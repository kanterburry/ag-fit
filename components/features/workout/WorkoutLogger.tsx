"use client";

import { useState, useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { workoutSchema, type WorkoutFormData } from "@/lib/validations/workout";
import { Plus, Trash2, Save, ChevronLeft, Clock, History, Loader2 } from "lucide-react";
import { logWorkout, getPastWorkouts } from "@/app/actions/workout";
import { useRouter } from "next/navigation";

interface WorkoutLoggerProps {
    onSuccess?: () => void;
    onCancel?: () => void;
}

const COMMON_EXERCISES = [
    "Squat", "Bench Press", "Deadlift", "Overhead Press",
    "Pull Up", "Chin Up", "Dumbbell Row", "Lat Pulldown",
    "Leg Press", "Lunge", "Romanian Deadlift", "Push Up",
    "Dips", "Face Pulls", "Lateral Raises", "Bicep Curls",
    "Tricep Extensions", "Leg Curls", "Leg Extensions"
];

export default function WorkoutLogger({ onSuccess, onCancel }: WorkoutLoggerProps) {
    const router = useRouter();
    const [pastWorkouts, setPastWorkouts] = useState<any[]>([]);
    const [showHistory, setShowHistory] = useState(false);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);

    const {
        register,
        control,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<WorkoutFormData>({
        resolver: zodResolver(workoutSchema) as any,
        defaultValues: {
            title: "",
            date: new Date().toISOString().split("T")[0],
            time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
            exercises: [{ name: "", sets: [{ reps: 0, weight: 0, rpe: 8 }] }],
        },
    });

    const { fields: exerciseFields, append: appendExercise, remove: removeExercise } = useFieldArray({
        control,
        name: "exercises",
    });

    useEffect(() => {
        if (showHistory && pastWorkouts.length === 0) {
            setIsLoadingHistory(true);
            getPastWorkouts().then(data => {
                setPastWorkouts(data);
                setIsLoadingHistory(false);
            });
        }
    }, [showHistory, pastWorkouts.length]);

    const loadWorkout = (workout: any) => {
        setValue("title", workout.title);
        // Keep current date/time
        setValue("exercises", workout.exercises);
        setShowHistory(false);
    };

    const onSubmit = async (data: WorkoutFormData) => {
        try {
            const result = await logWorkout(data);
            if (result.error) {
                alert(result.error);
                return;
            }

            if (onSuccess) {
                onSuccess();
            } else {
                router.push("/dashboard");
            }
        } catch (e) {
            console.error(e);
            alert("Failed to save workout");
        }
    };

    return (
        <div className="bg-background min-h-screen px-4 py-6 relative">
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {onCancel && (
                        <button onClick={onCancel} className="text-slate-400 hover:text-white">
                            <ChevronLeft size={24} />
                        </button>
                    )}
                    <h1 className="text-2xl font-bold text-white">Log Workout</h1>
                </div>
                <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300"
                >
                    <History size={18} />
                    Load Past
                </button>
            </div>

            {/* History Drawer */}
            {showHistory && (
                <div className="mb-6 p-4 rounded-xl bg-zinc-900 border border-zinc-800 animate-in slide-in-from-top-2">
                    <h3 className="text-sm font-semibold text-zinc-400 mb-3">Previous Workouts</h3>
                    {isLoadingHistory ? (
                        <div className="flex justify-center p-4"><Loader2 className="animate-spin text-zinc-500" /></div>
                    ) : pastWorkouts.length === 0 ? (
                        <div className="text-center text-zinc-500 text-sm py-2">No history found.</div>
                    ) : (
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                            {pastWorkouts.map(w => (
                                <button
                                    key={w.id}
                                    onClick={() => loadWorkout(w)}
                                    className="w-full text-left p-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors flex justify-between items-center"
                                >
                                    <span className="font-medium text-zinc-200">{w.title}</span>
                                    <span className="text-xs text-zinc-500">{new Date(w.start_time).toLocaleDateString()}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4 rounded-xl bg-surface p-4">
                    <div className="col-span-2">
                        <label className="mb-1 block text-sm font-medium text-slate-400">Title</label>
                        <input
                            {...register("title")}
                            placeholder="e.g. Pull Day"
                            className="w-full rounded-lg bg-slate-800 p-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        {errors.title && <p className="mt-1 text-xs text-error">{errors.title.message}</p>}
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-400">Date</label>
                        <input
                            type="date"
                            {...register("date")}
                            className="w-full rounded-lg bg-slate-800 p-3 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-400">Time</label>
                        <div className="relative">
                            <input
                                type="time"
                                {...register("time")}
                                className="w-full rounded-lg bg-slate-800 p-3 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            <Clock className="absolute right-3 top-3.5 h-4 w-4 text-slate-500 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Exercises */}
                <div className="space-y-4">
                    {exerciseFields.map((field, index) => (
                        <div key={field.id} className="rounded-xl bg-surface p-4">
                            <div className="mb-3 flex items-center justify-between gap-2">
                                <input
                                    list={`exercises-list-${index}`}
                                    {...register(`exercises.${index}.name`)}
                                    placeholder="Exercise Name"
                                    className="w-full rounded-lg bg-transparent text-lg font-semibold text-white placeholder-slate-500 focus:outline-none border-b border-slate-700 focus:border-primary pb-1"
                                />
                                <datalist id={`exercises-list-${index}`}>
                                    {COMMON_EXERCISES.map(ex => <option key={ex} value={ex} />)}
                                </datalist>

                                <button
                                    type="button"
                                    onClick={() => removeExercise(index)}
                                    className="text-slate-500 hover:text-error p-2"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>

                            {/* Sets */}
                            <SetsFieldArray nestIndex={index} control={control} register={register} />
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={() => appendExercise({ name: "", sets: [{ reps: 0, weight: 0, rpe: 8 }] })}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-700 p-4 text-slate-400 hover:bg-slate-800 hover:text-white"
                    >
                        <Plus size={20} />
                        Add Exercise
                    </button>
                </div>

                <div className="h-20" /> {/* Spacer */}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="fixed bottom-6 left-4 right-4 flex items-center justify-center gap-2 rounded-xl bg-primary py-4 text-lg font-bold text-background shadow-lg shadow-emerald-900/20 disabled:opacity-70 z-10"
                >
                    <Save size={20} />
                    {isSubmitting ? <Loader2 className="animate-spin" /> : "Save Workout"}
                </button>
            </form>
        </div>
    );
}

// Sub-component for Sets to isolate useFieldArray
function SetsFieldArray({ nestIndex, control, register }: { nestIndex: number; control: any; register: any }) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: `exercises.${nestIndex}.sets`,
    });

    return (
        <div className="space-y-2">
            <div className="grid grid-cols-10 gap-2 text-xs text-slate-500 mb-2">
                <div className="col-span-1 text-center font-mono">#</div>
                <div className="col-span-3 text-center">kg</div>
                <div className="col-span-3 text-center">reps</div>
                <div className="col-span-2 text-center">RPE</div>
                <div className="col-span-1"></div>
            </div>

            {fields.map((item, k) => (
                <div key={item.id} className="grid grid-cols-10 gap-2 items-center">
                    <div className="col-span-1 flex items-center justify-center text-sm font-bold text-slate-600 bg-slate-800/50 rounded h-10">
                        {k + 1}
                    </div>
                    <div className="col-span-3">
                        <input
                            type="number"
                            step="0.5"
                            {...register(`exercises.${nestIndex}.sets.${k}.weight`)}
                            className="w-full h-10 rounded bg-slate-800 p-2 text-center text-white focus:ring-1 focus:ring-primary"
                        />
                    </div>
                    <div className="col-span-3">
                        <input
                            type="number"
                            {...register(`exercises.${nestIndex}.sets.${k}.reps`)}
                            className="w-full h-10 rounded bg-slate-800 p-2 text-center text-white focus:ring-1 focus:ring-primary"
                        />
                    </div>
                    <div className="col-span-2">
                        <input
                            type="number"
                            max="10"
                            {...register(`exercises.${nestIndex}.sets.${k}.rpe`)}
                            className="w-full h-10 rounded bg-slate-800 p-2 text-center text-secondary focus:ring-1 focus:ring-secondary"
                        />
                    </div>
                    <div className="col-span-1 flex items-center justify-center">
                        <button type="button" onClick={() => remove(k)} className="text-slate-600 hover:text-error">
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
            ))}

            <button
                type="button"
                onClick={() => append({ reps: 0, weight: 0, rpe: 8 })}
                className="mt-3 w-full py-2 text-xs font-semibold text-primary/80 hover:text-primary bg-primary/5 rounded border border-primary/20 hover:bg-primary/10 transition-colors"
            >
                + Add Set
            </button>
        </div>
    );
}
