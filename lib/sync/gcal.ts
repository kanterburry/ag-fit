import { createClient } from "@/utils/supabase/server";

export async function syncGCalEvents() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    // Fetch Google tokens from DB
    const { data: tokens, error: tokenError } = await supabase
        .from('google_calendar_tokens')
        .select('*')
        .eq('user_id', user.id)
        .single();

    if (tokenError || !tokens) {
        throw new Error("No connected Google account found");
    }

    const accessToken = tokens.access_token;
    if (!accessToken) {
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
                Authorization: `Bearer ${accessToken}`,
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
                user_id: user.id, // Using the actual user ID from Supabase
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
