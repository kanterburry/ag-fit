'use server'

import { createOpenAI } from '@ai-sdk/openai'
import { generateText } from 'ai'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

export async function generateProtocolInsight(protocolId: string) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const cookieStore = await cookies()
    const supabase = await createClient()

    // 1. Fetch Protocol & Logs
    const { data: protocol } = await supabase
        .from('protocols')
        .select(`*, daily_logs (date, completed, data)`)
        .eq('id', protocolId)
        .single()

    if (!protocol) return { insight: null }

    // 2. Fetch Recent Metrics
    const { data: metrics } = await supabase
        .from('garmin_daily_metrics')
        .select('date, sleep_score, sleep_seconds, hrv_avg_ms, resting_heart_rate, total_steps')
        .order('date', { ascending: false })
        .limit(5)

    // Data Summary
    const recentLogs = protocol.daily_logs?.slice(0, 5) || []
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const logsText = recentLogs.map((l: any) =>
        `[${l.date}]: Status=${l.completed ? 'Done' : 'Missed'}`
    ).join(' | ')

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const metricsText = metrics?.map((m: any) =>
        `[${m.date}]: Sleep=${m.sleep_score || 'N/A'}, HRV=${m.hrv_avg_ms || 'N/A'}`
    ).join(' | ')

    const systemPrompt = `
        You are an elite bio-optimization coach.
        Analyze this SPECIFIC user data for the protocol: "${protocol.title}".
        
        CONTEXT:
        - Protocol: ${protocol.title} (${protocol.description})
        - Recent Logs: ${logsText || 'No logs yet'}
        - Biometrics: ${metricsText || 'No sync data'}

        TASK:
        Generate a single, punchy, 1-sentence insight (max 20 words).
        - If they are consistent: Praise the streak + mention a benefit.
        - If inconsistent: Gentle nudge + specific mechanism (e.g., "Missed days delay adaptation").
        - If metrics correlate (e.g. good sleep after log): Point it out!
        - If no data: Give a general scientific fact about "${protocol.title}".

        TONE:
        Professional, Scientific, Direct. No emojis in the text.
        
        CRITICAL INSTRUCTIONS:
        1. CITE SOURCES: If mentioning a benefit, cite a study or mechanism (e.g., "Huberman, 2021", "Circadian Entrainment").
        2. BE SPECIFIC: Do NOT say "Good job". Say "Consistent caffeine timing enhances adenosine clearance."
        3. NO FLUFF: Max 20 words. Every word must add information.
        4. IF NO DATA: Explain the *mechanism* of the protocol (e.g., "NSDR restores dopamine baseline via D2 receptor recovery").
    `

    try {
        const { text } = await generateText({
            model: openai('gpt-4o-mini'),
            system: systemPrompt,
            prompt: "Insight:",
        })

        return { insight: text }

    } catch (error) {
        console.error("AI Insight Error:", error)
        // Fallback that is slightly more generic but safely actionable
        return { insight: `Consistency with ${protocol.title} makes the insights smarter over time.` }
    }
}
