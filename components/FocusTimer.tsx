"use client";

import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Hash, Target, CheckCircle2 } from "lucide-react";

export function FocusTimer() {
  const [duration, setDuration] = useState(25 * 60); // Keep track of total time for progress bar
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [customMinutes, setCustomMinutes] = useState("");
  const [intent, setIntent] = useState(""); // What are you working on?
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      setSessionsCompleted(prev => prev + 1);
      // Optional: Play a "ding" sound here later
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const toggleTimer = () => setIsActive(!isActive);

  const setTimerDuration = (minutes: number) => {
    const seconds = minutes * 60;
    setDuration(seconds);
    setTimeLeft(seconds);
    setIsActive(false);
    setCustomMinutes(""); 
  };

  const handleCustomInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomMinutes(val);
    if (val && !isNaN(Number(val))) {
        setTimerDuration(Number(val));
    }
  };

  // Calculate Progress Percentage for the Ring
  const progress = ((duration - timeLeft) / duration) * 100;
  const radius = 120; // Radius of the circle
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="h-full min-h-[22rem] rounded-[2.5rem] bg-zinc-900/40 backdrop-blur-xl border border-white/5 p-8 lg:p-10 relative overflow-hidden shadow-2xl flex flex-col lg:flex-row items-center gap-10 group">
      
      {/* Background Glow */}
      <div className={`absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[100px] transition-all duration-1000 ${isActive ? 'bg-purple-500/30' : ''}`} />

      {/* LEFT SIDE: THE CLOCK */}
      <div className="relative flex-shrink-0">
        {/* SVG Progress Ring */}
        <div className="relative w-64 h-64 flex items-center justify-center">
             {/* Background Circle */}
             <svg className="absolute w-full h-full rotate-[-90deg]">
                <circle cx="128" cy="128" r={radius} stroke="currentColor" strokeWidth="4" fill="transparent" className="text-zinc-800" />
             </svg>
             {/* Active Progress Circle */}
             <svg className="absolute w-full h-full rotate-[-90deg]">
                <circle 
                    cx="128" cy="128" r={radius} 
                    stroke="currentColor" strokeWidth="4" fill="transparent" 
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className={`text-white transition-all duration-1000 ease-linear ${isActive ? 'opacity-100' : 'opacity-30'}`}
                />
             </svg>
             
             {/* Digital Time */}
             <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <div className={`text-6xl font-thin tracking-tighter tabular-nums transition-colors ${isActive ? 'text-white' : 'text-zinc-500'}`}>
                    {formatTime(timeLeft)}
                </div>
                <div className="mt-2 flex gap-2">
                    <button onClick={() => setTimerDuration(25)} className="text-[10px] px-2 py-1 rounded-full border border-white/10 text-zinc-500 hover:text-white transition">25</button>
                    <button onClick={() => setTimerDuration(45)} className="text-[10px] px-2 py-1 rounded-full border border-white/10 text-zinc-500 hover:text-white transition">45</button>
                    <div className="relative group/input">
                         <Hash className="w-3 h-3 text-zinc-600 absolute left-1.5 top-1.5" />
                         <input 
                            type="number" 
                            placeholder="" 
                            value={customMinutes}
                            onChange={handleCustomInput}
                            className="w-10 text-[10px] pl-5 py-1 rounded-full border border-white/10 bg-transparent text-white focus:outline-none focus:border-purple-500/50"
                        />
                    </div>
                </div>
             </div>
        </div>
      </div>

      {/* RIGHT SIDE: THE COCKPIT */}
      <div className="flex-1 w-full flex flex-col justify-center gap-6 z-10">
        
        {/* Header Section */}
        <div className="space-y-1">
            <h2 className="text-2xl font-light text-white tracking-tight">Focus Session</h2>
            <div className="flex items-center gap-2 text-zinc-500 text-xs uppercase tracking-widest font-bold">
                <CheckCircle2 className="w-3 h-3 text-green-500" />
                <span>{sessionsCompleted} Sessions Completed Today</span>
            </div>
        </div>

        {/* Intent Input (The "Groundbreaking" Feature) */}
        <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Target className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-zinc-600'}`} />
            </div>
            <input 
                type="text" 
                value={intent}
                onChange={(e) => setIntent(e.target.value)}
                placeholder="What is your main focus?"
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/20 focus:bg-white/10 transition"
            />
        </div>

        {/* Main Controls */}
        <div className="flex gap-4">
            <button 
                onClick={toggleTimer}
                className={`flex-1 py-4 rounded-2xl flex items-center justify-center gap-2 font-medium transition-all duration-300 ${isActive ? 'bg-white text-black hover:scale-[1.02]' : 'bg-white text-black hover:bg-zinc-200'}`}
            >
                {isActive ? (
                    <><Pause className="w-4 h-4 fill-current" /> Pause</>
                ) : (
                    <><Play className="w-4 h-4 fill-current" /> Start</>
                )}
            </button>
            
            <button 
                onClick={() => setTimerDuration(duration / 60)} // Reset
                className="p-4 rounded-2xl border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 transition"
            >
                <RotateCcw className="w-5 h-5" />
            </button>
        </div>

      </div>
    </div>
  );
}

