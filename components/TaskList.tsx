"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { CheckCircle2, Circle } from "lucide-react";

type Task = {
  id: number;
  title: string;
  is_completed: boolean;
};

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch tasks when component loads
  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('Error fetching tasks:', error);
    } else {
      setTasks(data || []);
    }
    setLoading(false);
  }

  // 2. Toggle completion status
  async function toggleTask(id: number, currentStatus: boolean) {
    // Update UI immediately (feels faster)
    setTasks(tasks.map(t => t.id === id ? { ...t, is_completed: !currentStatus } : t));

    // Update Database
    await supabase
      .from('tasks')
      .update({ is_completed: !currentStatus })
      .eq('id', id);
  }

  if (loading) return <div className="text-zinc-500 text-sm animate-pulse">Syncing with HQ...</div>;

  return (
    <div className="space-y-3 h-40 overflow-y-auto pr-2 custom-scrollbar">
      {tasks.length === 0 ? (
        <div className="text-zinc-500 text-sm">No active missions.</div>
      ) : (
        tasks.map((task) => (
          <div 
            key={task.id} 
            onClick={() => toggleTask(task.id, task.is_completed)}
            className="flex items-center gap-3 text-sm text-zinc-300 cursor-pointer group hover:text-white transition"
          >
            {task.is_completed ? (
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
            ) : (
                <Circle className="w-4 h-4 text-zinc-600 group-hover:text-purple-400 transition shrink-0" />
            )}
            <span className={task.is_completed ? "line-through text-zinc-600 transition" : "transition"}>
                {task.title}
            </span>
          </div>
        ))
      )}
    </div>
  );
}
