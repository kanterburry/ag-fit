"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Dumbbell, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
    const pathname = usePathname();

    const links = [
        {
            href: "/dashboard",
            label: "Timeline",
            icon: Home,
        },
        {
            href: "/dashboard/log",
            label: "Log",
            icon: Dumbbell,
        },
        {
            href: "/dashboard/coach",
            label: "Coach",
            icon: Bot,
        },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-800 bg-surface/90 backdrop-blur-lg pb-safe">
            <div className="flex h-16 items-center justify-around px-4">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex flex-col items-center justify-center gap-1 transition-colors duration-200",
                                isActive ? "text-primary" : "text-slate-500 hover:text-slate-300"
                            )}
                        >
                            <Icon size={24} />
                            <span className="text-[10px] font-medium">{link.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
