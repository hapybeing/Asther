import { Play, CheckCircle2, Music, Settings, Plus } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      
      {/* 1. The Zen Sidebar */}
      <aside className="w-20 lg:w-64 border-r border-white/10 bg-zinc-900/50 backdrop-blur-xl flex flex-col items-center lg:items-start py-8 transition-all">
        <div className="mb-10 px-0 lg:px-8">
            <h2 className="text-2xl font-bold hidden lg:block tracking-tighter">Asther.</h2>
            <div className="h-8 w-8 bg-white rounded-full lg:hidden" />
        </div>
        
        {/* Nav Icons */}
        <nav className="flex-1 space-y-6 w-full px-4">
            <NavItem icon={<Play className="w-5 h-5" />} label="Focus Mode" active />
            <NavItem icon={<CheckCircle2 className="w-5 h-5" />} label="Tasks" />
            <NavItem icon={<Music className="w-5 h-5" />} label="Soundscapes" />
            <NavItem icon={<Settings className="w-5 h-5" />} label="Settings" />
        </nav>
      </aside>

      {/* 2. Main Content Area */}
      <main className="flex-1 overflow-auto relative">
        {/* Background Ambient Light */}
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-purple-900/20 to-transparent pointer-events-none" />

        <div className="relative z-10 p-8 lg:p-12 max-w-7xl mx-auto space-y-10">
            
            {/* Header */}
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-light text-white/90">Good Evening, Gaurang.</h1>
                    <p className="text-zinc-500 mt-2">Ready to enter flow state?</p>
                </div>
                <button className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full font-medium hover:bg-zinc-200 transition">
                    <Plus className="w-4 h-4" /> 
                    <span className="hidden sm:inline">New Session</span>
                </button>
            </header>

            {/* Widgets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Card 1: Focus Timer */}
                <div className="col-span-1 md:col-span-2 h-64 rounded-3xl bg-zinc-900/50 border border-white/5 p-8 flex flex-col justify-between hover:border-white/10 transition group cursor-pointer">
                    <div className="flex justify-between items-start">
                        <div className="p-3 bg-purple-500/10 rounded-full text-purple-400 group-hover:text-purple-300 transition">
                            <Play className="w-6 h-6" />
                        </div>
                        <span className="text-zinc-500 text-sm">Deep Work</span>
                    </div>
                    <div>
                        <div className="text-5xl font-mono font-bold tracking-tighter">25:00</div>
                        <p className="text-zinc-500 mt-2">No active session.</p>
                    </div>
                </div>

                {/* Card 2: Quick Tasks */}
                <div className="h-64 rounded-3xl bg-zinc-900/50 border border-white/5 p-8 hover:border-white/10 transition group">
                     <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-blue-500/10 rounded-full text-blue-400">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <span className="text-zinc-500 text-sm">3 Pending</span>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm text-zinc-300">
                            <div className="w-4 h-4 rounded-full border border-zinc-600" />
                            <span>Update portfolio site</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-zinc-300">
                            <div className="w-4 h-4 rounded-full border border-zinc-600" />
                            <span>Read documentation</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-zinc-300">
                            <div className="w-4 h-4 rounded-full border border-zinc-600" />
                            <span>Design system review</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
      </main>
    </div>
  );
}

// Helper Component for Sidebar Items
function NavItem({ icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
    return (
        <div className={`flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all ${active ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}>
            {icon}
            <span className="hidden lg:block font-medium">{label}</span>
        </div>
    )
}
