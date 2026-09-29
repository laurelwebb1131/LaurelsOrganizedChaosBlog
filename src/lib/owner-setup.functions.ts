import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

const OWNER_EMAIL = 'thestudentemail1131@gmail.com'

async function ownerExists() {
  const { supabaseAdmin } = await import('@/integrations/supabase/client.server')
  const { count } = await supabaseAdmin.from('user_roles').select('id', { count: 'exact', head: true }).eq('role', 'owner')
  return (count ?? 0) > 0
}

export const getSetupStatus = createServerFn({ method: 'GET' }).handler(async () => ({ open: !(await ownerExists()) }))

export const createOwner = createServerFn({ method: 'POST' })
  .inputValidator((d) => z.object({ email: z.string().email(), password: z.string().min(10).max(128) }).parse(d))
  .handler(async ({ data }) => {
    if (data.email.trim().toLowerCase() !== OWNER_EMAIL) throw new Error('This email is not the owner email.')
    if (await ownerExists()) throw new Error('The owner account already exists.')
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server')
    const { data: created, error } = await supabaseAdmin.auth.admin.createUser({ email: OWNER_EMAIL, password: data.password, email_confirm: true })
    if (error || !created.user) throw new Error(error?.message ?? 'Could not create account.')
    const { error: roleError } = await supabaseAdmin.from('user_roles').insert({ user_id: created.user.id, role: 'owner' })
    if (roleError) throw new Error(roleError.message)
    return { ok: true }
  })