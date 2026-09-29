import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

const contactSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(320),
  message: z.string().trim().min(1).max(5000),
  website: z.string().max(500).optional().default(''),
  startedAt: z.number().int().nonnegative(),
})

export const submitContactMessage = createServerFn({ method: 'POST' })
  .validator((data) => contactSchema.parse(data))
  .handler(async ({ data }) => {
    // Honeypot + minimum human interaction time. Return success quietly so
    // simple bots do not learn which anti-spam check they tripped.
    const elapsed = Date.now() - data.startedAt
    if (data.website.trim() || elapsed < 800 || elapsed > 12 * 60 * 60 * 1000) {
      return { ok: true }
    }

    const { supabaseAdmin } = await import('@/integrations/supabase/client.server')
    const { error } = await supabaseAdmin.from('contact_messages').insert({
      name: data.name,
      email: data.email,
      message: data.message,
    })

    if (error) {
      console.error('[Contact] Could not store message:', error.message)
      throw new Error('Your note could not be sent right now.')
    }

    return { ok: true }
  })
