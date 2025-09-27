import React, { useState } from 'react'
import Slideshow from './Slideshow.jsx'
import { useEffect } from 'react'
import { getSiteContent } from './services/content'
import OrderModal from './OrderModal.jsx'
import Reviews from './Reviews.jsx'

// Auto-import all images from the assets directory (sorted by filename)
const galleryImages = Object.entries(
  import.meta.glob('../assets/*.{png,jpg,jpeg,JPG,JPEG,webp,avif}', { eager: true, import: 'default' })
)
  .filter(([p]) => !/\/chef\.(png|jpe?g|webp|avif)$/i.test(p))
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, url]) => url)

// Pick chef image specifically for the Story section (keep it out of the carousel)
const chefImage = Object.entries(
  import.meta.glob('../assets/*.{png,jpg,jpeg,JPG,JPEG,webp,avif}', { eager: true, import: 'default' })
).find(([p]) => /\/chef\.(png|jpe?g|webp|avif)$/i.test(p))?.[1]


const Nav = ({ onOrder, logoUrl }) => {
  const [open, setOpen] = useState(false);
  const links = [
    ['Broth', '#broth'],
    ['Benefits', '#benefits'],
    ['Ways to Use', '#ways'],
    ['Ingredients', '#ingredients'],
    ['Gallery', '#gallery'],
    ['Story', '#story'],
    ['FAQ', '#faq'],
    ['Contact', '#contact'],
  ];
  return (
    <header className="sticky top-0 z-50 bg-cream/90 backdrop-blur border-b border-ink/10">
      <div className="container-p flex items-center justify-between py-4">
        <a href="#" className="flex items-center gap-3">
          <img src={logoUrl || '/logo.jpg'} alt="Renegade Kitchen Bonefied Broth logo" className="h-12 w-12 rounded-full object-cover shadow" />
          <div className="leading-tight">
            <div className="text-xs uppercase tracking-[0.2em] text-ink/70">By</div>
            <div className="text-lg font-display font-bold">Renegade Kitchen</div>
          </div>
        </a>
        <nav className="hidden md:flex gap-6 text-sm">
          {links.map(([label, href]) => (
            <a key={href} className="hover:text-gold font-medium" href={href}>{label}</a>
          ))}
        </nav>
        <div className="hidden md:block">
          <button onClick={onOrder} className="btn btn-primary">Order Now</button>
        </div>
        <button onClick={() => setOpen(!open)} className="md:hidden p-2 -mr-2" aria-label="Toggle menu">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-ink/10">
          <div className="container-p py-3 flex flex-col gap-3">
            {links.map(([label, href]) => (
              <a key={href} className="py-1" href={href} onClick={() => setOpen(false)}>{label}</a>
            ))}
            <button className="btn btn-primary mt-2" onClick={()=>{ setOpen(false); onOrder(); }}>Order Now</button>
          </div>
        </div>
      )}
    </header>
  )
}

const Hero = ({ heroTitle, heroSubtitle, logoUrl }) => (
  <section className="relative">
    <div className="container-p grid md:grid-cols-2 items-center gap-10 py-16 md:py-24">
      <div>
        <h1 className="font-display text-4xl md:text-6xl leading-tight">{heroTitle || 'BONEFIED BROTH'}</h1>
        <p className="mt-4 text-lg text-ink/80">{heroSubtitle || 'Prescribed by a nurse, crafted by a chef.'}</p>
        <div className="mt-8 flex gap-4">
          <a href="#order" className="btn btn-primary">Order Now</a>
          <a href="#benefits" className="btn btn-outline">Why Broth?</a>
        </div>
        <div className="mt-6 text-ink/70 text-sm">Est. 2019 • Kosher • Crafted with integrity</div>
      </div>
      <div className="flex justify-center">
        <div className="relative">
          <img src={logoUrl || '/logo.jpg'} alt="Bonefied Broth logo" className="w-72 h-72 md:w-96 md:h-96 object-cover rounded-full ring-8 ring-cream shadow-soft"/>
          <div className="absolute -bottom-4 -right-4 bg-honey text-ink px-4 py-2 rounded-xl font-semibold shadow-soft">
            Real • Kosher
          </div>
        </div>
      </div>
    </div>
  </section>
)

