import { NextResponse } from 'next/server'
import { getGoogleCalendarClient } from '@/lib/google-calendar'
import { getProtocolTimelineEvents } from '@/app/actions/protocol-timeline'

export async function POST() {
    try {
        const calendar = await getGoogleCalendarClient()
        const events = await getProtocolTimelineEvents()

        if (!events || events.length === 0) {
            return NextResponse.json({ message: 'No protocol events to sync' })
        }

        const syncResults = []

        for (const event of events) {
            const gcalEvent = {
                summary: event.title,
                description: `Protocol: ${event.title}`,
                start: {
                    date: event.date.toISOString().split('T')[0],
                },
                end: {
                    date: event.date.toISOString().split('T')[0],
                },
                colorId: event.type === 'protocol-start' ? '9' : event.type === 'protocol-end' ? '10' : '7',
            }

            try {
                const result = await calendar.events.insert({
                    calendarId: 'primary',
                    requestBody: gcalEvent,
                })

                syncResults.push({
                    title: event.title,
                    status: 'synced',
                    gcalEventId: result.data.id
                })
            } catch (err) {
                console.error(`Failed to sync event ${event.title}:`, err)
                syncResults.push({
                    title: event.title,
                    status: 'failed',
                    error: err instanceof Error ? err.message : 'Unknown error'
                })
            }
        }

        return NextResponse.json({
            success: true,
            synced: syncResults.filter(r => r.status === 'synced').length,
            failed: syncResults.filter(r => r.status === 'failed').length,
            results: syncResults
        })

    } catch (err) {
        console.error('Sync error:', err)
        return NextResponse.json(
            { error: err instanceof Error ? err.message : 'Sync failed' },
            { status: 500 }
        )
    }
}
