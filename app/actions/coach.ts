"use server";

import { model } from "@/lib/ai/gemini";

export type Message = {
    role: "user" | "model";
    parts: string;
};

export async function chatWithCoach(history: Message[], newMessage: string) {
    try {
        // Mock Mode Fallback
        if (!process.env.GOOGLE_API_KEY) {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate latency
            return {
                success: true,
                message: "[DEMO MODE] I see you haven't configured your Neural Link (API Key) yet. \n\nI can still track your workouts, but my analysis modules are offline. \n\nTo activate full coaching:\n1. Get a key from Google AI Studio\n2. Add it to .env.local"
            };
        }

        const chat = model.startChat({
            history: history.map((msg) => ({
                role: msg.role,
                parts: [{ text: msg.parts }],
            })),
            generationConfig: {
                maxOutputTokens: 500,
            },
            systemInstruction: {
                role: "system",
                parts: [{
                    text: `You are the Antigravity Fitness Coach. You are an expert strength and conditioning coach.
        Your tone is motivating, analytical, and concise.
        You have access to the user's workout history (in future iterations).
        For now, answer general fitness questions and analyze provided logs.
        Keep responses short and actionable.` }],
            },
        });

        const result = await chat.sendMessage(newMessage);
        const response = result.response;
        const text = response.text();

        return { success: true, message: text };
    } catch (error) {
        console.error("AI Error:", error);
        return { success: false, message: "Sorry, I'm having trouble connecting to the neural link. Try again later." };
    }
}