const SectionTitle = ({eyebrow, title, subtitle}) => (
  <div className="text-center max-w-3xl mx-auto">
    {eyebrow && <div className="uppercase tracking-[0.2em] text-ink/60 text-xs">{eyebrow}</div>}
    <h2 className="font-display text-3xl md:text-5xl mt-2">{title}</h2>
    {subtitle && <p className="text-ink/70 mt-4">{subtitle}</p>}
  </div>
)

const Benefits = ({ items }) => {
  const defaultItems = [
    ['Supports Your Joint Health', 'Collagen, gelatin, and amino acids like proline and glycine may support cartilage and reduce joint pain or stiffness.'],
    ['Supports Your Gut Health', 'Gelatin can support the intestinal lining, aiding digestion and calming inflammation. Often included in protocols for leaky gut or IBS.'],
    ['It’s Rich in Nutrients', 'A source of vitamins, minerals, and electrolytes like calcium, magnesium, and phosphorus that support immune and bone health.'],
    ['KOSHER', 'KOSHER Prepared to the highest kashrut standard. All Meat is Glatt. Contact for further kashrus information.']
  ]
  const list = (items && items.length) ? items.map(i=>[i.title,i.body]) : defaultItems
  return (
    <section id="benefits" className="py-16 md:py-24 bg-white/60">
      <div className="container-p">
        <SectionTitle eyebrow="Benefits" title="Why BONEFIED BROTH?" />
        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {list.map(([title, body]) => (
            <div key={title} className="bg-white rounded-2xl p-6 shadow-soft border border-ink/5">
              <div className="text-[14px] md:text-[16px] xl:text-[18px] font-semibold leading-tight whitespace-normal break-words">{title}</div>
              <p className="text-ink/70 mt-2">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const Broth = ({ onOrder, nutritionalHighlights }) => {
  return (
  <section id="broth" className="py-16 md:py-24">
    <div className="container-p grid lg:grid-cols-[1.2fr,0.8fr] gap-12 items-start">
      <div>
        <SectionTitle eyebrow="About Bonefied Broth" title="Crafted with Culinary Skill and Health in Mind" />
        <div className="mt-6 space-y-4 text-ink/80">
          <p>This healthy, nutrient-dense bone broth is crafted by Chef Mo and Nurse Emily — a culinary masterpiece that combines the art of cooking with the science of nutrition. It begins with high-quality beef bones, roasted to enhance flavor.</p>
          <p>Chef Mo meticulously selects fresh vegetables like carrots, celery, and onions to add depth and richness. To this aromatic foundation, herbs such as thyme, parsley, and bay leaves are introduced, infusing the broth with a comforting, earthy aroma.</p>
          <p>It is simmered slowly over 18–24 hours, allowing the bones to release collagen, amino acids, and minerals like calcium and magnesium, which support joint and immune health. More than a nourishing elixir, it’s a testament to culinary artistry and health science — comfort and healing in every sip.</p>
        </div>
        <div className="mt-8 flex gap-4" id="order">
          <button className="btn btn-primary" onClick={onOrder}>Order Now</button>
          <a className="btn btn-outline" href="#contact">Wholesale</a>
        </div>
      </div>
      <div className="bg-white rounded-3xl p-8 shadow-soft border border-ink/5">
        <div className="uppercase tracking-widest text-xs text-ink/60">Nutritional Highlights*</div>
        <dl className="grid grid-cols-2 gap-4 mt-4">
          {(nutritionalHighlights && nutritionalHighlights.length ? nutritionalHighlights.map(n=>[n.label,n.value]) : [
            ['Protein', '15g'],
            ['Calories', '45'],
            ['Collagen', 'High'],
            ['Allergens', 'None']
          ]).map(([k, v]) => (
            <div key={k} className="bg-cream rounded-xl p-4 border border-ink/5">
              <dt className="text-sm text-ink/60">{k}</dt>
              <dd className="text-2xl font-semibold">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-xs text-ink/60">*Approximate values per 8oz serving; varies by batch.</p>

        <div className="mt-8 uppercase tracking-widest text-xs text-ink/60">Ingredients</div>
        <ul className="mt-4 list-disc pl-5 text-ink/80 space-y-1">
          <li>Beef bones</li>
          <li>Leek, celery, onion, carrot</li>
          <li>Thyme, parsley, bay leaves</li>
          <li>Salt and black pepper</li>
        </ul>
      </div>
    </div>
  </section>
  )
}

const Ingredients = ({ ingredients }) => (
  <section id="ingredients" className="py-16 md:py-24 bg-white/60">
    <div className="container-p grid md:grid-cols-2 gap-10 items-center">
      <div>
        <SectionTitle eyebrow="Ingredients" title="Simply nourishing" />
        <p className="mt-4 text-ink/80">{(ingredients && ingredients.length ? ingredients.join(', ') : 'Beef bones, leek, celery, onion, carrot, thyme, parsley, bay leaves, salt, and black pepper.')}</p>
        <p className="mt-4 text-ink/70 text-sm">Thoughtfully sourced and balanced for depth and clarity.</p>
      </div>
      <div className="bg-cream border border-ink/5 p-8 rounded-3xl shadow-soft">
        <ol className="list-decimal pl-6 space-y-3">
          <li>Roasted bones for deep, savory notes.</li>
          <li>Simmered low & slow for 24+ hours.</li>
          <li>Skim, strain, and chill for clarity.</li>
          <li>Packaged fresh, frozen fast.</li>
        </ol>
        <div className="mt-6 inline-block bg-honey text-ink px-4 py-2 rounded-xl font-semibold">Kosher • Est. 2019</div>
      </div>
    </div>
  </section>
)

const Gallery = ({ images }) => (
  <section id="gallery" className="py-16 md:py-24">
    <div className="container-p">
      <SectionTitle eyebrow="Gallery" title="See the product up close" subtitle="A few looks at Bonefied Broth." />
      <div className="mt-8">
        <Slideshow images={images && images.length ? images : galleryImages} />
      </div>
    </div>
  </section>
)

const WaysToUse = ({ items }) => (
  <section id="ways" className="py-16 md:py-24 bg-white/60">
    <div className="container-p">
      <SectionTitle eyebrow="Ways to Use" title="Delicious, simple, and versatile" />
      <div className="mt-10 grid md:grid-cols-3 gap-6">
        {(items && items.length ? items : [
          { title: 'A Filling Meal or Drink', body: 'With 15g of protein, sip it like tea or coffee — soothing, hydrating, and nutrient‑dense. Great first thing in the morning or as a light evening snack.' },
          { title: 'Base for Soups or Stews', body: 'Use instead of water or stock to boost flavor and nutrition in soups, stews, sauces, and marinades.' },
          { title: 'Cook Grains or Vegetables', body: 'Cook rice, quinoa, lentils, or steam vegetables in bone broth to add depth of flavor and extra nutrients.' },
        ]).map((it)=> (
          <div key={it.title} className="bg-white rounded-2xl p-6 shadow-soft border border-ink/5">
            <div className="text-xl font-semibold">{it.title}</div>
            <p className="text-ink/70 mt-2">{it.body}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
)

const Story = ({ storyTitle, storyBody, storyImageUrl }) => {
  const storyImage = chefImage || (galleryImages || []).find((p) => /4D12B177-A65F-45FC-9D46-728F205565B2|portrait/i.test(p)) || (galleryImages || [])[0] || '/logo.jpg';
  return (
    <section id="story" className="py-16 md:py-24">
      <div className="container-p grid md:grid-cols-2 gap-10 items-center">
        <div>
          <SectionTitle eyebrow="About Us" title={storyTitle || 'Meet Chef Mo'} />
          <div className="mt-6 text-ink/80 space-y-4">
            <p>{storyBody || 'Meet Chef Mo, our Executive Chef and CEO! With a passion for elevating kosher cuisine, Mo founded Renegade Kitchen in 2019. After culinary school, he specialized in smoked meats and has been refining his craft ever since. Now, in 2025, we\'re excited to introduce BONEFIED BROTH — a premium, health‑conscious product designed with you in mind.'}</p>
          </div>
        </div>
        <div className="rounded-3xl overflow-hidden border border-ink/10 shadow-soft bg-cream flex items-center justify-center">
          <img src={storyImageUrl || storyImage} alt="Chef Mo" className="max-h-[24rem] h-full w-full object-contain"/>
        </div>
      </div>
    </section>
  )
}

const FAQ = ({ items }) => {
  const faqs = items && items.length ? items.map(i=>[i.q,i.a]) : [
    ['Is it kosher?', 'Yes. Bonefied Broth is prepared to kosher standards.'],
    ['How do I use it?', 'Sip it warm, or use as a base for soups, grains, and sauces.'],
    ['How is it delivered?', 'We refrigerate or freeze in glass mason jars to lock in freshness. Local pickup/ship varies by region.'],
    ['How long does it stay fresh?', 'Bonefied Broth should be kept in the fridge and be consumed within 7 days, Broth can stay up to 3 months in the freezer.'],
  ]
  return (
    <section id="faq" className="py-16 md:py-24 bg-white/60">
      <div className="container-p">
        <SectionTitle eyebrow="FAQ" title="Good questions" />
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {faqs.map(([q, a]) => (
            <div key={q} className="bg-white rounded-2xl p-6 shadow-soft border border-ink/5">
              <div className="text-[14px] md:text-[16px] font-semibold leading-tight whitespace-normal">{q}</div>
              <p className="text-ink/70 mt-2">{a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');
  const [errorText, setErrorText] = useState('');
  const handle = async (e) => {
    e.preventDefault();
    setStatus('loading');
    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
    if (!accessKey) {
      setStatus('error');
      setErrorText('Web3Forms not configured. Add VITE_WEB3FORMS_ACCESS_KEY and restart.');
      return;
    }
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          access_key: accessKey,
          subject: `Website contact from ${form.name}`,
          name: form.name,
          email: form.email,
          message: form.message,
          to: 'RenegadeKitchenOrders@gmail.com'
        })
      });
      const data = await res.json();
      if (data.success) {
        setStatus('success');
        setForm({ name: '', email: '', message: '' });
      } else {
        throw new Error(data.message || 'Web3Forms error');
      }
    } catch (err) {
      console.error('Web3Forms error', err);
      setStatus('error');
      setErrorText(err?.message || 'Submission failed.');
    }
  }
  return (
    <section id="contact" className="py-16 md:py-24">
      <div className="container-p grid md:grid-cols-2 gap-10 items-start">
        <div>
          <SectionTitle eyebrow="Contact" title="Say hello" />
          <p className="mt-4 text-ink/70">Wholesale, catering, or press — we’d love to talk.</p>
          <div className="mt-6 text-sm">
            <div><strong>Email:</strong> <a href="mailto:RenegadeKitchenOrders@gmail.com" className="underline hover:text-gold">RenegadeKitchenOrders@gmail.com</a></div>
            <div className="mt-1"><strong>Instagram:</strong> <a href="https://www.instagram.com/_renegadekitchen_/" target="_blank" rel="noreferrer" className="underline hover:text-gold">@_renegadekitchen_</a></div>
          </div>
        </div>
        <form onSubmit={handle} className="bg-white rounded-3xl p-6 shadow-soft border border-ink/5">
          <label className="block text-sm font-medium">Name
            <input required value={form.name} onChange={e=>setForm({ ...form, name: e.target.value })} className="mt-1 w-full rounded-xl border border-ink/20 px-4 py-2 bg-cream/40 focus:outline-none focus:ring-2 focus:ring-gold" />
          </label>
          <label className="block text-sm font-medium mt-4">Email
            <input type="email" required value={form.email} onChange={e=>setForm({ ...form, email: e.target.value })} className="mt-1 w-full rounded-xl border border-ink/20 px-4 py-2 bg-cream/40 focus:outline-none focus:ring-2 focus:ring-gold" />
          </label>
          <label className="block text-sm font-medium mt-4">Message
            <textarea required value={form.message} onChange={e=>setForm({ ...form, message: e.target.value })} rows={4} className="mt-1 w-full rounded-xl border border-ink/20 px-4 py-2 bg-cream/40 focus:outline-none focus:ring-2 focus:ring-gold" />
          </label>
          <button className="btn btn-primary mt-5" disabled={status==='loading'}>
            {status==='loading' ? 'Sending…' : 'Send Message'}
          </button>
          {status==='success' && <div className="mt-3 text-green-700">Thanks! We’ll be in touch.</div>}
          {status==='error' && <div className="mt-3 text-red-700">Something went wrong. {errorText}</div>}
        </form>
      </div>
    </section>
  )
}

const Footer = () => (
  <footer className="border-t border-ink/10 py-8">
    <div className="container-p flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <img src="/logo.jpg" alt="logo" className="h-10 w-10 rounded-full object-cover"/>
        <div className="text-sm text-ink/70">© {new Date().getFullYear()} Renegade Kitchen</div>
      </div>
      <form className="flex gap-2" onSubmit={async (e)=>{
        e.preventDefault();
        const email = e.currentTarget.email.value;
        if (!email) return;
        await fetch('/api/subscribe', { method:'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({email}) });
        e.currentTarget.reset();
        alert('Thanks for subscribing!');
      }}>
        <input name="email" type="email" placeholder="Your email" className="rounded-xl px-4 py-2 border border-ink/20 bg-white/80 focus:outline-none focus:ring-2 focus:ring-gold" required/>
        <button className="btn btn-primary">Subscribe</button>
      </form>
    </div>
  </footer>
)

export default function App() {
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [cms, setCms] = useState(null)
  useEffect(() => { getSiteContent().then((c)=> c && setCms(c)).catch(()=>{}) }, [])
  const openOrder = () => setIsOrderOpen(true);
  const closeOrder = () => setIsOrderOpen(false);
  const jotformUrl = 'https://www.jotform.com/build/252296401837157/settings/emails#preview';

  return (
    <div>
      <Nav onOrder={openOrder} logoUrl={cms?.logoUrl} />
      <Hero heroTitle={cms?.heroTitle} heroSubtitle={cms?.heroSubtitle} logoUrl={cms?.logoUrl} />
      <Benefits items={cms?.benefits} />
      <Broth onOrder={openOrder} nutritionalHighlights={cms?.nutritionalHighlights} />
      <Ingredients ingredients={cms?.ingredientsList} />
      <WaysToUse items={cms?.ways} />
      <Gallery images={(cms?.gallery||[]).map((g)=> typeof g==='string' ? g : g.url).filter(Boolean)} />
      <Story storyTitle={cms?.storyTitle} storyBody={cms?.storyBody} storyImageUrl={cms?.storyImageUrl} />
      <Reviews items={cms?.reviews||[]} />
      <FAQ items={cms?.faq} />
      <Contact />
      <Footer />
      <OrderModal open={isOrderOpen} onClose={closeOrder} src={jotformUrl} />
    </div>
  )
}
