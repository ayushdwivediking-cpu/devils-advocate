"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [audit, setAudit] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [progress, setProgress] = useState(0);

  // Restore history logic exactly as you had it
  useEffect(() => {
    const savedHistory = localStorage.getItem("auditHistory");
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  const executeAudit = async () => {
    if (!text) return; 
    setLoading(true);
    setAudit("");
    
    // Your original Vulnerability Progress Logic
    setProgress(15);
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 90 ? prev + 8 : prev));
    }, 300);

    try {
      // Fixed API path for Vercel
      const response = await fetch("/api/challenge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      clearInterval(interval);
      setProgress(100);
      
      const result = data.error ? `SYSTEM_FAILURE: ${data.error}` : data.response;
      setAudit(result);

      // Your original History Saving logic
      const newHistory = [{ idea: text, report: result }, ...history].slice(0, 5);
      setHistory(newHistory);
      localStorage.setItem("auditHistory", JSON.stringify(newHistory));

    } catch (err) {
      clearInterval(interval);
      setAudit("CRITICAL_ERROR: Node Connection Lost.");
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 1500);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-10 font-mono">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 border-l-4 border-red-600 pl-4">
          <h1 className="text-4xl font-black uppercase tracking-tighter">Devil's Advocate</h1>
          <p className="text-zinc-500 text-xs mt-1">Vulnerability Research & Strategic Audit Unit</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Audit Area */}
          <div className="lg:col-span-3">
            <div className="bg-zinc-900 border border-zinc-800 p-1">
              <textarea
                className="w-full bg-black border-none p-6 text-lg focus:ring-0 resize-none placeholder:text-zinc-800"
                rows="10"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="ENTER SYSTEM ARCHITECTURE OR OPERATIONAL LOGIC..."
              />
              
              {/* Your Original Progress Bar */}
              {progress > 0 && (
                <div className="h-1 bg-zinc-800 w-full">
                  <div 
                    className="h-full bg-red-600 transition-all duration-300" 
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
            </div>

            <button
              onClick={executeAudit}
              disabled={loading}
              className="w-full mt-4 bg-red-600 hover:bg-red-700 py-4 font-bold tracking-[0.2em] transition-all disabled:bg-zinc-800"
            >
              {loading ? "SCANNING FOR VULNERABILITIES..." : "EXECUTE STRATEGIC AUDIT"}
            </button>

            {audit && (
              <div className="mt-10 bg-zinc-900 border border-zinc-800 p-8 shadow-2xl">
                <div className="text-red-600 font-bold mb-4 text-xs tracking-widest uppercase border-b border-zinc-800 pb-2">
                  Final Audit Report
                </div>
                <div className="text-zinc-300 whitespace-pre-wrap leading-relaxed font-sans">
                  {audit}
                </div>
              </div>
            )}
          </div>

          {/* Your Original History Section */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-900/50 border border-zinc-800 p-4 h-full">
              <h3 className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest mb-4">Execution Logs</h3>
              <div className="space-y-4">
                {history.length === 0 ? (
                  <div className="text-zinc-800 text-xs">No previous archives found.</div>
                ) : (
                  history.map((item, i) => (
                    <div key={i} className="border-b border-zinc-800 pb-3">
                      <p className="text-zinc-400 text-xs truncate uppercase">{item.idea}</p>
                      <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-tighter">Status: Archived</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}