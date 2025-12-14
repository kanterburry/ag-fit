'use client'

import { useState, useEffect } from 'react'
import { Bell, BellOff } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

const PUBLIC_VAPID_KEY = 'YOUR_PUBLIC_VAPID_KEY_HERE' // You need to generate this

export default function PushManager() {
    const [isSubscribed, setIsSubscribed] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            registerServiceWorker().then(() => {
                checkSubscription()
            })
        } else {
            setLoading(false)
        }
    }, [])

    async function registerServiceWorker() {
        try {
            await navigator.serviceWorker.register('/sw.js')
        } catch (e) {
            console.error('SW registration failed', e)
        }
    }

    async function checkSubscription() {
        try {
            const registration = await navigator.serviceWorker.ready
            const subscription = await registration.pushManager.getSubscription()
            setIsSubscribed(!!subscription)
        } catch (e) {
            console.error('Error checking subscription', e)
        } finally {
            setLoading(false)
        }
    }

    async function subscribeToPush() {
        try {
            setLoading(true)
            const registration = await navigator.serviceWorker.ready

            // Check permission provided in public VAPID key
            // We need to fetch the VAPID key from server or env? 
            // For now using a placeholder or env if available via Server Component passing prop?
            // Using a server action to get the key might be better.

            // Assuming we have the key from env NEXT_PUBLIC_VAPID_KEY
            const key = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
            if (!key) {
                alert('VAPID Key not configured')
                return
            }

            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(key)
            })

            // Save to Supabase
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (user) {
                await supabase.from('push_subscriptions').upsert({
                    user_id: user.id,
                    endpoint: subscription.endpoint,
                    p256dh: btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(subscription.getKey('p256dh')!)))),
                    auth: btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(subscription.getKey('auth')!))))
                })
            }

            setIsSubscribed(true)
        } catch (e) {
            console.error('Subscription failed', e)
            alert('Failed to subscribe: ' + e)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return null

    if (isSubscribed) {
        return (
            <button className="p-2 text-zinc-600 cursor-default" title="Notifications Enabled">
                <Bell size={16} className="text-purple-500" />
            </button>
        )
    }

    return (
        <button
            onClick={subscribeToPush}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 text-purple-400 text-xs font-mono border border-purple-500/20 hover:bg-purple-500/20 transition-colors"
        >
            <Bell size={14} />
            <span>Enable Nudges</span>
        </button>
    )
}

function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding)
        .replace(/\-/g, '+') // eslint-disable-line
        .replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
}
