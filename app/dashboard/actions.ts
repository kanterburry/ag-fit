'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getRecentActivities() {
    const supabase = await createClient()
    const { data } = await supabase
        .from('activities')
        .select('*')
        .order('start_time', { ascending: false })
        .limit(3)

    return data
}

export async function getAllActivities() {
    const supabase = await createClient()
    const { data } = await supabase
        .from('activities')
        .select('*')
        .order('start_time', { ascending: false })
        .limit(50) // Reasonable limit for now

    return data
}

export async function completeWorkout(id: number) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('planned_workouts')
        .update({ is_completed: true })
        .eq('id', id)

    if (error) {
        throw new Error('Failed to complete workout')
    }

    revalidatePath('/dashboard')
}

export async function getBiometrics() {
    const supabase = await createClient()
    const today = new Date().toISOString().split('T')[0]

    const { data } = await supabase
        .from('biometrics')
        .select('*')
        .eq('date', today)
        .single()

    return data
}

export async function getTodayWorkouts() {
    const supabase = await createClient()
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const { data } = await supabase
        .from('planned_workouts')
        .select('*')
        .gte('start_time', today.toISOString())
        .lt('start_time', tomorrow.toISOString())
        .order('start_time', { ascending: true })

    return data
}

export async function getUpcomingWorkouts() {
    const supabase = await createClient()
    const today = new Date().toISOString()

    // Fetch upcoming workouts
    const { data } = await supabase
        .from('planned_workouts')
        .select('*')
        .gte('start_time', today)
        .order('start_time', { ascending: true })
        .limit(10)

    return data
}

export async function createWorkout(formData: FormData) {
    const supabase = await createClient()

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const date = formData.get('date') as string
    const time = formData.get('time') as string

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
        throw new Error('User not authenticated')
    }

    const start_time = new Date(`${date}T${time}`).toISOString()

    const { error } = await supabase
        .from('planned_workouts')
        .insert({
            title,
            description,
            start_time,
            is_completed: false,
            user_id: user.id
        })

    if (error) {
        console.error('Error creating workout:', error)
        throw new Error('Failed to create workout')
    }

    // ... existing code ...
    revalidatePath('/dashboard/workouts')
    revalidatePath('/dashboard')
}

export async function getGarminDailyMetrics(date?: string) {
    const supabase = await createClient()
    const targetDate = date || new Date().toISOString().split('T')[0]

    const { data } = await supabase
        .from('garmin_daily_metrics')
        .select('*')
        .eq('date', targetDate)
        .single()

    return data
}

export async function getGarminHRV(date?: string) {
    const supabase = await createClient()
    const targetDate = date || new Date().toISOString().split('T')[0]

    const { data } = await supabase
        .from('garmin_hrv')
        .select('*')
        .eq('date', targetDate)
        .single()

    return data
}

export async function getGarminWeight(date?: string) {
    const supabase = await createClient()
    const targetDate = date || new Date().toISOString().split('T')[0]

    const { data } = await supabase
        .from('garmin_weight')
        .select('*')
        .eq('date', targetDate)
        .single()

    return data
}

export async function getGarminGear() {
    const supabase = await createClient()

    const { data } = await supabase
        .from('garmin_gear')
        .select('*')
        .eq('status', 'active')
        .order('total_distance_meters', { ascending: false })

    return data
}

export async function getGarminActivitiesExpanded(limit = 10) {
    const supabase = await createClient()

    const { data } = await supabase
        .from('garmin_activities')
        .select('*')
        .order('start_time', { ascending: false })
        .limit(limit)

    return data
}

export async function getGarminTrainingStatus() {
    const supabase = await createClient()
    const today = new Date().toISOString().split('T')[0]

    const { data } = await supabase
        .from('garmin_training_status')
        .select('*')
        .eq('date', today)
        .single()

    return data
}

export async function getGarminTrainingReadiness() {
    const supabase = await createClient()
    const today = new Date().toISOString().split('T')[0]

    const { data } = await supabase
        .from('garmin_training_readiness')
        .select('*')
        .eq('date', today)
        .single()

    return data
}

export async function getGarminWellness() {
    const supabase = await createClient()
    const today = new Date().toISOString().split('T')[0]

    // Get wellness data
    const { data: wellness } = await supabase
        .from('garmin_wellness')
        .select('*')
        .eq('date', today)
        .single()

    // Get SpO2 data
    const { data: spo2 } = await supabase
        .from('garmin_spo2')
        .select('*')
        .eq('date', today)
        .single()

    // Get respiration data
    const { data: respiration } = await supabase
        .from('garmin_respiration')
        .select('*')
        .eq('date', today)
        .single()

    return {
        ...wellness,
        avgSpo2Percentage: spo2?.avg_spo2_percentage,
        avgWakingBreathsPerMinute: respiration?.avg_waking_breaths_per_minute,
        avgSleepingBreathsPerMinute: respiration?.avg_sleeping_breaths_per_minute,
    }
}

