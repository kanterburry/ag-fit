import { google } from '@ai-sdk/google';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { createClient } from '@/utils/supabase/server';

export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages } = await req.json();

    const supabase = await createClient();
    const today = new Date().toISOString().split('T')[0];

    // Gather minimal context
    const { data: bio } = await supabase.from('biometrics').select('*').eq('date', today).single();
    const { data: daily } = await supabase.from('garmin_daily_metrics').select('*, sleep_score').order('date', { ascending: false }).limit(1).single();
    const { data: recentWorkouts } = await supabase.from('planned_workouts').select('*').order('start_time', { ascending: false }).limit(5);

    // Get user ID
    const { data: { user } } = await supabase.auth.getUser();

    const result = await streamText({
        model: google('gemini-2.0-flash-exp'),
        messages,
        maxSteps: 5,
        system: `You are the AG-Fit AI Coach. Your identity is a blend of James Clear (Atomic Habits) and a high-performance Strength Coach.
        
        Context:
        - Recent Daily Metrics (Last Sync): ${daily ? JSON.stringify(daily) : 'N/A'}. 
          (Note: If today's data is missing, this might be from yesterday. Check the date field).
        - Recent Workouts: ${recentWorkouts ? JSON.stringify(recentWorkouts.map(w => `${w.title} (${w.is_completed ? 'Done' : 'Planned'})`)) : 'N/A'}
        
        Capabilities:
        - You can SCHEDULE workouts for the user. If they ask to "plan a leg day for Friday", DO IT using the tool.
        - You can CHECK their history using getActivities.
        - You can CHECK health stats (HRV, Sleep, etc) using getHealthMetrics.
        
        Style:
        - Concise, punchy, motivational.
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
                execute: async (args: any) => {
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
            } as any),
            getActivities: tool({
                description: 'Get past completed activities/history',
                parameters: z.object({
                    limit: z.number().optional().default(5),
                }),
                execute: async (args: any) => {
                    const { limit } = args;
                    const { data } = await supabase.from('activities').select('*').order('start_time', { ascending: false }).limit(limit);
                    return JSON.stringify(data);
                },
            } as any),
            getHealthMetrics: tool({
                description: 'Get detailed health metrics (HRV, Stress, Body Battery) for a specific date or recent days.',
                parameters: z.object({
                    date: z.string().optional().describe('YYYY-MM-DD. Defaults to latest available if omitted.'),
                    limit: z.number().optional().default(1),
                }),
                execute: async (args: any) => {
                    const { date, limit } = args;
                    let query = supabase.from('garmin_daily_metrics').select('*').order('date', { ascending: false }).limit(limit);
                    if (date) query = query.eq('date', date);
                    const { data } = await query;
                    return JSON.stringify(data);
                }
            } as any),
            getSleepStats: tool({
                description: 'Get sleep statistics (score, duration, stages).',
                parameters: z.object({
                    date: z.string().optional().describe('YYYY-MM-DD.'),
                }),
                execute: async (args: any) => {
                    const { date } = args;
                    let query = supabase.from('garmin_daily_metrics').select('date, sleep_score, sleep_seconds, deep_sleep_seconds, rem_sleep_seconds, light_sleep_seconds').order('date', { ascending: false }).limit(1);
                    if (date) query = query.eq('date', date);
                    const { data } = await query;
                    return JSON.stringify(data);
                }
            } as any)
        },
    } as any);

    return (result as any).toDataStreamResponse();
}
