import { Link } from '@tanstack/react-router'
import { Moon, Star, Sparkles, BookOpen, ArrowUpRight, Instagram, Mail, Feather, Menu, X } from 'lucide-react'
import { useState } from 'react'
import crowArt from '@/assets/crow-moon.jpg'
import { Button } from '@/components/ui/button'
import type { getPublicContent } from '@/lib/content.functions'

type Content = Awaited<ReturnType<typeof getPublicContent>>
export const art = crowArt
export function SiteHeader() {
  const [open,setOpen] = useState(false)
  return <header className="site-header"><div className="site-header-inner"><Link to="/" className="wordmark-small"><span>Laurel's</span><strong>ORGANIZED CHAOS</strong></Link><nav className={open ? 'nav-tabs open' : 'nav-tabs'} aria-label="Main navigation">{([['/','Home'],['/blog','Blog'],['/about','About'],['/contact','Contact']] as const).map(([to,label],i) => <Link key={to} to={to} activeOptions={{ exact: true }} onClick={() => setOpen(false)} className={`nav-tab tab-${i}`}>{label}</Link>)}</nav><Button variant="ghost" size="icon" className="mobile-menu" aria-label={open?'Close menu':'Open menu'} onClick={() => setOpen(!open)}>{open?<X/>:<Menu/>}</Button></div></header>
}
export function SiteFooter({links}: {links?: Record<string,string> | undefined}) { return <footer className="site-footer"><div className="footer-stars">✦ &nbsp;☾ &nbsp;✧</div><div className="footer-inner"><div><span className="script">Laurel's</span><strong> ORGANIZED CHAOS</strong><p>Little pieces of a wonderfully messy life.</p></div><div className="footer-links"><Link to="/contact">Contact</Link><Link to="/privacy">Privacy</Link>{links?.['instagram'] && <a href={links['instagram']} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram size={18}/></a>}{links?.['email'] && <a href={`mailto:${links['email']}`} aria-label="Email"><Mail size={18}/></a>}</div></div><div className="footer-bottom">© {new Date().getFullYear()} Laurel's Organized Chaos <span>✧ Made of moonlight & marginalia ✧</span></div></footer> }
export function Shell({children,links}: {children:React.ReactNode,links?: Record<string,string> | undefined}) { return <div className="public-shell"><SiteHeader/>{children}<SiteFooter links={links}/></div> }
export function SectionLabel({children,number}: {children:React.ReactNode,number?:string}) { return <div className="section-label"><span>{number && `${number} / `}{children}</span><span className="label-rule"/><Star size={13}/></div> }
export function CategoryIcon({icon}:{icon:string}) { return icon==='book'?<BookOpen/>:icon==='sparkles'?<Sparkles/>:icon==='star'?<Star/>:<Moon/> }
export function PostCard({post,category}: {post:Content['posts'][number],category?:string|undefined}) { return <Link className="post-card" to="/blog/$slug" params={{slug:post.slug}}><div className="post-card-image">{post.featured_image?<img src={post.featured_image} alt={post.featured_image_alt || post.title}/>:<div className="post-card-blank"><Moon size={38}/><Star size={14}/></div>}</div><div className="post-card-body"><div className="card-meta">{category ?? 'Journal'} <span>✦</span> {post.published_at ? new Date(post.published_at).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}) : ''}</div><h3>{post.title}</h3><p>{post.excerpt}</p><span className="text-link">Read the story <ArrowUpRight size={16}/></span></div></Link> }
export function EmptyJournal() { return <div className="empty-journal"><Feather size={30}/><h3>The pages are waiting.</h3><p>The first story is still being written. Check back soon.</p></div> }