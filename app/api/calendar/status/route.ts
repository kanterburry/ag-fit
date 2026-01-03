import { NextResponse } from 'next/server'
import { isGoogleCalendarConnected } from '@/lib/google-calendar'

export async function GET() {
    try {
        const connected = await isGoogleCalendarConnected()
        return NextResponse.json({ connected })
    } catch (err) {
        console.error('Status check error:', err)
        return NextResponse.json({ connected: false })
    }
}
