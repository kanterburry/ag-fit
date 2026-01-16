'use client'

import QuickLogButton from './QuickLogButton'
import AskProtocolAIButton from './AskProtocolAIButton'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function DashboardActions({ protocols }: { protocols: any[] }) {
    return (
        <div className="sticky top-0 z-40 w-full flex justify-end items-center gap-2 sm:gap-3 py-2 sm:py-4 pointer-events-none pr-2">
            <div className="pointer-events-auto flex items-center gap-2 sm:gap-3">
                <div className="bg-black/50 backdrop-blur-md p-1 sm:p-1.5 rounded-full border border-zinc-800 shadow-2xl">
                    <AskProtocolAIButton />
                </div>
                <div className="bg-black/50 backdrop-blur-md p-1 sm:p-1.5 rounded-full border border-zinc-800 shadow-2xl">
                    <QuickLogButton protocols={protocols} />
                </div>
            </div>
        </div>
    )
}
