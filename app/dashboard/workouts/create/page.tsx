"use client";

import { createWorkout } from "@/app/dashboard/actions";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";

function CreateWorkoutForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dateParam = searchParams.get("date");

    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true);
        try {
            await createWorkout(formData);
            router.push("/dashboard/workouts");
        } catch (error) {
            console.error(error);
            alert("Failed to create workout");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form action={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">
                    Title
                </label>
                <input
                    name="title"
                    type="text"
                    required
                    placeholder="e.g. Upper Body Power"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500 transition-colors"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">
                        Date
                    </label>
                    <input
                        name="date"
                        type="date"
                        required
                        defaultValue={dateParam ?? ''}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500 transition-colors"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">
                        Time
                    </label>
                    <input
                        name="time"
                        type="time"
                        required
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500 transition-colors"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">
                    Description / Notes
                </label>
                <textarea
                    name="description"
                    rows={4}
                    placeholder="Focus on tempo and form..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500 transition-colors resize-none"
                />
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
                {isSubmitting ? (
                    <>
                        <Loader2 size={20} className="animate-spin" />
                        Planning...
                    </>
                ) : (
                    "Plan Workout"
                )}
            </button>
        </form>
    );
}

export default function CreateWorkoutPage() {
    return (
        <div className="max-w-xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link
                    href="/dashboard/workouts"
                    className="p-2 hover:bg-zinc-800 rounded-full transition-colors"
                >
                    <ChevronLeft size={24} className="text-zinc-400" />
                </Link>
                <h1 className="text-2xl font-bold text-white">Plan Workout</h1>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <Suspense fallback={<div className="text-white">Loading form...</div>}>
                    <CreateWorkoutForm />
                </Suspense>
            </div>
        </div>
    );
}
