"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { sql } from "@/lib/db";

interface PushSubscriptionJSON {
    endpoint?: string;
    keys: {
        p256dh: string;
        auth: string;
    };
}

export async function saveSubscription(subscription: PushSubscriptionJSON) {
    try {
        if (!subscription.endpoint) {
            return { success: false, message: "Missing endpoint" };
        }

        const session = await getServerSession(authOptions);
        const userId = (session?.user as any)?.id || (session?.user as any)?.sub;

        if (!userId) {
            return { success: false, message: "Unauthorized" };
        }

        // Save to DB
        // We use ON INTERSECT (UNIQUE constraint) to update or ignore? 
        // Actually the constraint is UNIQUE(user_id, endpoint). 
        // Let's use ON CONFLICT DO NOTHING for simplicity, or update the keys.
        const { endpoint, keys } = subscription;

        if (!keys || !keys.p256dh || !keys.auth) {
            return { success: false, message: "Invalid subscription keys" };
        }

        await sql`
      INSERT INTO push_subscriptions (user_id, endpoint, p256dh, auth)
      VALUES (${userId}, ${endpoint}, ${keys.p256dh}, ${keys.auth})
      ON CONFLICT (user_id, endpoint) 
      DO UPDATE SET p256dh = ${keys.p256dh}, auth = ${keys.auth}, created_at = NOW();
    `;

        return { success: true };
    } catch (error) {
        console.error("Save Subscription Error:", error);
        return { success: false, message: "Failed to save subscription" };
    }
}
