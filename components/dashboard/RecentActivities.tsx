
import { PersonStanding, Bike, Dumbbell, Timer, Flame } from "lucide-react";

export default function RecentActivities({ activities }: { activities: any[] }) {
    if (!activities?.length) {
        return (
            <div className="h-full rounded-2xl bg-zinc-900/50 border border-zinc-800 p-6 flex flex-col items-center justify-center text-zinc-500 gap-2">
                <Dumbbell className="w-8 h-8 opacity-20" />
                <p className="text-sm">No recent activities</p>
            </div>
        )
    }

    return (
        <div className="h-full rounded-2xl bg-zinc-900/50 border border-zinc-800 p-4">
            <h3 className="text-zinc-400 text-sm font-medium mb-4 flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-500" />
                Recent History
            </h3>
            <div className="space-y-3">
                {activities.map((act) => {
                    const date = new Date(act.start_time).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                    const isRun = act.activity_type === 'running';
                    const isLift = act.activity_type === 'strength_training';

                    return (
                        <div key={act.id} className="flex items-center justify-between p-3 rounded-xl bg-black/40 hover:bg-black/60 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${isRun ? 'bg-orange-500/20 text-orange-500' : isLift ? 'bg-blue-500/20 text-blue-500' : 'bg-zinc-800 text-zinc-400'}`}>
                                    {isRun ? <PersonStanding size={16} /> : isLift ? <Dumbbell size={16} /> : <Bike size={16} />}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-zinc-200 capitalize">{act.activity_type.replace('_', ' ')}</p>
                                    <p className="text-xs text-zinc-500">{date}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-mono text-zinc-300">
                                    {isRun ? `${(act.distance / 1000).toFixed(1)} km` : `${Math.round(act.duration / 60)} min`}
                                </p>
                                <div className="flex items-center justify-end gap-1 text-xs text-zinc-500">
                                    <Timer size={10} />
                                    <span>{Math.round(act.duration / 60)}m</span>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
