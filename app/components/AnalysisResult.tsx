"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  saveAnalysis,
  getCurrentUser,
  signInWithGoogle,
} from "../lib/supabase";
import type { AnalysisResult } from "../lib/types";

interface AnalysisResultProps {
  analysis: AnalysisResult | null;
  loading: boolean;
  code: string;
  language: string;
  onSaveSuccess?: () => void;
}

export default function AnalysisResultComponent({
  analysis,
  loading,
  code,
  language,
  onSaveSuccess,
}: AnalysisResultProps) {
  const [saving, setSaving] = useState(false);
  const [analyzedAt, setAnalyzedAt] = useState<string | null>(null);
  const [showFullExplanation, setShowFullExplanation] = useState(false);

  useEffect(() => {
    if (analysis) {
      setAnalyzedAt(new Date().toLocaleString());
    }
  }, [analysis]);

  useEffect(() => {
    // reset explanation toggle when a new analysis arrives
    setShowFullExplanation(false);
  }, [analysis?.explanation]);

  const handleSave = async () => {
    if (!analysis || !analysis.canAnalyze) return;

    setSaving(true);

    try {
      const user = await getCurrentUser();
      if (!user) {
        // remember current path to redirect after auth
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(
              "postAuthRedirect",
              window.location.pathname + window.location.search
            );
          } catch {}
        }
        toast.error("Please sign in to save analyses", {
          description: "You will be redirected to sign in",
        });
        // trigger OAuth
        await signInWithGoogle();
        setSaving(false);
        return;
      }

      const { error } = await saveAnalysis({
        code,
        language,
        timeComplexity: analysis.timeComplexity,
        spaceComplexity: analysis.spaceComplexity,
        explanation: analysis.explanation,
        optimizations: analysis.optimizations,
      });

      if (error) {
        console.error("Save error:", error);
        toast.error("Failed to save analysis", {
          description: error.message || "Please try again",
        });
      } else {
        toast.success("Analysis saved!", {
          description: "View it in your dashboard",
        });
        if (onSaveSuccess) onSaveSuccess();
      }
    } catch (error: any) {
      console.error("Save error:", error);
      toast.error("Failed to save analysis", {
        description: error.message || "Please try again",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-900/50 rounded-lg p-6 backdrop-blur-sm card-border">
        <div className="text-center text-gray-400 py-20">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-cyan-500/30 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-cyan-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-lg">Analyzing your code...</p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="bg-gray-900/50 rounded-lg p-6 backdrop-blur-sm card-border">
        <div className="text-center text-gray-400 py-20">
          <p className="text-2xl mb-3">👈 Paste your code</p>
          <p className="text-gray-500">Select a language and click Analyze</p>
        </div>
      </div>
    );
  }

  if (!analysis.canAnalyze) {
    return (
      <div className="bg-gray-900/50 rounded-lg p-6 backdrop-blur-sm card-border">
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-yellow-400 mb-3 flex items-center">
            <span className="mr-2">⚠️</span> Cannot Analyze
          </h3>
          <p className="text-gray-300 leading-relaxed">
            {analysis.refusalReason || "Unable to analyze this code"}
          </p>
        </div>
      </div>
    );
  }

  // sanitize AI output (strip simple Markdown/code markers) and build a very short preview
  const stripMarkdown = (s: string) =>
    s
      .replace(/```[\s\S]*?```/g, "")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/\*\*\*/g, "")
      .replace(/___+/g, "")
      .replace(/^#+\s?/gm, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

  const cleanExplanation = analysis
    ? stripMarkdown(analysis.explanation || "")
    : "";

  // very short preview: only show the time and space complexities
  const preview = analysis
    ? `Time: ${analysis.timeComplexity} · Space: ${analysis.spaceComplexity}`
    : "";

  const explanationIsTruncated = !!(
    cleanExplanation && cleanExplanation.length > 200
  );

  return (
    <div className="bg-gray-900/50 rounded-lg p-6 backdrop-blur-sm shadow-[0_0_30px_rgba(34,211,238,0.1)] card-border">
      <div className="space-y-6">
        {analyzedAt && (
          <div className="text-sm text-gray-400 text-right">
            Analyzed at: {analyzedAt}
          </div>
        )}
        {/* Complexities */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-black/50 rounded-lg p-5 border border-cyan-500/30 hover:border-cyan-500/50 transition-colors">
            <h3 className="text-sm font-medium text-cyan-400 mb-3 uppercase tracking-wide">
              Time Complexity
            </h3>
            <p className="text-4xl font-mono font-bold text-cyan-300">
              {analysis.timeComplexity}
            </p>
          </div>

          <div className="bg-black/50 rounded-lg p-5 border border-purple-500/30 hover:border-purple-500/50 transition-colors">
            <h3 className="text-sm font-medium text-purple-400 mb-3 uppercase tracking-wide">
              Space Complexity
            </h3>
            <p className="text-4xl font-mono font-bold text-purple-300">
              {analysis.spaceComplexity}
            </p>
          </div>
        </div>

        {/* Explanation */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-cyan-400 flex items-center">
            <span className="mr-2">📝</span> Explanation
          </h3>
          <div className="bg-black/50 rounded-lg p-5 border border-cyan-500/20">
            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
              {showFullExplanation ? cleanExplanation : preview}
            </p>

            {explanationIsTruncated && (
              <div className="mt-3 text-sm">
                <button
                  onClick={() => setShowFullExplanation((s) => !s)}
                  className="text-cyan-300 underline"
                >
                  {showFullExplanation ? "Show less" : "Read more"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Optimizations */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-purple-400 flex items-center">
            <span className="mr-2">💡</span> Optimization Suggestions
          </h3>
          {analysis.optimizations &&
          analysis.optimizations.trim() === "Already optimized." ? (
            <div className="bg-black/50 rounded-lg p-4 border border-purple-500/20">
              <p className="text-gray-300">Already optimized.</p>
            </div>
          ) : analysis.optimizations ? (
            <div className="bg-black/50 rounded-lg p-5 border border-purple-500/20">
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {stripMarkdown(analysis.optimizations)}
              </p>
            </div>
          ) : (
            <div className="bg-black/50 rounded-lg p-4 border border-purple-500/20">
              <p className="text-gray-400">No optimization suggestions.</p>
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="pt-4 border-t border-cyan-500/20 flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 disabled:from-gray-800 disabled:to-gray-800 disabled:cursor-not-allowed text-black disabled:text-gray-600 font-bold py-3 rounded-lg transition-all hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] flex items-center justify-center"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <span className="mr-2">💾</span> Save Analysis
              </>
            )}
          </button>

          <div className="flex-1 flex gap-2">
            <button
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(analysis.explanation);
                  toast.success("Explanation copied to clipboard");
                } catch (e) {
                  toast.error("Failed to copy explanation");
                }
              }}
              className="flex-1 bg-gray-800/60 text-gray-200 py-3 rounded-lg"
            >
              Copy Explanation
            </button>

            <button
              onClick={async () => {
                try {
                  const shareText = `CodeComplexity Analysis:\nLanguage: ${language}\nTime: ${analysis.timeComplexity}\nSpace: ${analysis.spaceComplexity}\n\n${analysis.explanation}`;
                  await navigator.clipboard.writeText(shareText);
                  toast.success("Shareable analysis copied to clipboard");
                } catch (e) {
                  toast.error("Failed to prepare share text");
                }
              }}
              className="flex-1 bg-gray-800/60 text-gray-200 py-3 rounded-lg"
            >
              Share Analysis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
