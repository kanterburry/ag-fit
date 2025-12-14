"use client";

import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";

interface DroppableSlotProps {
    id: string; // e.g., "mon-0800"
    children?: React.ReactNode;
    isOver?: boolean;
    timeLabel?: string;
}

export function DroppableSlot({ id, children, timeLabel }: DroppableSlotProps) {
    const { isOver, setNodeRef } = useDroppable({
        id: id,
    });

    return (
        <div
            ref={setNodeRef}
            className={cn(
                "relative flex h-24 flex-col rounded-lg border border-slate-800 bg-slate-900/50 p-2 transition-colors",
                isOver ? "border-primary/50 bg-primary/10" : "hover:border-slate-700"
            )}
        >
            {timeLabel && (
                <span className="absolute right-2 top-2 text-[10px] uppercase text-slate-600">
                    {timeLabel}
                </span>
            )}
            {children}
        </div>
    );
}
