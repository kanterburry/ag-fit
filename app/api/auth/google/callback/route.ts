import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')
    const error = searchParams.get('error')

    if (error) {
        return NextResponse.redirect(new URL(`/dashboard/settings?error=${error}`, request.url))
    }

    if (!code) {
        return NextResponse.redirect(new URL('/dashboard/settings?error=no_code', request.url))
    }

    try {
        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`
        )

        // Exchange code for tokens
        const { tokens } = await oauth2Client.getToken(code)

        if (!tokens.refresh_token) {
            return NextResponse.redirect(new URL('/dashboard/settings?error=no_refresh_token', request.url))
        }

        // Store tokens in database
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.redirect(new URL('/login', request.url))
        }

        const { error: dbError } = await supabase
            .from('google_calendar_tokens')
            .upsert({
                user_id: user.id,
                refresh_token: tokens.refresh_token,
                access_token: tokens.access_token || null,
                token_expiry: tokens.expiry_date ? new Date(tokens.expiry_date).toISOString() : null,
                updated_at: new Date().toISOString()
            })

        if (dbError) {
            console.error('Error storing tokens:', dbError)
            return NextResponse.redirect(new URL('/dashboard/settings?error=storage_failed', request.url))
        }

        // Redirect back to settings with success message
        return NextResponse.redirect(new URL('/dashboard/settings?gcal_connected=true', request.url))

    } catch (err) {
        console.error('OAuth callback error:', err)
        return NextResponse.redirect(new URL('/dashboard/settings?error=oauth_failed', request.url))
    }
}
