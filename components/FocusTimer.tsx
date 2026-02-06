"use client";

import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Hash } from "lucide-react";

export function FocusTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [customMinutes, setCustomMinutes] = useState(""); // Store text input

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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const toggleTimer = () => setIsActive(!isActive);

  const setDuration = (minutes: number) => {
    setTimeLeft(minutes * 60);
    setIsActive(false);
    setCustomMinutes(""); // Clear custom input when using preset
  };

  const handleCustomInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomMinutes(val);
    if (val && !isNaN(Number(val))) {
        setTimeLeft(Number(val) * 60);
        setIsActive(false);
    }
  };

  return (
    <div className="h-72 rounded-[2.5rem] bg-zinc-900/40 backdrop-blur-xl border border-white/5 p-8 flex flex-col justify-between relative overflow-hidden group shadow-2xl">
      
      {/* Background Glow */}
      <div className={`absolute top-0 right-0 w-40 h-40 bg-purple-500/20 blur-[80px] transition-all duration-1000 ${isActive ? 'bg-purple-500/40' : ''}`} />

      {/* Controls Row */}
      <div className="flex justify-between items-center z-10">
        <div className="flex gap-2">
            {/* Presets */}
            <button onClick={() => setDuration(25)} className="text-xs px-3 py-1.5 rounded-full border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition">25m</button>
            <button onClick={() => setDuration(45)} className="text-xs px-3 py-1.5 rounded-full border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition">45m</button>
            
            {/* THE NEW CUSTOM INPUT */}
            <div className="relative group/input">
                <Hash className="w-3 h-3 text-zinc-500 absolute left-2.5 top-2" />
                <input 
                    type="number" 
                    placeholder="Custom"
                    value={customMinutes}
                    onChange={handleCustomInput}
                    className="w-20 text-xs pl-7 py-1.5 rounded-full border border-white/10 bg-transparent text-white focus:outline-none focus:border-purple-500/50 focus:bg-white/5 transition placeholder:text-zinc-600"
                />
            </div>
        </div>
        
        <button onClick={() => setDuration(25)} className="text-zinc-600 hover:text-white transition p-2">
            <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* The Digits */}
      <div className="text-center z-10 mt-2">
        <div className={`text-8xl font-thin tracking-tighter transition-colors duration-500 tabular-nums ${isActive ? 'text-white' : 'text-zinc-500'}`}>
            {formatTime(timeLeft)}
        </div>
        <p className="text-zinc-500 text-xs font-bold tracking-[0.2em] uppercase mt-2 animate-pulse">
            {isActive ? "Flow State Active" : "Ready to Focus?"}
        </p>
      </div>

      {/* Action Button */}
      <button 
        onClick={toggleTimer}
        className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-medium transition-all duration-300 z-10 ${isActive ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-white text-black hover:bg-zinc-200 shadow-[0_0_20px_rgba(255,255,255,0.1)]'}`}
      >
        {isActive ? (
            <><Pause className="w-4 h-4 fill-current" /> Pause Session</>
        ) : (
            <><Play className="w-4 h-4 fill-current" /> Start Focus</>
        )}
      </button>
    </div>
  );
}
