import Link from "next/link";
import { Terminal, Code, Cpu, ExternalLink, ChevronRight } from "lucide-react";

export default function DocsPage() {
  return (
    <main className="min-h-screen bg-[#020202] text-zinc-300 font-sans p-6 md:p-12 selection:bg-[#FF003C] selection:text-white">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="border-b border-zinc-900 pb-6 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-zinc-100 bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
              BenPlayer{" "}
              <span className="text-sm font-mono text-[#FF003C] drop-shadow-[0_0_10px_rgba(255,0,60,0.3)]">
                v1.0 Docs
              </span>
            </h1>
            <p className="text-xs text-zinc-500 mt-2 tracking-wide">
              Developer guide for URL-driven high-performance media embedding
            </p>
          </div>
          <Link
            href="/"
            className="text-xs font-bold text-[#FF003C] hover:underline flex items-center space-x-1"
          >
            <span>Launch Player</span>
            <ExternalLink size={12} />
          </Link>
        </div>

        {/* Section: Architectural Flow */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-zinc-100 flex items-center space-x-2">
            <Cpu size={18} className="text-[#FF003C]" />
            <span>How it Works</span>
          </h2>
          <p className="text-xs text-zinc-400 leading-relaxed max-w-2xl">
            BenPlayer intercepts standard query parameters from the client-side
            URL, constructs a strict component-safe data mesh, handles layout
            rehydration securely, and injects optimization parameters directly
            into the HTML5 video pipeline.
          </p>
        </div>

        {/* Section: Query Parameters Schema */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-zinc-100 flex items-center space-x-2">
            <Terminal size={18} className="text-[#FF003C]" />
            <span>Query Parameters Schema</span>
          </h2>

          <div className="overflow-hidden border border-zinc-900 rounded-xl bg-[#050505]">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-zinc-900 bg-zinc-950/50 text-zinc-400 font-mono">
                  <th className="p-3">Parameter</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Required</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900 font-mono">
                <tr>
                  <td className="p-3 text-[#FF003C] font-semibold">title</td>
                  <td className="p-3 text-zinc-500">string</td>
                  <td className="p-3 text-zinc-400">
                    The cinematic title displayed on the upper-left HUD header.
                  </td>
                  <td className="p-3 text-zinc-600">Optional</td>
                </tr>
                <tr>
                  <td className="p-3 text-[#FF003C] font-semibold">url1080</td>
                  <td className="p-3 text-zinc-500">string (URL)</td>
                  <td className="p-3 text-zinc-400">
                    Direct streaming source path for 1080p high definition
                    resolution.
                  </td>
                  <td className="p-3 text-zinc-600">Optional</td>
                </tr>
                <tr>
                  <td className="p-3 text-[#FF003C] font-semibold">url720</td>
                  <td className="p-3 text-zinc-500">string (URL)</td>
                  <td className="p-3 text-zinc-400">
                    Direct streaming source path for 720p resolution.
                  </td>
                  <td className="p-3 text-zinc-600">Optional</td>
                </tr>
                <tr>
                  <td className="p-3 text-[#FF003C] font-semibold">url480</td>
                  <td className="p-3 text-zinc-500">string (URL)</td>
                  <td className="p-3 text-zinc-400">
                    Direct streaming source path for 480p mobile resolution.
                  </td>
                  <td className="p-3 text-zinc-600">Optional</td>
                </tr>
                <tr>
                  <td className="p-3 text-[#FF003C] font-semibold">url</td>
                  <td className="p-3 text-zinc-500">string (URL)</td>
                  <td className="p-3 text-zinc-400">
                    Fallback single-stream URL injected as "Auto" quality.
                  </td>
                  <td className="p-3 text-zinc-600">Conditional</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section: Live Code Blueprint */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-zinc-100 flex items-center space-x-2">
            <Code size={18} className="text-[#FF003C]" />
            <span>Deployment / Quick Link Example</span>
          </h2>
          <p className="text-xs text-zinc-400">
            Copy this configuration template to structure your external iFrame
            sources or shared player routes:
          </p>

          <div className="bg-[#050505] border border-zinc-900 rounded-xl p-4 font-mono text-[11px] text-zinc-400 overflow-x-auto relative group">
            <span className="absolute top-2 right-3 text-[9px] uppercase tracking-wider text-zinc-700 group-hover:text-[#FF003C] transition-colors font-bold">
              GET Request Structure
            </span>
            <div className="whitespace-pre-wrap break-all text-zinc-200">
              <span className="text-zinc-500">
                https://benplayer.vercel.app/
              </span>
              <span className="text-[#FF003C]">?title=</span>
              Night_of_the_Zoocalypse
              <span className="text-[#FF003C]">&url1080=</span>
              https://server1.com/1080.mp4
              <span className="text-[#FF003C]">&url720=</span>
              https://server1.com/720.mp4
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-[10px] text-zinc-600 border-t border-zinc-950 pt-8 font-mono tracking-widest uppercase">
          Designed and engineered natively from scratch by Alsaeed &copy; 2026
        </div>
      </div>
    </main>
  );
}
