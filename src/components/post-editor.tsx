import { useEffect, useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import LinkExtension from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import {
  Bold,
  Eye,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Quote,
} from 'lucide-react'

import { supabase } from '@/integrations/supabase/client'
import { AdminPage, ImageUpload, uploadImage, useTable } from '@/components/admin'
import { Button } from '@/components/ui/button'

const initial = {
  title: '',
  slug: '',
  excerpt: '',
  body: '',
  featured_image: '',
  featured_image_alt: '',
  category_id: '',
  tags: '',
  seo_title: '',
  seo_description: '',
  status: 'draft',
  published_at: null as string | null,
}

export function PostEditor({ id }: { id?: string }) {
  const navigate = useNavigate()
  const [form, setForm] = useState(initial)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [loadError, setLoadError] = useState('')
  const [loaded, setLoaded] = useState(!id)
  const [bodyHtml, setBodyHtml] = useState('')
  const [bodyHydrated, setBodyHydrated] = useState(!id)
  const { rows: categories } = useTable('categories')

  const editor = useEditor({
    extensions: [
      StarterKit,
      LinkExtension.configure({ openOnClick: false }),
      Image,
    ],
    content: '',
    immediatelyRender: false,
  })

  // Load the database row independently from TipTap initialization.
  // This avoids the previous race where a draft could finish loading before
  // the editor instance existed, leaving the edit screen stuck or empty.
  useEffect(() => {
    let cancelled = false

    if (!id) {
      setForm(initial)
      setBodyHtml('')
      setBodyHydrated(true)
      setLoadError('')
      setLoaded(true)
      return () => {
        cancelled = true
      }
    }

    setLoaded(false)
    setLoadError('')
    setBodyHydrated(false)

    async function loadPost() {
      const { data, error: queryError } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single()

      if (cancelled) return

      if (queryError || !data) {
        setLoadError(queryError?.message ?? 'This post could not be found.')
        setLoaded(true)
        return
      }

      setForm({
        ...initial,
        ...data,
        title: data.title ?? '',
        slug: data.slug ?? '',
        excerpt: data.excerpt ?? '',
        body: data.body ?? '',
        featured_image: data.featured_image ?? '',
        featured_image_alt: data.featured_image_alt ?? '',
        category_id: data.category_id ?? '',
        tags: (data.tags ?? []).join(', '),
        seo_title: data.seo_title ?? '',
        seo_description: data.seo_description ?? '',
        status: data.status ?? 'draft',
        published_at: data.published_at ?? null,
      })
      setBodyHtml(data.body ?? '')
      setLoaded(true)
    }

    void loadPost()

    return () => {
      cancelled = true
    }
  }, [id])

  // Hydrate TipTap only after both the post row and the editor instance exist.
  useEffect(() => {
    if (!id || !loaded || !editor || bodyHydrated || loadError) return
    editor.commands.setContent(bodyHtml || '', { emitUpdate: false })
    setBodyHydrated(true)
  }, [bodyHtml, bodyHydrated, editor, id, loadError, loaded])

  function field(key: keyof typeof initial, value: string) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  async function save(status: 'draft' | 'published') {
    if (!editor) {
      setError('The editor is still opening. Try again in a moment.')
      return
    }

    setBusy(true)
    setError('')

    const slug = form.slug
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, '-')
      .replace(/^-|-$/g, '')

    if (!form.title.trim() || !slug) {
      setError('A title and URL slug are required.')
      setBusy(false)
      return
    }

    const payload = {
      title: form.title.trim(),
      slug,
      excerpt: form.excerpt,
      body: editor.getHTML(),
      featured_image: form.featured_image || null,
      featured_image_alt: form.featured_image_alt,
      category_id: form.category_id || null,
      tags: form.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      seo_title: form.seo_title,
      seo_description: form.seo_description,
      status,
      published_at:
        status === 'published'
          ? id && form.status === 'published'
            ? form.published_at || new Date().toISOString()
            : new Date().toISOString()
          : null,
    }

    const result = id
      ? await supabase.from('blog_posts').update(payload).eq('id', id).select().single()
      : await supabase.from('blog_posts').insert(payload).select().single()

    if (result.error) {
      setError(result.error.message)
      setBusy(false)
      return
    }

    await navigate({ to: '/admin/posts' })
  }

  function setLink() {
    const url = prompt('Link URL (https://...)')
    if (url && /^https?:\/\//.test(url)) {
      editor?.chain().focus().setLink({ href: url }).run()
    }
  }

  async function addInlineImage() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'

    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return

      try {
        const path = await uploadImage(file)
        const { data } = await supabase.storage
          .from('blog-media')
          .createSignedUrl(path, 3600)

        if (data?.signedUrl) {
          editor?.chain().focus().setImage({ src: data.signedUrl, alt: file.name }).run()
        }
      } catch {
        setError('Image upload failed.')
      }
    }

    input.click()
  }

  if (!loaded) {
    return <AdminPage title="Loading...">Opening the page...</AdminPage>
  }

  if (loadError) {
    return (
      <AdminPage
        title="Could not open post"
        description="The editor could not load this journal entry."
        action={
          <Button variant="outline" asChild>
            <Link to="/admin/posts">← All posts</Link>
          </Button>
        }
      >
        <section className="admin-section">
          <p role="alert" className="form-error">{loadError}</p>
          <Button type="button" onClick={() => window.location.reload()}>
            Try again
          </Button>
        </section>
      </AdminPage>
    )
  }

  return (
    <AdminPage
      title={id ? 'Edit post' : 'New post'}
      description="Give this story a home in the journal."
      action={
        <Button variant="outline" asChild>
          <Link to="/admin/posts">← All posts</Link>
        </Button>
      }
    >
      <div className="editor-layout">
        <div className="editor-primary">
          <section className="admin-section editor-form">
            <label>
              Title
              <input
                value={form.title}
                onChange={(event) => {
                  const title = event.target.value
                  setForm((current) => ({
                    ...current,
                    title,
                    slug: id
                      ? current.slug
                      : title
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, '-')
                          .replace(/^-|-$/g, ''),
                  }))
                }}
                placeholder="A story worth telling"
              />
            </label>

            <label>
              Excerpt
              <textarea
                value={form.excerpt}
                onChange={(event) => field('excerpt', event.target.value)}
                rows={3}
                placeholder="A short introduction for your readers..."
              />
            </label>

            <label>Story</label>
            <div className="rich-editor">
              <div className="editor-toolbar">
                {(
                  [
                    [Bold, () => editor?.chain().focus().toggleBold().run(), 'Bold'],
                    [Italic, () => editor?.chain().focus().toggleItalic().run(), 'Italic'],
                    [Heading2, () => editor?.chain().focus().toggleHeading({ level: 2 }).run(), 'Heading 2'],
                    [Heading3, () => editor?.chain().focus().toggleHeading({ level: 3 }).run(), 'Heading 3'],
                    [List, () => editor?.chain().focus().toggleBulletList().run(), 'Bullet list'],
                    [ListOrdered, () => editor?.chain().focus().toggleOrderedList().run(), 'Numbered list'],
                    [Quote, () => editor?.chain().focus().toggleBlockquote().run(), 'Quote'],
                    [Minus, () => editor?.chain().focus().setHorizontalRule().run(), 'Divider'],
                    [Link2, setLink, 'Link'],
                    [ImagePlus, addInlineImage, 'Image'],
                  ] as const
                ).map(([Icon, action, label]) => (
                  <Button
                    key={label}
                    type="button"
                    variant="ghost"
                    size="icon"
                    title={label}
                    aria-label={label}
                    onClick={action}
                    disabled={!editor}
                  >
                    <Icon size={17} />
                  </Button>
                ))}
              </div>
              <EditorContent editor={editor} />
            </div>
          </section>
        </div>

        <div className="editor-side">
          <section className="admin-section editor-form">
            <h2>Publishing</h2>
            <label>
              URL slug
              <input
                value={form.slug}
                onChange={(event) => field('slug', event.target.value)}
                placeholder="my-story"
              />
            </label>
            <label>
              Category
              <select
                value={form.category_id}
                onChange={(event) => field('category_id', event.target.value)}
              >
                <option value="">Uncategorized</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Tags <small>(comma-separated)</small>
              <input
                value={form.tags}
                onChange={(event) => field('tags', event.target.value)}
                placeholder="magic, memories"
              />
            </label>

            <div className="publish-actions">
              <Button
                type="button"
                onClick={() => void save('draft')}
                disabled={busy || !editor}
                variant="outline"
              >
                Save draft
              </Button>
              <Button
                type="button"
                onClick={() => void save('published')}
                disabled={busy || !editor}
              >
                {form.status === 'published' ? 'Update post' : 'Publish'}
              </Button>
            </div>

            {form.status === 'published' && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => void save('draft')}
                disabled={busy || !editor}
              >
                Unpublish
              </Button>
            )}

            {id && (
              <Button asChild variant="ghost">
                <Link to="/admin/preview/$id" params={{ id }}>
                  <Eye size={16} /> Preview
                </Link>
              </Button>
            )}

            {error && (
              <p role="alert" className="form-error">
                {error}
              </p>
            )}
          </section>

          <section className="admin-section editor-form">
            <h2>Featured image</h2>
            <ImageUpload
              value={form.featured_image}
              onChange={(path) => field('featured_image', path)}
            />
            {form.featured_image && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => field('featured_image', '')}
              >
                Remove image
              </Button>
            )}
            <label>
              Image description
              <input
                value={form.featured_image_alt}
                onChange={(event) => field('featured_image_alt', event.target.value)}
                placeholder="Describe the image"
              />
            </label>
          </section>

          <section className="admin-section editor-form">
            <h2>Search preview</h2>
            <label>
              SEO title
              <input
                value={form.seo_title}
                onChange={(event) => field('seo_title', event.target.value)}
              />
            </label>
            <label>
              SEO description
              <textarea
                rows={3}
                value={form.seo_description}
                onChange={(event) => field('seo_description', event.target.value)}
              />
            </label>
          </section>
        </div>
      </div>
    </AdminPage>
  )
}
