"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase, signInWithGoogle, signOut } from "../lib/supabase";
import type { User } from "@supabase/supabase-js";

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "postAuthRedirect",
          window.location.pathname + window.location.search
        );
      }
    } catch {}
    await signInWithGoogle();
  };

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  const isActive = (path: string) => pathname === path;

  return (
    <header className="bg-black border-b border-cyan-500/20 sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center">
          {/* Left: Logo */}
          <div className="flex items-center flex-none">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <span className="text-2xl font-bold text-white">
                  Code<span className="text-cyan-400">Complexity</span>
                </span>
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-500 group-hover:w-full transition-all duration-300"></div>
              </div>
            </Link>
          </div>

          {/* Center: Navigation (centered) */}
          <div className="flex-1 flex items-center justify-center">
            <nav className="flex items-center space-x-6">
              <Link
                href="/analyze"
                className={`relative px-4 py-2 text-sm font-medium transition-colors ${
                  isActive("/analyze")
                    ? "text-cyan-400"
                    : "text-gray-400 hover:text-cyan-300"
                }`}
              >
                Analyze
                {isActive("/analyze") && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-400 to-purple-500"></span>
                )}
              </Link>

              <Link
                href="/interview"
                className={`relative px-4 py-2 text-sm font-medium transition-colors ${
                  isActive("/interview")
                    ? "text-cyan-400"
                    : "text-gray-400 hover:text-cyan-300"
                }`}
              >
                Interview Prep
                {isActive("/interview") && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-400 to-purple-500"></span>
                )}
              </Link>

              {user && (
                <Link
                  href="/dashboard"
                  className={`relative px-4 py-2 text-sm font-medium transition-colors ${
                    isActive("/dashboard")
                      ? "text-cyan-400"
                      : "text-gray-400 hover:text-cyan-300"
                  }`}
                >
                  Dashboard
                  {isActive("/dashboard") && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-400 to-purple-500"></span>
                  )}
                </Link>
              )}
            </nav>
          </div>

          {/* Right: Auth */}
          <div className="flex items-center flex-none">
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-gray-800 animate-pulse"></div>
            ) : user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-gray-900/50 card-border">
                  {user.user_metadata?.avatar_url && (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt="Profile"
                      className="w-8 h-8 rounded-full ring-2 ring-cyan-400/40"
                    />
                  )}
                  <span className="text-sm text-gray-300">
                    {user.user_metadata?.full_name || user.email}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="text-sm text-gray-400 hover:text-red-400 transition-colors font-medium"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="relative px-6 py-2 rounded-lg font-medium text-sm overflow-hidden group"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 opacity-100 group-hover:opacity-90 transition-opacity"></span>
                <span className="relative text-black font-semibold">
                  Sign In
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
