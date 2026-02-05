"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles } from "lucide-react";

// Initialize Supabase manually here for the login logic
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between Login/Signup
  const [error, setError] = useState<string | null>(null);

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        // 1. SIGN UP
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        alert("Account created! Logging you in...");
      } 
      
      // 2. LOG IN (Always do this after signup too)
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      // Success! Go to dashboard
      router.push("/dashboard");
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-900/20 via-black to-black pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 blur-[100px]" />

      <div className="w-full max-w-md bg-zinc-900/50 border border-white/10 p-8 rounded-3xl backdrop-blur-xl relative z-10 animate-in fade-in zoom-in duration-500">
        
        <div className="text-center mb-8">
            <div className="w-12 h-12 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-black" />
            </div>
            <h1 className="text-2xl font-light tracking-tight">Welcome to Asther.</h1>
            <p className="text-zinc-500 text-sm mt-2">Your digital sanctuary awaits.</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
            <div>
                <input 
                    type="email" 
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 transition placeholder:text-zinc-600"
                    required
                />
            </div>
            <div>
                <input 
                    type="password" 
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 transition placeholder:text-zinc-600"
                    required
                />
            </div>

            {error && (
                <div className="text-red-400 text-xs text-center bg-red-500/10 p-2 rounded-lg">
                    {error}
                </div>
            )}

            <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-white text-black font-medium py-3 rounded-xl hover:bg-zinc-200 transition flex items-center justify-center gap-2"
            >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSignUp ? "Create Account" : "Enter Workspace"}
            </button>
        </form>

        <div className="mt-6 text-center">
            <button 
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-xs text-zinc-500 hover:text-white transition"
            >
                {isSignUp ? "Already have an account? Log in" : "First time? Create an account"}
            </button>
        </div>
      </div>
    </div>
  );
}
