export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 text-center space-y-4">
        <h1 className="text-8xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
          Asther.
        </h1>
        <p className="text-xl text-neutral-400 animate-fade-in">
          Initialize your workspace.
        </p>
      </div>
      
    </main>
  );
}
