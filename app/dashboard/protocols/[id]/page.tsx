import { notFound } from 'next/navigation'
import { getProtocolDetails } from '@/app/actions/protocol-details'
import { ArrowLeft, Calendar, TrendingUp, Target } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'

export default async function ProtocolDetailPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const { protocol, error } = await getProtocolDetails(id)

    if (error || !protocol) {
        notFound()
    }

    // Calculate progress
    const phases = protocol.protocol_phases || []
    const totalDays = phases.reduce((sum: number, phase: any) => sum + phase.duration_days, 0)
    const logs = protocol.daily_logs || []
    const completedDays = logs.length
    const progressPercent = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0

    // Group logs by date
    const logsByDate = logs.reduce((acc: any, log: any) => {
        const date = new Date(log.date).toLocaleDateString()
        acc[date] = log
        return acc
    }, {})

    return (
        <div className="min-h-screen bg-black text-white p-6">
            {/* Header with Back Button */}
            <div className="max-w-5xl mx-auto mb-8">
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-6"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Dashboard</span>
                </Link>

                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">{protocol.title}</h1>
                        <p className="text-zinc-400">{protocol.description}</p>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-bold text-purple-400">{progressPercent}%</div>
                        <div className="text-sm text-zinc-500">Complete</div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Hypothesis Card */}
                <Card className="bg-zinc-900/50 border-zinc-800">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                            <Target className="w-5 h-5 text-purple-400" />
                            <h3 className="font-semibold">Hypothesis</h3>
                        </div>
                        <p className="text-sm text-zinc-400">{protocol.hypothesis}</p>
                    </CardContent>
                </Card>

                {/* Timeline Card */}
                <Card className="bg-zinc-900/50 border-zinc-800">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                            <Calendar className="w-5 h-5 text-blue-400" />
                            <h3 className="font-semibold">Timeline</h3>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-400">Total Duration</span>
                                <span className="font-semibold">{totalDays} days</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-400">Completed</span>
                                <span className="font-semibold">{completedDays} days</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-400">Remaining</span>
                                <span className="font-semibold">{Math.max(0, totalDays - completedDays)} days</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Status Card */}
                <Card className="bg-zinc-900/50 border-zinc-800">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                            <TrendingUp className="w-5 h-5 text-emerald-400" />
                            <h3 className="font-semibold">Status</h3>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-400">Protocol Status</span>
                                <span className="font-semibold capitalize">{protocol.status}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-400">Phases</span>
                                <span className="font-semibold">{phases.length}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Phases Section */}
            <div className="max-w-5xl mx-auto mt-8">
                <h2 className="text-2xl font-bold mb-4">Phases</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {phases
                        .sort((a: any, b: any) => a.order_index - b.order_index)
                        .map((phase: any) => (
                            <Card key={phase.id} className="bg-zinc-900/50 border-zinc-800">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-semibold">{phase.name}</h3>
                                        <span className="text-xs bg-zinc-800 px-2 py-1 rounded">
                                            {phase.duration_days}d
                                        </span>
                                    </div>
                                    <p className="text-xs text-zinc-500 capitalize">{phase.type}</p>
                                </CardContent>
                            </Card>
                        ))}
                </div>
            </div>

            {/* Daily Logs Section */}
            <div className="max-w-5xl mx-auto mt-8">
                <h2 className="text-2xl font-bold mb-4">Daily Logs</h2>
                {logs.length === 0 ? (
                    <Card className="bg-zinc-900/50 border-zinc-800">
                        <CardContent className="p-8 text-center">
                            <p className="text-zinc-500">No logs recorded yet. Start logging data from the dashboard!</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-3">
                        {logs
                            .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
                            .map((log: any) => (
                                <Card key={log.id} className="bg-zinc-900/50 border-zinc-800 hover:bg-zinc-900/80 transition-colors">
                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="font-semibold mb-2">
                                                    {new Date(log.date).toLocaleDateString('en-US', {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </div>
                                                {log.data && typeof log.data === 'object' && (
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                                        {Object.entries(log.data).map(([key, value]) => (
                                                            <div key={key}>
                                                                <span className="text-zinc-500">{key}: </span>
                                                                <span className="font-medium">{String(value)}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                {log.notes && (
                                                    <p className="mt-2 text-sm text-zinc-400 italic">"{log.notes}"</p>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                    </div>
                )}
            </div>
        </div>
    )
}
