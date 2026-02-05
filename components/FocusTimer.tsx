"use client";

import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";

export function FocusTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // Default 25m
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState(25); // Track which button is active

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  // Helper to format 00:00
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const toggleTimer = () => setIsActive(!isActive);

  // Function to change duration
  const setDuration = (minutes: number) => {
    setMode(minutes);
    setTimeLeft(minutes * 60);
    setIsActive(false);
  };

  return (
    <div className="h-64 rounded-3xl bg-zinc-900/50 border border-white/5 p-8 flex flex-col justify-between relative overflow-hidden group">
      
      {/* Background Glow */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-purple-500/20 blur-[80px] transition-all duration-1000 ${isActive ? 'bg-purple-500/40' : ''}`} />

      {/* Header & Reset */}
      <div className="flex justify-between items-start z-10">
        <div className="flex gap-2">
            <button 
                onClick={() => setDuration(25)}
                className={`text-xs px-3 py-1 rounded-full border transition ${mode === 25 ? 'bg-white text-black border-white' : 'border-white/10 text-zinc-500 hover:text-white'}`}
            >
                25m
            </button>
            <button 
                onClick={() => setDuration(45)}
                className={`text-xs px-3 py-1 rounded-full border transition ${mode === 45 ? 'bg-white text-black border-white' : 'border-white/10 text-zinc-500 hover:text-white'}`}
            >
                45m
            </button>
            <button 
                onClick={() => setDuration(60)}
                className={`text-xs px-3 py-1 rounded-full border transition ${mode === 60 ? 'bg-white text-black border-white' : 'border-white/10 text-zinc-500 hover:text-white'}`}
            >
                60m
            </button>
        </div>
        
        <button 
            onClick={() => setDuration(mode)} // Reset to current mode
            className="text-zinc-600 hover:text-white transition"
        >
            <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* The Big Timer */}
      <div className="text-center z-10 my-4">
        <div className={`text-7xl font-light tracking-tighter transition-colors duration-500 ${isActive ? 'text-white' : 'text-zinc-500'}`}>
            {formatTime(timeLeft)}
        </div>
        <p className="text-zinc-500 text-sm mt-2 font-medium tracking-wide animate-pulse">
            {isActive ? "FLOW STATE ACTIVE" : "READY TO FOCUS?"}
        </p>
      </div>

      {/* Play/Pause Button */}
      <button 
        onClick={toggleTimer}
        className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 font-medium transition-all duration-300 z-10 ${isActive ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-white text-black hover:bg-zinc-200'}`}
      >
        {isActive ? (
            <>
                <Pause className="w-4 h-4 fill-current" /> Pause Session
            </>
        ) : (
            <>
                <Play className="w-4 h-4 fill-current" /> Start Focus
            </>
        )}
      </button>
    </div>
  );
}
