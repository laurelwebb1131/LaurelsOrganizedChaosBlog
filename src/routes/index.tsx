import { createFileRoute, Link } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { ArrowRight, Moon, Sparkles, Star } from 'lucide-react'
import { contentQuery } from '@/lib/content'
import { themeAssets } from '@/lib/theme-assets'
import { Shell, CategoryIcon, PostCard, EmptyJournal, art } from '@/components/site'

function DecorativeAsset({ src, className, loading = 'lazy' }: { src: string; className: string; loading?: 'eager' | 'lazy' }) {
  return <img src={src} alt="" aria-hidden="true" className={`final-generated-asset ${className}`} loading={loading} onError={(event) => { event.currentTarget.hidden = true }} />
}

export const Route = createFileRoute('/')({
  loader: ({ context }) => context.queryClient.ensureQueryData(contentQuery),
  head: () => ({
    meta: [
      { title: "Laurel's Organized Chaos — Life, creativity & beautifully organized chaos" },
      { name: 'description', content: 'A creative home for real life, creativity, curiosity, projects, reviews, and the beautifully chaotic parts in between.' },
      { property: 'og:title', content: "Laurel's Organized Chaos" },
      { property: 'og:description', content: 'Real life, creativity, curiosity, projects, reviews, and a little bit of magic in between.' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
  }),
  component: Home,
})

function Home() {
  const { data } = useSuspenseQuery(contentQuery)
  const { posts, categories, settings } = data
  const links = (settings?.social_links ?? {}) as Record<string, string>

  return (
    <Shell links={links}>
      <main className="final-home">
        <section className="final-hero" aria-labelledby="home-title">
          <div className="final-hero-stars" aria-hidden="true" />
          <div className="final-hero-vines final-vines-left" aria-hidden="true">❋ ✦ ❋</div>
          <div className="final-hero-vines final-vines-right" aria-hidden="true">❋ ✦ ❋</div>

          <div className="final-lantern final-lantern-left" aria-hidden="true">✦</div>
          <div className="final-lantern final-lantern-right" aria-hidden="true">✦</div>
          <DecorativeAsset src={themeAssets.lanternsTop} className="asset-lanterns-top" loading="eager" />
          <DecorativeAsset src={themeAssets.celestialChain} className="asset-celestial-chain" loading="eager" />

          <div className="final-moon" aria-hidden="true">
            <span className="final-moon-craters" />
          </div>
          <DecorativeAsset src={themeAssets.heroMoon} className="asset-hero-moon" loading="eager" />
          <DecorativeAsset src={themeAssets.heroWorld} className="asset-hero-world" loading="eager" />

          <div className="final-skyline" aria-hidden="true">
            <span className="castle castle-a" />
            <span className="castle castle-b" />
            <span className="castle castle-c" />
            <span className="ferris-wheel"><i/><i/><i/><i/></span>
            <span className="carnival-tent tent-a" />
            <span className="carnival-tent tent-b" />
            <span className="light-string lights-a" />
            <span className="light-string lights-b" />
          </div>

          <div className="final-water" aria-hidden="true" />

          <div className="final-crow-scene">
            <DecorativeAsset src={themeAssets.crowOnBooks} className="asset-crow-on-books" loading="eager" />
            <img src={art} alt="" aria-hidden="true" className="final-crow-art final-crow-fallback" />
            <div className="final-book-stack" aria-hidden="true"><span/><span/><span/></div>
            <div className="final-crystal cluster-a" aria-hidden="true">◆</div>
            <div className="final-crystal cluster-b" aria-hidden="true">◆</div>
          </div>

          <aside className="final-paper-note final-note-left" aria-label="What you can find here">
            <span>REAL LIFE</span>
            <span>CREATIVE PROJECTS</span>
            <span>HONEST REVIEWS</span>
            <span>PLACES I EXPLORE</span>
            <span>AND EVERYTHING</span>
            <span>IN BETWEEN.</span>
            <b>♡</b>
          </aside>

          <aside className="final-signpost" aria-hidden="true">
            <span>SAME MESS</span>
            <span>DIFFERENT MAGIC</span>
            <b>♡</b>
          </aside>

          <div className="final-title-wrap">
            <div className="final-celestial-crown" aria-hidden="true">☾ ✦</div>
            <DecorativeAsset src={themeAssets.logoMain} className="asset-logo-main" loading="eager" />
            <h1 id="home-title" className="final-title-text-fallback">
              <span className="final-title-script">Laurel's</span>
              <span className="final-title-block">ORGANIZED CHAOS</span>
            </h1>
            <div className="final-intro-paper">
              <p>{settings?.intro || settings?.tagline || 'A creative home for real life, creativity, curiosity, and the beautifully chaotic parts in between.'}</p>
              <span aria-hidden="true">♡</span>
            </div>
            <Link className="final-primary-cta" to="/blog">Explore the Blog <ArrowRight size={17}/></Link>
          </div>

          <aside className="final-paper-note final-note-right" aria-hidden="true">
            Curious<br/>Creative<br/>Always<br/>A Work<br/>in Progress
            <b>♡</b>
          </aside>
        </section>

        <section className="final-paths" aria-label="Explore Laurel's Organized Chaos">
          <DecorativeAsset src={themeAssets.floralBorder} className="asset-paths-floral-border" />
          <div className="final-path-grid">
            {categories.slice(0, 5).map((category, index) => (
              <Link
                key={category.id}
                to="/blog"
                search={{ category: category.slug }}
                className="final-path-card"
              >
                <div className="final-path-art" aria-hidden="true">
                  <span className={"path-glow path-glow-" + (index % 5)} />
                  <CategoryIcon icon={category.icon} />
                  <span className="path-sparkles">✦ ☾ ✧</span>
                </div>
                <div className="final-path-label">{category.name} <span>♡</span></div>
                <p>{category.description}</p>
                <span className="final-path-arrow" aria-hidden="true">→</span>
              </Link>
            ))}
            <Link to="/blog" className="final-path-card final-all-posts-card">
              <div className="final-path-art" aria-hidden="true">
                <Moon />
                <Star />
                <Sparkles />
              </div>
              <div className="final-path-label">All Posts <span>♡</span></div>
              <p>Browse the full archive of blog posts.</p>
              <span className="final-path-arrow" aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        <section className="final-latest-section" aria-labelledby="latest-title">
          <div className="final-paper-edge final-paper-edge-top" aria-hidden="true" />
          <div className="final-latest-inner">
            <DecorativeAsset src={themeAssets.noteMoments} className="asset-note-moments" />
            <div className="final-margin-note final-margin-left" aria-hidden="true">Collect<br/>Moments<br/>Not Things<br/>♡</div>
            <header className="final-section-heading">
              <span aria-hidden="true">☾</span>
              <h2 id="latest-title">Latest from the Blog</h2>
              <span className="final-heading-stars" aria-hidden="true">✦ ✧ ✦</span>
              <Link to="/blog">View all posts →</Link>
            </header>

            <div className="final-latest-grid">
              {posts.length ? posts.slice(0, 3).map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  category={categories.find((category) => category.id === post.category_id)?.name}
                />
              )) : <EmptyJournal />}
            </div>

            <div className="final-polaroid-stack" aria-hidden="true">
              <span className="mini-polaroid mini-polaroid-a">☾</span>
              <span className="mini-polaroid mini-polaroid-b">✦</span>
            </div>
          </div>
        </section>

        <section className="final-about-section" aria-labelledby="about-home-title">
          <div className="final-about-decor final-about-left" aria-hidden="true">
            <DecorativeAsset src={themeAssets.aboutPolaroid} className="asset-about-polaroid" />
            <DecorativeAsset src={themeAssets.noteMessMagic} className="asset-note-mess-magic" />
            <span className="final-crystal big-crystal">◆</span>
            <span className="final-candle">✦</span>
            <span className="final-polaroid-frame"><img src={settings?.about_image || art} alt="" /></span>
            <span className="final-hand-note">same mess<br/>different magic ♡</span>
          </div>

          <div className="final-about-paper">
            <span className="final-paper-pin" aria-hidden="true">✦</span>
            <h2 id="about-home-title">About Laurel</h2>
            <p>{settings?.about_preview || 'This is my corner of the internet where I share real life, what I am learning, making, trying, loving, and figuring out as I go.'}</p>
            <Link className="final-primary-cta final-about-cta" to="/about">Read My Story <ArrowRight size={16}/></Link>
          </div>

          <div className="final-about-decor final-about-right" aria-hidden="true">
            <DecorativeAsset src={themeAssets.aboutBookMug} className="asset-about-book-mug" />
            <span className="final-mug">☾</span>
            <div className="final-book-stack final-books-right"><span>IDEAS</span><span>PLACES</span><span>PEOPLE</span><span>POSSIBILITIES</span></div>
            <span className="final-candle final-candle-right">✦</span>
            <span className="final-crystal big-crystal crystal-right">◆</span>
          </div>
        </section>
      </main>
    </Shell>
  )
}
