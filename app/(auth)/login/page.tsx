"use client";

import { createClient } from "@/utils/supabase/client";
import { getURL } from "@/lib/utils";
import { Activity, Loader2 } from "lucide-react";
import { useState } from "react";

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        setIsLoading(true);
        const supabase = createClient();
        const redirectUrl = `${getURL()}auth/callback`;
        console.log('[LoginPage] Initiating sign-in with redirectTo:', redirectUrl);

        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: redirectUrl,
            },
        });
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
            <div className="flex flex-col items-center gap-6 rounded-2xl bg-surface p-8 shadow-xl ring-1 ring-slate-800">
                <div className="flex items-center gap-3 text-primary">
                    <Activity size={48} />
                    <h1 className="text-3xl font-bold tracking-tight text-white">
                        AG-Fit
                    </h1>
                </div>

                <p className="text-center text-slate-400">
                    Sync your training. <br />
                    Unlock your potential.
                </p>

                <button
                    onClick={handleLogin}
                    disabled={isLoading}
                    className="flex w-full items-center justify-center gap-3 rounded-lg bg-white px-5 py-3 text- font-semibold text-black transition-colors hover:bg-slate-200 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 4.63c1.61 0 3.06.56 4.23 1.68l3.18-3.18C17.45 1.14 14.97 0 12 0 7.7 0 3.99 2.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                    )}
                    Sign in with Google
                </button>
            </div>
        </div>
    );
}
