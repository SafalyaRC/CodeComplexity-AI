"use client";

import { useState } from "react";
import type { Analysis } from "../lib/types";

interface HistoryCardProps {
  analysis: Analysis;
  onDelete?: (id: string) => void;
}

export default function HistoryCard({ analysis, onDelete }: HistoryCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this analysis?")) return;

    setDeleting(true);
    if (onDelete) {
      await onDelete(analysis.id);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getLanguageColor = (lang: string) => {
    const colors: Record<string, { bg: string; border: string; text: string }> =
      {
        python: {
          bg: "bg-blue-500/20",
          border: "border-blue-500",
          text: "text-blue-400",
        },
        javascript: {
          bg: "bg-yellow-500/20",
          border: "border-yellow-500",
          text: "text-yellow-400",
        },
        java: {
          bg: "bg-red-500/20",
          border: "border-red-500",
          text: "text-red-400",
        },
        cpp: {
          bg: "bg-purple-500/20",
          border: "border-purple-500",
          text: "text-purple-400",
        },
      };
    return (
      colors[lang] || {
        bg: "bg-gray-500/20",
        border: "border-gray-500",
        text: "text-gray-400",
      }
    );
  };

  const langColor = getLanguageColor(analysis.language);

  return (
    <div className="group relative bg-gray-900/50 rounded-xl p-6 card-border hover:shadow-[0_0_20px_rgba(34,211,238,0.12)] transition-all backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span
            className={`${langColor.bg} ${langColor.text} border ${langColor.border} text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide`}
          >
            {analysis.language}
          </span>
          <span className="text-gray-500 text-sm">
            {formatDate(analysis.created_at)}
          </span>
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="text-red-400 hover:text-red-300 text-sm font-medium disabled:opacity-50 transition-colors"
        >
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>

      {/* Complexities */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-black/50 rounded-lg p-3 border border-cyan-500/20">
          <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
            Time
          </p>
          <p className="text-xl font-mono font-bold text-cyan-400">
            {analysis.time_complexity}
          </p>
        </div>
        <div className="bg-black/50 rounded-lg p-3 border border-purple-500/20">
          <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
            Space
          </p>
          <p className="text-xl font-mono font-bold text-purple-400">
            {analysis.space_complexity}
          </p>
        </div>
      </div>

      {/* Code Preview */}
      <div className="mb-4">
        <div className="bg-black/50 rounded-lg p-4 font-mono text-sm text-gray-300 overflow-x-auto card-border">
          <pre className="whitespace-pre-wrap break-words">
            {analysis.code.substring(0, 200)}
            {analysis.code.length > 200 && "..."}
          </pre>
        </div>
      </div>

      {/* Expand/Collapse */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-cyan-400 hover:text-cyan-300 text-sm font-medium flex items-center transition-colors"
      >
        {expanded ? (
          <>
            Show Less <span className="ml-1 transition-transform">▲</span>
          </>
        ) : (
          <>
            Show More <span className="ml-1 transition-transform">▼</span>
          </>
        )}
      </button>

      {/* Expanded Content */}
      {expanded && (
        <div className="mt-6 space-y-4 pt-6 border-t border-cyan-500/20">
          {/* Full Code */}
          <div>
            <h4 className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wide">
              Full Code
            </h4>
            <div className="bg-black/50 rounded-lg p-4 font-mono text-sm text-gray-300 overflow-x-auto card-border max-h-64 overflow-y-auto">
              <pre className="whitespace-pre-wrap break-words">
                {analysis.code}
              </pre>
            </div>
          </div>

          {/* Explanation */}
          <div>
            <h4 className="text-sm font-semibold text-cyan-400 mb-2 flex items-center uppercase tracking-wide">
              <span className="mr-2">📝</span> Explanation
            </h4>
            <div className="bg-black/50 rounded-lg p-4 card-border">
              <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                {analysis.explanation}
              </p>
            </div>
          </div>

          {/* Optimizations */}
          {analysis.optimizations && (
            <div>
              <h4 className="text-sm font-semibold text-purple-400 mb-2 flex items-center uppercase tracking-wide">
                <span className="mr-2">💡</span> Optimizations
              </h4>
              <div className="bg-black/50 rounded-lg p-4 card-border">
                <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {analysis.optimizations}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
