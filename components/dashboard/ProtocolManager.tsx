'use client'

import { useCallback, useEffect, useState } from 'react'
import DailyCheckInCard from './DailyCheckInCard'
import { Card, CardContent } from '@/components/ui/card'
import { Activity, ClipboardList, ChevronLeft, ChevronRight } from 'lucide-react'
import useEmblaCarousel from 'embla-carousel-react'
import { cn } from '@/lib/utils'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ProtocolManager({ protocolDataList }: { protocolDataList: any[] }) {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: 'start',
        loop: false,
        skipSnaps: false,
        dragFree: false
    })

    const [prevBtnDisabled, setPrevBtnDisabled] = useState(true)
    const [nextBtnDisabled, setNextBtnDisabled] = useState(true)
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi])
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi])
    const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi])

    const onSelect = useCallback((emblaApi: any) => {
        setSelectedIndex(emblaApi.selectedScrollSnap())
        setPrevBtnDisabled(!emblaApi.canScrollPrev())
        setNextBtnDisabled(!emblaApi.canScrollNext())
    }, [])

    const onInit = useCallback((emblaApi: any) => {
        setScrollSnaps(emblaApi.scrollSnapList())
    }, [])

    useEffect(() => {
        if (!emblaApi) return

        onInit(emblaApi)
        onSelect(emblaApi)
        emblaApi.on('reInit', onInit).on('reInit', onSelect).on('select', onSelect)
    }, [emblaApi, onInit, onSelect])

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

                {/* Navigation Buttons (Removed for cleaner UI, use Dots) */}
            </div>

            {/* Embla Carousel */}
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex gap-4">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {uniqueProtocols.map((protocolData: any, index: number) => (
                        <div
                            key={protocolData.protocol.id}
                            className="flex-[0_0_100%] min-w-0"
                        >
                            <DailyCheckInCard
                                protocolData={protocolData}
                                colorIndex={index}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Dots Indicator */}
            {uniqueProtocols.length > 1 && (
                <div className="flex justify-center gap-2 pt-2">
                    {scrollSnaps.map((_, index) => (
                        <button
                            key={index}
                            className={cn(
                                "w-2 h-2 rounded-full transition-all duration-300",
                                index === selectedIndex
                                    ? "bg-indigo-500 w-6" // Active pill
                                    : "bg-zinc-800 hover:bg-zinc-700"
                            )}
                            onClick={() => scrollTo(index)}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
