"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        toast.error(error.message || "Sign-up failed");
        setLoading(false);
        return;
      }
      toast.success(
        "Sign-up successful. Check your email to confirm, then sign in."
      );
      router.push("/auth/signin");
    } catch (err: any) {
      toast.error(err?.message || "Sign-up error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-white">Create an Account</h1>
      <p className="text-gray-400 mt-2">Sign up with email and password</p>

      <div className="mt-8 p-6 rounded-lg bg-gray-900/50 card-border">
        <form onSubmit={handleSignUp} className="space-y-4">
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
              className="bg-purple-500 hover:bg-purple-600 text-black font-bold py-2 px-4 rounded"
            >
              {loading ? "Creating..." : "Create account"}
            </button>

            <Link
              href="/auth/signin"
              className="text-sm text-gray-300 underline"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
