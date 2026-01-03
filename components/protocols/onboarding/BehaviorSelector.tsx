'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { HABIT_CATEGORIES, HABIT_OPTIONS } from '@/lib/protocols/templates'
import { cn } from '@/lib/utils'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'

type Props = {
    onComplete: (selectedHabits: string[]) => void
    onBack: () => void
}

export function BehaviorSelector({ onComplete, onBack }: Props) {
    const [selectedHabits, setSelectedHabits] = useState<string[]>([])
    const [activeTab, setActiveTab] = useState<string>(HABIT_CATEGORIES.LIFESTYLE) // Default to first tab

    const categories = Object.values(HABIT_CATEGORIES)

    const toggleHabit = (habit: string) => {
        if (selectedHabits.includes(habit)) {
            setSelectedHabits(prev => prev.filter(h => h !== habit))
        } else {
            setSelectedHabits(prev => [...prev, habit])
        }
    }

    return (
        <div className="w-full max-w-md mx-auto h-[600px] flex flex-col bg-zinc-950 text-white rounded-xl border border-zinc-800 overflow-hidden">
            {/* Header */}
            <div className="p-6 pb-2 text-center">
                <header className="flex justify-between items-center mb-4">
                    <Button variant="ghost" size="icon" onClick={onBack} className="text-zinc-400 hover:text-white">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <h2 className="text-lg font-bold">Select Behaviors</h2>
                    <div className="w-9" /> {/* Spacer */}
                </header>

                <h3 className="text-sm text-zinc-400 mb-1">
                    Choose from the following categories.
                </h3>
                <p className="text-xs text-zinc-500">
                    Try to limit your list to just a few.
                </p>
                <div className="mt-4 text-xs font-medium text-indigo-400">
                    {selectedHabits.length} behaviors selected
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-zinc-800 px-2 overflow-x-auto no-scrollbar">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveTab(cat)}
                        className={cn(
                            "px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors",
                            activeTab === cat
                                ? "border-white text-white"
                                : "border-transparent text-zinc-500 hover:text-zinc-300"
                        )}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {HABIT_OPTIONS[activeTab as keyof typeof HABIT_OPTIONS]?.map((habit) => {
                    const isSelected = selectedHabits.includes(habit)
                    return (
                        <div
                            key={habit}
                            onClick={() => toggleHabit(habit)}
                            className={cn(
                                "flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all border",
                                isSelected
                                    ? "bg-indigo-500/10 border-indigo-500/50 text-indigo-100" // Selected state
                                    : "bg-zinc-900/40 border-zinc-800/50 text-zinc-400 hover:bg-zinc-900" // Default state
                            )}
                        >
                            <span className="text-sm font-medium">{habit}</span>
                            {isSelected && <Check className="w-4 h-4 text-indigo-400" />}
                        </div>
                    )
                })}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-zinc-800">
                <Button
                    className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
                    onClick={() => onComplete(selectedHabits)}
                >
                    Next
                </Button>
            </div>
        </div>
    )
}
