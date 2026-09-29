import { createFileRoute } from '@tanstack/react-router'

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = new URL(request.url).origin
        const { supabaseAdmin } = await import('@/integrations/supabase/client.server')

        const { data: posts, error } = await supabaseAdmin
          .from('blog_posts')
          .select('slug,updated_at,published_at')
          .eq('status', 'published')
          .lte('published_at', new Date().toISOString())
          .order('published_at', { ascending: false })

        if (error) {
          console.error('[Sitemap] Could not load posts:', error.message)
        }

        const staticUrls = [
          { path: '/', priority: '1.0', changefreq: 'weekly' },
          { path: '/blog', priority: '0.9', changefreq: 'weekly' },
          { path: '/about', priority: '0.6', changefreq: 'monthly' },
          { path: '/contact', priority: '0.4', changefreq: 'yearly' },
          { path: '/privacy', priority: '0.2', changefreq: 'yearly' },
        ]

        const urls = [
          ...staticUrls.map(
            ({ path, priority, changefreq }) => `
  <url>
    <loc>${escapeXml(`${origin}${path}`)}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`,
          ),
          ...(posts ?? []).map((post) => {
            const lastmod = post.updated_at ?? post.published_at
            return `
  <url>
    <loc>${escapeXml(`${origin}/blog/${encodeURIComponent(post.slug)}`)}</loc>
    ${lastmod ? `<lastmod>${new Date(lastmod).toISOString()}</lastmod>` : ''}
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
          }),
        ]

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('')}
</urlset>
`

        return new Response(xml, {
          headers: {
            'content-type': 'application/xml; charset=utf-8',
            'cache-control': 'public, max-age=300',
          },
        })
      },
    },
  },
})
