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
        startOfHistory.setDate(today.getDate() - 90); // 90 days of health data

        const startOfGarmin = new Date();
        startOfGarmin.setDate(today.getDate() - 30); // 30 days of metrics

        // Get user
        const { data: { user } } = await supabase.auth.getUser();

        // 1. Fetch user's active and recent protocols
        const { data: protocols } = await supabase
            .from('protocols')
            .select(`
                *,
                protocol_phases (*),
                daily_logs (*)
            `)
            .eq('user_id', user?.id)
            .order('created_at', { ascending: false });

        // 2. Fetch recent health metrics
        const { data: garminStats } = await supabase
            .from('garmin_daily_metrics')
            .select('date, resting_hr, sleep_score, stress_avg, body_battery_max, body_battery_min, steps, calories_active')
            .gte('date', startOfGarmin.toISOString().split('T')[0])
            .order('date', { ascending: false });

        // 3. Fetch training metrics
        const { data: trainingStatus } = await supabase
            .from('garmin_training_status')
            .select('*')
            .order('date', { ascending: false })
            .limit(30);

        // 4. Fetch recent activities
        const { data: activities } = await supabase
            .from('activities')
            .select('activity_type, start_time, duration_seconds, distance_meters, calories')
            .gte('start_time', startOfHistory.toISOString())
            .order('start_time', { ascending: false })
            .limit(50);

        const result = await streamText({
            model: google('gemini-2.0-flash-exp'), // Use Gemini 2.0 Flash for best performance
            messages,
            // @ts-ignore
            maxSteps: 5,
            system: `You are ProtocolAI - an AI research assistant specialized in n=1 self-experimentation and behavioral science.

Your core mission: Help users understand their habit experiments (protocols) through the lens of academic research and their personal health data.

=== YOUR DATA ACCESS ===

PROTOCOLS (User's Experiments):
${JSON.stringify(protocols, null, 2)}

HEALTH METRICS (Last 30 Days):
${JSON.stringify(garminStats, null, 2)}

TRAINING STATUS:
${JSON.stringify(trainingStatus, null, 2)}

RECENT ACTIVITIES:
${JSON.stringify(activities, null, 2)}

=== YOUR CAPABILITIES ===

1. **Pattern Analysis**: Identify correlations between protocols and health outcomes (sleep, HRV, body battery, etc.)
2. **Research Synthesis**: Connect user's experiments to peer-reviewed research with proper citations
3. **Hypothesis Generation**: Suggest new protocols based on scientific literature and user's data
4. **Protocol Optimization**: Recommend adjustments to ongoing experiments based on results

=== RESPONSE GUIDELINES ===

**ALWAYS cite sources** when referencing research:
- Format: "According to [Author et al., Year], [finding]..."
- Prefer recent meta-analyses and RCTs
- Link lifestyle metrics (caffeine, sleep, exercise) to measurable outcomes

**Data-Driven Insights**:
- Reference specific data points from user's protocols
- Show before/after comparisons when relevant
- Quantify improvements (e.g., "7% increase in sleep score")

**Actionable Recommendations**:
- Suggest protocol modifications with scientific rationale
- Propose new experiments with expected outcomes
- Recommend optimal timing/dosing based on research

**Style**:
- Concise, evidence-based, scientific but accessible
- Use bullet points for clarity
- Highlight key insights with bold text

Example Response:
"Your Caffeine Reset protocol shows a **15% improvement in sleep score** (baseline: 68 → current: 78). This aligns with research showing caffeine's 5-6 hour half-life affects sleep architecture (Drake et al., 2013). 

**Recommendation**: Extend your caffeine cutoff to 1pm for optimal sleep quality, as adenosine receptor upregulation continues for 12-14 days (Fredholm et al., 1999)."

Remember: You're a research assistant, not a fitness coach. Focus on scientific evidence and data analysis.`,
            tools: {
                // No tools needed - ProtocolAI is purely analytical
            },
        });

        return (result as any).toDataStreamResponse();
    } catch (error: any) {
        console.error('Error in chat route:', error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
