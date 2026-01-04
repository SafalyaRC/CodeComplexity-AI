"use client";

import { useState } from "react";
import { toast } from "sonner";
import { supabase, signInWithGoogle } from "../../lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        const msg = error.message || "Sign-in failed";
        if (/user not found|no user|invalid login|invalid email/i.test(msg)) {
          toast.error("Sign-in failed: User not found. Please sign up first.");
        } else if (/invalid password|incorrect password/i.test(msg)) {
          toast.error("Sign-in failed: Incorrect password.");
        } else {
          toast.error(msg);
        }
        setLoading(false);
        return;
      }

      // If session returned directly, redirect to home
      if (data?.session) {
        toast.success("Signed in successfully");
        try {
          const redirect =
            typeof window !== "undefined"
              ? localStorage.getItem("postAuthRedirect")
              : null;
          if (redirect) {
            localStorage.removeItem("postAuthRedirect");
            window.location.href = redirect;
          } else {
            window.location.href = "/";
          }
        } catch {
          window.location.href = "/";
        }
        return;
      }

      // Otherwise listen for auth state change (useful if sign-in triggers redirect flow)
      toast.success("Sign-in initiated. Waiting for session...");
      const { data: listener } = supabase.auth.onAuthStateChange(
        (event, session) => {
          if (session?.user) {
            toast.success("Signed in successfully");
            try {
              listener.subscription.unsubscribe();
            } catch {}
            const redirect =
              typeof window !== "undefined"
                ? localStorage.getItem("postAuthRedirect")
                : null;
            try {
              if (redirect) {
                localStorage.removeItem("postAuthRedirect");
                window.location.href = redirect;
              } else {
                window.location.href = "/";
              }
            } catch {
              window.location.href = "/";
            }
          }
        }
      );
      // safety: stop listening after 8s
      setTimeout(() => {
        try {
          listener.subscription.unsubscribe();
        } catch {}
        setLoading(false);
      }, 8000);
    } catch (err: any) {
      toast.error(err?.message || "Sign-in error");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      // For Google sign-in we always want to land on `/` after auth,
      // so do not set or preserve a postAuthRedirect here.
      await signInWithGoogle();
    } catch (err: any) {
      toast.error(err?.message || "Google sign-in failed");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-white">Sign In</h1>
      <p className="text-gray-400 mt-2">
        Sign in with email and password or use Google OAuth
      </p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-lg bg-gray-900/50 card-border">
          <h2 className="text-xl font-semibold text-gray-200 mb-4">
            Email Sign In
          </h2>
          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div>
              <label className="text-sm text-gray-300">Email</label>
              <input
                className="w-full mt-1 p-2 rounded bg-black/40 border border-gray-800 text-white"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-sm text-gray-300">Password</label>
              <input
                className="w-full mt-1 p-2 rounded bg-black/40 border border-gray-800 text-white"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                type="submit"
                disabled={loading}
                className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-2 px-4 rounded"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>

              <Link
                href="/auth/signup"
                className="text-sm text-gray-300 underline"
              >
                Don't have an account? Sign up
              </Link>
            </div>
          </form>
        </div>

        <div className="p-6 rounded-lg bg-gray-900/50 card-border flex flex-col items-center justify-center">
          <h2 className="text-xl font-semibold text-gray-200 mb-4">
            Social Sign In
          </h2>
          <button
            onClick={handleGoogle}
            className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-black py-2 rounded mb-3 flex items-center justify-center gap-3"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 48 48"
              className="inline-block"
            >
              <path
                fill="#fbbc04"
                d="M43.6 20.5H42V20H24v8h11.3c-1.9 5-6.4 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.1 8.1 2.9l5.7-5.7C33.6 6.1 29 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c10 0 18.3-7.2 19.6-16.5z"
              />
              <path
                fill="#ea4335"
                d="M6.3 14.6l6.6 4.8C14 16.3 18.8 13 24 13c3.1 0 5.9 1.1 8.1 2.9l5.7-5.7C33.6 6.1 29 4 24 4c-6.6 0-12 3.3-17.7 10.6z"
              />
              <path
                fill="#34a853"
                d="M24 44c5.4 0 10-1.8 13.3-4.8l-6.3-5.2C28.6 34.9 26.4 35.6 24 35.6c-5 0-9.3-3.1-10.8-7.4l-6.7 5.1C8.9 39.9 16 44 24 44z"
              />
              <path
                fill="#4285f4"
                d="M43.6 20.5H42V20H24v8h11.3c-1 2.6-2.7 4.6-4.9 6.1l6.3 5.2C38.6 34 43.6 28.9 43.6 20.5z"
              />
            </svg>
            <span>Sign in with Google</span>
          </button>

          <p className="text-gray-400 text-sm mt-2">
            Or use email sign-in on the left.
          </p>
        </div>
      </div>
    </div>
  );
}
