"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Dumbbell, Calendar, Activity, GripVertical } from "lucide-react";

interface DraggableWorkoutProps {
    id: string;
    title: string;
    type: "strength" | "bft" | "cardio";
}

export function DraggableWorkout({ id, title, type }: DraggableWorkoutProps) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: id,
        data: { title, type },
    });

    const style = {
        transform: CSS.Translate.toString(transform),
    };

    const Icon = {
        strength: Dumbbell,
        bft: Calendar,
        cardio: Activity,
    }[type];

    // Colors based on type
    const colorClass = {
        strength: "bg-blue-500/10 border-blue-500/20 text-blue-400",
        bft: "bg-purple-500/10 border-purple-500/20 text-purple-400",
        cardio: "bg-orange-500/10 border-orange-500/20 text-orange-400",
    }[type];

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={`group relative flex cursor-grab items-center gap-3 rounded-lg border p-3 hover:border-slate-600 hover:bg-slate-800 ${colorClass}`}
        >
            {/* Grip Handle */}
            <div className="text-slate-600 opacity-0 transition-opacity group-hover:opacity-100">
                <GripVertical size={16} />
            </div>

            <div className={`rounded-md p-2 ${colorClass.replace('border', '')}`}>
                <Icon size={18} />
            </div>

            <div className="flex-1">
                <p className="font-medium text-white">{title}</p>
                <p className="text-xs capitalize opacity-70">{type}</p>
            </div>
        </div>
    );
}
