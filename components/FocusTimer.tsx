"use client";

import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export function FocusTimer() {
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(25 * 60); // 25 minutes in seconds

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      setIsActive(false);
    }

    return () => clearInterval(interval);
  }, [isActive, time]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTime(25 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Calculate progress for the glowing ring
  const totalTime = 25 * 60;
  const progress = ((totalTime - time) / totalTime) * 100;

  return (
    <div className="relative group col-span-1 md:col-span-2 h-64 rounded-3xl bg-zinc-900/50 border border-white/5 p-8 flex flex-col justify-between hover:border-white/10 transition overflow-hidden">
      
      {/* Background Progress Bar (Subtle Fill) */}
      <div 
        className="absolute bottom-0 left-0 h-1 bg-purple-500/50 transition-all duration-1000" 
        style={{ width: `${progress}%` }}
      />
      
      <div className="flex justify-between items-start relative z-10">
        <button 
            onClick={toggleTimer}
            className={cn(
                "p-3 rounded-full transition-all duration-300 hover:scale-110 active:scale-95",
                isActive ? "bg-red-500/10 text-red-400" : "bg-purple-500/10 text-purple-400"
            )}
        >
            {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
        </button>
        <div className="flex items-center gap-2">
            <span className="text-zinc-500 text-xs uppercase tracking-widest font-bold animate-pulse">
                {isActive ? "Focusing..." : "Ready"}
            </span>
            <button onClick={resetTimer} className="text-zinc-600 hover:text-white transition">
                <RotateCcw className="w-4 h-4" />
            </button>
        </div>
      </div>

      <div className="relative z-10">
        <div className={cn(
            "text-7xl font-mono font-bold tracking-tighter transition-all duration-500",
            isActive ? "text-white glow-text" : "text-zinc-500"
        )}>
            {formatTime(time)}
        </div>
        <p className="text-zinc-500 mt-2 text-sm">
            {isActive ? "Don't break the flow." : "Start a 25m session."}
        </p>
      </div>
    </div>
  );
}
