"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, CheckCircle2, Circle, Dices } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Task = {
  id: string;
  text: string;
  completed: boolean;
};

const SUGGESTIONS = [
  "Drink a glass of water",
  "Read 10 pages",
  "Stretch for 5 minutes",
  "Write down 3 goals",
  "Clean your workspace",
  "Meditate for 10 mins",
  "Check emails",
  "Plan tomorrow's schedule",
  "Call a friend",
  "No phone for 1 hour"
];

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (data) setTasks(data);
    setLoading(false);
  }

  async function addTask(text: string) {
    if (!text.trim()) return;
    
    const tempId = Math.random().toString();
    const task = { id: tempId, text, completed: false };
    setTasks([task, ...tasks]);
    setNewTask("");

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("tasks")
      .insert([{ text, user_id: user.id }])
      .select()
      .single();

    if (data) {
        setTasks((prev) => prev.map(t => t.id === tempId ? data : t));
    }
  }

  async function toggleTask(id: string, currentStatus: boolean) {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !currentStatus } : t));
    await supabase.from("tasks").update({ completed: !currentStatus }).eq("id", id);
  }

  async function deleteTask(id: string) {
    setTasks(tasks.filter(t => t.id !== id));
    await supabase.from("tasks").delete().eq("id", id);
  }

  function addRandomTask() {
    const random = SUGGESTIONS[Math.floor(Math.random() * SUGGESTIONS.length)];
    addTask(random);
  }

  return (
    <div className="h-full flex flex-col">
      {/* Input Container - Already optimized for mobile */}
      <div className="flex items-center gap-2 mb-6 w-full">
        <div className="relative flex-1 group">
            <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask(newTask)}
            placeholder="Add new mission..."
            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder:text-zinc-600 focus:outline-none focus:border-purple-500/50 transition-all text-sm md:text-base"
            />
            <button 
                onClick={() => addTask(newTask)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition"
            >
                <Plus className="w-5 h-5" />
            </button>
        </div>
        
        <button 
            onClick={addRandomTask}
            className="p-3 bg-white/5 border border-white/10 rounded-xl text-zinc-400 hover:text-purple-400 hover:border-purple-500/30 transition-all shrink-0" 
        >
            <Dices className="w-5 h-5" />
        </button>
      </div>

      {/* Task List - NOW FIXING THE TEXT CUTOFF */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar pb-20"> {/* Added pb-20 for scrolling space */}
        {loading && <p className="text-zinc-600 text-center mt-10 animate-pulse text-sm">Loading missions...</p>}
        
        {!loading && tasks.length === 0 && (
            <div className="text-center mt-10 space-y-2">
                <p className="text-zinc-500 text-sm">No active missions.</p>
                <button onClick={addRandomTask} className="text-xs text-purple-400 hover:underline">Generate one?</button>
            </div>
        )}

        {tasks.map((task) => (
          <div 
            key={task.id} 
            className="group flex items-start justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all animate-in fade-in slide-in-from-bottom-2 duration-300 min-h-[3.5rem]"
          >
            <div className="flex items-start gap-3 w-full"> {/* Changed items-center to items-start for multiline */}
                <button 
                    onClick={() => toggleTask(task.id, task.completed)}
                    className={`shrink-0 mt-0.5 transition-all duration-300 ${task.completed ? "text-green-400 scale-110" : "text-zinc-600 hover:text-purple-400"}`}
                >
                    {task.completed ? <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6" /> : <Circle className="w-5 h-5 md:w-6 md:h-6" />}
                </button>
                
                {/* --- THE FIX: Removed 'truncate', added 'break-words' --- */}
                <span 
                    onClick={() => toggleTask(task.id, task.completed)}
                    className={`text-sm md:text-base break-words w-full pr-2 leading-tight transition-all duration-300 cursor-pointer ${task.completed ? "text-zinc-600 line-through decoration-zinc-700" : "text-zinc-200"}`}
                >
                    {task.text}
                </span>
            </div>
            
            <button 
                onClick={() => deleteTask(task.id)}
                className="opacity-100 md:opacity-0 group-hover:opacity-100 p-2 text-zinc-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-300 shrink-0 -mt-1 -mr-2"
            >
                <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
