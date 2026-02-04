"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [audit, setAudit] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const savedHistory = localStorage.getItem("auditHistory");
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  const executeAudit = async () => {
    if (!text) return; 
    setLoading(true);
    setAudit("");
    setProgress(10);

    const interval = setInterval(() => {
      setProgress((prev) => (prev < 95 ? prev + 5 : prev));
    }, 400);

    try {
      // API Path fix for Vercel Root
      const response = await fetch("/api/challenge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      clearInterval(interval);
      setProgress(100);
      
      const result = data.error ? `SYSTEM_ERROR: ${data.error}` : data.response;
      setAudit(result);

      const newHistory = [{ idea: text, report: result }, ...history].slice(0, 5);
      setHistory(newHistory);
      localStorage.setItem("auditHistory", JSON.stringify(newHistory));

    } catch (err) {
      clearInterval(interval);
      setAudit("CRITICAL_ERROR: Node Connection Lost.");
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  return (
    <main className="min-h-screen bg-black text-zinc-100 p-6 md:p-12 font-mono selection:bg-red-500/30">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="border-b border-zinc-800 pb-8 mb-12">
          <h1 className="text-5xl font-black tracking-tighter text-red-600 mb-2">
            DEVIL'S ADVOCATE
          </h1>
          <p className="text-zinc-500 text-sm tracking-[0.2em] uppercase">
            Strategic Vulnerability Assessment Unit
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="relative bg-zinc-900/50 border border-zinc-800 p-1">
              <textarea
                className="w-full bg-black border-none p-6 text-xl text-white focus:ring-0 resize-none placeholder:text-zinc-700"
                rows="8"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="INPUT STARTUP OPERATIONAL LOGIC..."
              />
              
              {progress > 0 && (
                <div className="absolute bottom-0 left-0 h-1 bg-red-600 transition-all duration-300" 
                     style={{ width: `${progress}%` }} />
              )}
            </div>

            <button
              onClick={executeAudit}
              disabled={loading}
              className="group relative w-full overflow-hidden bg-red-600 py-5 transition-all hover:bg-red-700 disabled:bg-zinc-800"
            >
              <span className="relative z-10 font-black tracking-[0.3em] text-white">
                {loading ? "SCANNING VULNERABILITIES..." : "EXECUTE STRATEGIC AUDIT"}
              </span>
            </button>

            {audit && (
              <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="bg-zinc-900 border border-red-900/30 p-8 shadow-2xl">
                  <div className="flex justify-between items-center mb-6 border-b border-zinc-800 pb-4">
                    <span className="text-red-500 font-bold tracking-widest text-sm">AUDIT_REPORT_V2.0</span>
                    <span className="text-zinc-600 text-xs">{new Date().toLocaleTimeString()}</span>
                  </div>
                  <div className="text-zinc-300 leading-relaxed font-sans text-lg">
                    {audit}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar / History Section */}
          <div className="space-y-8">
            <div className="border border-zinc-800 p-6 bg-zinc-900/20">
              <h3 className="text-zinc-500 text-xs font-bold tracking-widest uppercase mb-6">Execution History</h3>
              {history.length === 0 ? (
                <p className="text-zinc-700 text-xs italic">No previous logs found...</p>
              ) : (
                <div className="space-y-4">
                  {history.map((item, i) => (
                    <div key={i} className="group border-l border-zinc-800 pl-4 py-2 hover:border-red-600 transition-colors">
                      <p className="text-zinc-400 text-sm truncate uppercase tracking-tighter">{item.idea}</p>
                      <span className="text-[10px] text-zinc-600 font-bold uppercase">Stored_Archive</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}