'use client'

import GoogleAuthButton from "@/components/auth/GoogleAuthButton"
import { usePathname } from "next/navigation"
import DashboardActions from "@/components/dashboard/DashboardActions"

export function DashboardHeader({ protocols = [] }: { protocols?: any[] }) {
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
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-zinc-800 bg-background/80 backdrop-blur-md px-4 sm:px-6">
            <h1 className="text-lg font-semibold text-white truncate mr-2">{getTitle()}</h1>
            <div className="flex items-center gap-2 sm:gap-4">
                <DashboardActions protocols={protocols} />
                <GoogleAuthButton />
            </div>
        </header>
    )
}
