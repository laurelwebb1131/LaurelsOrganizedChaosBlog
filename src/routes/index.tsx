import { createFileRoute, Link } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { ArrowUpRight, Moon, Star, Sparkles, ArrowRight } from 'lucide-react'
import { Owl, Crow, Web, Potion, Staple } from '@/components/doodles'
import { contentQuery } from '@/lib/content'
import { Shell, SectionLabel, CategoryIcon, PostCard, EmptyJournal, art } from '@/components/site'

export const Route = createFileRoute('/')({ loader: ({context}) => context.queryClient.ensureQueryData(contentQuery), head: () => ({meta:[{title:"Laurel's Organized Chaos — A magical scrapbook"},{name:'description',content:'Stories, snapshots, and little bits of magic from Laurel’s Organized Chaos.'},{property:'og:title',content:"Laurel's Organized Chaos"},{property:'og:description',content:'Stories, snapshots, and little bits of magic.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]}), component: Home })

function Polaroid({photo,index}:{photo:{id:string,image_url:string,alt_text:string,caption:string},index:number}) {
 return <figure className={`polaroid polaroid-${index}`}><span className="polaroid-tape"/><img src={photo.image_url} alt={photo.alt_text || photo.caption}/><figcaption>{photo.caption}</figcaption></figure>
}

function Home() {
 const {data} = useSuspenseQuery(contentQuery)
 const {posts,categories,settings,photos,currently,notes} = data
 const featured = posts.find(p => p.id===settings?.featured_post_id) ?? posts[0]
 const links = (settings?.social_links ?? {}) as Record<string,string>
 return <Shell links={links}><main className="scrapbook-home">
  <section className="scrapbook-masthead wrap">
   <Web className="masthead-web"/><span className="masthead-moon" aria-hidden="true">☾</span><Crow className="masthead-crow"/>
   <div className="masthead-copy"><p className="eyebrow"><Star size={14}/> A journal of the beautifully unfinished <Star size={14}/></p><h1><span className="hero-script">Laurel's</span><span className="hero-block">ORGANIZED <em>CHAOS</em></span></h1><div className="masthead-tagline"><span>✦</span><p>{settings?.tagline || 'A little magic in the mess.'}</p><span>☾</span></div><p className="hero-intro">{settings?.intro}</p></div>
   <div className="masthead-art"><img src={art} alt="Illustrated crow perched on a crescent moon, among crystals and wildflowers"/><span>keeper of little things / fig. 01</span></div>
   <span className="scribble-note scribble-hero">midnight thoughts, paper scraps &amp; a little magic</span>
  </section>
  <div className="marquee"><span>✦ LIFE IS A LITTLE MESSY ✦ AND THAT'S WHERE THE MAGIC LIVES ✦ LIFE IS A LITTLE MESSY ✦ AND THAT'S WHERE THE MAGIC LIVES ✦</span></div>

  <section className="collage-stage wrap">
   <div className="collage-stars" aria-hidden="true">✦ · ☾ · ✧</div>
   <div className="collage-photos">
    <SectionLabel number="01">little moments</SectionLabel><span className="washi washi-pink"/><span className="pressed-flower" aria-hidden="true">❋</span>
    <div className="polaroid-cluster">{photos.length ? photos.slice(0,3).map((photo,i)=><Polaroid key={photo.id} photo={photo} index={i}/>) : <><figure className="polaroid polaroid-0 placeholder-polaroid"><div className="photo-placeholder"><Sparkles/><span>add a favorite moment</span></div><figcaption>your photos live here ♡</figcaption></figure><figure className="polaroid polaroid-1 placeholder-polaroid"><div className="photo-placeholder"><Moon/><span>add another snapshot</span></div><figcaption>saved for later ✷</figcaption></figure></>}</div>
    <p className="cluster-caption">little moments, kept forever ↗</p><div className="mini-scrap">✦ collected along the way</div>
   </div>

   <div className="collage-feature">
    <SectionLabel number="02">featured from the journal</SectionLabel><Crow className="doodle-crow-feature"/><span className="sticker sticker-feature">fresh ink!</span>
    {featured ? <Link className="feature-clip" to="/blog/$slug" params={{slug:featured.slug}}><span className="clip-tape"/><Staple className="staple-a"/>{featured.featured_image&&<div className="feature-image"><img src={featured.featured_image} alt={featured.featured_image_alt || featured.title}/></div>}<div className="feature-inner"><span className="tiny-label">LATEST STORY ✦ {featured.published_at && new Date(featured.published_at).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})}</span><h2>{featured.title}</h2><p>{featured.excerpt}</p><span className="feature-button">Read the post <ArrowUpRight size={17}/></span></div></Link> : <div className="feature-clip feature-empty"><span className="clip-tape"/><Staple className="staple-a"/><div className="feature-inner"><span className="tiny-label">A BLANK PAGE, FOR NOW</span><h2>Every story starts somewhere.</h2><p>Add the first journal entry in the owner area and it will appear here.</p><Link className="feature-button" to="/about">Meet Laurel <ArrowUpRight size={17}/></Link></div></div>}
    <div className="feature-side-note">read me<br/><span>↳</span></div><span className="moon-phases" aria-hidden="true">● ◐ ○ ◑ ●</span>
   </div>

   <aside className="collage-about">
    <div className="about-tarot"><Potion className="doodle-potion"/><Owl className="doodle-owl-tarot"/><div className="tarot-inner"><div className="tarot-top">✦ THE PERSON BEHIND THE PAGES ✦</div><div className="tarot-corners" aria-hidden="true">☾ ✧ ☽</div><div className="tarot-illustration">{settings?.about_image?<img src={settings.about_image} alt="Portrait of Laurel"/>:<img src={art} alt="Illustrated crow and crescent moon"/>}</div><div className="tarot-moon">☾ ✧ ☽</div><h2>About Me</h2><p>{settings?.about_preview || 'Add a short introduction in the owner area.'}</p><Link className="tarot-button" to="/about">More about me <ArrowUpRight size={15}/></Link></div></div>
    {notes.slice(0,1).map(note=><div key={note.id} className="note-scrap scrap-0"><span>✳ A LITTLE NOTE</span><p>{note.body}</p><span className="note-star">✦</span></div>)}
   </aside>
  </section>

  <section className="currently-spread wrap">
   <div className="currently-card"><Owl className="doodle-owl-currently"/><Staple className="staple-b"/><span className="notebook-tape"/><div className="card-holes"><span/><span/><span/><span/></div><span className="currently-date">A LITTLE LIFE UPDATE / RIGHT NOW</span><h2>Currently<span>...</span></h2><div className="currently-list">{currently.length ? currently.map(item=><div key={item.id}><strong>{item.label}</strong><span>{item.value}</span></div>) : <div className="currently-empty"><strong>Waiting</strong><span>Add your current favorites in the owner area.</span></div>}</div><span className="currently-doodle">✳ ☾ ✳</span></div>
   <div className="currently-notes"><span className="side-scribble">notes from the margins →</span>{notes.slice(1,3).map((note,i)=><div key={note.id} className={`note-scrap scrap-${(i+1)%2}`}><span>✳ PINNED THOUGHT</span><p>{note.body}</p><span className="note-star">✦</span></div>)}<Crow className="currently-crow"/></div>
  </section>

  <section className="explore-band"><div className="wrap"><Web className="doodle-web-explore"/><Crow className="explore-crow"/><SectionLabel number="03">explore the chaos</SectionLabel><div className="explore-heading"><h2>Pick a path,<br/><em>follow the magic.</em></h2><p>Some things fit neatly in a box.<br/>These are not those things.</p></div><div className="category-grid">{categories.map((c,i)=><Link key={c.id} to="/blog" search={{category:c.slug}} className={`category-card category-${i%4}`}><span className="category-spark">{['✧','☾','✦','✷'][i%4]}</span><div className="category-icon"><CategoryIcon icon={c.icon}/></div><span className="category-index">0{i+1} / THE COLLECTION</span><h3>{c.name}</h3><p>{c.description}</p><ArrowUpRight className="category-arrow" size={20}/></Link>)}</div></div></section>

  <section className="recent-paper"><div className="wrap recent-inner"><span className="recent-tape"/><SectionLabel number="04">fresh ink &amp; recent stories</SectionLabel><div className="recent-heading"><h2>Torn from the <em>journal.</em></h2><span>newest pages / filed imperfectly</span></div><div className="post-grid recent-grid">{posts.length ? posts.slice(0,3).map(post=><PostCard key={post.id} post={post} category={categories.find(c=>c.id===post.category_id)?.name}/>) : <EmptyJournal/>}</div><Link className="all-posts-link" to="/blog">View all posts <ArrowRight size={18}/></Link></div></section>

  <section className="closing wrap"><Owl className="doodle-owl-closing"/><div>✷ &nbsp;✦ &nbsp;☾</div><p>There is beauty in the <em>beautifully unfinished.</em></p><Link to="/contact">Leave a little note <ArrowUpRight size={18}/></Link></section>
 </main></Shell>
}