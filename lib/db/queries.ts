import { sql } from "@/lib/db";

export async function getWeeklyVolume(userId: string) {
    // Aggregates volume (sets * reps * weight) per week for the last 6 weeks
    // Note: This relies on the JSONB structure of 'sets' being [{reps: n, weight: n}]
    try {
        const result = await sql`
            SELECT 
                DATE_TRUNC('week', w.date) as week_start,
                SUM(
                    (s->>'reps')::int * (s->>'weight')::numeric
                ) as total_volume
            FROM workouts w
            JOIN exercises e ON w.id = e.workout_id
            CROSS JOIN jsonb_array_elements(e.sets) as s
            WHERE w.user_id = ${userId}
            AND w.date > NOW() - INTERVAL '6 weeks'
            GROUP BY week_start
            ORDER BY week_start ASC;
        `;
        return result.rows.map(row => ({
            date: new Date(row.week_start).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
            volume: Math.round(Number(row.total_volume || 0))
        }));
    } catch (error) {
        console.error("Error fetching volume:", error);
        return [];
    }
}

export async function getActivityDistribution(userId: string) {
    // Counts workouts by type (Strength vs Cardio vs BFT)
    try {
        const result = await sql`
            SELECT type, COUNT(*) as count
            FROM workouts
            WHERE user_id = ${userId}
            GROUP BY type;
        `;
        // Normalize names for chart
        return result.rows.map(row => ({
            name: row.type.charAt(0).toUpperCase() + row.type.slice(1),
            value: Number(row.count)
        }));
    } catch (error) {
        console.error("Error fetching distribution:", error);
        return [];
    }
}

export async function getConsistencyHeatmap(userId: string) {
    // Gets distinct dates with completed workouts for the last 90 days
    try {
        const result = await sql`
            SELECT DISTINCT DATE(date) as workout_date, COUNT(*) as count
            FROM workouts
            WHERE user_id = ${userId}
            AND status = 'completed'
            AND date > NOW() - INTERVAL '90 days'
            GROUP BY workout_date;
        `;
        return result.rows.map(row => ({
            date: new Date(row.workout_date).toISOString().split('T')[0],
            count: Number(row.count)
        }));
    } catch (error) {
        console.error("Error fetching consistency:", error);
        return [];
    }
}
