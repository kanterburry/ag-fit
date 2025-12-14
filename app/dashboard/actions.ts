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
