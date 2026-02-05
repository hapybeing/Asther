"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { CheckCircle2, Music, Settings, LayoutGrid, CloudRain, Flame, Wind, Coffee, Volume2, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

// 1. The Bulletproof Sound Library
const SOUNDS = [
  {
    id: "rain",
    label: "Heavy Rain",
    icon: CloudRain,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    // Google (Reliable OGG)
    url: "https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg"
  },
  {
    id: "fire",
    label: "Campfire",
    icon: Flame,
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    // Google (Reliable OGG)
    url: "https://actions.google.com/sounds/v1/ambiences/fire.ogg"
  },
  {
    id: "wind",
    label: "Night Wind",
    icon: Wind,
    color: "text-slate-400",
    bg: "bg-slate-500/10",
    // Wikimedia Commons (Unblockable MP3)
    url: "https://upload.wikimedia.org/wikipedia/commons/transcoded/e/e5/Wind_blowing.ogg/Wind_blowing.ogg.mp3" 
  },
  {
    id: "cafe",
    label: "Coffee Shop",
    icon: Coffee,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    // Google (Reliable OGG)
    url: "https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg"
  }
];

export default function Soundscapes() {
  const [activeSound, setActiveSound] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleSound = (sound: typeof SOUNDS[0]) => {
    if (activeSound === sound.id) {
      // Pause
      audioRef.current?.pause();
      setActiveSound(null);
    } else {
      // Play
      if (audioRef.current) audioRef.current.pause();
      
      const audio = new Audio(sound.url);
      audio.loop = true;
      audio.volume = 1.0; 
      
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            audioRef.current = audio;
            setActiveSound(sound.id);
          })
          .catch((error) => {
            console.error("Playback failed:", error);
            // If this alerts, it's 100% a network block, but Wikimedia should pass.
            alert("Stream blocked. Try turning off 'Data Saver' mode.");
          });
      }
    }
  };

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden font-sans">
      
      {/* Sidebar */}
      <aside className="w-20 lg:w-64 border-r border-white/10 bg-zinc-900/50 backdrop-blur-xl flex flex-col items-center lg:items-start py-8 transition-all z-50">
        <div className="mb-10 px-0 lg:px-8">
            <h2 className="text-2xl font-bold hidden lg:block tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white to-zinc-500">Asther.</h2>
            <div className="h-8 w-8 bg-white rounded-full lg:hidden" />
        </div>
        
        <nav className="flex-1 space-y-6 w-full px-4">
            <Link href="/dashboard">
                <NavItem icon={<LayoutGrid className="w-5 h-5" />} label="Dashboard" />
            </Link>
            <NavItem icon={<CheckCircle2 className="w-5 h-5" />} label="Tasks" />
            <Link href="/soundscapes">
                <NavItem icon={<Music className="w-5 h-5" />} label="Soundscapes" active />
            </Link>
            <NavItem icon={<Settings className="w-5 h-5" />} label="Settings" />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative">
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-900/20 to-transparent pointer-events-none" />

        <div className="relative z-10 p-8 lg:p-12 max-w-7xl mx-auto space-y-10">
            <header>
                <h1 className="text-4xl font-light text-white/90">Sonic Environment.</h1>
                <p className="text-zinc-500 mt-2">Design your background noise.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {SOUNDS.map((sound) => (
                    <div 
                        key={sound.id}
                        onClick={() => toggleSound(sound)}
                        className={cn(
                            "relative overflow-hidden h-64 rounded-3xl border p-8 flex flex-col justify-between cursor-pointer transition-all duration-300 group select-none",
                            activeSound === sound.id 
                                ? "bg-white/10 border-white/20 scale-[1.02] shadow-2xl" 
                                : "bg-zinc-900/50 border-white/5 hover:border-white/10 hover:bg-zinc-900/80"
                        )}
                    >
                        {activeSound === sound.id && (
                            <div className={cn("absolute inset-0 opacity-20 blur-3xl", sound.bg)} />
                        )}

                        <div className="flex justify-between items-start relative z-10">
                            <div className={cn("p-4 rounded-full transition-colors", sound.bg, sound.color)}>
                                <sound.icon className="w-8 h-8" />
                            </div>
                            <div className={cn("p-2 rounded-full", activeSound === sound.id ? "bg-white text-black" : "bg-white/5 text-white")}>
                                {activeSound === sound.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                            </div>
                        </div>

                        <div className="relative z-10">
                            <h3 className="text-2xl font-medium tracking-tight">{sound.label}</h3>
                            <div className="flex items-center gap-2 mt-2 text-sm text-zinc-500">
                                <Volume2 className="w-4 h-4" />
                                <span>{activeSound === sound.id ? "Playing now" : "Tap to play"}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
    return (
        <div className={`flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all ${active ? 'bg-white/10 text-white shadow-inner' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}>
            {icon}
            <span className="hidden lg:block font-medium">{label}</span>
        </div>
    )
}
