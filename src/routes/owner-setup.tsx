import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState, type FormEvent } from 'react'
import { useServerFn } from '@tanstack/react-start'
import { Button } from '@/components/ui/button'
import { createOwner, getSetupStatus } from '@/lib/owner-setup.functions'

export const Route = createFileRoute('/owner-setup')({
  head: () => ({ meta: [
    { title: "Owner setup — Laurel's Organized Chaos" },
    { name: 'description', content: 'One-time owner account setup.' },
    { property: 'og:title', content: "Owner setup — Laurel's Organized Chaos" },
    { property: 'og:description', content: 'One-time owner account setup.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary' },
    { name: 'robots', content: 'noindex' },
  ] }),
  component: Setup,
})

function Setup() {
  const status = useServerFn(getSetupStatus)
  const create = useServerFn(createOwner)
  const [open, setOpen] = useState<boolean | null>(null)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [busy, setBusy] = useState(false)
  useEffect(() => { status().then((r) => setOpen(r.open)).catch(() => setOpen(false)) }, [status])
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setError('')
    const f = new FormData(e.currentTarget)
    const password = String(f.get('password')); if (password !== String(f.get('confirm'))) { setError('Passwords do not match.'); return }
    setBusy(true)
    try { await create({ data: { email: String(f.get('email')), password } }); setDone(true) }
    catch (err) { setError(err instanceof Error ? err.message : 'Setup failed.') }
    finally { setBusy(false) }
  }
  return <main className="login-page"><div className="login-panel">
    <Link to="/" className="login-back">← Back to the site</Link>
    <span className="eyebrow">✦ ONE-TIME SETUP ✦</span>
    <h1>Claim the<br/><em>keys to the chaos.</em></h1>
    {open === null ? <p>Checking...</p> : done || !open ? <><p>{done ? 'Your owner account is ready.' : 'The owner account is already set up.'}</p><Button asChild><Link to="/owner-login">Go to sign in</Link></Button></> :
    <form onSubmit={submit}>
      <label>Owner email<input type="email" name="email" autoComplete="email" required/></label>
      <label>Choose a password (10+ characters)<input type="password" name="password" minLength={10} autoComplete="new-password" required/></label>
      <label>Confirm password<input type="password" name="confirm" minLength={10} autoComplete="new-password" required/></label>
      {error && <p role="alert" className="form-error">{error}</p>}
      <Button type="submit" disabled={busy}>{busy ? 'Creating...' : 'Create owner account'}</Button>
    </form>}
  </div></main>
}