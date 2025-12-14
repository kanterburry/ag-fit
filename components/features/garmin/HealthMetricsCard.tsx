
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Activity, Battery, Zap } from "lucide-react"

interface HealthProps {
    daily: {
        resting_hr?: number | null
        max_hr?: number | null
        stress_avg?: number | null
        body_battery_min?: number | null
        body_battery_max?: number | null
    } | null
    hrv: {
        nightly_avg_ms?: number | null
        status?: string | null
    } | null
}

export function HealthMetricsCard({ daily, hrv }: HealthProps) {
    return (
        <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Health Metrics</CardTitle>
                <Activity className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Heart Rate */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-red-400" />
                        <span className="text-sm font-medium">Resting HR</span>
                    </div>
                    <div className="text-lg font-bold">{daily?.resting_hr || '--'} <span className="text-xs font-normal text-muted-foreground">bpm</span></div>
                </div>

                {/* HRV */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-blue-400" />
                        <span className="text-sm font-medium">HRV (Avg)</span>
                    </div>
                    <div className="text-lg font-bold">
                        {hrv?.nightly_avg_ms || '--'}
                        <span className="text-xs font-normal text-muted-foreground ml-1">ms</span>
                        {hrv?.status && <span className="text-[10px] ml-2 px-1.5 py-0.5 rounded bg-white/10">{hrv.status}</span>}
                    </div>
                </div>

                {/* Stress */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-orange-400" />
                        <span className="text-sm font-medium">Stress</span>
                    </div>
                    <div className="text-lg font-bold">{daily?.stress_avg || '--'}</div>
                </div>

                {/* Body Battery */}
                <div className="pt-2 border-t border-white/5">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Battery className="h-3 w-3" /> Body Battery
                        </span>
                        <span className="text-xs font-mono">{daily?.body_battery_min || '--'} - {daily?.body_battery_max || '--'}</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 opacity-80"
                            style={{
                                marginLeft: `${daily?.body_battery_min || 0}%`,
                                width: `${(daily?.body_battery_max || 0) - (daily?.body_battery_min || 0)}%`
                            }}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
