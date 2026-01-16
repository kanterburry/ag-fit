'use server'

import { createClient } from '@/utils/supabase/server'
import { google } from 'googleapis'

export async function syncProtocolsToGoogleCalendar() {
    const supabase = await createClient()

    // 1. Get User
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, message: 'Not authenticated' }

    // 2. Get Tokens
    const { data: tokenData, error: tokenError } = await supabase
        .from('google_calendar_tokens')
        .select('*')
        .eq('user_id', user.id)
        .single()

    if (tokenError || !tokenData) {
        return { success: false, message: 'Google Calendar not connected. Please sign in again.' }
    }

    // 3. Setup Google Client
    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.NEXT_PUBLIC_APP_URL + '/auth/callback'
    )

    oauth2Client.setCredentials({
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token
    })

    // Handle token refresh if needed (googleapis handles this automatically if refresh_token is present?)
    // Actually, we might need to manually refresh and save if it expired. 
    // googleapis auto-refreshes if refresh_token is set. We should listen to 'tokens' event but that's for long running processes.
    // For serverless, we check expiry or just try.

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client })

    try {
        // 4. Get Protocols
        const { data: protocols } = await supabase
            .from('protocols')
            .select('*, protocol_phases(*)')
            .eq('user_id', user.id)
            .eq('status', 'active')

        if (!protocols || protocols.length === 0) {
            return { success: true, message: 'No active protocols to sync.' }
        }

        let syncedCount = 0

        for (const protocol of protocols) {
            // Search for existing event to avoid duplicates
            const existingEvents = await calendar.events.list({
                calendarId: 'primary',
                privateExtendedProperty: [`agFitProtocolId=${protocol.id}`]
            })

            const eventBody = {
                summary: `Protocol: ${protocol.title}`,
                description: `Focus: ${protocol.goal}\nHypothesis: ${protocol.hypothesis}\n\nSynced from AG-Fit`,
                start: {
                    date: new Date(protocol.created_at).toISOString().split('T')[0]
                },
                end: {
                    // Estimated end
                    date: calculateEndDate(protocol.created_at, protocol.protocol_phases).toISOString().split('T')[0]
                },
                extendedProperties: {
                    private: {
                        agFitProtocolId: protocol.id
                    }
                }
            }

            if (existingEvents.data.items && existingEvents.data.items.length > 0) {
                // Update existing
                const eventId = existingEvents.data.items[0].id
                if (eventId) {
                    await calendar.events.patch({
                        calendarId: 'primary',
                        eventId: eventId,
                        requestBody: eventBody
                    })
                    syncedCount++ // Count updates too
                }
            } else {
                // Insert new
                await calendar.events.insert({
                    calendarId: 'primary',
                    requestBody: eventBody
                })
                syncedCount++
            }
        }

        return { success: true, message: `Synced ${syncedCount} protocols to Google Calendar` }

    } catch (error: any) {
        console.error('Google Calendar Sync Error:', error)
        return { success: false, message: 'Failed to sync: ' + error.message }
    }
}

function calculateEndDate(startDateStr: string, phases: any[]) {
    const start = new Date(startDateStr)
    const totalDays = phases?.reduce((sum: number, p: any) => sum + (p.duration_days || 0), 0) || 0
    const end = new Date(start)
    end.setDate(end.getDate() + totalDays)
    return end
}
