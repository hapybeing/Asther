"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, Smartphone, Download } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert("Check your email to confirm sign up!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Main Card */}
      <div className="w-full max-w-md bg-zinc-900/30 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-500 shadow-lg mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-light text-white tracking-tight">Asther.</h1>
          <p className="text-zinc-500 text-sm">Your digital sanctuary for deep focus.</p>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-2">
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email" 
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-purple-500/50 transition"
              required
            />
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password" 
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-purple-500/50 transition"
              required
            />
          </div>

          {error && <div className="text-red-400 text-xs text-center">{error}</div>}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-white text-black font-medium py-3 rounded-xl hover:bg-zinc-200 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? "Processing..." : (isSignUp ? "Create Account" : "Enter Workspace")}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-zinc-500 text-xs hover:text-white transition"
          >
            {isSignUp ? "Already have an account? Sign In" : "First time? Create an account"}
          </button>
        </div>

        {/* --- THE DOWNLOAD BUTTON --- */}
        <div className="mt-8 pt-8 border-t border-white/5">
            <a 
                href="/Asther.apk" 
                download
                className="group flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-purple-500/30 transition-all duration-300"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/10 rounded-lg text-green-400 group-hover:text-green-300 transition">
                        <Smartphone className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                        <div className="text-sm font-medium text-white group-hover:text-purple-200 transition">Download for Android</div>
                        <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Latest v1.0 • APK</div>
                    </div>
                </div>
                <Download className="w-5 h-5 text-zinc-500 group-hover:text-white transition" />
            </a>
        </div>

      </div>
      
      <div className="mt-8 text-zinc-600 text-[10px] uppercase tracking-widest font-medium">
        Designed by Gaurang
      </div>
    </div>
  );
}

