"use client";

import { useState } from "react";
import CodeEditor from "../components/CodeEditor";
import AnalysisResultComponent from "../components/AnalysisResult";
import type { AnalysisResult } from "../lib/types";

export default function AnalyzePage() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!code.trim()) return;

    setLoading(true);
    setAnalysis(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      });

      const data = await response.json();
      setAnalysis(data);
    } catch (error) {
      console.error("Analysis error:", error);
      setAnalysis({
        canAnalyze: false,
        refusalReason: "An error occurred. Please try again.",
        timeComplexity: "",
        spaceComplexity: "",
        explanation: "",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-[128px]"></div>
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px]"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Analyze <span className="text-cyan-400">Code Complexity</span>
          </h1>
          <p className="text-gray-400">
            Paste your code below to get instant complexity analysis
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left: Code Editor */}
          <div className="space-y-4">
            <div className="flex gap-4 items-center bg-gray-900/50 p-4 rounded-lg border border-cyan-500/20 backdrop-blur-sm">
              <label className="text-sm font-medium text-gray-300">
                Language:
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-black border border-cyan-500/30 rounded px-4 py-2 text-white focus:outline-none focus:border-cyan-500 transition-colors"
              >
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
              </select>
            </div>

            <div className="border border-cyan-500/20 rounded-lg overflow-hidden shadow-[0_0_30px_rgba(34,211,238,0.1)]">
              <CodeEditor code={code} language={language} onChange={setCode} />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={loading || !code.trim()}
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 disabled:from-gray-800 disabled:to-gray-800 disabled:cursor-not-allowed text-black disabled:text-gray-600 font-bold py-4 rounded-lg transition-all hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] disabled:shadow-none"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-3"></div>
                  Analyzing...
                </span>
              ) : (
                "Analyze Complexity"
              )}
            </button>
          </div>

          {/* Right: Results */}
          <AnalysisResultComponent
            analysis={analysis}
            loading={loading}
            code={code}
            language={language}
          />
        </div>
      </div>
    </div>
  );
}