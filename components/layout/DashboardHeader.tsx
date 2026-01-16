'use client'

import GoogleAuthButton from "@/components/auth/GoogleAuthButton"
import { usePathname } from "next/navigation"

export function DashboardHeader() {
    const pathname = usePathname()

    // Simple breadcrumb or title logic
    const getTitle = () => {
        if (pathname === '/dashboard') return 'Overview'
        if (pathname.includes('/protocols')) return 'Protocols'
        if (pathname.includes('/workouts')) return 'Workouts'
        if (pathname.includes('/log')) return 'Log'
        if (pathname.includes('/coach')) return 'ProtocolAI'
        return 'Dashboard'
    }

    return (
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-zinc-800 bg-background/80 backdrop-blur-md px-6">
            <h1 className="text-lg font-semibold text-white">{getTitle()}</h1>
            <div className="flex items-center gap-4">
                <GoogleAuthButton />
            </div>
        </header>
    )
}
