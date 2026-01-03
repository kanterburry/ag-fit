import { z } from "zod";

export const setSchema = z.object({
    reps: z.coerce.number().min(0, "Reps must be positive"),
    weight: z.coerce.number().min(0, "Weight must be positive"),
    rpe: z.coerce.number().min(1).max(10).optional(),
});

export const exerciseSchema = z.object({
    name: z.string().min(1, "Exercise name is required"),
    sets: z.array(setSchema).min(1, "At least one set is required"),
});

export const workoutSchema = z.object({
    title: z.string().min(1, "Workout title is required"),
    date: z.string(), // ISO string from input
    time: z.string().optional(),
    notes: z.string().optional(),
    exercises: z.array(exerciseSchema).min(1, "At least one exercise is required"),
});

export type WorkoutFormData = z.infer<typeof workoutSchema>;
