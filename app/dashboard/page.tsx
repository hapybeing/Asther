"use client";

import { useState, useEffect } from "react";
import { LayoutGrid, Music, LogOut, Sparkles } from "lucide-react";
import { FocusTimer } from "@/components/FocusTimer";
import { TaskList } from "@/components/TaskList";
import { Soundscapes } from "@/components/Soundscapes";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Dashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"dashboard" | "soundscapes">("dashboard");
  const [userName, setUserName] = useState("Traveler");

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
      } else {
        let name = user.email?.split("@")[0] || "Traveler";
        name = name.replace(/[0-9]/g, '');
        setUserName(name.charAt(0).toUpperCase() + name.slice(1));
      }
    }
    getUser();
  }, [router]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden font-sans selection:bg-purple-500/30">
      
      {/* --- AESTHETIC UPGRADE: BACKGROUND AMBIENCE --- */}
      {/* These fixed glow orbs make the dashboard feel alive, not just black */}
      <div className="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-900/20 blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-900/10 blur-[120px] pointer-events-none z-0" />
      
      {/* SIDEBAR */}
      <aside className="w-20 lg:w-64 border-r border-white/5 bg-black/40 backdrop-blur-2xl flex flex-col items-center lg:items-start py-8 z-50">
        <div className="mb-12 px-0 lg:px-8">
            <h2 className="text-2xl font-bold hidden lg:block tracking-tighter text-white">Asther.</h2>
            <div className="h-10 w-10 bg-white rounded-full lg:hidden flex items-center justify-center">
                <span className="text-black font-bold text-xs tracking-tighter">A.</span>
            </div>
        </div>
        
        <nav className="flex-1 space-y-2 w-full px-3">
            <button 
                onClick={() => setActiveTab("dashboard")} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${activeTab === 'dashboard' ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}`}
            >
                <LayoutGrid className="w-5 h-5 transition-transform group-hover:scale-110" />
                <span className="hidden lg:block font-medium text-sm tracking-tight">Dashboard</span>
            </button>
            
            <button 
                onClick={() => setActiveTab("soundscapes")} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${activeTab === 'soundscapes' ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}`}
            >
                <Music className="w-5 h-5 transition-transform group-hover:scale-110" />
                <span className="hidden lg:block font-medium text-sm tracking-tight">Soundscapes</span>
            </button>
        </nav>

        <div className="px-3 w-full">
             <button 
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-3 text-zinc-600 hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-all duration-300"
             >
                <LogOut className="w-5 h-5" />
                <span className="hidden lg:block font-medium text-sm tracking-tight">Sign Out</span>
             </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-auto relative z-10">
        
        <div className="relative p-8 lg:p-16 max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700 slide-in-from-bottom-4">
            
            {/* VIEW 1: DASHBOARD */}
            <div className={activeTab === "dashboard" ? "block space-y-10" : "hidden"}>
                
                <header className="space-y-2">
                    {/* Updated Typography: Lighter weight, tighter tracking */}
                    <div className="flex items-center gap-3 mb-2">
                        <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest text-zinc-400 font-medium">
                            {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
                        </span>
                    </div>
                    <h1 className="text-5xl lg:text-6xl font-thin tracking-tighter text-white/90">
                        Good Evening, <span className="font-normal text-white">{userName}</span>.
                    </h1>
                    <p className="text-zinc-500 text-lg font-light tracking-tight flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        Ready to enter flow state?
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Focus Timer (The component itself handles its own look, but we wrap it for layout) */}
                    <FocusTimer /> 
                    
                    {/* Mission Log - Enhanced Glass Look */}
                    <div className="min-h-[16rem] rounded-[2rem] bg-zinc-900/40 backdrop-blur-xl border border-white/5 p-8 hover:border-white/10 transition duration-500 group flex flex-col shadow-2xl shadow-black/20">
                        <div className="flex justify-between items-center mb-8">
                            <div className="flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] animate-pulse" />
                                <span className="text-zinc-300 font-medium tracking-tight text-sm">Mission Log</span>
                            </div>
                            <span className="text-zinc-600 text-xs tracking-widest uppercase font-semibold">Synced</span>
                        </div>
                        <div className="flex-1">
                            <TaskList /> 
                        </div>
                    </div>
                </div>
            </div>

            {/* VIEW 2: SOUNDSCAPES */}
            <div className={activeTab === "soundscapes" ? "block" : "hidden"}>
                <Soundscapes />
            </div>

        </div>
      </main>
    </div>
  );
}


