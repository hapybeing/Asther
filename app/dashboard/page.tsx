"use client";

import { useState } from "react";
import { LayoutGrid, Music, Settings, Plus, LogOut } from "lucide-react";
import { FocusTimer } from "@/components/FocusTimer";
import { TaskList } from "@/components/TaskList";
import { Soundscapes } from "@/components/Soundscapes"; 

export default function Dashboard() {
  // STATE: This controls the view. Default is 'dashboard'.
  const [activeTab, setActiveTab] = useState<"dashboard" | "soundscapes">("dashboard");
  const userName = "Gaurang"; 

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-20 lg:w-64 border-r border-white/10 bg-zinc-900/50 backdrop-blur-xl flex flex-col items-center lg:items-start py-8 z-50">
        <div className="mb-10 px-0 lg:px-8">
            <h2 className="text-2xl font-bold hidden lg:block tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white to-zinc-500">Asther.</h2>
            <div className="h-8 w-8 bg-white rounded-full lg:hidden" />
        </div>
        
        <nav className="flex-1 space-y-4 w-full px-4">
            {/* BUTTON 1: Dashboard */}
            <button 
                onClick={() => setActiveTab("dashboard")} 
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-white/10 text-white shadow-inner' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
            >
                <LayoutGrid className="w-5 h-5" />
                <span className="hidden lg:block font-medium">Dashboard</span>
            </button>
            
            {/* BUTTON 2: Soundscapes */}
            <button 
                onClick={() => setActiveTab("soundscapes")} 
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${activeTab === 'soundscapes' ? 'bg-white/10 text-white shadow-inner' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
            >
                <Music className="w-5 h-5" />
                <span className="hidden lg:block font-medium">Soundscapes</span>
            </button>
        </nav>

        {/* Fake Sign Out */}
        <div className="px-4 w-full">
             <div className="flex items-center gap-4 px-4 py-3 text-zinc-600 hover:text-white transition cursor-not-allowed opacity-50">
                <LogOut className="w-5 h-5" />
                <span className="hidden lg:block font-medium text-sm">Sign Out</span>
             </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-auto relative">
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-purple-900/20 to-transparent pointer-events-none" />

        <div className="relative z-10 p-8 lg:p-12 max-w-7xl mx-auto space-y-10">
            
            {/* VIEW 1: DASHBOARD (Hidden when inactive, but ALIVE) */}
            <div className={activeTab === "dashboard" ? "block space-y-10 animate-in fade-in" : "hidden"}>
                
                <header className="flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-light text-white/90">Good Evening, {userName}.</h1>
                        <p className="text-zinc-500 mt-2">Ready to enter flow state?</p>
                    </div>
                    <button className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full font-medium hover:bg-zinc-200 transition shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                        <Plus className="w-4 h-4" /> 
                        <span className="hidden sm:inline">New Session</span>
                    </button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FocusTimer /> 
                    
                    <div className="h-64 rounded-3xl bg-zinc-900/50 border border-white/5 p-8 hover:border-white/10 transition group flex flex-col">
                        <div className="flex justify-between items-start mb-6">
                            <span className="text-blue-400 font-bold tracking-widest text-xs uppercase">Mission Log</span>
                            <span className="text-zinc-500 text-xs">Supabase Connected</span>
                        </div>
                        <TaskList /> 
                    </div>
                </div>
            </div>

            {/* VIEW 2: SOUNDSCAPES (Hidden when inactive) */}
            <div className={activeTab === "soundscapes" ? "block" : "hidden"}>
                <Soundscapes />
            </div>

        </div>
      </main>
    </div>
  );
}


