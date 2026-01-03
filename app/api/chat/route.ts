import { google } from '@ai-sdk/google';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { createClient } from '@/utils/supabase/server';

export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages } = await req.json();

    try {
        const supabase = await createClient();
        const today = new Date();
        const startOfHistory = new Date();
        startOfHistory.setDate(today.getDate() - 180); // 180 days ago

        const startOfGarmin = new Date();
        startOfGarmin.setDate(today.getDate() - 30); // 30 days ago

        // 1. Fetch massive history (Context Stuffing)
        const { data: fullWorkoutHistory } = await supabase
            .from('activities')
            .select('*')
            .gte('start_time', startOfHistory.toISOString())
            .order('start_time', { ascending: false });

        const { data: garminStats } = await supabase
            .from('garmin_daily_metrics')
            .select('date, resting_hr, sleep_score, stress_avg, body_battery_max, body_battery_min')
            .gte('date', startOfGarmin.toISOString().split('T')[0])
            .order('date', { ascending: false });

        const { data: plannedWorkouts } = await supabase
            .from('planned_workouts')
            .select('*')
            .gte('start_time', today.toISOString())
            .order('start_time', { ascending: true })
            .limit(10); // Next 10 planned workouts

        // Get user ID
        const { data: { user } } = await supabase.auth.getUser();

        const result = await streamText({
            model: google('gemini-1.5-flash-001'), // Use Flash for massive context window
            messages,
            // @ts-ignore
            maxSteps: 5,
            system: `You are the AG-Fit AI Coach. Your identity is a blend of James Clear (Atomic Habits) and a high-performance Strength Coach.

        You have access to the user's complete training history for the last 6 months and physiological data for the last 30 days.
        
        DATA CONTEXT:
        - Recent Garmin Stats (Last 30 Days): ${JSON.stringify(garminStats)}
        - Workout History (Last 180 Days): ${JSON.stringify(fullWorkoutHistory)}
        - Upcoming Planned Workouts: ${JSON.stringify(plannedWorkouts)}
        
        CAPABILITIES:
        - You can SCHEDULE workouts for the user. If they ask to "plan a leg day for Friday", DO IT using the tool.
        - You DO NOT need to call tools to get history - you already have it in the context above.
        
        STYLE:
        - Concise, punchy, motivational.
        - Analyze patterns in the provided data to answer questions (e.g. "How is my sleep affecting my training?").
        - If creating a workout, confirm the details (Time, Date) before calling the tool if vague.`,
            tools: {
                createWorkout: tool({
                    description: 'Schedule a new workout in the calendar',
                    parameters: z.object({
                        title: z.string().describe('The title of the workout e.g. "Leg Day"'),
                        description: z.string().describe('Detailed exercises or notes'),
                        date: z.string().describe('YYYY-MM-DD date string'),
                        time: z.string().describe('HH:mm time string (24hr)'),
                    }),
                    // @ts-ignore
                    execute: async (args: { title: string; description: string; date: string; time: string }) => {
                        const { title, description, date, time } = args;
                        if (!user) return "Error: User not authenticated.";
                        const start_time = new Date(`${date}T${time}`).toISOString();
                        const { error } = await supabase.from('planned_workouts').insert({
                            title,
                            description,
                            start_time,
                            is_completed: false,
                            user_id: user.id
                        });
                        if (error) return `Error creating workout: ${error.message}`;
                        return `Workout "${title}" scheduled for ${date} at ${time}.`;
                    },
                }),
                // Removed getActivities and getHealthMetrics as data is now stuffed in context
            },
        });

        return (result as any).toDataStreamResponse();
    } catch (error: any) {
        console.error('Error in chat route:', error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
