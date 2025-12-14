import Link from "next/link";
import { Plus } from "lucide-react";
import { getUpcomingWorkouts } from "@/app/dashboard/actions";
import { WorkoutCard } from "@/components/features/workout/WorkoutCard";

export default async function WorkoutsPage() {
    const workoutsData = await getUpcomingWorkouts();

    // Map DB data to WorkoutCard props
    const workouts = workoutsData?.map((w: any) => ({
        id: w.id,
        type: "strength", // Defaulting for now
        source: "manual", // Defaulting for now
        status: w.is_completed ? "completed" : "planned",
        date: w.start_time,
        title: w.title,
        notes: w.description,
    })) || [];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Workouts</h1>
                    <p className="text-zinc-400">Manage your training schedule</p>
                </div>
                <Link
                    href="/dashboard/workouts/create"
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    <Plus size={20} />
                    <span>New Workout</span>
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {workouts.length > 0 ? (
                    workouts.map((workout: any) => (
                        <WorkoutCard key={workout.id} workout={workout} />
                    ))
                ) : (
                    <div className="col-span-full py-12 text-center border border-zinc-800 rounded-xl bg-zinc-900/50">
                        <p className="text-zinc-500">No upcoming workouts scheduled.</p>
                        <Link href="/dashboard/workouts/create" className="text-purple-400 hover:text-purple-300 mt-2 inline-block">
                            Create one now &rarr;
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
