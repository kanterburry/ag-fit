import Link from "next/link";
import { Activity } from "lucide-react";

export function Header() {
    return (
        <header className="sticky top-0 z-50 flex h-14 items-center border-b border-slate-800 bg-surface/90 backdrop-blur-lg px-4">
            <Link href="/dashboard" className="flex items-center gap-2">
                <Activity className="text-primary" size={24} />
                <span className="text-lg font-bold tracking-tight text-white">
                    AG-Fit
                </span>
            </Link>
        </header>
    );
}
