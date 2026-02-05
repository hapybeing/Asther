"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { CheckCircle2, Circle, Plus, Trash2 } from "lucide-react";

type Task = {
  id: number;
  title: string;
  is_completed: boolean;
};

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState(""); // State for the input box
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    const { data } = await supabase
      .from('tasks')
      .select('*')
      .order('id', { ascending: true });
    setTasks(data || []);
    setLoading(false);
  }

  // 1. ADD TASK FUNCTION
  async function addTask(e: React.FormEvent) {
    e.preventDefault(); // Stop page refresh
    if (!newTask.trim()) return;

    const title = newTask;
    setNewTask(""); // Clear input immediately

    // Optimistic update (Show it instantly before database responds)
    const tempId = Date.now();
    setTasks([...tasks, { id: tempId, title, is_completed: false }]);

    // Send to Database
    const { data, error } = await supabase
        .from('tasks')
        .insert([{ title }])
        .select();

    // If successful, update with the REAL ID from database
    if (data) {
        setTasks((prev) => prev.map(t => t.id === tempId ? data[0] : t));
    }
  }

  // 2. TOGGLE FUNCTION
  async function toggleTask(id: number, currentStatus: boolean) {
    setTasks(tasks.map(t => t.id === id ? { ...t, is_completed: !currentStatus } : t));
    await supabase.from('tasks').update({ is_completed: !currentStatus }).eq('id', id);
  }

  // 3. DELETE FUNCTION (Bonus!)
  async function deleteTask(id: number, e: React.MouseEvent) {
    e.stopPropagation(); // Stop clicking the task row
    setTasks(tasks.filter(t => t.id !== id));
    await supabase.from('tasks').delete().eq('id', id);
  }

  if (loading) return <div className="text-zinc-500 text-sm animate-pulse">Syncing with HQ...</div>;

  return (
    <div className="flex flex-col h-full">
        
      {/* THE NEW INPUT FORM */}
      <form onSubmit={addTask} className="mb-4 relative group">
        <input 
            type="text" 
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add new mission..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-10 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition placeholder:text-zinc-600"
        />
        <button type="submit" className="absolute right-3 top-2.5 text-zinc-500 hover:text-white transition">
            <Plus className="w-5 h-5" />
        </button>
      </form>

      {/* THE LIST */}
      <div className="space-y-2 overflow-y-auto pr-2 custom-scrollbar flex-1">
        {tasks.length === 0 ? (
          <div className="text-zinc-500 text-sm text-center py-4">No active missions.</div>
        ) : (
          tasks.map((task) => (
            <div 
              key={task.id} 
              onClick={() => toggleTask(task.id, task.is_completed)}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition group cursor-pointer"
            >
              <div className="flex items-center gap-3 text-sm text-zinc-300">
                {task.is_completed ? (
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                ) : (
                    <Circle className="w-4 h-4 text-zinc-600 group-hover:text-purple-400 transition shrink-0" />
                )}
                <span className={task.is_completed ? "line-through text-zinc-600 transition" : "transition"}>
                    {task.title}
                </span>
              </div>
              
              {/* Delete Button (Hidden until hover) */}
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
