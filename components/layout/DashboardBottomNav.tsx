"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Dumbbell, Calendar, History, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { href: "/dashboard", label: "Home", icon: Home },
    { href: "/dashboard/workouts", label: "Workouts", icon: Dumbbell },
    { href: "/dashboard/calendar", label: "Calendar", icon: Calendar },
    { href: "/dashboard/activity", label: "Activity", icon: History },
    { href: "/dashboard/profile", label: "Profile", icon: User },
];

export function DashboardBottomNav() {
    const pathname = usePathname();

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-zinc-950/80 backdrop-blur-xl border-t border-zinc-800/50 flex items-center justify-around px-2 z-50 pb-safe">
            {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "relative flex flex-col items-center justify-center w-full h-full gap-1 transition-all duration-300",
                            isActive ? "text-purple-400" : "text-zinc-500 hover:text-zinc-300"
                        )}
                    >
                        <div className={cn(
                            "absolute -top-[1px] w-8 h-[2px] rounded-full transition-all duration-300",
                            isActive ? "bg-purple-500 shadow-[0_0_10px_#a855f7]" : "bg-transparent"
                        )} />

                        <item.icon
                            size={24}
                            strokeWidth={isActive ? 2.5 : 2}
                            className={cn("transition-transform duration-300", isActive && "-translate-y-1")}
                        />
                        <span className={cn("text-[10px] font-medium transition-all duration-300", isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 hidden")}>
                            {item.label}
                        </span>
                    </Link>
                );
            })}
        </nav>
    );
}
