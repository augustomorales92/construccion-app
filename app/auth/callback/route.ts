
import { createUserInPrisma } from '@/actions/actions'
import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the SSR package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin
  const redirectTo = requestUrl.searchParams.get('redirect_to')?.toString()
  const email = requestUrl.searchParams.get('email')?.toString()
  const role = requestUrl.searchParams.get('role')?.toString()

  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)
    if (email) {
      await createUserInPrisma(email, role)
    }
  }

  if (redirectTo) {
    return NextResponse.redirect(`${origin}${redirectTo}`)
  }

  // URL to redirect to after sign up process completes
  return NextResponse.redirect(`${origin}/protected`)
}
