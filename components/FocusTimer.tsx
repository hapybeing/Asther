"use client";

import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, CheckCircle2, ChevronDown, ListTodo, MoreHorizontal } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase inside the component for direct access
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Task = { id: number; title: string; is_completed: boolean; };

export function FocusTimer() {
  // TIMER STATE
  const [duration, setDuration] = useState(25 * 60);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [customMinutes, setCustomMinutes] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  // SESSION STATE
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  
  // TASK INTEGRATION STATE
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [manualIntent, setManualIntent] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 1. Fetch Tasks on Load
  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        const { data } = await supabase.from('tasks').select('*').eq('user_id', user.id).eq('is_completed', false).order('id', { ascending: false });
        if (data) setTasks(data);
    }
  }

  // 2. Timer Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      setSessionsCompleted(prev => prev + 1);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  // 3. Formatters & Handlers
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
    setShowCustomInput(false);
  };

  const applyCustomTime = () => {
    const val = Number(customMinutes);
    if (val && !isNaN(val)) setTimerDuration(val);
  };

  // 4. "The Interconnectivity" - Completing a task from the Timer
  async function completeSelectedTask() {
    if (!selectedTask) return;
    
    // Optimistic Update (Remove from list immediately)
    setTasks(tasks.filter(t => t.id !== selectedTask.id));
    setSelectedTask(null);
    setManualIntent(""); // Reset input

    // Database Update
    await supabase.from('tasks').update({ is_completed: true }).eq('id', selectedTask.id);
  }

  // Progress Ring Math
  const progress = ((duration - timeLeft) / duration) * 100;
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="h-full min-h-[22rem] rounded-[2.5rem] bg-zinc-900/40 backdrop-blur-xl border border-white/5 p-8 lg:p-10 relative overflow-hidden shadow-2xl flex flex-col lg:flex-row items-center gap-10 group">
      
      {/* Background Glow */}
      <div className={`absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[100px] transition-all duration-1000 ${isActive ? 'bg-purple-500/30' : ''}`} />

      {/* LEFT SIDE: THE CLOCK */}
      <div className="relative flex-shrink-0">
        <div className="relative w-64 h-64 flex items-center justify-center">
             <svg className="absolute w-full h-full rotate-[-90deg]">
                <circle cx="128" cy="128" r={radius} stroke="currentColor" strokeWidth="4" fill="transparent" className="text-zinc-800" />
             </svg>
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
             
             {/* Digital Time & Controls */}
             <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <div className={`text-6xl font-thin tracking-tighter tabular-nums transition-colors ${isActive ? 'text-white' : 'text-zinc-500'}`}>
                    {formatTime(timeLeft)}
                </div>
                
                {/* IMPROVED PRESETS */}
                <div className="mt-4 flex items-center gap-2">
                    <button onClick={() => setTimerDuration(25)} className="text-xs px-3 py-1.5 rounded-full border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition">25m</button>
                    <button onClick={() => setTimerDuration(45)} className="text-xs px-3 py-1.5 rounded-full border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition">45m</button>
                    
                    {/* BIGGER CUSTOM BUTTON */}
                    {!showCustomInput ? (
                        <button 
                            onClick={() => setShowCustomInput(true)}
                            className="text-xs px-3 py-1.5 rounded-full border border-white/10 text-zinc-400 hover:text-purple-400 hover:border-purple-500/30 hover:bg-purple-500/10 transition flex items-center gap-1"
                        >
                            <MoreHorizontal className="w-3 h-3" />
                        </button>
                    ) : (
                        <div className="flex items-center gap-1 animate-in fade-in zoom-in">
                            <input 
                                autoFocus
                                type="number" 
                                value={customMinutes}
                                onChange={(e) => setCustomMinutes(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && applyCustomTime()}
                                className="w-12 text-xs py-1.5 px-2 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:border-purple-500"
                                placeholder="min"
                            />
                            <button onClick={applyCustomTime} className="text-[10px] bg-white text-black px-2 py-1.5 rounded-lg font-bold hover:bg-zinc-200">GO</button>
                        </div>
                    )}
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

        {/* --- THE INTEGRATED MISSION SELECTOR --- */}
        <div className="relative z-50">
            {/* Input Field */}
            <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <ListTodo className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-zinc-600'}`} />
                </div>
                
                <input 
                    type="text" 
                    value={selectedTask ? selectedTask.title : manualIntent}
                    onChange={(e) => {
                        setManualIntent(e.target.value);
                        setSelectedTask(null); // Clear selection if typing
                    }}
                    onFocus={() => { fetchTasks(); setIsDropdownOpen(true); }}
                    // Don't close immediately so we can click items
                    onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)} 
                    placeholder="Select a mission or type focus..."
                    className={`w-full bg-white/5 border rounded-2xl pl-12 pr-10 py-4 text-white placeholder:text-zinc-600 focus:outline-none focus:bg-white/10 transition ${selectedTask ? 'border-purple-500/50 text-purple-100' : 'border-white/10'}`}
                />

                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    <ChevronDown className="w-4 h-4 text-zinc-600" />
                </div>
            </div>

            {/* The Dropdown (Shows active tasks) */}
            {isDropdownOpen && tasks.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 text-[10px] uppercase tracking-widest text-zinc-500 font-bold bg-white/5">
                        Your Active Tasks
                    </div>
                    {tasks.map(task => (
                        <button
                            key={task.id}
                            onClick={() => {
                                setSelectedTask(task);
                                setIsDropdownOpen(false);
                            }}
                            className="w-full text-left px-4 py-3 text-sm text-zinc-300 hover:bg-white/10 hover:text-white transition flex items-center gap-2"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                            {task.title}
                        </button>
                    ))}
                </div>
            )}
        </div>

        {/* Controls Row */}
        <div className="flex gap-4">
            {/* Play/Pause */}
            <button 
                onClick={toggleTimer}
                className={`flex-1 py-4 rounded-2xl flex items-center justify-center gap-2 font-medium transition-all duration-300 ${isActive ? 'bg-white text-black hover:scale-[1.02]' : 'bg-white text-black hover:bg-zinc-200'}`}
            >
                {isActive ? <><Pause className="w-4 h-4 fill-current" /> Pause</> : <><Play className="w-4 h-4 fill-current" /> Start</>}
            </button>
            
            {/* THE COMPLETE TASK BUTTON (Only shows if task is selected) */}
            {selectedTask && (
                <button 
                    onClick={completeSelectedTask}
                    className="flex-1 py-4 rounded-2xl flex items-center justify-center gap-2 font-medium bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition animate-in fade-in slide-in-from-left-2"
                >
                    <CheckCircle2 className="w-4 h-4" />
                    Complete Mission
                </button>
            )}

            {/* Reset Button (Only shows if no task button is taking up space, or we shrink it) */}
            {!selectedTask && (
                <button 
                    onClick={() => setTimerDuration(duration / 60)} 
                    className="p-4 rounded-2xl border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 transition"
                >
                    <RotateCcw className="w-5 h-5" />
                </button>
            )}
        </div>

      </div>
    </div>
  );
}

