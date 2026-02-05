"use client";

import { useState, useRef } from "react";
import { CloudRain, Flame, Trees, Coffee, Pause, Play, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

const SOUNDS = [
  {
    id: "rain",
    label: "Heavy Rain",
    icon: CloudRain,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    url: "https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg"
  },
  {
    id: "fire",
    label: "Campfire",
    icon: Flame,
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    url: "https://actions.google.com/sounds/v1/ambiences/fire.ogg"
  },
  {
    id: "forest",
    label: "Deep Forest",
    icon: Trees,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    url: "https://actions.google.com/sounds/v1/relax/forest.ogg"
  },
  {
    id: "cafe",
    label: "Coffee Shop",
    icon: Coffee,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    url: "https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg"
  }
];

export function Soundscapes() {
  const [activeSound, setActiveSound] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleSound = (sound: typeof SOUNDS[0]) => {
    if (activeSound === sound.id) {
      audioRef.current?.pause();
      setActiveSound(null);
    } else {
      if (audioRef.current) audioRef.current.pause();
      const audio = new Audio(sound.url);
      audio.loop = true;
      audio.volume = 1.0;
      audio.play().catch(e => console.log("Buffering..."));
      audioRef.current = audio;
      setActiveSound(sound.id);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
        <header>
            <h1 className="text-4xl font-light text-white/90">Sonic Environment.</h1>
            <p className="text-zinc-500 mt-2">Design your background noise.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SOUNDS.map((sound) => (
                <div 
                    key={sound.id}
                    onClick={() => toggleSound(sound)}
                    className={cn(
                        "relative overflow-hidden h-48 rounded-3xl border p-6 flex flex-col justify-between cursor-pointer transition-all duration-300 group select-none",
                        activeSound === sound.id 
                            ? "bg-white/10 border-white/20 scale-[1.02] shadow-2xl" 
                            : "bg-zinc-900/50 border-white/5 hover:border-white/10 hover:bg-zinc-900/80"
                    )}
                >
                    {activeSound === sound.id && (
                        <div className={cn("absolute inset-0 opacity-20 blur-3xl", sound.bg)} />
                    )}

                    <div className="flex justify-between items-start relative z-10">
                        <div className={cn("p-3 rounded-full transition-colors", sound.bg, sound.color)}>
                            <sound.icon className="w-6 h-6" />
                        </div>
                        <div className={cn("p-2 rounded-full", activeSound === sound.id ? "bg-white text-black" : "bg-white/5 text-white")}>
                            {activeSound === sound.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                        </div>
                    </div>

                    <div className="relative z-10">
                        <h3 className="text-xl font-medium tracking-tight">{sound.label}</h3>
                        <div className="flex items-center gap-2 mt-2 text-xs text-zinc-500">
                            <Volume2 className="w-3 h-3" />
                            <span>{activeSound === sound.id ? "Playing" : "Tap to play"}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
}
