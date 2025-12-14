
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bike, Footprints } from "lucide-react"

interface GearProps {
    gear: any[] | null
}

export function GearCard({ gear }: GearProps) {
    if (!gear || gear.length === 0) return null // Hide if empty

    return (
        <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Gear</CardTitle>
                <Footprints className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent className="space-y-3">
                {gear.slice(0, 3).map((item) => (
                    <div key={item.uuid} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/5 p-2 rounded-md">
                                {item.type_key === 'cycling' ? <Bike className="h-4 w-4" /> : <Footprints className="h-4 w-4" />}
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-medium truncate w-32">{item.name}</p>
                                <p className="text-xs text-muted-foreground">{item.brand} {item.model}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm font-bold">{Math.round((item.total_distance_meters || 0) / 1000)} km</div>
                            <p className="text-[10px] text-muted-foreground">Total</p>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
