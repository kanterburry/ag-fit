
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@/utils/supabase/server';

export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages } = await req.json();
    const lastUserMessage = messages[messages.length - 1].content;

    // Context Injection
    const supabase = await createClient();
    const today = new Date().toISOString().split('T')[0];

    // 1. Get Biometrics
    const { data: bio } = await supabase.from('biometrics').select('*').eq('date', today).single();

    // 2. Get Recent Workouts
    const { data: workouts } = await supabase.from('planned_workouts').select('*').order('start_time', { ascending: false }).limit(5);

    const systemInstruction = `
You are the AG-Fit AI Coach. Your identity is a blend of James Clear (Atomic Habits) and a high-performance Strength Coach.
Your goal is to provide actionable advice based on the user's data.

Current User Context:
- Biometrics (Today): ${bio ? JSON.stringify(bio) : 'No data for today'}
- Recent Workouts: ${workouts ? JSON.stringify(workouts.map(w => `${w.title} (${w.is_completed ? 'Completed' : 'Planned'})`)) : 'No recent workouts'}

Style Guide:
- Be concise (SMS style).
- Focus on "Atomic Habits" (make it obvious, attractive, easy, satisfying).
- If biometric data is low (Sleep < 50, Body Battery < 30), recommend active recovery.
- If biometric data is high, push for PRs.
`;

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) {
        return new Response('Missing GOOGLE_API_KEY or GOOGLE_GENERATIVE_AI_API_KEY', { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash', systemInstruction });

    // Convert messages to Gemini history format if needed, but for simple request we can just send the last message 
    // with history or just one prompt. For true chat, we construct history.
    // Gemini expects: { role: 'user' | 'model', parts: [{ text: string }] }

    const history = messages.slice(0, -1).map((m: { role: string; content: string }) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
    }));

    const chat = model.startChat({
        history: history,
    });

    const result = await chat.sendMessageStream(lastUserMessage);

    // Create a ReadableStream from the generator
    const stream = new ReadableStream({
        async start(controller) {
            for await (const chunk of result.stream) {
                const chunkText = chunk.text();
                controller.enqueue(chunkText);
            }
            controller.close();
        },
    });

    return new Response(stream, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
}
