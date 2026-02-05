import { cn } from "@/lib/utils";
import Link from "next/link"; // <--- This is the new part

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center relative overflow-hidden bg-black text-white">
      
      {/* 1. The Ambient Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[120px] animate-pulse delay-75" />
      </div>

      {/* 2. The Glass Container */}
      <div className="relative z-10 w-full max-w-2xl px-4">
        <div className="group relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
          
          <div className="relative bg-zinc-900/90 ring-1 ring-white/10 backdrop-blur-xl rounded-xl p-10 text-center space-y-6">
            
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
              Asther.
            </h1>
            
            <p className="text-lg text-zinc-400 font-light max-w-md mx-auto leading-relaxed">
              Your digital sanctuary. Focus, manage, and create in a space designed for flow.
            </p>

            <div className="pt-4">
              {/* This is the new Link Wrapper */}
              <Link href="/dashboard">
                  <button className="px-8 py-3 rounded-full bg-white text-black font-medium hover:bg-zinc-200 transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                    Enter Workspace
                  </button>
              </Link>
            </div>

          </div>
        </div>
      </div>
      
      <div className="absolute bottom-10 text-xs text-zinc-600 uppercase tracking-widest">
        System Online • V 1.0
      </div>

    </main>
  );
}
