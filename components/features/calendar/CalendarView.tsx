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
import { ChevronLeft, ChevronRight, Beaker, CheckCircle2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface CalendarViewProps {
    events: { date: Date; type: string; title: string; protocolId?: string; status?: string }[];
}

export function CalendarView({ events }: CalendarViewProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const getEventIcon = (type: string) => {
        if (type === 'protocol-start') return Beaker;
        if (type === 'protocol-end') return CheckCircle2;
        if (type === 'protocol-active') return Clock;
        return Beaker;
    };

    const getEventColor = (type: string, status?: string) => {
        if (type === 'protocol-start') return 'text-purple-400';
        if (type === 'protocol-end') return 'text-emerald-400';
        if (type === 'protocol-active' && status === 'active') return 'text-blue-400';
        return 'text-zinc-400';
    };

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
                            className={cn(
                                "min-h-[100px] p-2 border-b border-r border-zinc-800/50 transition-colors",
                                !isSameMonth(day, monthStart) && "bg-zinc-950/50 text-zinc-600",
                                isToday && "bg-purple-900/10"
                            )}
                        >
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
                                {dayEvents.map((event, i) => {
                                    const Icon = getEventIcon(event.type);
                                    const color = getEventColor(event.type, event.status);

                                    return (
                                        <Link
                                            key={i}
                                            href={event.protocolId ? `/dashboard/protocols/${event.protocolId}` : '/dashboard'}
                                            onClick={(e) => e.stopPropagation()}
                                            className="flex items-center gap-1.5 px-1.5 py-1 rounded-md bg-zinc-800/50 text-xs text-zinc-300 border border-zinc-700/50 truncate hover:bg-zinc-700 transition-colors"
                                        >
                                            <Icon size={10} className={cn(color, "shrink-0")} />
                                            <span className="truncate">{event.title}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
