"use client";

import { useState, useEffect } from "react";
import { LayoutGrid, Music, LogOut } from "lucide-react"; // Removed 'Plus' icon
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
        // 1. Get the part before @
        let name = user.email?.split("@")[0] || "Traveler";
        // 2. Remove numbers (The Polish Fix)
        name = name.replace(/[0-9]/g, '');
        // 3. Capitalize
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
    <div className="flex h-screen bg-black text-white overflow-hidden font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-20 lg:w-64 border-r border-white/10 bg-zinc-900/50 backdrop-blur-xl flex flex-col items-center lg:items-start py-8 z-50">
        <div className="mb-10 px-0 lg:px-8">
            <h2 className="text-2xl font-bold hidden lg:block tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white to-zinc-500">Asther.</h2>
            <div className="h-8 w-8 bg-white rounded-full lg:hidden" />
        </div>
        
        <nav className="flex-1 space-y-4 w-full px-4">
            <button 
                onClick={() => setActiveTab("dashboard")} 
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-white/10 text-white shadow-inner' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
            >
                <LayoutGrid className="w-5 h-5" />
                <span className="hidden lg:block font-medium">Dashboard</span>
            </button>
            
            <button 
                onClick={() => setActiveTab("soundscapes")} 
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${activeTab === 'soundscapes' ? 'bg-white/10 text-white shadow-inner' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
            >
                <Music className="w-5 h-5" />
                <span className="hidden lg:block font-medium">Soundscapes</span>
            </button>
        </nav>

        <div className="px-4 w-full">
             <button 
                onClick={handleSignOut}
                className="w-full flex items-center gap-4 px-4 py-3 text-zinc-600 hover:text-red-400 transition"
             >
                <LogOut className="w-5 h-5" />
                <span className="hidden lg:block font-medium text-sm">Sign Out</span>
             </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-auto relative">
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-purple-900/20 to-transparent pointer-events-none" />

        <div className="relative z-10 p-8 lg:p-12 max-w-7xl mx-auto space-y-10">
            
            {/* VIEW 1: DASHBOARD */}
            <div className={activeTab === "dashboard" ? "block space-y-10 animate-in fade-in" : "hidden"}>
                
                {/* CLEAN HEADER (No Button, Better Name) */}
                <header>
                    <h1 className="text-4xl font-light text-white/90">Good Evening, {userName}.</h1>
                    <p className="text-zinc-500 mt-2">Ready to enter flow state?</p>
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

            {/* VIEW 2: SOUNDSCAPES */}
            <div className={activeTab === "soundscapes" ? "block" : "hidden"}>
                <Soundscapes />
            </div>

        </div>
      </main>
    </div>
  );
}


