import { supabase } from '@/integrations/supabase/client'

/**
 * Blog-post HTML stores the durable Supabase object path in data-storage-path.
 * The signed src is only a temporary browser preview. Refresh it whenever a
 * draft or preview is opened so inline images never depend on an old token.
 */
export async function refreshStoredImageUrls(html: string) {
  if (!html || typeof DOMParser === 'undefined') return html

  const document = new DOMParser().parseFromString(html, 'text/html')
  const images = Array.from(
    document.querySelectorAll<HTMLImageElement>('img[data-storage-path]'),
  )

  await Promise.all(
    images.map(async (image) => {
      const path = image.dataset.storagePath
      if (!path) return

      const { data, error } = await supabase.storage
        .from('blog-media')
        .createSignedUrl(path, 3600)

      if (!error && data?.signedUrl) {
        image.src = data.signedUrl
      }
    }),
  )

  return document.body.innerHTML
}
