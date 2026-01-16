'use client'

import { useCoach } from "@/context/CoachContext"
import { MessageSquare } from "lucide-react"

export default function AskProtocolAIButton() {
    const { open } = useCoach()

    return (
        <button
            onClick={open}
            className="flex-1 sm:flex-none h-10 sm:h-12 px-3 sm:px-6 rounded-xl sm:rounded-2xl bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/30 flex items-center justify-center gap-2 text-purple-300 font-medium active:scale-95 transition-transform backdrop-blur-md shadow-lg shadow-purple-900/20 hover:shadow-purple-900/40 hover:border-purple-500/50"
        >
            <MessageSquare size={18} className="sm:size-5" />
            <span className="hidden sm:inline text-sm">Ask ProtocolAI</span>
        </button>
    )
}
