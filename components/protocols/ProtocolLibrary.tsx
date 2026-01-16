'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PROTOCOL_TEMPLATES } from '@/lib/protocols/templates'
import { createProtocolFromTemplate } from '@/app/actions/protocol'
import { BehaviorSelector } from './onboarding/BehaviorSelector'
import { Coffee, Moon, Smartphone, Activity, ArrowRight, Loader2, Zap } from 'lucide-react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ICON_MAP: any = {
    coffee: Coffee,
    moon: Moon,
    smartphone: Smartphone,
    activity: Activity,
    zap: Zap
}

interface Props {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    userProtocols: any[]
}

export function ProtocolLibrary({ userProtocols }: Props) {
    const [launchingId, setLaunchingId] = useState<string | null>(null)
    const [selectedTemplateForConfig, setSelectedTemplateForConfig] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    // Filter active and deduplicate by title (keep latest)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rawActive = userProtocols.filter((p: any) => p.status === 'active')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const activeProtocols = rawActive.reduce((acc: any[], current: any) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const x = acc.find((item: any) => item.title === current.title);
        if (!x) return acc.concat([current]);
        return acc;
    }, []);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pastProtocols = userProtocols.filter((p: any) => p.status !== 'active')

    const initiateLaunch = (templateId: string) => {
        // Check if THIS protocol is already active
        const template = PROTOCOL_TEMPLATES.find(t => t.id === templateId)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (activeProtocols.some((p: any) => p.title === template?.title)) {
            window.location.href = '/dashboard'
            return
        }
        // User Feedback: Skip the lifestyle logging flow as it's redundant
        // Instead of setting state which triggers UI, we call launch directly
        handleLaunchProcess(templateId, [])
    }

    const handleLaunchProcess = async (templateId: string, habits: string[]) => {
        const template = PROTOCOL_TEMPLATES.find(t => t.id === templateId)
        if (!template) return

        try {
            setLaunchingId(templateId)
            const result = await createProtocolFromTemplate(templateId, habits)

            if (result?.error) {
                if (result.error === 'Unauthorized' || result.error.includes('Unauthorized')) {
                    window.location.href = `/login?next=/dashboard/protocols`
                    return
                }
                setError(result.error)
            } else if (result?.success) {
                window.location.href = '/dashboard'
            }
        } catch (e) {
            console.error('Launch error:', e)
            setError('An unexpected error occurred')
        } finally {
            setLaunchingId(null)
            setSelectedTemplateForConfig(null)
        }
    }

    const handleFinalLaunch = (habits: string[]) => {
        if (selectedTemplateForConfig) {
            handleLaunchProcess(selectedTemplateForConfig, habits)
        }
    }

    if (selectedTemplateForConfig) {
        // Import dynamically or strictly? BehaviorSelector is imported above? No, need to import it.
        // Let's assume imports will be added at top.
        return (
            <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                {/* Behavior Selector Wrapper */}
                <div className="w-full max-w-lg">
                    <BehaviorSelector
                        onBack={() => setSelectedTemplateForConfig(null)}
                        onComplete={handleFinalLaunch}
                    />
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {error && (
                <div className="p-4 bg-red-900/50 border border-red-800 text-red-200 rounded-lg">
                    Error: {error}
                </div>
            )}

            {activeProtocols.length > 0 && (
                <div className="space-y-4 mb-8">
                    <h3 className="text-xl font-bold text-emerald-400 mb-1 px-1">
                        {activeProtocols.length} Active Experiment{activeProtocols.length > 1 ? 's' : ''} In Progress
                    </h3>

                    <div className="grid gap-4 md:grid-cols-2">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {activeProtocols.map((p: any) => {
                            const startDate = new Date(p.created_at)
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const totalDuration = p.protocol_phases?.reduce((acc: number, phase: any) => acc + (phase.duration_days || 0), 0) || 0
                            const daysRunning = Math.max(0, Math.floor((new Date().getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)))
                            const progress = totalDuration > 0 ? Math.min(100, Math.round((daysRunning / totalDuration) * 100)) : 0
                            const daysLeft = Math.max(0, totalDuration - daysRunning)

                            return (
                                <div key={p.id} className="p-5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex flex-col gap-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-emerald-100 text-lg">{p.title}</h4>
                                            <p className="text-xs text-emerald-400/70 uppercase tracking-wider font-medium">Day {daysRunning + 1} of {totalDuration}</p>
                                        </div>
                                        <div className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                                            ACTIVE
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex justify-between text-xs text-zinc-400">
                                            <span>Progress</span>
                                            <span>{progress}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-emerald-950/50 rounded-full overflow-hidden border border-emerald-900/30">
                                            <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${progress}%` }} />
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center pt-2 mt-auto">
                                        <span className="text-xs text-zinc-500">Ends in {daysLeft} days</span>
                                        <Button
                                            onClick={() => window.location.href = `/dashboard/protocols/${p.id}`}
                                            size="sm"
                                            className="h-8 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-600/30"
                                        >
                                            View Details <ArrowRight className="ml-1.5 h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {PROTOCOL_TEMPLATES.map((template) => {
                    const Icon = ICON_MAP[template.icon] || Activity
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const isRunning = activeProtocols.some((p: any) => p.title === template.title)

                    // User Feedback: Hide specific active protocols from the library view
                    if (isRunning) return null

                    return (
                        <Card key={template.id} className={`border-slate-800 bg-slate-900/50 transition-colors flex flex-col ${isRunning ? 'border-emerald-500/50 bg-emerald-900/10' : 'hover:border-primary/50'}`}>
                            <CardHeader>
                                <div className="flex justify-between items-start mb-2">
                                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <div className={`px-2 py-1 rounded text-xs font-bold border ${template.tier === 1 ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' :
                                        template.tier === 2 ? 'border-blue-500/30 bg-blue-500/10 text-blue-400' :
                                            'border-purple-500/30 bg-purple-500/10 text-purple-400'
                                        }`}>
                                        TIER {template.tier}
                                    </div>
                                </div>
                                <CardTitle className="text-lg">{template.title}</CardTitle>
                                <CardDescription className="line-clamp-2 min-h-[40px]">
                                    {template.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <div className="space-y-4">
                                    {/* Timeline Section */}
                                    <div className="space-y-1">
                                        <div className="flex justify-between items-center">
                                            <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Timeline</div>
                                            <div className="flex gap-2 text-[10px] text-zinc-500">
                                                <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-slate-600"></div>Base</span>
                                                <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-primary"></div>Active</span>
                                                <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-secondary"></div>Washout</span>
                                            </div>
                                        </div>
                                        <div className="w-full flex gap-1 h-2 rounded-full overflow-hidden bg-slate-800">
                                            {template.phases.map((p, i) => (
                                                <div
                                                    key={i}
                                                    className={`h-full ${p.type === 'baseline' ? 'bg-slate-600' :
                                                        p.type === 'intervention' ? 'bg-primary' : 'bg-secondary'
                                                        }`}
                                                    style={{ flex: p.duration_days }}
                                                    title={`${p.name} (${p.duration_days}d)`}
                                                />
                                            ))}
                                        </div>
                                        <div className="flex justify-between text-xs text-zinc-500 font-mono">
                                            <span>{template.phases[0].duration_days}d Base</span>
                                            <span>{template.phases.reduce((a, b) => a + b.duration_days, 0)} Days Total</span>
                                        </div>
                                    </div>

                                    {/* Metrics Preview Section (New) */}
                                    <div className="pt-2 border-t border-white/5">
                                        <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-2 mt-2">Metrics Tracked</div>
                                        <div className="flex flex-wrap gap-2">
                                            {template.metrics.slice(0, 3).map((m) => (
                                                <span key={m.key} className="inline-flex items-center px-2 py-1 rounded-md bg-zinc-950 border border-zinc-800 text-[10px] font-medium text-zinc-400">
                                                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${m.source === 'automated' ? 'bg-indigo-500' : 'bg-emerald-500'}`} />
                                                    {m.label}
                                                </span>
                                            ))}
                                            {template.metrics.length > 3 && (
                                                <span className="inline-flex items-center px-2 py-1 text-[10px] text-zinc-500">+ {template.metrics.length - 3} more</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    className={`w-full transition-all group ${isRunning ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-slate-800 hover:bg-primary hover:text-slate-950'}`}
                                    onClick={() => isRunning ? (window.location.href = '/dashboard') : initiateLaunch(template.id)}
                                    disabled={false}
                                >
                                    {launchingId === template.id ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Launching...
                                        </>
                                    ) : isRunning ? (
                                        <>
                                            View Details <ArrowRight className="ml-2 h-4 w-4" />
                                        </>
                                    ) : (
                                        <>
                                            Start Tier {template.tier} Protocol <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </Button>
                            </CardFooter>
                        </Card>
                    )
                })}
            </div>

            {/* History Section */}
            {pastProtocols.length > 0 && (
                <div className="pt-12 border-t border-zinc-800">
                    <h2 className="text-2xl font-bold text-white mb-6">Protocol History</h2>
                    <div className="grid grid-cols-1 gap-4">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {pastProtocols.map((p: any) => (
                            <div key={p.id} className="flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
                                <div>
                                    <h3 className="font-bold text-zinc-200">{p.title}</h3>
                                    <p className="text-sm text-zinc-500">
                                        {new Date(p.created_at).toLocaleDateString()} • {p.status}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className={`px-2 py-1 rounded text-xs font-bold border ${p.status === 'completed' ? 'border-emerald-500/30 text-emerald-400' : 'border-zinc-700 text-zinc-500'
                                        }`}>
                                        {p.status.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
