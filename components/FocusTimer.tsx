"use client";

import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, CheckCircle2, ChevronDown, ListTodo, MoreHorizontal } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Task = { id: number; title: string; is_completed: boolean; };

export function FocusTimer() {
  const [duration, setDuration] = useState(25 * 60);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [customMinutes, setCustomMinutes] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [manualIntent, setManualIntent] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // FETCH & SUBSCRIBE
  useEffect(() => { 
    fetchTasks(); 

    const channel = supabase
      .channel('timer-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => {
        fetchTasks(); 
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); }
  }, []);

  async function fetchTasks() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        const { data } = await supabase.from('tasks').select('*').eq('user_id', user.id).eq('is_completed', false).order('id', { ascending: false });
        if (data) setTasks(data);
    }
  }

  // Timer Logic
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

  async function completeSelectedTask() {
    if (!selectedTask) return;
    
    // 1. STOP & RESET TIMER (The New Fix)
    setIsActive(false);
    setTimeLeft(duration); // Reset time to full

    // 2. Remove Task from UI
    setTasks(tasks.filter(t => t.id !== selectedTask.id));
    const taskToComplete = selectedTask;
    setSelectedTask(null);
    setManualIntent(""); 

    // 3. Update Database
    await supabase.from('tasks').update({ is_completed: true }).eq('id', taskToComplete.id);
  }

  const progress = ((duration - timeLeft) / duration) * 100;
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="h-full min-h-[22rem] rounded-[2.5rem] bg-zinc-900/40 backdrop-blur-xl border border-white/5 p-8 lg:p-10 relative shadow-2xl flex flex-col lg:flex-row items-center gap-10 group">
      
      {/* GLOW LAYER */}
      <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden pointer-events-none">
          <div className={`absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[100px] transition-all duration-1000 ${isActive ? 'bg-purple-500/30' : ''}`} />
      </div>

      {/* CLOCK */}
      <div className="relative flex-shrink-0 z-10">
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
             
             <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <div className={`text-6xl font-thin tracking-tighter tabular-nums transition-colors ${isActive ? 'text-white' : 'text-zinc-500'}`}>
                    {formatTime(timeLeft)}
                </div>
                
                <div className="mt-4 flex items-center gap-2 pointer-events-auto">
                    <button onClick={() => setTimerDuration(25)} className="text-xs px-3 py-1.5 rounded-full border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition">25m</button>
                    <button onClick={() => setTimerDuration(45)} className="text-xs px-3 py-1.5 rounded-full border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition">45m</button>
                    
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

      {/* CONTROLS */}
      <div className="flex-1 w-full flex flex-col justify-center gap-6 z-10">
        <div className="space-y-1">
            <h2 className="text-2xl font-light text-white tracking-tight">Focus Session</h2>
            <div className="flex items-center gap-2 text-zinc-500 text-xs uppercase tracking-widest font-bold">
                <CheckCircle2 className="w-3 h-3 text-green-500" />
                <span>{sessionsCompleted} Sessions Completed Today</span>
            </div>
        </div>

        <div className="relative z-50">
            <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <ListTodo className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-zinc-600'}`} />
                </div>
                
                <input 
                    type="text" 
                    value={selectedTask ? selectedTask.title : manualIntent}
                    onChange={(e) => {
                        setManualIntent(e.target.value);
                        setSelectedTask(null);
                    }}
                    onClick={() => { fetchTasks(); setIsDropdownOpen(true); }}
                    onFocus={() => { fetchTasks(); setIsDropdownOpen(true); }}
                    onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)} 
                    placeholder="Select a mission or type focus..."
                    className={`w-full bg-black/50 border rounded-2xl pl-12 pr-10 py-4 text-white placeholder:text-zinc-600 focus:outline-none focus:bg-black/80 transition ${selectedTask ? 'border-purple-500/50 text-purple-100' : 'border-white/10'}`}
                />

                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    <ChevronDown className="w-4 h-4 text-zinc-600" />
                </div>
            </div>

            {isDropdownOpen && tasks.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 z-[100] max-h-60 overflow-y-auto">
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
                            className="w-full text-left px-4 py-3 text-sm text-zinc-300 hover:bg-white/10 hover:text-white transition flex items-center gap-2 border-b border-white/5 last:border-0"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                            {task.title}
                        </button>
                    ))}
                </div>
            )}
            
            {isDropdownOpen && tasks.length === 0 && (
                 <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl p-4 text-center z-[100]">
                    <p className="text-zinc-500 text-xs">No active tasks found in Mission Control.</p>
                 </div>
            )}
        </div>

        <div className="flex gap-4">
            <button 
                onClick={toggleTimer}
                className={`flex-1 py-4 rounded-2xl flex items-center justify-center gap-2 font-medium transition-all duration-300 ${isActive ? 'bg-white text-black hover:scale-[1.02]' : 'bg-white text-black hover:bg-zinc-200'}`}
            >
                {isActive ? <><Pause className="w-4 h-4 fill-current" /> Pause</> : <><Play className="w-4 h-4 fill-current" /> Start</>}
            </button>
            
            {selectedTask ? (
                <button 
                    onClick={completeSelectedTask}
                    className="flex-1 py-4 rounded-2xl flex items-center justify-center gap-2 font-medium bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition animate-in fade-in slide-in-from-left-2"
                >
                    <CheckCircle2 className="w-4 h-4" />
                    Complete
                </button>
            ) : (
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

