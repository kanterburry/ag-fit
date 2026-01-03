'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getActiveProtocols() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    // Fetch active protocols with phases
    const { data: protocols, error: protocolError } = await supabase
        .from('protocols')
        .select(`
      *,
      protocol_phases (
        *
      )
    `)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })

    if (protocolError) {
        console.error('[getActiveProtocols] Error fetching protocols:', protocolError)
        return []
    }

    if (!protocols || protocols.length === 0) {
        return []
    }

    // Fetch global logs and metrics once to efficiency
    // We can fetch last 30 days or so. For now, fetch all daily logs for these protocols.
    const protocolIds = protocols.map(p => p.id)
    const { data: allLogs } = await supabase
        .from('daily_logs')
        .select('*')
        .in('protocol_id', protocolIds)
        .order('date', { ascending: true })

    // Fetch automated metrics (last 60 days to cover most protocols)
    const today = new Date()
    const sixtyDaysAgo = new Date(today)
    sixtyDaysAgo.setDate(today.getDate() - 60)

    const { data: allMetrics } = await supabase
        .from('daily_metrics')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', sixtyDaysAgo.toISOString().split('T')[0])
        .order('date', { ascending: true })

    const results = protocols.map(protocol => {
        // Sort phases
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const phases = protocol.protocol_phases.sort((a: any, b: any) => a.order_index - b.order_index)

        // Calculate current day and phase
        const startDate = new Date(protocol.created_at!)
        const daysSinceStart = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1

        let currentPhase = null
        let accDays = 0
        for (const phase of phases) {
            if (daysSinceStart <= accDays + phase.duration_days) {
                currentPhase = phase
                break
            }
            accDays += phase.duration_days
        }

        // Check if logged today
        const TODAY_STR = today.toISOString().split('T')[0]
        const protocolLogs = allLogs?.filter(l => l.protocol_id === protocol.id) || []
        const todayLog = protocolLogs.find(l => l.date === TODAY_STR)

        // Calculate progress percentage
        const totalDuration = phases.reduce((sum: number, p: any) => sum + p.duration_days, 0)
        const progressPercent = Math.min(100, Math.max(0, Math.round((daysSinceStart / totalDuration) * 100)))

        // Expected End Date
        const endDate = new Date(startDate)
        endDate.setDate(startDate.getDate() + totalDuration)

        return {
            protocol,
            currentPhase,
            daysSinceStart,
            activeDayInPhase: daysSinceStart - accDays,
            todayLog,
            logs: protocolLogs,
            metrics: allMetrics || [], // Pass all metrics, component can filter
            progressPercent,
            endDate
        }
    })

    return results
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function logDailyData(protocolId: string, phaseId: string, data: any) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const today = new Date().toISOString().split('T')[0]

    const { error } = await supabase
        .from('daily_logs')
        .upsert({
            user_id: user.id,
            protocol_id: protocolId,
            phase_id: phaseId,
            date: today,
            data: data,
            completed: true
        }, { onConflict: 'user_id, protocol_id, date' })

    if (error) return { error: error.message }

    revalidatePath('/dashboard')
    return { success: true }
}
