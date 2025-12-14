"use client";

import { useState } from "react";
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    addMonths,
    subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight, Dumbbell, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface CalendarViewProps {
    events: { date: Date; type: string; title: string }[];
}

export function CalendarView({ events }: CalendarViewProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const router = useRouter();

    return (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-zinc-800/50">
                <h2 className="text-lg font-bold text-white">
                    {format(currentMonth, "MMMM yyyy")}
                </h2>
                <div className="flex items-center gap-2">
                    <button
                        onClick={prevMonth}
                        className="p-1 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-white"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={nextMonth}
                        className="p-1 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-white"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 border-b border-zinc-800/50 bg-zinc-950/30">
                {weekDays.map((day) => (
                    <div
                        key={day}
                        className="py-2 text-center text-xs font-semibold text-zinc-500 uppercase tracking-wider"
                    >
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 auto-rows-fr">
                {days.map((day) => {
                    const dayEvents = events.filter((e) => isSameDay(e.date, day));
                    const isToday = isSameDay(day, new Date());
                    return (
                        <div
                            key={day.toISOString()}
                            onClick={() => router.push(`/dashboard/workouts/create?date=${format(day, 'yyyy-MM-dd')}`)}
                            className={cn(
                                "min-h-[100px] p-2 border-b border-r border-zinc-800/50 transition-colors hover:bg-zinc-800/40 cursor-pointer group relative",
                                !isSameMonth(day, monthStart) && "bg-zinc-950/50 text-zinc-600",
                                isToday && "bg-purple-900/10"
                            )}
                        >
                            {/* Hover Add Icon */}
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Plus size={14} className="text-zinc-400" />
                            </div>

                            <div className="flex items-start justify-between">
                                <span
                                    className={cn(
                                        "text-sm font-medium",
                                        isToday
                                            ? "text-purple-400 bg-purple-900/20 w-6 h-6 rounded-full flex items-center justify-center -mt-1 -ml-1"
                                            : "text-zinc-400"
                                    )}
                                >
                                    {format(day, "d")}
                                </span>
                            </div>

                            <div className="mt-2 space-y-1">
                                {dayEvents.map((event, i) => (
                                    <div
                                        key={i}
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent triggering add workout
                                            // Optional: Navigate to workout detail
                                        }}
                                        className="flex items-center gap-1.5 px-1.5 py-1 rounded-md bg-zinc-800/50 text-xs text-zinc-300 border border-zinc-700/50 truncate hover:bg-zinc-700"
                                    >
                                        <Dumbbell size={10} className="text-purple-400 shrink-0" />
                                        <span className="truncate">{event.title}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
