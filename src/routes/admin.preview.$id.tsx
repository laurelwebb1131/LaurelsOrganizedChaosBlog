import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

import { supabase } from '@/integrations/supabase/client'
import type { Database } from '@/integrations/supabase/types'
import { refreshStoredImageUrls } from '@/lib/editor-media'
import { Button } from '@/components/ui/button'

type Post = Database['public']['Tables']['blog_posts']['Row']

export const Route = createFileRoute('/admin/preview/$id')({
  component: Preview,
  head: () => ({
    meta: [
      { title: 'Post Preview — Laurel’s Organized Chaos' },
      { name: 'description', content: 'Private draft preview.' },
      { property: 'og:title', content: 'Post Preview — Laurel’s Organized Chaos' },
      { property: 'og:description', content: 'Private draft preview.' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary' },
      { name: 'robots', content: 'noindex' },
    ],
  }),
})

function Preview() {
  const { id } = Route.useParams()
  const [post, setPost] = useState<Post | null>(null)
  const [body, setBody] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadPreview() {
      const { data, error: queryError } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single()

      if (cancelled) return

      if (queryError || !data) {
        setError(queryError?.message ?? 'This post could not be loaded.')
        return
      }

      setPost(data)
      setBody(await refreshStoredImageUrls(data.body ?? ''))
    }

    void loadPreview()

    return () => {
      cancelled = true
    }
  }, [id])

  return (
    <div className="admin-content">
      <Button variant="outline" asChild>
        <Link to="/admin/posts/$id" params={{ id }}>
          ← Back to editor
        </Link>
      </Button>

      {error ? (
        <p role="alert" className="form-error">
          {error}
        </p>
      ) : post ? (
        <article className="article-wrap preview-article">
          <header className="article-header">
            <span className="eyebrow">✦ PRIVATE PREVIEW · {post.status.toUpperCase()} ✦</span>
            <h1>{post.title}</h1>
            <p>{post.excerpt}</p>
          </header>
          <div className="article-paper">
            <div className="article-body" dangerouslySetInnerHTML={{ __html: body }} />
          </div>
        </article>
      ) : (
        <p>Loading preview...</p>
      )}
    </div>
  )
}
