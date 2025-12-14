
import { sql } from "@/lib/db";
import webpush from "web-push";
import { NextResponse } from "next/server";

// Configure Web Push (Ideally this happens once, but Next.js API routes are stateless)
if (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
    webpush.setVapidDetails(
        'mailto:support@agfit.com',
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
        process.env.VAPID_PRIVATE_KEY
    );
}

export async function GET(req: Request) {
    // Basic Auth for Cron security (Vercel automatically adds this header)
    // const authHeader = req.headers.get('authorization');
    // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) { ... }

    try {
        // 1. Find planned workouts for the NEXT 30 minutes that haven't been notified
        // Logic: date between NOW and NOW + 30m
        // Note: 'date' in workouts is timestamp with time zone
        const result = await sql`
            SELECT w.id, w.title, w.date, w.type, w.user_id, p.endpoint, p.p256dh, p.auth
            FROM workouts w
            JOIN push_subscriptions p ON w.user_id = p.user_id
            WHERE w.status = 'planned'
            AND (w.notification_sent IS NULL OR w.notification_sent = FALSE)
            AND w.date > NOW()
            AND w.date <= NOW() + INTERVAL '30 minutes'
        `;

        const notifications = result.rows;
        console.log(`Found ${notifications.length} workouts to nudge.`);

        const results = await Promise.all(notifications.map(async (nudge) => {
            const payload = JSON.stringify({
                title: `Get Ready: ${nudge.title}`,
                body: `It's time to destroy your ${nudge.type} session. Starts in <30m.`,
                url: `/dashboard/log?workoutId=${nudge.id}`
            });

            try {
                await webpush.sendNotification({
                    endpoint: nudge.endpoint,
                    keys: {
                        p256dh: nudge.p256dh,
                        auth: nudge.auth
                    }
                }, payload);

                // Mark as sent
                await sql`UPDATE workouts SET notification_sent = TRUE WHERE id = ${nudge.id}`;
                return { success: true, id: nudge.id };
            } catch (err) {
                console.error(`Failed to send to ${nudge.user_id}:`, err);
                if ((err as any).statusCode === 410) {
                    // Subscription gone, delete it?
                    await sql`DELETE FROM push_subscriptions WHERE endpoint = ${nudge.endpoint}`;
                }
                return { success: false, id: nudge.id };
            }
        }));

        return NextResponse.json({ success: true, processed: results.length });
    } catch (error) {
        console.error("Cron Error:", error);
        return NextResponse.json({ success: false, error: (error as any).message }, { status: 500 });
    }
}
