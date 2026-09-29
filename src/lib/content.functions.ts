import { createServerFn } from '@tanstack/react-start'
import { createClient } from '@supabase/supabase-js'
import sanitizeHtml from 'sanitize-html'
import type { Database } from '@/integrations/supabase/types'

function publicClient() {
  const key = process.env['SUPABASE_PUBLISHABLE_KEY'] ?? ''
  return createClient<Database>(process.env['SUPABASE_URL'] ?? '', key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers)
        if (headers.get('Authorization') === `Bearer ${key}`) {
          headers.delete('Authorization')
        }
        headers.set('apikey', key)
        return fetch(input, { ...init, headers })
      },
    },
  })
}

export function cleanBody(body: string) {
  return sanitizeHtml(body, {
    allowedTags: [
      'p',
      'h2',
      'h3',
      'h4',
      'strong',
      'em',
      'a',
      'blockquote',
      'ul',
      'ol',
      'li',
      'img',
      'hr',
      'br',
      'figure',
      'figcaption',
    ],
    allowedAttributes: {
      a: ['href', 'target', 'rel'],
      img: ['src', 'alt', 'title'],
    },
    allowedSchemes: ['https', 'http'],
    allowedSchemesAppliedToAttributes: ['href', 'src'],
  })
}

async function sign(path: string | null) {
  if (!path) return null
  if (/^https?:\/\//.test(path)) return path

  const { supabaseAdmin } = await import('@/integrations/supabase/client.server')
  const { data } = await supabaseAdmin.storage
    .from('blog-media')
    .createSignedUrl(path, 3600)

  return data?.signedUrl ?? null
}

function escapeAttribute(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

async function signInlineImages(body: string) {
  const imagePattern = /<img\b[^>]*\bdata-storage-path=(["'])([^"']+)\1[^>]*>/gi
  const paths = [
    ...new Set(
      Array.from(body.matchAll(imagePattern))
        .map((match) => match[2])
        .filter((path): path is string => Boolean(path)),
    ),
  ]

  if (paths.length === 0) return cleanBody(body)

  const signedEntries = await Promise.all(
    paths.map(async (path) => [path, await sign(path)] as const),
  )
  const signed = new Map(
    signedEntries.filter(
      (entry): entry is readonly [string, string] => typeof entry[1] === 'string',
    ),
  )

  const refreshed = body.replace(/<img\b[^>]*>/gi, (tag) => {
    const pathMatch = tag.match(/\bdata-storage-path=(["'])([^"']+)\1/i)
    const path = pathMatch?.[2]
    if (!path) return tag

    const url = signed.get(path)
    if (!url) return tag

    const src = `src="${escapeAttribute(url)}"`
    if (/\bsrc=(["'])[^"']*\1/i.test(tag)) {
      return tag.replace(/\bsrc=(["'])[^"']*\1/i, src)
    }

    return tag.replace(/^<img/i, `<img ${src}`)
  })

  // data-storage-path is intentionally stripped from public HTML.
  return cleanBody(refreshed)
}

export const getPublicContent = createServerFn({ method: 'GET' }).handler(async () => {
  const db = publicClient()
  const [
    postsResult,
    categoriesResult,
    settingsResult,
    photosResult,
    currentlyResult,
    notesResult,
  ] = await Promise.all([
    db
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .lte('published_at', new Date().toISOString())
      .order('published_at', { ascending: false }),
    db.from('categories').select('*').eq('visible', true).order('sort_order'),
    db.from('site_settings').select('*').eq('id', 1).single(),
    db.from('photos').select('*').eq('visible', true).order('sort_order'),
    db.from('currently_items').select('*').eq('visible', true).order('sort_order'),
    db.from('homepage_notes').select('*').eq('visible', true).order('sort_order'),
  ])

  const posts = await Promise.all(
    (postsResult.data ?? []).map(async (post) => ({
      ...post,
      body: await signInlineImages(post.body),
      featured_image: await sign(post.featured_image),
    })),
  )

  const photos = await Promise.all(
    (photosResult.data ?? []).map(async (photo) => ({
      ...photo,
      image_url: (await sign(photo.image_url)) ?? '',
    })),
  )

  const settings = settingsResult.data
    ? {
        ...settingsResult.data,
        about_image: await sign(settingsResult.data.about_image),
      }
    : null

  return {
    posts,
    categories: categoriesResult.data ?? [],
    settings,
    photos,
    currently: currentlyResult.data ?? [],
    notes: notesResult.data ?? [],
  }
})
