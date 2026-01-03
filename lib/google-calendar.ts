import { google } from 'googleapis'
import { createClient } from '@/utils/supabase/server'

export async function getGoogleCalendarClient() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('User not authenticated')
    }

    // Fetch tokens from database
    const { data: tokenData, error } = await supabase
        .from('google_calendar_tokens')
        .select('*')
        .eq('user_id', user.id)
        .single()

    if (error || !tokenData) {
        throw new Error('Google Calendar not connected')
    }

    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`
    )

    oauth2Client.setCredentials({
        refresh_token: tokenData.refresh_token,
        access_token: tokenData.access_token || undefined,
    })

    // Refresh token if needed
    oauth2Client.on('tokens', async (tokens) => {
        if (tokens.access_token) {
            await supabase
                .from('google_calendar_tokens')
                .update({
                    access_token: tokens.access_token,
                    token_expiry: tokens.expiry_date ? new Date(tokens.expiry_date).toISOString() : null,
                    updated_at: new Date().toISOString()
                })
                .eq('user_id', user.id)
        }
    })

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client })

    return calendar
}

export async function isGoogleCalendarConnected() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return false

    const { data } = await supabase
        .from('google_calendar_tokens')
        .select('id')
        .eq('user_id', user.id)
        .single()

    return !!data
}
