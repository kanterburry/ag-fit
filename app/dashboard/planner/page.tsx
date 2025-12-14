"use client";

import { useState } from "react";
import { DndContext, DragEndEvent, DragOverlay, useSensor, useSensors, PointerSensor } from "@dnd-kit/core";
import { DraggableWorkout } from "@/components/features/planner/DraggableWorkout";
import { DroppableSlot } from "@/components/features/planner/DroppableSlot";
import { Save } from "lucide-react";

// Initial Template Data
const TEMPLATES = [
    { id: "tmpl-1", title: "Upper Body Power", type: "strength" },
    { id: "tmpl-2", title: "Lower Body Hypert", type: "strength" },
    { id: "tmpl-3", title: "BFT: Cardio Summit", type: "bft" },
    { id: "tmpl-4", title: "Zone 2 Run", type: "cardio" },
] as const;

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const TIMES = ["06:00", "18:00"]; // Simplified for MVP (Morning/Evening slots)

import { commitSchedule } from "@/app/actions/planner";
import { useRouter } from "next/navigation";

export default function PlannerPage() {
    const [schedule, setSchedule] = useState<Record<string, typeof TEMPLATES[number] | null>>({});
    const [activeId, setActiveId] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();

    async function handleCommit() {
        setIsSaving(true);
        const result = await commitSchedule(schedule);
        setIsSaving(false);

        if (result.success) {
            alert("Schedule Committed! 🚀");
            router.push("/dashboard");
        } else {
            alert("Error: " + result.message);
        }
    }

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    function handleDragStart(event: any) {
        setActiveId(event.active.id);
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        setActiveId(null);

        if (over) {
            // Find the template based on active.id
            const template = TEMPLATES.find((t) => t.id === active.id) ||
                Object.values(schedule).find(t => t?.id === active.id); // Or existing item

            if (template) {
                // Create a unique instance ID for the schedule
                // In a real app, we'd clone the template properly
                setSchedule((prev) => ({
                    ...prev,
                    [over.id as string]: template
                }));
            }
        }
    }

    return (
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="min-h-screen bg-background p-4 md:p-8">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Macro-Planner</h1>
                        <p className="text-slate-400">Design your perfect week.</p>
                    </div>
                    <button
                        onClick={handleCommit}
                        disabled={isSaving}
                        className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 font-bold text-slate-900 transition-hover hover:bg-emerald-400 disabled:opacity-50"
                    >
                        <Save size={18} />
                        {isSaving ? "Witnessing..." : "Commit Plan"}
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                    {/* Sidebar: Templates */}
                    <div className="col-span-1 space-y-4 rounded-xl border border-slate-800 bg-surface p-4">
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Templates</h2>
                        <div className="space-y-3">
                            {TEMPLATES.map((tmpl) => (
                                <DraggableWorkout
                                    key={tmpl.id}
                                    id={tmpl.id}
                                    title={tmpl.title}
                                    type={tmpl.type as any}
                                />
                            ))}
                        </div>
                        <p className="text-xs text-slate-600">Drag these into your week.</p>
                    </div>

                    {/* Main Calendar Grid */}
                    <div className="col-span-1 lg:col-span-3">
                        <div className="grid grid-cols-7 gap-2">
                            {DAYS.map(day => (
                                <div key={day} className="text-center font-bold text-slate-500">{day}</div>
                            ))}
                        </div>

                        <div className="mt-2 space-y-4">
                            {TIMES.map(time => (
                                <div key={time} className="space-y-2">
                                    <div className="text-xs font-medium text-slate-600 mb-1 flex items-center gap-2">
                                        <span className="w-12">{time}</span>
                                        <div className="h-[1px] flex-1 bg-slate-800"></div>
                                    </div>
                                    <div className="grid grid-cols-7 gap-2">
                                        {DAYS.map(day => {
                                            const slotId = `${day}-${time}`;
                                            const scheduledItem = schedule[slotId];
                                            return (
                                                <DroppableSlot key={slotId} id={slotId}>
                                                    {scheduledItem && (
                                                        <div className="bg-slate-800 rounded p-1 text-xs text-white truncate">
                                                            {scheduledItem.title}
                                                        </div>
                                                    )}
                                                </DroppableSlot>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Drag Overlay for smooth visuals */}
                <DragOverlay>
                    {activeId ? (
                        <div className="rounded-lg bg-slate-700 p-2 text-white shadow-xl opacity-80 border border-primary">
                            <div className="h-4 w-24 bg-slate-600 rounded animate-pulse"></div>
                        </div>
                    ) : null}
                </DragOverlay>

            </div>
        </DndContext>
    );
}
