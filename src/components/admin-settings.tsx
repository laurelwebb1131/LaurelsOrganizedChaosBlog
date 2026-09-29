import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import type { Database } from '@/integrations/supabase/types'
import { AdminPage, SaveButton, ImageUpload, useTable, ListEditor } from '@/components/admin'
import { Button } from '@/components/ui/button'

type Settings = Database['public']['Tables']['site_settings']['Row']
type CollectionType = 'categories' | 'currently_items' | 'homepage_notes'
type CollectionRow = {
  id: string
  sort_order: number
  visible: boolean
  created_at?: string
  updated_at?: string
  [key: string]: unknown
}

export function SettingsEditor({ mode }: { mode: 'homepage' | 'about' | 'settings' }) {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState('')
  const { rows: posts } = useTable('blog_posts')

  useEffect(() => {
    supabase
      .from('site_settings')
      .select('*')
      .eq('id', 1)
      .single()
      .then(({ data }) => setSettings(data))
  }, [])

  async function save(event: React.FormEvent) {
    event.preventDefault()
    if (!settings) return
    setBusy(true)
    const { error } = await supabase.from('site_settings').update(settings).eq('id', 1)
    setStatus(error ? error.message : 'Saved successfully.')
    setBusy(false)
  }

  function field<K extends keyof Settings>(key: K, value: Settings[K]) {
    setSettings((current) => (current ? { ...current, [key]: value } : current))
  }

  if (!settings) {
    return (
      <AdminPage
        title={mode === 'homepage' ? 'Homepage' : mode === 'about' ? 'About' : 'Settings'}
      >
        <p>Loading settings...</p>
      </AdminPage>
    )
  }

  const socialLinks =
    settings.social_links &&
    typeof settings.social_links === 'object' &&
    !Array.isArray(settings.social_links)
      ? (settings.social_links as Record<string, string>)
      : {}

  return (
    <AdminPage
      title={mode === 'homepage' ? 'Homepage' : mode === 'about' ? 'About' : 'Settings'}
      description={
        mode === 'homepage'
          ? 'The words and little details visitors see first.'
          : mode === 'about'
            ? 'Make this page your own.'
            : 'Links and site details.'
      }
    >
      <form onSubmit={save} className="admin-section editor-form settings-form">
        {mode === 'homepage' ? (
          <>
            <h2>Opening words</h2>
            <label>
              Tagline
              <input
                value={settings.tagline ?? ''}
                onChange={(event) => field('tagline', event.target.value)}
              />
            </label>
            <label>
              Introduction
              <textarea
                rows={4}
                value={settings.intro ?? ''}
                onChange={(event) => field('intro', event.target.value)}
              />
            </label>
            <label>
              Featured story
              <select
                value={settings.featured_post_id ?? ''}
                onChange={(event) => field('featured_post_id', event.target.value || null)}
              >
                <option value="">Newest published story (automatic)</option>
                {posts
                  .filter((post) => post.status === 'published')
                  .map((post) => (
                    <option key={post.id} value={post.id}>
                      {post.title}
                    </option>
                  ))}
              </select>
            </label>
            <h2>About preview</h2>
            <label>
              Short introduction
              <textarea
                rows={4}
                value={settings.about_preview ?? ''}
                onChange={(event) => field('about_preview', event.target.value)}
              />
            </label>
          </>
        ) : mode === 'about' ? (
          <>
            <h2>Your story</h2>
            <label>
              Short introduction
              <textarea
                rows={4}
                value={settings.about_preview ?? ''}
                onChange={(event) => field('about_preview', event.target.value)}
              />
            </label>
            <label>
              About page text
              <textarea
                rows={12}
                value={settings.about_body ?? ''}
                onChange={(event) => field('about_body', event.target.value)}
              />
            </label>
            <label>
              Portrait / illustration
              <ImageUpload
                value={settings.about_image}
                onChange={(path) => field('about_image', path)}
              />
            </label>
            {settings.about_image && (
              <Button type="button" variant="ghost" onClick={() => field('about_image', null)}>
                Remove portrait
              </Button>
            )}
          </>
        ) : (
          <>
            <h2>Social links</h2>
            {['instagram', 'email', 'pinterest', 'tiktok'].map((key) => (
              <label key={key}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
                <input
                  value={socialLinks[key] ?? ''}
                  onChange={(event) =>
                    field('social_links', { ...socialLinks, [key]: event.target.value })
                  }
                />
              </label>
            ))}
          </>
        )}
        {status && (
          <p role="status" className="save-status">
            {status}
          </p>
        )}
        <SaveButton busy={busy} />
      </form>
    </AdminPage>
  )
}

export function CollectionEditor({ type }: { type: CollectionType }) {
  const { rows, refresh, error } = useTable(type)
  const collectionRows = rows as unknown as CollectionRow[]

  const fields: { key: keyof CollectionRow; label: string }[] =
    type === 'categories'
      ? [
          { key: 'name', label: 'Name' },
          { key: 'slug', label: 'URL slug' },
          { key: 'description', label: 'Description' },
          { key: 'icon', label: 'Icon (moon, star, book, sparkles)' },
        ]
      : type === 'currently_items'
        ? [
            { key: 'label', label: 'Label' },
            { key: 'value', label: 'Value' },
          ]
        : [{ key: 'body', label: 'Note' }]

  async function add() {
    const order = rows.length + 1
    if (type === 'categories') {
      await supabase
        .from('categories')
        .insert({ name: 'New category', slug: `new-category-${Date.now()}`, sort_order: order })
    } else if (type === 'currently_items') {
      await supabase.from('currently_items').insert({ label: 'New item', value: '', sort_order: order })
    } else {
      await supabase.from('homepage_notes').insert({ body: 'New note', sort_order: order })
    }
    await refresh()
  }

  async function save(row: CollectionRow) {
    const { id, created_at: _createdAt, updated_at: _updatedAt, ...value } = row
    const { error: updateError } = await supabase
      .from(type)
      .update(value as never)
      .eq('id', id)
    if (updateError) throw updateError
    await refresh()
  }

  async function remove(row: CollectionRow) {
    const { error: deleteError } = await supabase.from(type).delete().eq('id', row.id)
    if (deleteError) throw deleteError
    await refresh()
  }

  return (
    <>
      {error && <p role="alert">{error}</p>}
      <ListEditor<CollectionRow>
        title={
          type === 'categories'
            ? 'Journal categories'
            : type === 'currently_items'
              ? 'Currently... list'
              : 'Little notes'
        }
        rows={collectionRows}
        fields={fields}
        onAdd={add}
        onSave={save}
        onDelete={remove}
      />
    </>
  )
}
