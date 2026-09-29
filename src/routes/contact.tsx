import { createFileRoute } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { useRef, useState, type FormEvent } from 'react'
import { ArrowUpRight, Mail } from 'lucide-react'

import { Shell } from '@/components/site'
import { Button } from '@/components/ui/button'
import { submitContactMessage } from '@/lib/contact.functions'

export const Route = createFileRoute('/contact')({
  head: () => ({
    meta: [
      { title: "Contact — Laurel's Organized Chaos" },
      { name: 'description', content: 'Send a note to Laurel through the contact page.' },
      { property: 'og:title', content: 'Contact — Laurel’s Organized Chaos' },
      { property: 'og:description', content: 'Send a little note to Laurel.' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
  }),
  component: Contact,
})

function Contact() {
  const sendMessage = useServerFn(submitContactMessage)
  const startedAt = useRef(Date.now())
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setState('sending')

    const form = new FormData(event.currentTarget)

    try {
      await sendMessage({
        data: {
          name: String(form.get('name') || ''),
          email: String(form.get('email') || ''),
          message: String(form.get('message') || ''),
          website: String(form.get('website') || ''),
          startedAt: startedAt.current,
        },
      })
      setState('sent')
      event.currentTarget.reset()
      startedAt.current = Date.now()
    } catch {
      setState('error')
    }
  }

  return (
    <Shell>
      <main className="wrap page-main contact-page">
        <div>
          <span className="eyebrow">✦ A NOTE ACROSS THE UNIVERSE ✦</span>
          <h1>
            Leave a
            <br />
            <em>little note.</em>
          </h1>
          <p>Questions, thoughts, or just a hello? Drop it here. The inbox is open.</p>
          <div className="contact-doodle">
            <Mail size={55} />
            <span>✧ messages make the world smaller ✧</span>
          </div>
        </div>

        <div className="contact-paper">
          <span className="paper-heading">DEAR LAUREL,</span>
          {state === 'sent' ? (
            <div className="sent-state">
              <h2>Your note is on its way. ✦</h2>
              <p>Thanks for reaching out. Your message has been tucked safely into the inbox.</p>
              <Button
                type="button"
                onClick={() => {
                  startedAt.current = Date.now()
                  setState('idle')
                }}
              >
                Write another note
              </Button>
            </div>
          ) : (
            <form onSubmit={submit}>
              <label>
                Your name
                <input
                  name="name"
                  required
                  maxLength={120}
                  autoComplete="name"
                  placeholder="What should I call you?"
                />
              </label>

              <label>
                Your email
                <input
                  name="email"
                  type="email"
                  required
                  maxLength={320}
                  autoComplete="email"
                  placeholder="you@example.com"
                />
              </label>

              <label>
                Your message
                <textarea
                  name="message"
                  required
                  maxLength={5000}
                  rows={6}
                  placeholder="Start anywhere..."
                />
              </label>

              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  width: 1,
                  height: 1,
                  overflow: 'hidden',
                  clipPath: 'inset(50%)',
                }}
              >
                <label>
                  Website
                  <input
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </label>
              </div>

              {state === 'error' && (
                <p role="alert">The note could not be sent. Please try again.</p>
              )}

              <Button type="submit" disabled={state === 'sending'}>
                {state === 'sending' ? 'Sending...' : 'Send my note'}{' '}
                <ArrowUpRight size={17} />
              </Button>
            </form>
          )}
        </div>
      </main>
    </Shell>
  )
}
