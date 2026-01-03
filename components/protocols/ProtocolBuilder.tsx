'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { createProtocol, CreateProtocolInput, ProtocolPhaseInput } from '@/app/actions/protocol'
import { ArrowLeft, ArrowRight, Plus, Trash2, TestTube, CheckCircle2 } from 'lucide-react'

export function ProtocolBuilder() {
    const [step, setStep] = useState(1)
    const [isLoading, setIsLoading] = useState(false)

    // State
    const [title, setTitle] = useState('')
    const [hypothesis, setHypothesis] = useState('')
    const [phases, setPhases] = useState<ProtocolPhaseInput[]>([
        { name: 'Baseline', type: 'baseline', duration_days: 7, order_index: 0 },
        { name: 'Intervention', type: 'intervention', duration_days: 14, order_index: 1 },
    ])

    // Handlers
    const addPhase = () => {
        setPhases([
            ...phases,
            {
                name: 'New Phase',
                type: 'washout',
                duration_days: 7,
                order_index: phases.length
            }
        ])
    }

    const removePhase = (index: number) => {
        const newPhases = phases.filter((_, i) => i !== index)
        // re-index
        const reindexed = newPhases.map((p, i) => ({ ...p, order_index: i }))
        setPhases(reindexed)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updatePhase = (index: number, field: keyof ProtocolPhaseInput, value: any) => {
        const newPhases = [...phases]
        newPhases[index] = { ...newPhases[index], [field]: value }
        setPhases(newPhases)
    }

    const handleCreate = async () => {
        setIsLoading(true)
        const payload: CreateProtocolInput = {
            title,
            hypothesis,
            phases,
        }
        await createProtocol(payload)
        // createProtocol handles redirect
        setIsLoading(false)
    }

    // Render Steps
    const renderStep1 = () => (
        <div className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-medium">Protocol Title</label>
                <Input
                    placeholder="e.g., Caffeine Reduction Experiment"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Hypothesis</label>
                <Input
                    placeholder="e.g., Reducing caffeine will improve my deep sleep scores."
                    value={hypothesis}
                    onChange={(e) => setHypothesis(e.target.value)}
                />
            </div>
        </div>
    )

    const renderStep2 = () => (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Experimental Phases</h3>
                <Button variant="outline" size="sm" onClick={addPhase}>
                    <Plus className="mr-2 h-4 w-4" /> Add Phase
                </Button>
            </div>

            <div className="space-y-3">
                {phases.map((phase, index) => (
                    <div key={index} className="flex items-end gap-3 rounded-lg border border-slate-800 bg-slate-900/50 p-3">
                        <div className="flex-1 space-y-1">
                            <label className="text-xs text-muted-foreground">Name</label>
                            <Input
                                value={phase.name}
                                onChange={(e) => updatePhase(index, 'name', e.target.value)}
                                className="h-8"
                            />
                        </div>
                        <div className="w-32 space-y-1">
                            <label className="text-xs text-muted-foreground">Type</label>
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            <select
                                className="flex h-8 w-full rounded-md border border-slate-700 bg-surface px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                value={phase.type}
                                onChange={(e) => updatePhase(index, 'type', e.target.value as any)}
                            >
                                <option value="baseline">Baseline</option>
                                <option value="intervention">Intervention</option>
                                <option value="washout">Washout</option>
                            </select>
                        </div>
                        <div className="w-24 space-y-1">
                            <label className="text-xs text-muted-foreground">Days</label>
                            <Input
                                type="number"
                                value={phase.duration_days}
                                onChange={(e) => updatePhase(index, 'duration_days', parseInt(e.target.value))}
                                className="h-8"
                            />
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-error"
                            onClick={() => removePhase(index)}
                            disabled={phases.length <= 1}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
            </div>
            <div className="text-xs text-muted-foreground">
                Total Duration: {phases.reduce((acc, p) => acc + (p.duration_days || 0), 0)} days
            </div>
        </div>
    )

    const renderStep3 = () => (
        <div className="space-y-6">
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                <h3 className="mb-2 font-semibold text-primary flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" /> Ready to Launch?
                </h3>
                <p className="text-sm text-muted-foreground">
                    Review your experiment details below. Once launched, you&apos;ll start tracking daily from tomorrow.
                </p>
            </div>

            <div className="space-y-4 text-sm">
                <div className="grid grid-cols-3 gap-4 border-b border-slate-800 pb-4">
                    <span className="text-muted-foreground">Title</span>
                    <span className="col-span-2 font-medium">{title}</span>

                    <span className="text-muted-foreground">Hypothesis</span>
                    <span className="col-span-2">{hypothesis}</span>
                </div>

                <div>
                    <span className="mb-2 block text-muted-foreground">Timeline</span>
                    <div className="flex gap-1 overflow-hidden rounded-full h-4 w-full">
                        {phases.map((p, i) => (
                            <div
                                key={i}
                                className={`h-full ${p.type === 'baseline' ? 'bg-slate-500' :
                                        p.type === 'intervention' ? 'bg-primary' : 'bg-secondary'
                                    }`}
                                style={{ flex: p.duration_days }}
                                title={`${p.name} (${p.duration_days} days)`}
                            />
                        ))}
                    </div>
                    <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                        {phases.map((p, i) => (
                            <div key={i}>{p.name} ({p.duration_days}d)</div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )

    return (
        <Card className="w-full max-w-2xl mx-auto border-slate-800 bg-slate-950/50 backdrop-blur-sm">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <TestTube className="h-5 w-5" />
                    </div>
                    <div>
                        <CardTitle>Design Protocol</CardTitle>
                        <CardDescription>Step {step} of 3: {
                            step === 1 ? 'Core Concept' :
                                step === 2 ? 'Phase Configuration' : 'Review & Launch'
                        }</CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="min-h-[300px]">
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
            </CardContent>

            <CardFooter className="flex justify-between border-t border-slate-800 bg-slate-900/50 p-6">
                <Button
                    variant="ghost"
                    onClick={() => setStep(step - 1)}
                    disabled={step === 1}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>

                {step < 3 ? (
                    <Button onClick={() => setStep(step + 1)}>
                        Next <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                ) : (
                    <Button onClick={handleCreate} disabled={isLoading} className="bg-primary text-slate-950 hover:bg-primary/90">
                        {isLoading ? 'Creating...' : 'Launch Experiment'}
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
}
