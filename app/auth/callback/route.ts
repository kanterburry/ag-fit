import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get('next') ?? '/dashboard'

    if (code) {
        const supabase = await createClient()
        const { data, error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error && data?.session) {
            // Extract provider tokens
            const { session } = data
            const { provider_token, provider_refresh_token, user } = session

            if (provider_token && user) {
                // Upsert tokens
                const { error: tokenError } = await supabase
                    .from('google_calendar_tokens')
                    .upsert({
                        user_id: user.id,
                        access_token: provider_token,
                        refresh_token: provider_refresh_token, // Might be null if not first login or no offline access
                        // expiry? Supabase doesn't give absolute expiry, but usually it's 1 hour.
                        updated_at: new Date().toISOString()
                    }, { onConflict: 'user_id' })

                if (tokenError) {
                    console.error('Error saving Google tokens:', tokenError)
                    // Don't block login, but log it
                }
            }

            return NextResponse.redirect(`${origin}${next}`)
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
