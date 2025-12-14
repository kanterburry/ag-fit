
import webpush from 'web-push';
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

// Initialize web-push with VAPID keys
// Ideally these are in env vars
if (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
    webpush.setVapidDetails(
        'mailto:support@ag-fit.com',
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
        process.env.VAPID_PRIVATE_KEY
    );
}

export async function GET() {
    const supabase = await createClient(); // Use await for server client

    // 1. Find workouts starting in < 30 mins that haven't been notified
    const now = new Date();
    const thirtyMinsFromNow = new Date(now.getTime() + 30 * 60000);

    const { data: workouts, error } = await supabase
        .from('planned_workouts')
        .select('*')
        .gt('start_time', now.toISOString())
        .lt('start_time', thirtyMinsFromNow.toISOString())
        .eq('notification_sent', false);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!workouts?.length) {
        return NextResponse.json({ status: 'No workouts found requiring notification' });
    }

    // 2. Get all subscriptions (In a real app, filtering by user_id of the workout owner is required)
    // For this single-user / small scale app, we verify user_id matches or just send to all subs for that user?
    // We should iterate workouts and find the subscription for that user.

    let successCount = 0;

    for (const workout of workouts) {
        const { data: sub } = await supabase
            .from('push_subscriptions')
            .select('*')
            .eq('user_id', workout.user_id)
            .order('id', { ascending: false }) // Get latest
            .limit(1)
            .single();

        if (!sub) continue;

        const payload = JSON.stringify({
            title: '🚀 Pre-Flight Check',
            body: `Get ready. ${workout.title} starts in 30 mins.`,
            url: '/dashboard'
        });

        try {
            await webpush.sendNotification({
                endpoint: sub.endpoint,
                keys: { p256dh: sub.p256dh, auth: sub.auth }
            }, payload);

            // 3. Mark as sent
            await supabase
                .from('planned_workouts')
                .update({ notification_sent: true })
                .eq('id', workout.id);

            successCount++;
        } catch (e) {
            console.error(`Failed to send push for workout ${workout.id}`, e);
            // Potentially remove dead subscription if 410/404
        }
    }

    return NextResponse.json({ success: true, count: successCount });
}
