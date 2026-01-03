export default function DashboardLoading() {
    return (
        <div className="min-h-screen bg-black text-white p-6 pb-24 space-y-8">
            <div className="lg:col-span-2 space-y-6">
                {/* Header Skeleton */}
                <div className="h-32 bg-zinc-900/50 border border-zinc-800 rounded-2xl animate-pulse" />

                {/* Bio Command Center Header Skeleton */}
                <div className="space-y-2">
                    <div className="h-8 w-64 bg-zinc-800/50 rounded animate-pulse" />
                    <div className="h-4 w-96 bg-zinc-800/30 rounded animate-pulse" />
                </div>

                {/* Protocol Cards Skeleton */}
                <div className="flex gap-4 overflow-hidden">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="flex-[0_0_100%] md:flex-[0_0_45%] lg:flex-[0_0_30%] xl:flex-[0_0_22%]"
                        >
                            <div className="h-[280px] bg-zinc-900/50 border border-zinc-800 rounded-3xl animate-pulse" />
                        </div>
                    ))}
                </div>

                {/* Bio Insights Skeleton */}
                <div className="h-48 bg-zinc-900/50 border border-zinc-800 rounded-2xl animate-pulse" />

                {/* Health Dashboard Skeleton */}
                <div className="space-y-2">
                    <div className="h-6 w-48 bg-zinc-800/50 rounded animate-pulse" />
                    <div className="h-4 w-80 bg-zinc-800/30 rounded animate-pulse" />
                </div>

                {/* Garmin Cards Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div
                            key={i}
                            className="h-48 bg-zinc-900/50 border border-zinc-800 rounded-2xl animate-pulse"
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
