"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface MuscleSplitProps {
    data: { name: string; value: number }[];
}

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444']; // Primary, Blue, Amber, Red

export default function MuscleSplit({ data }: MuscleSplitProps) {
    if (!data || data.length === 0) {
        return (
            <div className="flex h-64 items-center justify-center rounded-xl bg-slate-900 border border-slate-800">
                <p className="text-slate-500">No workout data yet</p>
            </div>
        );
    }

    return (
        <div className="h-64 w-full rounded-xl bg-slate-900 border border-slate-800 p-4">
            <h3 className="mb-4 text-sm font-medium text-slate-400">Activity Split</h3>
            <ResponsiveContainer width="100%" height="80%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                        ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff', borderRadius: '8px' }} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
