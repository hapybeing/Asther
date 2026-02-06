"use client";

import { useState, useEffect } from "react";
import { LayoutGrid, Music, LogOut, Sparkles, Quote, CheckCircle2 } from "lucide-react";
import { FocusTimer } from "@/components/FocusTimer";
import { TaskList } from "@/components/TaskList";
import { Soundscapes } from "@/components/Soundscapes";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const QUOTES = [
  { text: "The art of being wise is the art of knowing what to overlook.", author: "William James" },
  { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
  { text: "Focus is a matter of deciding what things you're not going to do.", author: "John Carmack" },
  { text: "Flow is being completely involved in an activity for its own sake.", author: "Mihaly Csikszentmihalyi" },
  { text: "Do less, but better.", author: "Dieter Rams" },
  { text: "Silence is a source of great strength.", author: "Lao Tzu" }
];

export default function Dashboard() {
  const router = useRouter();
  // NOW HAS 3 STATES
  const [activeTab, setActiveTab] = useState<"dashboard" | "tasks" | "soundscapes">("dashboard");
  const [userName, setUserName] = useState<string | null>(null);
  const [quote, setQuote] = useState(QUOTES[0]);

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
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  }, [router]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  // Sidebar Button Component for reuse
  const SidebarBtn = ({ id, icon: Icon, label }: { id: typeof activeTab, icon: any, label: string }) => (
    <button 
        onClick={() => setActiveTab(id)} 
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${activeTab === id ? 'bg-white/10 text-white border border-white/5' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5 border border-transparent'}`}
    >
        <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
        <span className="hidden lg:block font-medium text-sm tracking-tight">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden font-sans selection:bg-purple-500/30 relative">
      
      {/* GRID BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-zinc-950" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_200px,#3b07641a,transparent)]" />
      </div>

      {/* SIDEBAR */}
      <aside className="w-20 lg:w-64 border-r border-white/5 bg-black/20 backdrop-blur-xl flex flex-col items-center lg:items-start py-8 z-50">
        <div className="mb-12 px-0 lg:px-8">
            <h2 className="text-2xl font-bold hidden lg:block tracking-tighter text-white">Asther.</h2>
            <div className="h-10 w-10 bg-white rounded-full lg:hidden flex items-center justify-center">
                <span className="text-black font-bold text-xs tracking-tighter">A.</span>
            </div>
        </div>
        
        <nav className="flex-1 space-y-2 w-full px-3">
            <SidebarBtn id="dashboard" icon={LayoutGrid} label="Dashboard" />
            {/* NEW TASKS BUTTON */}
            <SidebarBtn id="tasks" icon={CheckCircle2} label="Tasks" />
            <SidebarBtn id="soundscapes" icon={Music} label="Soundscapes" />
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
                    <div className="flex items-center gap-3 mb-2">
                        <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest text-zinc-400 font-medium">
                            {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
                        </span>
                    </div>
                    <h1 className="text-5xl lg:text-6xl font-thin tracking-tighter text-white/90">
                        Good Evening, {" "}
                        {userName ? <span className="font-normal text-white animate-in fade-in duration-500">{userName}</span> : <span className="inline-block w-64 h-12 bg-white/10 rounded-xl animate-pulse align-bottom ml-2" />}.
                    </h1>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FocusTimer /> 

                    <div className="min-h-[16rem] rounded-[2rem] bg-zinc-900/30 backdrop-blur-md border border-white/5 p-8 hover:border-white/10 transition duration-500 flex flex-col justify-between group shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition duration-500"><Quote className="w-24 h-24 text-white" /></div>
                        <div className="flex justify-between items-start"><span className="p-3 bg-white/5 rounded-full text-zinc-400"><Sparkles className="w-5 h-5" /></span></div>
                        <div className="relative z-10">
                            <p className="text-xl font-light leading-relaxed text-white/90 italic tracking-tight">"{quote.text}"</p>
                            <p className="mt-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">— {quote.author}</p>
                        </div>
                    </div>
                    
                    {/* MINI MISSION LOG (Kept on dashboard for quick glance) */}
                    <div className="min-h-[16rem] rounded-[2rem] bg-zinc-900/30 backdrop-blur-md border border-white/5 p-8 hover:border-white/10 transition duration-500 group flex flex-col shadow-xl">
                        <div className="flex justify-between items-center mb-8">
                            <div className="flex items-center gap-3"><div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] animate-pulse" /><span className="text-zinc-300 font-medium tracking-tight text-sm">Mission Log</span></div>
                            <span className="text-zinc-600 text-xs tracking-widest uppercase font-semibold">Preview</span>
                        </div>
                        <div className="flex-1 opacity-60 hover:opacity-100 transition">
                            <TaskList /> 
                        </div>
                    </div>
                </div>
            </div>

            {/* VIEW 2: TASKS (FULL SCREEN) */}
            <div className={activeTab === "tasks" ? "block space-y-10" : "hidden"}>
                <header>
                    <h1 className="text-4xl font-light text-white/90">Mission Control.</h1>
                    <p className="text-zinc-500 mt-2">Manage your daily objectives.</p>
                </header>
                <div className="w-full max-w-3xl">
                     <div className="rounded-[2.5rem] bg-zinc-900/30 backdrop-blur-md border border-white/5 p-10 min-h-[500px] flex flex-col shadow-2xl">
                        <TaskList />
                     </div>
                </div>
            </div>

            {/* VIEW 3: SOUNDSCAPES */}
            <div className={activeTab === "soundscapes" ? "block" : "hidden"}>
                <Soundscapes />
            </div>

        </div>
      </main>
    </div>
  );
}



