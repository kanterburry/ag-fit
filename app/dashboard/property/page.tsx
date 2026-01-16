import { PropertyDashboard } from '@/components/features/property/PropertyDashboard'

export default function Page() {
    return (
        <div className="container mx-auto p-4 space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Real Estate Command Center</h1>
                <p className="text-muted-foreground">
                    Market Intelligence for Private & HDB Properties
                </p>
            </div>

            <PropertyDashboard />
        </div>
    )
}
