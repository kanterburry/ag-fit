import { createClient } from "@/utils/supabase/server"; // Import createClient
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Calendar, Clock, Play } from "lucide-react";
import { format } from "date-fns";
import { completeWorkout } from "@/app/dashboard/actions"; // Assuming this exists or will exist

export default async function WorkoutDetailPage({
    params,
}: {
    params: Promise<{ id: string }>; // Updated to Promise as per Next.js 15+ convention for server components if applicable, but standard remains
}) {
    const { id } = await params;
    const supabase = await createClient(); // Await createClient

    const { data: workout } = await supabase
        .from("planned_workouts")
        .select("*")
        .eq("id", id)
        .single();

    if (!workout) {
        notFound();
    }

    const date = new Date(workout.start_time);

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link
                    href="/dashboard/workouts"
                    className="p-2 hover:bg-zinc-800 rounded-full transition-colors"
                >
                    <ChevronLeft size={24} className="text-zinc-400" />
                </Link>
                <h1 className="text-2xl font-bold text-white">Workout Details</h1>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8 space-y-8">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">{workout.title}</h2>
                    <div className="flex items-center gap-6 text-zinc-400">
                        <div className="flex items-center gap-2">
                            <Calendar size={20} />
                            <span>{format(date, "EEEE, MMMM d, yyyy")}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock size={20} />
                            <span>{format(date, "h:mm a")}</span>
                        </div>
                    </div>
                </div>

                {workout.description && (
                    <div className="bg-zinc-950/50 rounded-lg p-6 border border-zinc-800/50">
                        <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-2">
                            Notes
                        </h3>
                        <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">
                            {workout.description}
                        </p>
                    </div>
                )}

                <div className="border-t border-zinc-800 pt-8 flex justify-end">
                    {/* This could be a client component for better interaction */}
                    <form action={async () => {
                        'use server';
                        await completeWorkout(parseInt(id));
                    }}>
                        <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl transition-all font-medium">
                            <Play size={20} fill="currentColor" />
                            Start Session
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
