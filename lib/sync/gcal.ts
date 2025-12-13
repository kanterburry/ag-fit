import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { sql } from "@/lib/db";

export async function syncGCalEvents() {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
        throw new Error("No access token found");
    }

    // Calculate time range (last 7 days to next 7 days)
    const now = new Date();
    const timeMin = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const timeMax = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();

    const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&timeMax=${timeMax}&q=BFT&singleEvents=true`,
        {
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
            },
        }
    );

    if (!response.ok) {
        console.error("GCal Error", await response.text());
        throw new Error("Failed to fetch events");
    }

    const data = await response.json();
    const events = data.items || [];

    const syncedEvents = [];

    for (const event of events) {
        // Simple deduplication logic could go here
        // For now, let's just format them
        if (event.summary?.toLowerCase().includes("bft") || event.description?.toLowerCase().includes("bft")) {
            syncedEvents.push({
                user_id: session.user?.email || "unknown", // Using email as ID proxy for MVP if sub not mapped
                date: event.start.dateTime || event.start.date,
                type: "bft",
                source: "gcal",
                status: new Date(event.start.dateTime) < now ? "completed" : "planned",
                summary: event.summary
            });

            // In a real app, we would UPSERT into DB here
            // await sql`INSERT INTO workouts ... ON CONFLICT DO NOTHING`
        }
    }

    return syncedEvents;
}
