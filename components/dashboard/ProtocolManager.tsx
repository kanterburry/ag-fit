'use client'

import { useCallback } from 'react'
import DailyCheckInCard from './DailyCheckInCard'
import { Card, CardContent } from '@/components/ui/card'
import { Activity, ClipboardList, ChevronLeft, ChevronRight } from 'lucide-react'
import useEmblaCarousel from 'embla-carousel-react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ProtocolManager({ protocolDataList }: { protocolDataList: any[] }) {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: 'start',
        loop: false,
        skipSnaps: false,
        dragFree: false
    })

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev()
    }, [emblaApi])

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext()
    }, [emblaApi])

    // Deduplicate protocols by Title
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const uniqueProtocols = protocolDataList.reduce((acc: any[], current) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const x = acc.find((item: any) => item.protocol.title === current.protocol.title);
        if (!x) return acc.concat([current]);
        return acc;
    }, []);

    const selectedProtocolData = uniqueProtocols?.[0]

    if (!selectedProtocolData) {
        // Empty State
        return (
            <div className="space-y-4">
                <h2 className="text-xl font-bold tracking-tight px-1">Summary</h2>
                <Card className="border-dashed border-zinc-800 bg-zinc-900/20">
                    <CardContent className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                        <div className="h-12 w-12 rounded-full bg-zinc-900 flex items-center justify-center">
                            <Activity className="h-6 w-6 text-zinc-500" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-lg font-medium text-white">No Active Protocols</h3>
                            <p className="text-sm text-zinc-400 max-w-[300px]">
                                You aren't tracking any experimental protocols yet. Start one to optimize your biology.
                            </p>
                        </div>
                        <a href="/dashboard/protocols" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-300">
                            <ClipboardList className="mr-2 h-4 w-4" />
                            Browse Library
                        </a>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
                <h2 className="text-xl font-bold tracking-tight">Summary</h2>

                {/* Navigation Buttons */}
                {uniqueProtocols.length > 1 && (
                    <div className="flex gap-2">
                        <button
                            onClick={scrollPrev}
                            className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
                            aria-label="Previous protocol"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={scrollNext}
                            className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
                            aria-label="Next protocol"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </div>

            {/* Embla Carousel */}
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex gap-4">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {uniqueProtocols.map((protocolData: any, index: number) => (
                        <div
                            key={protocolData.protocol.id}
                            className="flex-[0_0_100%] min-w-0 md:flex-[0_0_45%] lg:flex-[0_0_30%] xl:flex-[0_0_22%]"
                        >
                            <DailyCheckInCard
                                protocolData={protocolData}
                                colorIndex={index}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
