"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Instantly send everyone to the Login gate
    router.push("/login");
  }, [router]);

  return (
    <div className="h-screen bg-black flex items-center justify-center text-zinc-600">
      <Loader2 className="w-6 h-6 animate-spin" />
    </div>
  );
}
