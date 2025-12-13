"use server";

import { syncGCalEvents } from "@/lib/sync/gcal";
import { syncGarminActivities } from "@/lib/sync/garmin";

export async function triggerGCalSync() {
    try {
        const events = await syncGCalEvents();
        // In a real app, we would revalidatePath('/dashboard') here
        return { success: true, count: events.length };
    } catch (error) {
        console.error("GCal Sync Action Error:", error);
        return { success: false, message: "Sync failed" };
    }
}

export async function triggerGarminSync() {
    const result = await syncGarminActivities();
    return result;
}
