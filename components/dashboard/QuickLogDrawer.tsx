'use client'

import { useState } from 'react'
import { SidePanel } from '@/components/ui/SidePanel'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { logDailyData } from '@/app/actions/dashboard'
import { Loader2, Save, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

// Basic Checkbox since shadcn one is missing
function SimpleCheckbox({ checked, onCheckedChange }: { checked: boolean; onCheckedChange: (c: boolean) => void }) {
    return (
        <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onCheckedChange(e.target.checked)}
            className="w-5 h-5 rounded border-zinc-700 bg-zinc-800 text-indigo-500 focus:ring-indigo-500 cursor-pointer accent-indigo-500"
        />
    )
}

export default function QuickLogDrawer({
    isOpen,
    onClose,
    protocols
}: {
    isOpen: boolean
    onClose: () => void
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    protocols: any[]
}) {
    const [loading, setLoading] = useState(false)
    // Map protocolId -> data (e.g. { count: 5 } or { completed: true })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [logData, setLogData] = useState<Record<string, any>>({})
    const [selectedProtocols, setSelectedProtocols] = useState<Set<string>>(new Set())

    // Initialize state when opening
    // Filter: Only show active protocols that have NOT been logged today
    const activeProtocols = protocols.filter(p => !p.todayLog && p.protocol.status === 'active')

    // If you want to show completed ones at the bottom, we can compute that too
    const completedProtocols = protocols.filter(p => p.todayLog && p.protocol.status === 'active')

    const handleToggle = (id: string) => {
        const newSelected = new Set(selectedProtocols)
        if (newSelected.has(id)) {
            newSelected.delete(id)
        } else {
            newSelected.add(id)
        }
        setSelectedProtocols(newSelected)
    }

    const handleSave = async () => {
        setLoading(true)
        let successCount = 0

        for (const pid of Array.from(selectedProtocols)) {
            const p = protocols.find(p => p.protocol.id === pid)
            if (!p) continue

            // Determine data payload
            // Default to { completed: true } unless input provided
            const specificData = logData[pid] || {}

            // If manual metric exists, ensure we have data ??
            // For now, simple boolean toggle implies "Done" or "1" if count is needed but not provided?
            // Let's assume boolean toggle = minimal valid log.

            const payload = { ...specificData, completed: true }

            const res = await logDailyData(p.protocol.id, p.currentPhase.id, payload)
            if (res?.success) successCount++
        }

        setLoading(false)
        if (successCount > 0) {
            onClose()
            setSelectedProtocols(new Set())
            setLogData({})
        }
    }

    return (
        <SidePanel isOpen={isOpen} onClose={onClose} title="Quick Log">
            <div className="space-y-6">
                <p className="text-zinc-400 text-sm">
                    Select behaviors you performed today.
                </p>

                <div className="space-y-2">
                    {activeProtocols.length === 0 && (
                        <div className="text-center py-8 text-zinc-500">
                            <CheckCircle2 className="w-12 h-12 mx-auto mb-2 opacity-20" />
                            <p>All caught up for today!</p>
                        </div>
                    )}

                    {activeProtocols.map((item) => {
                        const pid = item.protocol.id
                        const isSelected = selectedProtocols.has(pid)
                        const primaryMetric = item.protocol.protocol_phases?.[0]?.metrics?.[0] // Simplified

                        return (
                            <div
                                key={pid}
                                className={cn(
                                    "flex items-center gap-4 p-4 rounded-xl border transition-all duration-200",
                                    isSelected
                                        ? "bg-indigo-500/10 border-indigo-500/50"
                                        : "bg-zinc-900/50 border-zinc-800 hover:border-zinc-700"
                                )}
                            >
                                <SimpleCheckbox
                                    checked={isSelected}
                                    onCheckedChange={() => handleToggle(pid)}
                                />

                                <div className="flex-1">
                                    <h4 className={cn("font-medium", isSelected ? "text-indigo-200" : "text-zinc-300")}>
                                        {item.protocol.title}
                                    </h4>
                                    {/* Inputs for values if selected */}
                                    {isSelected && primaryMetric?.type !== 'boolean' && (
                                        <div className="mt-2 animate-in slide-in-from-top-2 fade-in">
                                            <Input
                                                type={primaryMetric?.type === 'number' ? 'number' : 'text'}
                                                placeholder={primaryMetric?.label || "Value"}
                                                className="h-8 bg-zinc-950/50 border-zinc-700 text-xs"
                                                onChange={(e) => setLogData(prev => ({
                                                    ...prev,
                                                    [pid]: { [primaryMetric?.key || 'value']: e.target.value }
                                                }))}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className="sticky bottom-0 pt-4 pb-8 bg-background border-t border-zinc-800">
                    <Button
                        onClick={handleSave}
                        disabled={loading || selectedProtocols.size === 0}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                        Save Logs ({selectedProtocols.size})
                    </Button>
                </div>
            </div>
        </SidePanel>
    )
}
