import Link from "next/link";
import AnalyzeCTA from "./components/AnalyzeCTA";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-[128px] animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-[128px] animate-pulse delay-2000"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="text-white">Code</span>
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Complexity
              </span>{" "}
              <span className="text-white">AI</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-400 mb-4">
              Analyze your code's time and space complexity
            </p>
            <p className="text-lg text-gray-500">with AI-powered insights</p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-12 mt-16">
            <Link
              href="/analyze"
              className="group relative bg-gray-900/50 p-8 rounded-xl border border-cyan-500/20 hover:border-cyan-500/50 transition-all hover:shadow-[0_0_30px_rgba(34,211,238,0.3)] backdrop-blur-sm"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="text-5xl mb-4">⚡</div>
                <h3 className="text-xl font-bold mb-3 text-cyan-400">
                  Instant Analysis
                </h3>
                <p className="text-gray-400">
                  Get complexity breakdowns in seconds with AI precision
                </p>
              </div>
            </Link>

            <Link
              href="/interview"
              className="group relative bg-gray-900/50 p-8 rounded-xl border border-purple-500/20 hover:border-purple-500/50 transition-all hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] backdrop-blur-sm"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="text-5xl mb-4">🎯</div>
                <h3 className="text-xl font-bold mb-3 text-purple-400">
                  Interview Ready
                </h3>
                <p className="text-gray-400">
                  Curated coding problems for acing your interviews
                </p>
              </div>
            </Link>

            <Link
              href="/analyze"
              className="group relative bg-gray-900/50 p-8 rounded-xl border border-pink-500/20 hover:border-pink-500/50 transition-all hover:shadow-[0_0_30px_rgba(236,72,153,0.3)] backdrop-blur-sm"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="text-5xl mb-4">💡</div>
                <h3 className="text-xl font-bold mb-3 text-pink-400">
                  Optimization Tips
                </h3>
                <p className="text-gray-400">
                  Learn how to improve your solutions
                </p>
              </div>
            </Link>
          </div>

          {/* CTA */}
          <AnalyzeCTA />

          {/* Stats - FIXED SECTION */}
          <div className="grid grid-cols-3 gap-8 mt-20 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
                {"<"}5s
              </div>
              <div className="text-sm text-gray-500">Analysis Time</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                3+
              </div>
              <div className="text-sm text-gray-500">Languages</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                100%
              </div>
              <div className="text-sm text-gray-500">Accurate</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
