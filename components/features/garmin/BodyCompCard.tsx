
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Scale, Droplets, Dumbbell } from "lucide-react"

interface BodyCompProps {
    data: {
        weight_kg?: number | null
        bmi?: number | null
        body_fat_percent?: number | null
        muscle_mass_kg?: number | null
        bone_mass_kg?: number | null
        body_water_percent?: number | null
    } | null
}

export function BodyCompCard({ data }: BodyCompProps) {
    if (!data) return (
        <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Body Composition</CardTitle>
                <Scale className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">--</div>
                <p className="text-xs text-muted-foreground">No recent measurement</p>
            </CardContent>
        </Card>
    )

    return (
        <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Body Composition</CardTitle>
                <Scale className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Weight</p>
                    <div className="text-2xl font-bold">{data.weight_kg?.toFixed(1)} <span className="text-sm font-normal text-muted-foreground">kg</span></div>
                </div>
                <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">BMI</p>
                    <div className="text-2xl font-bold">{data.bmi?.toFixed(1)}</div>
                </div>

                <div className="col-span-2 grid grid-cols-3 gap-2 pt-2 border-t border-white/5">
                    <div className="text-center">
                        <div className="flex justify-center mb-1"><Droplets className="h-3 w-3 text-cyan-400" /></div>
                        <div className="text-sm font-semibold">{data.body_water_percent?.toFixed(1)}%</div>
                        <div className="text-[10px] text-muted-foreground">Water</div>
                    </div>
                    <div className="text-center">
                        <div className="flex justify-center mb-1"><Dumbbell className="h-3 w-3 text-red-400" /></div>
                        <div className="text-sm font-semibold">{data.muscle_mass_kg?.toFixed(1)}kg</div>
                        <div className="text-[10px] text-muted-foreground">Muscle</div>
                    </div>
                    <div className="text-center">
                        <div className="flex justify-center mb-1"><div className="h-3 w-3 rounded-full border border-yellow-400" /></div>
                        <div className="text-sm font-semibold">{data.body_fat_percent?.toFixed(1)}%</div>
                        <div className="text-[10px] text-muted-foreground">Fat</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
