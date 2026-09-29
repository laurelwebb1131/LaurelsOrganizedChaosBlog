import { createServerFn } from '@tanstack/react-start'
import { createClient } from '@supabase/supabase-js'
import sanitizeHtml from 'sanitize-html'
import type { Database } from '@/integrations/supabase/types'

function publicClient() {
  const key = process.env['SUPABASE_PUBLISHABLE_KEY'] ?? ''
  return createClient<Database>(process.env['SUPABASE_URL'] ?? '', key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: (input, init) => { const headers = new Headers(init?.headers); if (headers.get('Authorization') === `Bearer ${key}`) headers.delete('Authorization'); headers.set('apikey', key); return fetch(input, { ...init, headers }) } }
  })
}
export function cleanBody(body: string) {
  return sanitizeHtml(body, { allowedTags: ['p','h2','h3','h4','strong','em','a','blockquote','ul','ol','li','img','hr','br','figure','figcaption'], allowedAttributes: { a: ['href','target','rel'], img: ['src','alt','title'] }, allowedSchemes: ['https','http'], allowedSchemesAppliedToAttributes: ['href','src'] })
}
async function sign(path: string | null) {
  if (!path) return null
  if (/^https?:\/\//.test(path)) return path
  const { supabaseAdmin } = await import('@/integrations/supabase/client.server')
  const { data } = await supabaseAdmin.storage.from('blog-media').createSignedUrl(path, 3600)
  return data?.signedUrl ?? null
}
export const getPublicContent = createServerFn({ method: 'GET' }).handler(async () => {
  const db = publicClient()
  const [postsResult, categoriesResult, settingsResult, photosResult, currentlyResult, notesResult] = await Promise.all([
    db.from('blog_posts').select('*').eq('status','published').lte('published_at',new Date().toISOString()).order('published_at',{ ascending: false }),
    db.from('categories').select('*').eq('visible',true).order('sort_order'),
    db.from('site_settings').select('*').eq('id',1).single(),
    db.from('photos').select('*').eq('visible',true).order('sort_order'),
    db.from('currently_items').select('*').eq('visible',true).order('sort_order'),
    db.from('homepage_notes').select('*').eq('visible',true).order('sort_order')
  ])
  const posts = await Promise.all((postsResult.data ?? []).map(async p => ({ ...p, body: cleanBody(p.body), featured_image: await sign(p.featured_image) })))
  const photos = await Promise.all((photosResult.data ?? []).map(async p => ({ ...p, image_url: await sign(p.image_url) ?? '' })))
  const settings = settingsResult.data ? { ...settingsResult.data, about_image: await sign(settingsResult.data.about_image) } : null
  return { posts, categories: categoriesResult.data ?? [], settings, photos, currently: currentlyResult.data ?? [], notes: notesResult.data ?? [] }
})