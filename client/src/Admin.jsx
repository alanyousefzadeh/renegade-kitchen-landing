import React, { useEffect, useState } from 'react'
import { auth, signOut, onAuthStateChanged, firebaseIsConfigured } from './firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { getSiteContent, setSiteContent, uploadImage, deleteImage } from './services/content'

export default function Admin() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [content, setContent] = useState({
    logoUrl: '', logoStoragePath: '',
    heroTitle: '', heroSubtitle: '',
    storyTitle: '', storyBody: '', storyImageUrl: '', storyImageStoragePath: '',
    social: { email: 'RenegadeKitchenOrders@gmail.com', instagram: 'https://www.instagram.com/_renegadekitchen_/' },
    benefits: [],
    ways: [],
    ingredientsList: [],
    nutritionalHighlights: [],
    faq: [],
    reviews: [],
    gallery: []
  })
  const [authForm, setAuthForm] = useState({ email: '', password: '' })

  useEffect(() => {
    if (!firebaseIsConfigured) { setLoading(false); return }
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u)
      if (u) {
        try {
          const data = await getSiteContent()
          // Build defaults from current site
          const allAssets = Object.entries(
            import.meta.glob('../assets/*.{png,jpg,jpeg,JPG,JPEG,webp,avif}', { eager: true, import: 'default' })
          ).map(([, url]) => url)
          const defaults = {
            logoUrl: '/logo.jpg',
            heroTitle: 'BONEFIED BROTH',
            heroSubtitle: 'Prescribed by a nurse, crafted by a chef.',
            storyTitle: 'Meet Chef Mo',
            storyBody: 'Meet Chef Mo, our Executive Chef and CEO! With a passion for elevating kosher cuisine, Mo founded Renegade Kitchen in 2019. After culinary school, he specialized in smoked meats and has been refining his craft ever since. Now, in 2025, we\'re excited to introduce BONEFIED BROTH — a premium, health‑conscious product designed with you in mind.',
            social: { email: 'RenegadeKitchenOrders@gmail.com', instagram: 'https://www.instagram.com/_renegadekitchen_/' },
            benefits: [
              { title: 'Supports Your Joint Health', body: 'Collagen, gelatin, and amino acids like proline and glycine may support cartilage and reduce joint pain or stiffness.' },
              { title: 'Supports Your Gut Health', body: 'Gelatin can support the intestinal lining, aiding digestion and calming inflammation. Often included in protocols for leaky gut or IBS.' },
              { title: 'It’s Rich in Nutrients', body: 'A source of vitamins, minerals, and electrolytes like calcium, magnesium, and phosphorus that support immune and bone health.' },
              { title: 'KOSHER', body: 'KOSHER Prepared to the highest kashrut standard. All Meat is Glatt. Contact for further kashrus information.' },
            ],
            ways: [
              { title: 'A Filling Meal or Drink', body: 'With 15g of protein, sip it like tea or coffee — soothing, hydrating, and nutrient‑dense. Great first thing in the morning or as a light evening snack.' },
              { title: 'Base for Soups or Stews', body: 'Use instead of water or stock to boost flavor and nutrition in soups, stews, sauces, and marinades.' },
              { title: 'Cook Grains or Vegetables', body: 'Cook rice, quinoa, lentils, or steam vegetables in bone broth to add depth of flavor and extra nutrients.' },
            ],
            ingredientsList: ['Beef bones', 'Leek, celery, onion, carrot', 'Thyme, parsley, bay leaves', 'Salt and black pepper'],
            nutritionalHighlights: [
              { label: 'Protein', value: '15g' },
              { label: 'Calories', value: '45' },
              { label: 'Collagen', value: 'High' },
              { label: 'Allergens', value: 'None' },
            ],
            faq: [
              { q: 'Is it kosher?', a: 'Yes. Bonefied Broth is prepared to kosher standards.' },
              { q: 'How do I use it?', a: 'Sip it warm, or use as a base for soups, grains, and sauces.' },
              { q: 'How is it delivered?', a: 'We refrigerate or freeze in glass mason jars to lock in freshness. Local pickup/ship varies by region.' },
              { q: 'How long does it stay fresh?', a: 'Bonefied Broth should be kept in the fridge and be consumed within 7 days, Broth can stay up to 3 months in the freezer.' },
            ],
            reviews: [
              { text: "Best broth I've ever had — tastes amazing and I feel great.", author: 'Sara' },
              { text: 'My go-to morning drink now. Clean ingredients, rich flavor.', author: 'David' },
              { text: 'Helped my recovery after training. Highly recommend.', author: 'Josh' }
            ],
            gallery: allAssets,
          }
          const merged = data ? { ...defaults, ...data } : defaults
          setContent((c) => ({ ...c, ...merged }))
        } catch (e) { setError(e.message) }
      }
      setLoading(false)
    })
    return () => unsub && unsub()
  }, [])

  const signIn = async (e) => {
    e?.preventDefault()
    try { await signInWithEmailAndPassword(auth, authForm.email, authForm.password) }
    catch (e) { setError(e.message) }
  }
  const signOutUser = async () => { try { await signOut(auth) } catch (e) { setError(e.message) } }

  const onChange = (e) => setContent({ ...content, [e.target.name]: e.target.value })

  const saveText = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try { await setSiteContent({
      logoUrl: content.logoUrl, logoStoragePath: content.logoStoragePath,
      heroTitle: content.heroTitle, heroSubtitle: content.heroSubtitle,
      storyTitle: content.storyTitle, storyBody: content.storyBody,
      storyImageUrl: content.storyImageUrl, storyImageStoragePath: content.storyImageStoragePath,
      social: content.social,
      benefits: content.benefits,
      ways: content.ways,
      ingredientsList: content.ingredientsList,
      nutritionalHighlights: content.nutritionalHighlights,
      faq: content.faq,
      reviews: content.reviews
    })
      // success feedback
      setNotice('Saved successfully')
      setTimeout(()=>setNotice(''), 3000)
    }
    catch (e) { setError(e.message) }
    finally { setSaving(false) }
  }

  const addImages = async (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setSaving(true)
    try {
      const uploaded = []
      for (const f of files) {
        const { url, storagePath } = await uploadImage(f, 'images')
        uploaded.push({ url, storagePath })
      }
      const gallery = [...(content.gallery || []), ...uploaded]
      setContent({ ...content, gallery })
      await setSiteContent({ gallery })
    } catch (e) { setError(e.message) } finally { setSaving(false); e.target.value = '' }
  }

  const removeImage = async (i) => {
    const img = content.gallery?.[i]
    if (!img) return
    setSaving(true)
    try {
      if (img.storagePath) await deleteImage(img.storagePath)
      const gallery = content.gallery.filter((_, idx) => idx !== i)
      setContent({ ...content, gallery })
      await setSiteContent({ gallery })
    } catch (e) { setError(e.message) } finally { setSaving(false) }
  }

  const migrateFromCurrentSite = async () => {
    if (!firebaseIsConfigured) return
    setSaving(true)
    setError('')
    try {
      // Defaults from site
      const assets = Object.entries(
        import.meta.glob('../assets/*.{png,jpg,jpeg,JPG,JPEG,webp,avif}', { eager: true, import: 'default' })
      ).map(([, url]) => url)

      const toFile = async (url) => {
        const res = await fetch(url)
        const blob = await res.blob()
        const name = url.split('/').pop()?.split('?')[0] || `image-${Date.now()}`
        return new File([blob], name, { type: blob.type || 'image/jpeg' })
      }

      // Upload logo
      let logoUrl = content.logoUrl
      let logoStoragePath = content.logoStoragePath
      try {
        const logoFile = await toFile('/logo.jpg')
        const up = await uploadImage(logoFile, 'images')
        logoUrl = up.url
        logoStoragePath = up.storagePath
      } catch {}

      // Upload gallery assets
      const uploaded = []
      for (const url of assets) {
        try {
          const f = await toFile(url)
          const up = await uploadImage(f, 'gallery')
          uploaded.push({ url: up.url, storagePath: up.storagePath })
        } catch {}
      }

      const next = { ...content, logoUrl, logoStoragePath, gallery: uploaded.length ? uploaded : content.gallery }
      setContent(next)
      await setSiteContent(next)
      setNotice(`Migration complete: ${uploaded.length} image${uploaded.length===1?'':'s'} uploaded`)
      setTimeout(()=>setNotice(''), 4000)
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  if (!firebaseIsConfigured) return <div className="container-p py-10">Add VITE_FIREBASE_* env vars and restart.</div>
  if (loading) return <div className="container-p py-10">Loading…</div>
  if (!user) return (
    <div className="container-p py-10 max-w-md">
      <h1 className="text-2xl font-semibold">Admin Login</h1>
      <form className="mt-4 bg-white rounded-2xl p-6 shadow-soft border border-ink/5" onSubmit={signIn}>
        <label className="block text-sm font-medium">Email
          <input type="email" value={authForm.email} onChange={e=>setAuthForm({...authForm,email:e.target.value})} className="mt-1 w-full rounded-xl border border-ink/20 px-4 py-2 bg-cream/40" required />
        </label>
        <label className="block text-sm font-medium mt-4">Password
          <input type="password" value={authForm.password} onChange={e=>setAuthForm({...authForm,password:e.target.value})} className="mt-1 w-full rounded-xl border border-ink/20 px-4 py-2 bg-cream/40" required />
        </label>
        <button type="submit" className="btn btn-primary mt-5">Sign in</button>
        {error && <div className="mt-3 text-red-700">{error}</div>}
      </form>
    </div>
  )

  return (
    <div className="container-p py-10">
      {notice && (
        <div className="mb-4 rounded-xl border border-green-200 bg-green-50 text-green-800 px-4 py-3 shadow-soft">{notice}</div>
      )}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin</h1>
        <button className="btn btn-outline" onClick={signOutUser}>Sign out</button>
      </div>
      {error && <div className="mt-3 text-red-700">{error}</div>}

      <div className="mt-6 bg-white rounded-2xl p-6 shadow-soft border border-ink/5">
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold">Migrate existing site content to Firebase</div>
          <button className="btn btn-outline" onClick={migrateFromCurrentSite} disabled={saving}>{saving ? 'Working…' : 'Migrate now'}</button>
        </div>
        <div className="text-sm text-ink/70 mt-2">Uploads current logo and all images from the gallery, and saves current text into Firestore.</div>
      </div>

      <form onSubmit={saveText} className="mt-6 grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-soft border border-ink/5">
          <div className="text-lg font-semibold">Brand</div>
          <div className="mt-3 flex items-center gap-4">
            <img src={content.logoUrl || '/logo.jpg'} alt="logo" className="h-16 w-16 rounded-full object-cover border border-ink/10" />
            <label className="btn btn-outline">Upload Logo
              <input type="file" accept="image/*" className="hidden" onChange={async (e)=>{
                const f = e.target.files?.[0]; if(!f) return; setSaving(true); try{ const {url, storagePath} = await uploadImage(f,'images'); setContent({...content, logoUrl:url, logoStoragePath:storagePath}); await setSiteContent({logoUrl:url, logoStoragePath:storagePath}); } catch(err){ setError(err.message) } finally { setSaving(false); e.target.value=''; }
              }} />
            </label>
          </div>
          <label className="block text-sm font-medium mt-4">Instagram URL
            <input value={content.social?.instagram||''} onChange={(e)=>setContent({...content, social:{...content.social, instagram:e.target.value}})} className="mt-1 w-full rounded-xl border border-ink/20 px-4 py-2 bg-cream/40" />
          </label>
          <label className="block text-sm font-medium mt-4">Contact Email
            <input type="email" value={content.social?.email||''} onChange={(e)=>setContent({...content, social:{...content.social, email:e.target.value}})} className="mt-1 w-full rounded-xl border border-ink/20 px-4 py-2 bg-cream/40" />
          </label>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-soft border border-ink/5">
          <div className="text-lg font-semibold">Hero</div>
          <label className="block text-sm font-medium mt-4">Title
            <input name="heroTitle" value={content.heroTitle||''} onChange={onChange} className="mt-1 w-full rounded-xl border border-ink/20 px-4 py-2 bg-cream/40" />
          </label>
          <label className="block text-sm font-medium mt-4">Subtitle
            <input name="heroSubtitle" value={content.heroSubtitle||''} onChange={onChange} className="mt-1 w-full rounded-xl border border-ink/20 px-4 py-2 bg-cream/40" />
          </label>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-soft border border-ink/5">
          <div className="text-lg font-semibold">Story</div>
          <div className="mt-3 flex items-center gap-4">
            <img src={content.storyImageUrl || content.logoUrl || '/logo.jpg'} alt="story" className="h-20 w-20 object-cover rounded-xl border border-ink/10" />
            <label className="btn btn-outline">Upload Story Image
              <input type="file" accept="image/*" className="hidden" onChange={async (e)=>{
                const f = e.target.files?.[0]; if(!f) return; setSaving(true); try{ const {url, storagePath} = await uploadImage(f,'images'); setContent({...content, storyImageUrl:url, storyImageStoragePath:storagePath}); await setSiteContent({storyImageUrl:url, storyImageStoragePath:storagePath}); } catch(err){ setError(err.message) } finally { setSaving(false); e.target.value=''; }
              }} />
            </label>
          </div>
          <label className="block text-sm font-medium mt-4">Title
            <input name="storyTitle" value={content.storyTitle||''} onChange={onChange} className="mt-1 w-full rounded-xl border border-ink/20 px-4 py-2 bg-cream/40" />
          </label>
          <label className="block text-sm font-medium mt-4">Body
            <textarea rows={6} name="storyBody" value={content.storyBody||''} onChange={onChange} className="mt-1 w-full rounded-xl border border-ink/20 px-4 py-2 bg-cream/40" />
          </label>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-soft border border-ink/5">
          <div className="text-lg font-semibold">Benefits</div>
          <button type="button" className="btn btn-outline mt-3" onClick={()=>setContent({...content, benefits:[...(content.benefits||[]), {title:'', body:''}]})}>Add</button>
          <div className="mt-3 space-y-3">
            {(content.benefits||[]).map((it, i)=> (
              <div key={i} className="border border-ink/10 rounded-xl p-3">
                <input placeholder="Title" value={it.title} onChange={(e)=>{ const arr=[...content.benefits]; arr[i]={...arr[i], title:e.target.value}; setContent({...content, benefits:arr}) }} className="w-full rounded-xl border border-ink/20 px-3 py-2 bg-cream/40" />
                <textarea placeholder="Body" value={it.body} onChange={(e)=>{ const arr=[...content.benefits]; arr[i]={...arr[i], body:e.target.value}; setContent({...content, benefits:arr}) }} className="w-full rounded-xl border border-ink/20 px-3 py-2 bg-cream/40 mt-2" />
                <button type="button" className="btn btn-outline mt-2" onClick={()=>{ const arr=[...content.benefits]; arr.splice(i,1); setContent({...content, benefits:arr}) }}>Remove</button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-soft border border-ink/5">
          <div className="text-lg font-semibold">Ways To Use</div>
          <button type="button" className="btn btn-outline mt-3" onClick={()=>setContent({...content, ways:[...(content.ways||[]), {title:'', body:''}]})}>Add</button>
          <div className="mt-3 space-y-3">
            {(content.ways||[]).map((it, i)=> (
              <div key={i} className="border border-ink/10 rounded-xl p-3">
                <input placeholder="Title" value={it.title} onChange={(e)=>{ const arr=[...content.ways]; arr[i]={...arr[i], title:e.target.value}; setContent({...content, ways:arr}) }} className="w-full rounded-xl border border-ink/20 px-3 py-2 bg-cream/40" />
                <textarea placeholder="Body" value={it.body} onChange={(e)=>{ const arr=[...content.ways]; arr[i]={...arr[i], body:e.target.value}; setContent({...content, ways:arr}) }} className="w-full rounded-xl border border-ink/20 px-3 py-2 bg-cream/40 mt-2" />
                <button type="button" className="btn btn-outline mt-2" onClick={()=>{ const arr=[...content.ways]; arr.splice(i,1); setContent({...content, ways:arr}) }}>Remove</button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-soft border border-ink/5">
          <div className="text-lg font-semibold">Ingredients</div>
          <button type="button" className="btn btn-outline mt-3" onClick={()=>setContent({...content, ingredientsList:[...(content.ingredientsList||[]), '']})}>Add</button>
          <div className="mt-3 space-y-2">
            {(content.ingredientsList||[]).map((val, i)=> (
              <div key={i} className="flex gap-2 items-center">
                <input value={val} onChange={(e)=>{ const arr=[...content.ingredientsList]; arr[i]=e.target.value; setContent({...content, ingredientsList:arr}) }} className="flex-1 rounded-xl border border-ink/20 px-3 py-2 bg-cream/40" />
                <button type="button" className="btn btn-outline" onClick={()=>{ const arr=[...content.ingredientsList]; arr.splice(i,1); setContent({...content, ingredientsList:arr}) }}>Remove</button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-soft border border-ink/5">
          <div className="text-lg font-semibold">Nutrition</div>
          <button type="button" className="btn btn-outline mt-3" onClick={()=>setContent({...content, nutritionalHighlights:[...(content.nutritionalHighlights||[]), {label:'', value:''}]})}>Add</button>
          <div className="mt-3 space-y-3">
            {(content.nutritionalHighlights||[]).map((it, i)=> (
              <div key={i} className="grid grid-cols-2 gap-2 items-center">
                <input placeholder="Label" value={it.label} onChange={(e)=>{ const arr=[...content.nutritionalHighlights]; arr[i]={...arr[i], label:e.target.value}; setContent({...content, nutritionalHighlights:arr}) }} className="rounded-xl border border-ink/20 px-3 py-2 bg-cream/40" />
                <input placeholder="Value" value={it.value} onChange={(e)=>{ const arr=[...content.nutritionalHighlights]; arr[i]={...arr[i], value:e.target.value}; setContent({...content, nutritionalHighlights:arr}) }} className="rounded-xl border border-ink/20 px-3 py-2 bg-cream/40" />
                <div className="col-span-2">
                  <button type="button" className="btn btn-outline" onClick={()=>{ const arr=[...content.nutritionalHighlights]; arr.splice(i,1); setContent({...content, nutritionalHighlights:arr}) }}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-soft border border-ink/5 md:col-span-2">
          <div className="text-lg font-semibold">FAQ</div>
          <button type="button" className="btn btn-outline mt-3" onClick={()=>setContent({...content, faq:[...(content.faq||[]), {q:'', a:''}]})}>Add</button>
          <div className="mt-3 grid md:grid-cols-2 gap-3">
            {(content.faq||[]).map((it, i)=> (
              <div key={i} className="border border-ink/10 rounded-xl p-3">
                <input placeholder="Question" value={it.q} onChange={(e)=>{ const arr=[...content.faq]; arr[i]={...arr[i], q:e.target.value}; setContent({...content, faq:arr}) }} className="w-full rounded-xl border border-ink/20 px-3 py-2 bg-cream/40" />
                <textarea placeholder="Answer" value={it.a} onChange={(e)=>{ const arr=[...content.faq]; arr[i]={...arr[i], a:e.target.value}; setContent({...content, faq:arr}) }} className="w-full rounded-xl border border-ink/20 px-3 py-2 bg-cream/40 mt-2" />
                <button type="button" className="btn btn-outline mt-2" onClick={()=>{ const arr=[...content.faq]; arr.splice(i,1); setContent({...content, faq:arr}) }}>Remove</button>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save all text'}</button>
        </div>
      </form>

      <div className="mt-10 bg-white rounded-2xl p-6 shadow-soft border border-ink/5 md:col-span-2">
        <div className="text-lg font-semibold">Reviews</div>
        <button type="button" className="btn btn-outline mt-3" onClick={()=>setContent({...content, reviews:[...(content.reviews||[]), {text:'', author:'', imageUrl:'', imageStoragePath:''}]})}>Add</button>
        <div className="mt-3 grid md:grid-cols-3 gap-3">
          {(content.reviews||[]).map((r, i)=> (
            <div key={i} className="border border-ink/10 rounded-xl p-3">
              <label className="block text-sm font-medium">Text
                <textarea value={r.text} onChange={(e)=>{ const arr=[...content.reviews]; arr[i]={...arr[i], text:e.target.value}; setContent({...content, reviews:arr}) }} className="mt-1 w-full rounded-xl border border-ink/20 px-3 py-2 bg-cream/40" />
              </label>
              <label className="block text-sm font-medium mt-2">Author
                <input value={r.author} onChange={(e)=>{ const arr=[...content.reviews]; arr[i]={...arr[i], author:e.target.value}; setContent({...content, reviews:arr}) }} className="mt-1 w-full rounded-xl border border-ink/20 px-3 py-2 bg-cream/40" />
              </label>
              <div className="mt-2 flex items-center gap-3">
                {r.imageUrl && <img src={r.imageUrl} alt="review" className="h-12 w-12 rounded-full object-cover border border-ink/10" />}
                <label className="btn btn-outline">Upload Photo
                  <input type="file" accept="image/*" className="hidden" onChange={async (e)=>{
                    const f = e.target.files?.[0]; if(!f) return; setSaving(true); try{ const {url, storagePath} = await uploadImage(f,'reviews'); const arr=[...content.reviews]; arr[i]={...arr[i], imageUrl:url, imageStoragePath:storagePath}; setContent({...content, reviews:arr}); await setSiteContent({reviews:arr}); } catch(err){ setError(err.message) } finally { setSaving(false); e.target.value=''; }
                  }} />
                </label>
              </div>
              <button type="button" className="btn btn-outline mt-2" onClick={()=>{ const arr=[...content.reviews]; arr.splice(i,1); setContent({...content, reviews:arr}) }}>Remove</button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 bg-white rounded-2xl p-6 shadow-soft border border-ink/5">
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold">Gallery Images</div>
          <label className="btn btn-outline">
            Upload
            <input type="file" multiple accept="image/*" className="hidden" onChange={addImages} />
          </label>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {(content.gallery||[]).map((img, i) => (
            <div key={i} className="relative group border border-ink/10 rounded-xl overflow-hidden bg-cream">
              <img src={img.url || img} alt="Gallery" className="w-full h-40 object-cover" />
              <button className="absolute top-2 right-2 hidden group-hover:block bg-white/90 rounded px-2 py-1 text-sm" onClick={()=>removeImage(i)}>Remove</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


