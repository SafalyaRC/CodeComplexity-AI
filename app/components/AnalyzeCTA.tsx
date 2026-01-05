"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function AnalyzeCTA() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await supabase.auth.getUser();
        if (mounted) setUser(data.user ?? null);
      } catch (err) {
        // ignore
      }
    })();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (mounted) setUser(session?.user ?? null);
      }
    );

    return () => {
      mounted = false;
      try {
        listener.subscription.unsubscribe();
      } catch (e) {}
    };
  }, []);

  const handleClick = async () => {
    if (user) {
      router.push("/analyze");
      return;
    }

    try {
      localStorage.setItem("postAuthRedirect", "/analyze");
    } catch (e) {}
    router.push("/auth/signin");
  };

  return (
    <button
      onClick={handleClick}
      className="group inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-black font-bold px-10 py-4 rounded-xl text-lg transition-all hover:shadow-[0_0_40px_rgba(34,211,238,0.6)] hover:scale-105"
    >
      <span>Start Analyzing Code</span>
      <span className="group-hover:translate-x-1 transition-transform">→</span>
    </button>
  );
}
