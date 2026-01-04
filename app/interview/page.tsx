"use client";

import { useEffect, useState } from "react";

type Problem = {
  id: number;
  title: string;
  difficulty: string;
  topic: string;
  leetcode_url: string;
};

const STORAGE_KEY = "blind75-solved-v1";

export default function InterviewPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [solvedMap, setSolvedMap] = useState<Record<number, boolean>>({});

  useEffect(() => {
    fetch("/blind75.json")
      .then((res) => res.json())
      .then((data) => setProblems(data))
      .catch(() => setProblems([]));

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSolvedMap(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(solvedMap));
    } catch {}
  }, [solvedMap]);

  const toggleSolved = (id: number) => {
    setSolvedMap((m) => {
      const next = { ...m, [id]: !m[id] };
      return next;
    });
  };

  const clearProgress = () => {
    setSolvedMap({});
  };

  const solvedCount = Object.values(solvedMap).filter(Boolean).length;

  return (
    <main className="min-h-screen bg-black text-white py-12">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-1">Interview Prep</h1>
              <p className="text-gray-400">
                Curated coding problems for acing your interviews
              </p>
            </div>

            <div className="text-right">
              <div className="text-sm text-gray-400">Solved</div>
              <div className="text-lg font-semibold text-cyan-400">
                {solvedCount}/{problems.length}
              </div>
              <button
                onClick={clearProgress}
                className="mt-2 text-sm text-gray-400 hover:text-red-400"
              >
                Clear progress
              </button>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {problems.map((p) => (
              <div
                key={p.id}
                className="relative group bg-gray-900/50 p-5 rounded-xl border card-border hover:shadow-[0_0_20px_rgba(34,211,238,0.06)] transition-all"
              >
                <div className="flex items-start justify-between">
                  <a
                    href={p.leetcode_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-lg font-semibold text-white hover:text-cyan-300"
                  >
                    {p.title}
                  </a>

                  <button
                    onClick={() => toggleSolved(p.id)}
                    aria-label={
                      solvedMap[p.id] ? "Mark unsolved" : "Mark solved"
                    }
                    className={`ml-3 w-9 h-9 rounded-md flex items-center justify-center transition-colors ${
                      solvedMap[p.id]
                        ? "bg-cyan-500 text-black"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    {solvedMap[p.id] ? "✓" : "○"}
                  </button>
                </div>

                <div className="mt-3 flex items-center justify-between text-sm text-gray-400">
                  <div className="flex items-center space-x-3">
                    <span className="px-2 py-1 rounded-full bg-gray-800/50 text-xs">
                      Topic: {p.topic}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        p.difficulty === "Easy"
                          ? "bg-green-800 text-green-300"
                          : p.difficulty === "Medium"
                          ? "bg-amber-900 text-amber-300"
                          : "bg-red-900 text-red-300"
                      }`}
                    >
                      {p.difficulty}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
