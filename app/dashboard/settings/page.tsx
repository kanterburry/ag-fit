'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function SettingsPage() {
    const [isConnected, setIsConnected] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [isSyncing, setIsSyncing] = useState(false)
    const [isDisconnecting, setIsDisconnecting] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        checkConnection()

        // Handle OAuth callback success
        if (searchParams?.get('gcal_connected') === 'true') {
            setIsConnected(true)
            // Remove query param
            window.history.replaceState({}, '', '/dashboard/settings')
        }

        // Handle errors
        const error = searchParams?.get('error')
        if (error) {
            alert(`Connection failed: ${error}`)
            window.history.replaceState({}, '', '/dashboard/settings')
        }
    }, [searchParams])

    const checkConnection = async () => {
        try {
            const res = await fetch('/api/calendar/status')
            const data = await res.json()
            setIsConnected(data.connected)
        } catch (err) {
            console.error('Failed to check connection:', err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleConnect = () => {
        window.location.href = '/api/auth/google/connect'
    }

    const handleDisconnect = async () => {
        if (!confirm('Are you sure you want to disconnect Google Calendar?')) return

        setIsDisconnecting(true)
        try {
            const res = await fetch('/api/calendar/disconnect', { method: 'POST' })
            if (res.ok) {
                setIsConnected(false)
            } else {
                alert('Failed to disconnect')
            }
        } catch (err) {
            console.error('Disconnect error:', err)
            alert('Failed to disconnect')
        } finally {
            setIsDisconnecting(false)
        }
    }

    const handleSync = async () => {
        setIsSyncing(true)
        try {
            const res = await fetch('/api/calendar/sync', { method: 'POST' })
            const data = await res.json()

            if (res.ok) {
                alert(`Sync complete! Synced: ${data.synced}, Failed: ${data.failed}`)
            } else {
                alert(`Sync failed: ${data.error}`)
            }
        } catch (err) {
            console.error('Sync error:', err)
            alert('Sync failed')
        } finally {
            setIsSyncing(false)
        }
    }

    return (
        <div className="min-h-screen bg-black text-white p-6">
            <div className="max-w-4xl mx-auto space-y-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Settings</h1>
                    <p className="text-zinc-400">Manage your app integrations and preferences</p>
                </div>

                {/* Google Calendar Integration */}
                <Card className="bg-zinc-900/50 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-purple-400" />
                            Google Calendar Integration
                        </CardTitle>
                        <CardDescription>
                            Sync your protocol experiments to your Google Calendar
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {isLoading ? (
                            <div className="flex items-center gap-2 text-zinc-400">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Checking connection status...</span>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center gap-2">
                                    {isConnected ? (
                                        <>
                                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                            <span className="text-emerald-400 font-medium">Connected</span>
                                        </>
                                    ) : (
                                        <>
                                            <XCircle className="w-5 h-5 text-zinc-500" />
                                            <span className="text-zinc-500 font-medium">Not Connected</span>
                                        </>
                                    )}
                                </div>

                                <div className="flex gap-3">
                                    {isConnected ? (
                                        <>
                                            <Button
                                                onClick={handleSync}
                                                disabled={isSyncing}
                                                className="bg-purple-600 hover:bg-purple-700 text-white"
                                            >
                                                {isSyncing ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                        Syncing...
                                                    </>
                                                ) : (
                                                    'Sync Now'
                                                )}
                                            </Button>
                                            <Button
                                                onClick={handleDisconnect}
                                                disabled={isDisconnecting}
                                                variant="outline"
                                                className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                                            >
                                                {isDisconnecting ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                        Disconnecting...
                                                    </>
                                                ) : (
                                                    'Disconnect'
                                                )}
                                            </Button>
                                        </>
                                    ) : (
                                        <Button
                                            onClick={handleConnect}
                                            className="bg-purple-600 hover:bg-purple-700 text-white"
                                        >
                                            Connect Google Calendar
                                        </Button>
                                    )}
                                </div>

                                <p className="text-sm text-zinc-500">
                                    When connected, your protocol start and end dates will be synced to your Google Calendar.
                                </p>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
