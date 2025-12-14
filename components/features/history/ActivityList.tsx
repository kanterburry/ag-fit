import { format } from "date-fns";
import { Activity, Zap, Clock, MapPin } from "lucide-react";

interface ActivityItem {
    id: number;
    activity_type: string;
    start_time: string;
    distance?: number;
    duration?: number;
    calories?: number;
    avg_hr?: number;
}

export function ActivityList({ activities }: { activities: ActivityItem[] }) {
    const formatDuration = (seconds?: number) => {
        if (!seconds) return "--";
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return h > 0 ? `${h}h ${m}m` : `${m}m`;
    };

    return (
        <div className="space-y-4">
            {activities.map((activity) => (
                <div
                    key={activity.id}
                    className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 flex items-center justify-between hover:bg-zinc-800/50 transition-colors"
                >
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-purple-900/20 flex items-center justify-center text-purple-400">
                            {/* Simple logic for icon based on type could go here */}
                            <Activity size={20} />
                        </div>
                        <div>
                            <h3 className="font-medium text-zinc-100 capitalize">
                                {activity.activity_type.replace(/_/g, " ")}
                            </h3>
                            <p className="text-xs text-zinc-500">
                                {format(new Date(activity.start_time), "MMM d, h:mm a")}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-zinc-400">
                        {activity.duration && (
                            <div className="flex items-center gap-1.5 tooltip" title="Duration">
                                <Clock size={14} />
                                <span>{formatDuration(activity.duration)}</span>
                            </div>
                        )}
                        {activity.calories && (
                            <div className="flex items-center gap-1.5 hidden md:flex" title="Calories">
                                <Zap size={14} />
                                <span>{activity.calories} cal</span>
                            </div>
                        )}
                        {activity.distance && (
                            <div className="flex items-center gap-1.5 hidden sm:flex" title="Distance">
                                <MapPin size={14} />
                                <span>{(activity.distance / 1000).toFixed(2)} km</span>
                            </div>
                        )}
                    </div>
                </div>
            ))}

            {activities.length === 0 && (
                <div className="text-center py-10 text-zinc-500">
                    No activities recorded yet.
                </div>
            )}
        </div>
    );
}
