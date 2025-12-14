"use client";

interface ConsistencyGridProps {
    data: { date: string; count: number }[];
}

export default function ConsistencyGrid({ data }: ConsistencyGridProps) {
    // Generate last 90 days grid
    // This is a simplified grid visualization
    // In a real app we'd map this to a calendar weeks grid

    // For MVP, simply show a summary or a simple contribution list
    // OR: create a simple flex-wrap grid of squares for "Last 30 Days"

    const today = new Date();
    const last30Days = Array.from({ length: 30 }, (_, i) => {
        const d = new Date();
        d.setDate(today.getDate() - (29 - i));
        return d.toISOString().split('T')[0];
    });

    const activeDates = new Set(data.map(d => d.date));

    return (
        <div className="w-full rounded-xl bg-slate-900 border border-slate-800 p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-slate-400">Consistency (Last 30 Days)</h3>
                <span className="text-xs text-slate-500">{data.length} Workouts</span>
            </div>

            <div className="grid grid-cols-7 gap-1 md:gap-2">
                {last30Days.map((dateStr) => {
                    const isActive = activeDates.has(dateStr);
                    return (
                        <div
                            key={dateStr}
                            title={dateStr}
                            className={`
                                aspect-square rounded-sm md:rounded-md transition-colors
                                ${isActive ? 'bg-primary shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-slate-800/50'}
                            `}
                        />
                    );
                })}
            </div>
        </div>
    );
}
