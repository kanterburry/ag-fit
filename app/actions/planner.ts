"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { sql } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function commitSchedule(scheduleData: Record<string, any>) {
    try {
        const session = await getServerSession(authOptions);
        // Secure ID retrieval (using the same logic we fixed in Analysis page)
        const userId = (session?.user as any)?.id || (session?.user as any)?.sub;

        if (!userId) {
            return { success: false, message: "Unauthorized" };
        }

        // 1. Calculate dates for the *Current* week (starting Monday)
        // If today is Sunday, we might want next week? Let's stick to "Current Week" for simplicity 
        // or "Next Monday" if committed on Sunday. 
        // For MVP: Always "This Week's Monday" to "Sunday".
        const today = new Date();
        const dayOfWeek = today.getDay(); // 0 is Sunday
        const diffToMon = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust when Sunday
        const monday = new Date(today.setDate(diffToMon));
        monday.setHours(0, 0, 0, 0);

        const workoutsToInsert = [];

        // 2. Parse schedule object: keys are "Mon-06:00", "Tue-18:00" etc.
        // values are { id, title, type }
        for (const [slotId, template] of Object.entries(scheduleData)) {
            if (!template) continue;

            const [dayName, timeStr] = slotId.split('-');
            const [hours, minutes] = timeStr.split(':').map(Number);

            // Map dayName (Mon, Tue...) to actual Date
            const dayIndex = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(dayName);
            if (dayIndex === -1) continue;

            const workoutDate = new Date(monday);
            workoutDate.setDate(monday.getDate() + dayIndex);
            workoutDate.setHours(hours, minutes, 0, 0);

            // Only plan future workouts (or include today?) 
            // Let's allow planning for the whole week even if passed, for record keeping.

            workoutsToInsert.push({
                user_id: userId,
                date: workoutDate.toISOString(),
                type: template.type,
                source: 'manual', // or 'planner'
                status: 'planned',
                title: template.title
            });
        }

        if (workoutsToInsert.length === 0) {
            return { success: true, message: "No workouts to schedule." };
        }

        // 3. Batch Insert (using a loop for simple SQL safety with parameterized queries)
        // In production, we'd use a single large INSERT statement.
        for (const w of workoutsToInsert) {
            await sql`
            INSERT INTO workouts (user_id, date, type, source, status, notes)
            VALUES (${w.user_id}, ${w.date}, ${w.type}, ${w.source}, ${w.status}, ${w.title})
        `;
        }

        revalidatePath("/dashboard");
        return { success: true, message: `Successfully scheduled ${workoutsToInsert.length} workouts!` };

    } catch (error) {
        console.error("Commit Schedule Error:", error);
        return { success: false, message: "Failed to save schedule." };
    }
}
