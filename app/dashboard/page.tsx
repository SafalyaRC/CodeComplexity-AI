"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserAnalyses, getCurrentUser, supabase } from "../lib/supabase";
import HistoryCard from "../components/HistoryCard";
import type { Analysis } from "../lib/types";

export default function DashboardPage() {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);

    const currentUser = await getCurrentUser();
    if (!currentUser) {
      router.push("/");
      return;
    }

    setUser(currentUser);

    const { data, error } = await getUserAnalyses();
    if (!error && data) {
      setAnalyses(data);
    }

    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("analyses").delete().eq("id", id);

    if (!error) {
      setAnalyses(analyses.filter((a) => a.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-cyan-500/30 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-cyan-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-400">Loading your analyses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-[128px]"></div>
          <div className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px]"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Your <span className="text-cyan-400">Dashboard</span>
          </h1>
          <p className="text-gray-400">
            View and manage your saved complexity analyses
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-900/50 border border-cyan-500/20 rounded-lg p-6 backdrop-blur-sm hover:border-cyan-500/40 transition-colors">
            <p className="text-gray-400 text-sm mb-2 uppercase tracking-wide">
              Total Analyses
            </p>
            <p className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              {analyses.length}
            </p>
          </div>
          <div className="bg-gray-900/50 border border-purple-500/20 rounded-lg p-6 backdrop-blur-sm hover:border-purple-500/40 transition-colors">
            <p className="text-gray-400 text-sm mb-2 uppercase tracking-wide">
              Most Used Language
            </p>
            <p className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent capitalize">
              {getMostUsedLanguage(analyses)}
            </p>
          </div>
          <div className="bg-gray-900/50 border border-pink-500/20 rounded-lg p-6 backdrop-blur-sm hover:border-pink-500/40 transition-colors">
            <p className="text-gray-400 text-sm mb-2 uppercase tracking-wide">
              This Week
            </p>
            <p className="text-5xl font-bold bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent">
              {getThisWeekCount(analyses)}
            </p>
          </div>
        </div>

        {/* Analyses List */}
        {analyses.length === 0 ? (
          <div className="bg-gray-900/50 border border-cyan-500/20 rounded-lg p-12 text-center backdrop-blur-sm">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-6">📊</div>
              <p className="text-2xl text-gray-300 mb-3 font-semibold">
                No analyses yet
              </p>
              <p className="text-gray-500 mb-8">
                Start analyzing code to see your history here
              </p>
              <button
                onClick={() => router.push("/analyze")}
                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-black px-8 py-3 rounded-lg font-bold transition-all hover:shadow-[0_0_30px_rgba(34,211,238,0.5)]"
              >
                Analyze Code →
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-cyan-400">
                Recent Analyses
              </h2>
              <p className="text-gray-500 text-sm">
                {analyses.length} {analyses.length === 1 ? "item" : "items"}
              </p>
            </div>
            {analyses.map((analysis) => (
              <HistoryCard
                key={analysis.id}
                analysis={analysis}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Helper functions
function getMostUsedLanguage(analyses: Analysis[]): string {
  if (analyses.length === 0) return "-";

  const counts: Record<string, number> = {};
  analyses.forEach((a) => {
    counts[a.language] = (counts[a.language] || 0) + 1;
  });

  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
}

function getThisWeekCount(analyses: Analysis[]): number {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  return analyses.filter((a) => new Date(a.created_at) > weekAgo).length;
}