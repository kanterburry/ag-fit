"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { workoutSchema, type WorkoutFormData } from "@/lib/validations/workout";
import { Plus, Trash2, Save, ChevronLeft } from "lucide-react";
import Link from "next/link";
interface WorkoutLoggerProps {
    onSuccess?: () => void;
    onCancel?: () => void;
}

export default function WorkoutLogger({ onSuccess, onCancel }: WorkoutLoggerProps) {
    // const router = useRouter(); // Removed for SidePanel usage
    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<WorkoutFormData>({
        resolver: zodResolver(workoutSchema) as any,
        defaultValues: {
            title: "",
            date: new Date().toISOString().split("T")[0],
            exercises: [{ name: "", sets: [{ reps: 0, weight: 0, rpe: 8 }] }],
        },
    });

    const { fields: exerciseFields, append: appendExercise, remove: removeExercise } = useFieldArray({
        control,
        name: "exercises",
    });

    const onSubmit = async (data: WorkoutFormData) => {
        // TODO: Call API to save workout
        console.log("Submitting workout:", data);
        // Simulate delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (onSuccess) {
            onSuccess();
        }
    };

    return (
        <div className="bg-background min-h-screen px-4 py-6">
            <div className="mb-6 flex items-center gap-4">
                {onCancel && (
                    <button onClick={onCancel} className="text-slate-400 hover:text-white">
                        <ChevronLeft size={24} />
                    </button>
                )}
                <h1 className="text-2xl font-bold text-white">Log Workout</h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Info */}
                <div className="space-y-4 rounded-xl bg-surface p-4">
                    <div>
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
                </div>

                {/* Exercises */}
                <div className="space-y-4">
                    {exerciseFields.map((field, index) => (
                        <div key={field.id} className="rounded-xl bg-surface p-4">
                            <div className="mb-3 flex items-center justify-between">
                                <input
                                    {...register(`exercises.${index}.name`)}
                                    placeholder="Exercise Name"
                                    className="w-2/3 rounded-lg bg-transparent text-lg font-semibold text-white placeholder-slate-500 focus:outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeExercise(index)}
                                    className="text-slate-500 hover:text-error"
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

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="fixed bottom-20 left-4 right-4 flex items-center justify-center gap-2 rounded-xl bg-primary py-4 text-lg font-bold text-background shadow-lg shadow-emerald-900/20 disabled:opacity-70"
                >
                    <Save size={20} />
                    {isSubmitting ? "Saving..." : "Save Workout"}
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
            <div className="grid grid-cols-10 gap-2 text-xs text-slate-500">
                <div className="col-span-1 text-center">#</div>
                <div className="col-span-3">kg</div>
                <div className="col-span-3">reps</div>
                <div className="col-span-2">RPE</div>
                <div className="col-span-1"></div>
            </div>

            {fields.map((item, k) => (
                <div key={item.id} className="grid grid-cols-10 gap-2">
                    <div className="col-span-1 flex items-center justify-center text-sm font-bold text-slate-600">
                        {k + 1}
                    </div>
                    <div className="col-span-3">
                        <input
                            type="number"
                            {...register(`exercises.${nestIndex}.sets.${k}.weight`)}
                            className="w-full rounded bg-slate-800 p-2 text-center text-white focus:ring-1 focus:ring-primary"
                        />
                    </div>
                    <div className="col-span-3">
                        <input
                            type="number"
                            {...register(`exercises.${nestIndex}.sets.${k}.reps`)}
                            className="w-full rounded bg-slate-800 p-2 text-center text-white focus:ring-1 focus:ring-primary"
                        />
                    </div>
                    <div className="col-span-2">
                        <input
                            type="number"
                            max="10"
                            {...register(`exercises.${nestIndex}.sets.${k}.rpe`)}
                            className="w-full rounded bg-slate-800 p-2 text-center text-secondary focus:ring-1 focus:ring-secondary"
                        />
                    </div>
                    <div className="col-span-1 flex items-center justify-center">
                        {fields.length > 1 && (
                            <button type="button" onClick={() => remove(k)} className="text-slate-600 hover:text-error">
                                <Trash2 size={16} />
                            </button>
                        )}
                    </div>
                </div>
            ))}

            <button
                type="button"
                onClick={() => append({ reps: 0, weight: 0, rpe: 8 })}
                className="mt-2 text-xs font-semibold text-primary hover:underline"
            >
                + Add Set
            </button>
        </div>
    );
}
