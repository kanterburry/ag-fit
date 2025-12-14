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