export async function getGarminRacePredictions() {
    const supabase = await createClient()

    const { data } = await supabase
        .from('garmin_races')
        .select('*')
        .order('calculated_date', { ascending: false })
        .limit(5)

    return data
}

export async function getGarminChallengesAndGoals() {
    const supabase = await createClient()

    const { data: challenges } = await supabase
        .from('garmin_challenges')
        .select('*')
        .in('status', ['active', 'in_progress'])
        .order('end_date', { ascending: true })
        .limit(10)

    const { data: goals } = await supabase
        .from('garmin_goals')
        .select('*')
        .eq('status', 'active')
        .order('end_date', { ascending: true })
        .limit(10)

    return { challenges, goals }
}

export async function getActiveProtocols() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    const { data: protocols } = await supabase
        .from('protocols')
        .select(`
            *,
            protocol_phases (
                id,
                name,
                type,
                duration_days,
                order_index
            ),
            protocol_daily_logs (
                id,
                date,
                data,
                notes
            )
        `)
        .eq('user_id', user.id)
        .neq('status', 'completed') // Exclude completed protocols
        .order('created_at', { ascending: false })

    return protocols || []
}

export async function getCommandCenterStats() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    // 1. Protocols Completed
    const { count: completedProtocols } = await supabase
        .from('protocols')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'completed')

    // 1b. Protocols Active (Unique Count)
    const { data: activeRows } = await supabase
        .from('protocols')
        .select('title')
        .eq('user_id', user.id)
        .eq('status', 'active')

    const activeProtocols = activeRows ? new Set(activeRows.map(r => r.title)).size : 0

    // 2. Reliability Score (Consistency)
    // Formula: (Total Logs / Days Since First Log) * 100
    // Fetch all logs
    const { data: logs } = await supabase
        .from('daily_logs')
        .select('date')
        .eq('user_id', user.id)
        .order('date', { ascending: true })

    let reliabilityScore = 0
    let activeStreak = 0

    if (logs && logs.length > 0) {
        const firstLogDate = new Date(logs[0].date)
        const today = new Date()
        const totalDays = Math.max(1, Math.floor((today.getTime() - firstLogDate.getTime()) / (1000 * 60 * 60 * 24)) + 1)

        reliabilityScore = Math.round((logs.length / totalDays) * 100)
        reliabilityScore = Math.min(100, reliabilityScore) // Cap at 100

        // Streak Calc
        let currentStreak = 0
        const logDates = new Set(logs.map(l => l.date))
        for (let i = 0; i < 365; i++) {
            const d = new Date()
            d.setDate(d.getDate() - i)
            const dateStr = d.toISOString().split('T')[0]
            if (logDates.has(dateStr)) {
                currentStreak++
            } else if (i === 0 && !logDates.has(dateStr)) {
                // today not logged yet, don't break streak if yesterday was logged
                continue
            } else {
                break
            }
        }
        activeStreak = currentStreak
    }

    return {
        completedProtocols: completedProtocols || 0,
        activeProtocols: activeProtocols || 0,
        reliabilityScore,
        activeStreak
    }
}

export async function getBioInsights() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    // Tier 1: Clinical / Research Intelligence (Based on user's own data vs baselines)
    // For now, we'll generate some dynamic insights based on their protocol status
    const { count: activeProtocols } = await supabase
        .from('protocols')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'active')

    const clinicalInsights = []

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (activeProtocols && activeProtocols > 0) {
        clinicalInsights.push({
            id: 'c1',
            type: 'positive',
            title: 'Protocol Adherence',
            description: 'Your consistency with active protocols suggests a 15% increase in baseline adaptation speed compared to irregular users.',
            reference: 'Internal Baseline'
        })
    } else {
        clinicalInsights.push({
            id: 'c2',
            type: 'neutral',
            title: 'Baseline Establishment',
            description: 'No active protocols detected. Maintaining a consistent workout schedule for 14 days will establish your physiological baseline.',
            reference: 'Huberman Lab'
        })
    }

    // Mock Random Clinical Insight
    clinicalInsights.push({
        id: 'c3',
        type: 'info',
        title: 'Circadian Alignment',
        description: 'Viewing sunlight within 30-60 minutes of waking is shown to increase cortisol peak by 50%, improving focus.',
        reference: 'Stanford School of Medicine'
    })

    // Tier 2: Community / Hive Intelligence (Crowdsourced)
    // This would eventually query a 'shared_insights' table or vector DB
    const communityInsights = [
        {
            id: 'co1',
            title: 'Popular Protocol',
            description: '84% of users combining "Deep Sleep" protocol with 10k steps reported improved HRV scores within 7 days.',
            users: 128
        },
        {
            id: 'co2',
            title: 'Recovery Trend',
            description: 'Users measuring sleep temperature observe a 0.5°C drop on rest days.',
            users: 45
        }
    ]

    return {
        clinical: clinicalInsights,
        community: communityInsights
    }
}
