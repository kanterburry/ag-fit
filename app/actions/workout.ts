'use server'

import { createClient } from '@/utils/supabase/server'
import { WorkoutFormData } from '@/lib/validations/workout'
import { revalidatePath } from 'next/cache'

export async function logWorkout(data: WorkoutFormData & { time?: string }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    const { title, date, notes, exercises, time } = data

    // Construct timestamp
    let timestamp = new Date(date)
    if (time) {
        const [hours, minutes] = time.split(':').map(Number)
        timestamp.setHours(hours, minutes, 0, 0)
    } else {
        // If no time specific, and date is today, use now. Else noon.
        const now = new Date()
        if (timestamp.toDateString() === now.toDateString()) {
            timestamp = now
        } else {
            timestamp.setHours(12, 0, 0, 0)
        }
    }

    const { error } = await supabase.from('workouts').insert({
        user_id: user.id,
        title,
        start_time: timestamp.toISOString(),
        exercises, // jsonb
        notes
    })

    if (error) {
        console.error('Error logging workout:', error)
        return { error: 'Failed to save workout' }
    }

    revalidatePath('/dashboard')
    revalidatePath('/dashboard/log')
    return { success: true }
}

export async function getPastWorkouts(limit = 10) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    const { data } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', user.id)
        .order('start_time', { ascending: false })
        .limit(limit)

    return data || []
}
