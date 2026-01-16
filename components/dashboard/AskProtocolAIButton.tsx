'use client'

import { useCoach } from "@/context/CoachContext"
import { MessageSquare } from "lucide-react"

export default function AskProtocolAIButton() {
    const { open } = useCoach()

    return (
        <button
            onClick={open}
            className="max-w-[300px] w-full h-14 rounded-2xl bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/30 flex items-center justify-center gap-2 text-purple-300 font-medium active:scale-95 transition-transform backdrop-blur-md shadow-lg shadow-purple-900/20 hover:shadow-purple-900/40 hover:border-purple-500/50"
        >
            <MessageSquare size={20} />
            <span>Ask ProtocolAI</span>
        </button>
    )
}
