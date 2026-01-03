'use server'

import { createClient } from '@/utils/supabase/server'

export async function getProtocolTimelineEvents() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    // Fetch all protocols (both active and completed)
    const { data: protocols } = await supabase
        .from('protocols')
        .select(`
            *,
            protocol_phases (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    if (!protocols) return []

    // Transform protocols into calendar events
    const events = []

    for (const protocol of protocols) {
        const phases = protocol.protocol_phases || []
        const totalDays = phases.reduce((sum: number, phase: any) => sum + phase.duration_days, 0)

        const startDate = new Date(protocol.created_at)
        const endDate = new Date(startDate)
        endDate.setDate(endDate.getDate() + totalDays)

        // Only add ONE start event per protocol
        events.push({
            date: startDate,
            type: protocol.status === 'completed' ? 'protocol-end' : 'protocol-start',
            title: `${protocol.title}${protocol.status === 'completed' ? ' (Completed)' : ' (Start)'}`,
            protocolId: protocol.id,
            status: protocol.status
        })

        // Only add end date for active protocols (to show estimated completion)
        if (protocol.status === 'active' && totalDays > 0) {
            events.push({
                date: endDate,
                type: 'protocol-active',
                title: `${protocol.title} (Est. End)`,
                protocolId: protocol.id,
                status: protocol.status
            })
        }
    }

    return events
}
