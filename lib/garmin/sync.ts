import { createClient } from '@/utils/supabase/server'
import { GarminClient } from './client'

export async function syncGarminData() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Unauthorized: No logged in user for sync')
    }

    const client = new GarminClient()

    // 1. Sync Daily Metrics (Today & Yesterday to capture sleep)
    const datesToSync = [new Date(), new Date(Date.now() - 86400000)]
    const results = []

    for (const date of datesToSync) {
        try {
            const data = await client.getDailyStats(date)
            // Parse and Upsert
            const metrics = {
                user_id: user.id,
                date: date.toISOString().split('T')[0],
                steps: data.summary?.totalSteps,
                rhr: data.summary?.restingHeartRate,
                stress_level: data.summary?.averageStressLevel,
                sleep_score: data.sleep?.dailySleepDTO?.sleepScores?.overall?.value,
                hrv: data.hrv?.hrvSummary?.weeklyAvg // Garmin API varies, checking structure later if needed
            }

            // Remove undefined
            const cleanedMetrics = Object.fromEntries(
                Object.entries(metrics).filter(([_, v]) => v !== undefined)
            )

            const { error } = await supabase
                .from('daily_metrics')
                .upsert(cleanedMetrics, { onConflict: 'user_id, date' })

            if (error) throw error
            results.push({ date: metrics.date, status: 'success' })

        } catch (e: any) {
            console.error(`Error syncing ${date.toISOString()}:`, e)
            results.push({ date: date.toISOString(), status: 'failed', error: e.message })
        }
    }

    // 2. Sync Activities
    try {
        const activities = await client.getActivities(5)
        for (const activity of activities) {
            // Map activity to DB structure
            // activities table: id (int?), activity_type, distance, duration, calories, start_time, avg_hr
            // Garmin activity has activityId, activityType, distance, duration, calories, startTimeLocal, averageHR

            const payload = {
                user_id: user.id,
                // ID is number in DB? check schema. 
                // Schema said "id: number". Garmin activityId is number.
                id: activity.activityId,
                activity_type: activity.activityType.typeKey,
                start_time: activity.startTimeLocal,
                duration: activity.duration, // seconds
                distance: activity.distance, // meters
                calories: activity.calories,
                avg_hr: activity.averageHR,
                created_at: new Date().toISOString()
            }

            const { error } = await supabase
                .from('activities')
                .upsert(payload, { onConflict: 'id' }) // Assuming ID is PK or unique

            if (error) console.error('Failed to insert activity:', activity.activityId, error)
        }
    } catch (e) {
        console.error('Failed to sync activities', e)
    }

    return { success: true, results }
}
