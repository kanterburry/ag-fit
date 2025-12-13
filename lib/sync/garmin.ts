import { GarminConnect } from "garmin-connect";

export async function syncGarminActivities() {
    const username = process.env.GARMIN_USERNAME;
    const password = process.env.GARMIN_PASSWORD;

    if (!username || !password) {
        return { success: false, message: "Garmin credentials not configured" };
    }

    const GC = new GarminConnect();

    try {
        await GC.login(username, password);

        // Get activities for last 5 days
        const activities = await GC.getActivities(0, 5);

        // Transform to our schema format
        const mappedActivities = activities.map((activity: any) => ({
            type: activity.activityType.typeKey === "running" ? "cardio" : "strength",
            source: "garmin",
            status: "completed",
            date: activity.startTimeLocal,
            title: activity.activityName,
            // distance: activity.distance,
            // duration: activity.duration
        }));

        return { success: true, count: mappedActivities.length, activities: mappedActivities };

    } catch (error) {
        console.error("Garmin Sync Error:", error);
        return { success: false, message: "Failed to sync with Garmin" };
    }
}
