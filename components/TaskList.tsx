"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { CheckCircle2, Circle, Plus, Trash2, Dices } from "lucide-react";

type Task = {
  id: number;
  title: string;
  is_completed: boolean;
};

// The "Inspire Me" Database
const RANDOM_TASKS = [
  "Read 10 pages of a book", "Clean your workspace", "Drink a glass of water", 
  "Organize desktop files", "Stretch for 5 minutes", "Write down 3 goals",
  "Reply to important emails", "Review today's notes", "Plan tomorrow's schedule",
  "Meditate for 10 minutes"
];

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchTasks(); }, []);

  async function fetchTasks() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        const { data } = await supabase.from('tasks').select('*').eq('user_id', user.id).order('id', { ascending: true });
        setTasks(data || []);
    }
    setLoading(false);
  }

  async function addTask(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!newTask.trim()) return;

    const title = newTask;
    setNewTask(""); 

    // Optimistic Update
    const tempId = Date.now();
    setTasks([...tasks, { id: tempId, title, is_completed: false }]);

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        const { data } = await supabase.from('tasks').insert([{ title, user_id: user.id }]).select();
        if (data) setTasks((prev) => prev.map(t => t.id === tempId ? data[0] : t));
    }
  }

  // THE RANDOM GENERATOR
  function inspireMe() {
    const random = RANDOM_TASKS[Math.floor(Math.random() * RANDOM_TASKS.length)];
    setNewTask(random);
  }

  async function toggleTask(id: number, currentStatus: boolean) {
    setTasks(tasks.map(t => t.id === id ? { ...t, is_completed: !currentStatus } : t));
    await supabase.from('tasks').update({ is_completed: !currentStatus }).eq('id', id);
  }

  async function deleteTask(id: number, e: React.MouseEvent) {
    e.stopPropagation();
    setTasks(tasks.filter(t => t.id !== id));
    await supabase.from('tasks').delete().eq('id', id);
  }

  if (loading) return <div className="text-zinc-500 text-sm animate-pulse">Syncing...</div>;

  return (
    <div className="flex flex-col h-full">
        
      {/* INPUT FORM */}
      <form onSubmit={addTask} className="mb-6 relative group flex gap-2">
        <div className="relative flex-1">
            <input 
                type="text" 
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Add new mission..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-4 pr-10 py-4 text-sm text-white focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition placeholder:text-zinc-600"
            />
            <button type="submit" className="absolute right-3 top-3.5 text-zinc-500 hover:text-white transition">
                <Plus className="w-5 h-5" />
            </button>
        </div>
        
        {/* THE INSPIRE ME BUTTON */}
        <button 
            type="button"
            onClick={inspireMe}
            className="px-4 bg-white/5 border border-white/10 rounded-2xl text-zinc-500 hover:text-purple-400 hover:bg-purple-500/10 transition"
            title="Give me a random task"
        >
            <Dices className="w-5 h-5" />
        </button>
      </form>

      {/* THE LIST */}
      <div className="space-y-2 overflow-y-auto pr-2 custom-scrollbar flex-1">
        {tasks.length === 0 ? (
          <div className="text-zinc-500 text-sm text-center py-10 opacity-50">No active missions.</div>
        ) : (
          tasks.map((task) => (
            <div 
              key={task.id} 
              onClick={() => toggleTask(task.id, task.is_completed)}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition group cursor-pointer border border-transparent hover:border-white/5"
            >
              <div className="flex items-center gap-3 text-sm text-zinc-300">
                {task.is_completed ? (
                    <CheckCircle2 className="w-5 h-5 text-purple-500 shrink-0" />
                ) : (
                    <Circle className="w-5 h-5 text-zinc-600 group-hover:text-purple-400 transition shrink-0" />
                )}
                <span className={task.is_completed ? "line-through text-zinc-600 transition" : "transition font-medium"}>
                    {task.title}
                </span>
              </div>
              
              <button 
                onClick={(e) => deleteTask(task.id, e)}
                className="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-red-400 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

