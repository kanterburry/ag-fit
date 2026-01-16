'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { getURL } from '@/lib/utils'
import { User } from '@supabase/supabase-js'
import { LogOut, LogIn } from 'lucide-react'

export default function GoogleAuthButton() {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const supabase = createClient()

        // Get initial user
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user)
        })

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => subscription.unsubscribe()
    }, [])

    const handleSignIn = async () => {
        setIsLoading(true)
        const supabase = createClient()
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${getURL()}auth/callback`,
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                    scope: 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'
                }
            },
        })
    }

    const handleSignOut = async () => {
        setIsLoading(true)
        const supabase = createClient()
        await supabase.auth.signOut()
        window.location.href = '/login'
    }

    if (user) {
        // User is signed in - show avatar/email and sign out option
        return (
            <div className="flex items-center gap-3">
                {/* User Info (Desktop only) */}
                <div className="hidden md:flex flex-col items-end mr-2">
                    <span className="text-xs text-zinc-400 font-medium">
                        {user.email}
                    </span>
                    <span className="text-[10px] text-green-500 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        Online
                    </span>
                </div>

                <button
                    onClick={handleSignOut}
                    disabled={isLoading}
                    className="flex items-center gap-2 rounded-full bg-zinc-900 border border-zinc-800 p-1 pr-3 text-sm font-medium text-zinc-300 hover:bg-red-950/20 hover:text-red-400 hover:border-red-900/30 transition-all disabled:opacity-50 group"
                    title="Sign out"
                >
                    {user.user_metadata?.avatar_url ? (
                        <img
                            src={user.user_metadata.avatar_url}
                            alt="Profile"
                            className="w-8 h-8 rounded-full border border-zinc-700"
                        />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 font-bold">
                            {user.email?.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <span className="group-hover:text-red-400 text-zinc-400 text-xs uppercase tracking-wider font-bold">Sign Out</span>
                    <LogOut size={14} className="group-hover:text-red-400" />
                </button>
            </div>
        )
    }

    // User is signed out - show sign in button
    return (
        <button
            onClick={handleSignIn}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-gray-100 transition-all disabled:opacity-50"
            title="Sign in with Google"
        >
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
            <LogIn size={16} />
        </button>
    )
}
