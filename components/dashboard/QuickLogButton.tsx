'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import QuickLogDrawer from "./QuickLogDrawer"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function QuickLogButton({ protocols }: { protocols: any[] }) {
    const [isOpen, setIsOpen] = useState(false)

    // Only show if there are protocols to log
    const hasPendingLogs = protocols.some(p => !p.todayLog && p.protocol.status === 'active')

    if (!hasPendingLogs && !isOpen) return null

    return (
        <>
            <Button
                onClick={() => setIsOpen(true)}
                className="rounded-xl shadow-lg bg-indigo-600 hover:bg-indigo-500 text-white px-3 sm:px-4 h-10 sm:h-12 flex gap-1.5 sm:gap-2 items-center animate-in zoom-in duration-300 border border-indigo-400/30"
            >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline text-xs sm:text-sm font-bold tracking-wide">LOG</span>
            </Button>

            <QuickLogDrawer
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                protocols={protocols}
            />
        </>
    )
}
