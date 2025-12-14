import { Calendar, MapPin, Trophy, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function ChallengesPage() {
    // Mock Data for "Public APIs"
    const events = [
        {
            id: 1,
            title: "London Marathon 2026",
            date: "2026-04-26",
            location: "London, UK",
            distance: "42.2 km",
            type: "Running",
            image: "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800&q=80"
        },
        {
            id: 2,
            title: "Spartan Race: Beast",
            date: "2025-11-15",
            location: "California, USA",
            distance: "21 km + 30 Obstacles",
            type: "Obstacle",
            image: "https://images.unsplash.com/photo-1524255684952-d7185b509571?w=800&q=80"
        },
        {
            id: 3,
            title: "Ironman 70.3",
            date: "2025-12-05",
            location: "Perth, Australia",
            distance: "113 km",
            type: "Triathlon",
            image: "https://images.unsplash.com/photo-1517926116633-85bbf2277663?w=800&q=80"
        }
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-white">Global Challenges</h1>
                <p className="text-zinc-400">Join public racing events and push your limits.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                    <div key={event.id} className="group relative overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 transition-all hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-900/10">
                        {/* Image */}
                        <div className="h-48 w-full overflow-hidden">
                            {/* Placeholder generic images are used via CSS or simple divs if Next Image is tricky with external domains without config. Using img tag for simplicity in MVP. */}
                            <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/10">
                                {event.type}
                            </div>
                        </div>

                        <div className="p-5 space-y-4">
                            <h3 className="text-xl font-bold text-white">{event.title}</h3>

                            <div className="space-y-2 text-sm text-zinc-400">
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} className="text-purple-400" />
                                    <span>{event.date}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin size={16} className="text-purple-400" />
                                    <span>{event.location}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Trophy size={16} className="text-purple-400" />
                                    <span>{event.distance}</span>
                                </div>
                            </div>

                            <button className="w-full flex items-center justify-center gap-2 py-3 mt-2 bg-zinc-800 hover:bg-white hover:text-black transition-colors rounded-xl text-sm font-semibold">
                                <span>Join Challenge</span>
                                <ExternalLink size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* AI Suggestion */}
            <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/20 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-purple-600/20 rounded-xl text-purple-400">
                        <Trophy size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white mb-2">Not sure what to pick?</h3>
                        <p className="text-zinc-400 text-sm mb-4">
                            Ask your AI Coach to recommend a race based on your current fitness level and training history.
                        </p>
                        {/* This could trigger the chat in the future */}
                    </div>
                </div>
            </div>
        </div>
    );
}
