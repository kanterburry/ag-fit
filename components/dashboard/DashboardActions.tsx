'use client'

import QuickLogButton from './QuickLogButton'
import AskProtocolAIButton from './AskProtocolAIButton'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function DashboardActions({ protocols }: { protocols: any[] }) {
    return (
        <div className="flex items-center gap-1.5 sm:gap-3 pointer-events-auto">
            <AskProtocolAIButton />
            <QuickLogButton protocols={protocols} />
        </div>
    )
}
