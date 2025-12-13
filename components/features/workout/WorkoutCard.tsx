import { format } from "date-fns";
import { Dumbbell, Calendar, Activity, CheckCircle, XCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export type Workout = {
    id: string;
    type: "strength" | "bft" | "cardio";
    source: "manual" | "gcal" | "garmin";
    status: "planned" | "completed" | "missed";
    date: string | Date;
    title?: string;
    notes?: string;
    exercises?: { name: string; sets: any[] }[];
};

interface WorkoutCardProps {
    workout: Workout;
}

export function WorkoutCard({ workout }: WorkoutCardProps) {
    const statusColor = {
        completed: "text-primary border-primary/20 bg-primary/5",
        missed: "text-error border-error/20 bg-error/5",
        planned: "text-slate-400 border-slate-700 bg-slate-800/50",
    }[workout.status];

    const Icon = {
        strength: Dumbbell,
        bft: Calendar,
        cardio: Activity,
    }[workout.type] || Dumbbell;

    return (
        <div className={cn("relative mb-4 overflow-hidden rounded-xl border p-4 transition-all", statusColor)}>
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className={cn("rounded-lg p-2", workout.status === "completed" ? "bg-primary/20 text-primary" : "bg-slate-800 text-slate-400")}>
                        <Icon size={20} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-white">
                            {workout.title || (workout.type === "bft" ? "BFT Class" : "Workout")}
                        </h3>
                        <p className="text-xs text-slate-400">
                            {format(new Date(workout.date), "EEE, MMM d • h:mm a")}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-medium uppercase tracking-wider opacity-80">
                    {workout.status === "completed" && <CheckCircle size={14} />}
                    {workout.status === "missed" && <XCircle size={14} />}
                    {workout.status === "planned" && <Clock size={14} />}
                    <span>{workout.status}</span>
                </div>
            </div>

            {workout.exercises && workout.exercises.length > 0 && (
                <div className="mt-3 border-t border-slate-700/50 pt-3 text-sm text-slate-300">
                    <ul className="space-y-1">
                        {workout.exercises.slice(0, 3).map((ex, i) => (
                            <li key={i} className="flex justify-between">
                                <span>{ex.name}</span>
                                <span className="text-slate-500">{ex.sets.length} sets</span>
                            </li>
                        ))}
                        {workout.exercises.length > 3 && (
                            <li className="text-xs text-slate-500">+{workout.exercises.length - 3} more</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}
