import http from 'node:http'

const now = new Date().toISOString()
const posts = [
  { id:'p1', slug:'finding-beauty-in-the-chaos', title:'Finding Beauty in the Chaos', excerpt:'Real life, imperfect and still worth noticing.', body:'<p>Visual QA fixture.</p>', category_id:'c1', status:'published', published_at:now, featured_image:null, featured_image_alt:null },
  { id:'p2', slug:'a-little-something-i-made', title:'A Little Something I Made', excerpt:'A creative project from the messy middle.', body:'<p>Visual QA fixture.</p>', category_id:'c2', status:'published', published_at:now, featured_image:null, featured_image_alt:null },
  { id:'p3', slug:'honest-thoughts-a-product-i-tried', title:'Honest Thoughts: A Product I Tried', excerpt:'A straightforward review from real use.', body:'<p>Visual QA fixture.</p>', category_id:'c3', status:'published', published_at:now, featured_image:null, featured_image_alt:null },
]
const categories = [
  { id:'c1', name:'Life', slug:'life', description:'Thoughts, routines and everyday chaos in between.', icon:'star', visible:true, sort_order:1 },
  { id:'c2', name:'Creative Projects', slug:'creative-projects', description:'Ideas, experiments and works in progress.', icon:'sparkles', visible:true, sort_order:2 },
  { id:'c3', name:'Reviews', slug:'reviews', description:'Products, places and honest thoughts.', icon:'book', visible:true, sort_order:3 },
  { id:'c4', name:'Places', slug:'places', description:'Adventures, hidden gems and new perspectives.', icon:'moon', visible:true, sort_order:4 },
  { id:'c5', name:'Currently', slug:'currently', description:"What I'm into, loving and exploring right now.", icon:'star', visible:true, sort_order:5 },
]
const settings = { id:1, featured_post_id:null, social_links:{}, tagline:'A little magic in the mess.', intro:'A personal blog about real life, creativity, curiosity, projects, reviews, and the beautifully chaotic parts in between.', about_preview:"I'm Laurel, and this is my corner of the internet where I share my real life, what I'm learning, making, trying, loving, and figuring out as I go.", about_image:null }

const server=http.createServer((req,res)=>{
  res.setHeader('Access-Control-Allow-Origin','*')
  res.setHeader('Access-Control-Allow-Headers','*')
  res.setHeader('Content-Type','application/json')
  if(req.method==='OPTIONS'){res.statusCode=204;return res.end()}
  const u=new URL(req.url||'/', 'http://localhost')
  let data=[]
  if(u.pathname.includes('/blog_posts')) data=posts
  else if(u.pathname.includes('/categories')) data=categories
  else if(u.pathname.includes('/site_settings')) data=settings
  else if(u.pathname.includes('/photos')) data=[]
  else if(u.pathname.includes('/currently_items')) data=[]
  else if(u.pathname.includes('/homepage_notes')) data=[]
  else if(u.pathname.includes('/storage/')) { res.statusCode=404; data={message:'not used in fixture'} }
  res.end(JSON.stringify(data))
})
server.listen(54321,'127.0.0.1',()=>console.log('Visual QA Supabase mock on 54321'))
