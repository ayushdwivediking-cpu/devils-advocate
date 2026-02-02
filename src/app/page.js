"use client";
import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  async function handleSend() {
    if (!input.trim()) return;
    setLoading(true);
    setResponse("");
    setScore(null);

    try {
      const res = await fetch("/api/challenge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });
      const data = await res.json();
      const aiResponse = data.response || data.error;

      // Extract the score from the first line (e.g., "SCORE: 85")
      const scoreMatch = aiResponse.match(/SCORE:\s*(\d+)/i);
      const extractedScore = scoreMatch ? parseInt(scoreMatch[1]) : 0;
      const cleanResponse = aiResponse.replace(/SCORE:\s*\d+/i, "").trim();

      setScore(extractedScore);
      setResponse(cleanResponse);

      setHistory(prev => [{
        id: Date.now(),
        query: input,
        result: cleanResponse,
        score: extractedScore,
        time: new Date().toLocaleTimeString()
      }, ...prev]);

    } catch (error) {
      setResponse("CRITICAL_ERROR: Node Connection Lost.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ backgroundColor: "#0a0a0a", color: "#ededed", minHeight: "100vh", padding: "40px", fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: "3rem", fontWeight: "900", color: "#e11d48", margin: "0", letterSpacing: "-2px" }}>
            DEVIL'S ADVOCATE
          </h1>
          <p style={{ color: "#666", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "2px" }}>
            Strategic Vulnerability Meter // v1.2
          </p>
        </div>

        <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
          
          <div style={{ flex: '2', minWidth: '300px' }}>
            {/* Score Display */}
            {score !== null && (
              <div style={{ textAlign: 'center', marginBottom: '20px', padding: '20px', background: '#171717', borderRadius: '12px', border: `2px solid ${score > 70 ? '#e11d48' : '#f59e0b'}` }}>
                <span style={{ fontSize: '0.8rem', color: '#666', display: 'block' }}>VULNERABILITY SCORE</span>
                <span style={{ fontSize: '4rem', fontWeight: '900', color: score > 70 ? '#e11d48' : '#f59e0b' }}>{score}%</span>
                <p style={{ margin: '0', color: '#a3a3a3', fontWeight: 'bold' }}>
                  {score > 80 ? "CRITICAL FRAGILITY DETECTED" : score > 50 ? "MODERATE RISK" : "UNUSUAL RESILIENCE"}
                </p>
              </div>
            )}

            <div style={{ background: "#171717", padding: "24px", borderRadius: "12px", border: "1px solid #262626", marginBottom: "30px" }}>
              <textarea 
                style={{ width: "100%", height: "120px", background: "#000", border: "1px solid #404040", borderRadius: "8px", color: "#fff", padding: "12px", outline: "none", fontSize: "1rem", boxSizing: 'border-box' }}
                placeholder="Enter your startup thesis..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button 
                onClick={handleSend}
                disabled={loading}
                style={{ width: "100%", marginTop: "15px", padding: "16px", background: loading ? "#444" : "#e11d48", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: loading ? "not-allowed" : "pointer" }}
              >
                {loading ? "CALCULATING RISK..." : "EXECUTE STRATEGIC AUDIT"}
              </button>
            </div>

            {response && (
              <div style={{ borderLeft: "4px solid #e11d48", background: "#171717", padding: "30px", borderRadius: "0 12px 12px 0" }}>
                <h3 style={{ color: "#e11d48", marginTop: "0" }}>AUDIT REPORT:</h3>
                <div style={{ whiteSpace: "pre-wrap", lineHeight: "1.6", color: "#d4d4d4", fontFamily: "monospace" }}>
                  {response}
                </div>
              </div>
            )}
          </div>

          <div style={{ flex: '1', minWidth: '250px', background: "#111", padding: '20px', borderRadius: '12px', border: '1px solid #262626' }}>
            <h3 style={{ color: '#e11d48', fontSize: '0.9rem', marginBottom: '20px' }}>AUDIT LOGS</h3>
            {history.map((item) => (
              <div 
                key={item.id} 
                onClick={() => { setInput(item.query); setResponse(item.result); setScore(item.score); }}
                style={{ padding: '12px', background: '#1a1a1a', border: '1px solid #333', borderRadius: '6px', marginBottom: '10px', cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <p style={{ color: '#fff', fontSize: '0.8rem', margin: '0', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '70%' }}>{item.query}</p>
                   <span style={{ color: item.score > 70 ? '#e11d48' : '#f59e0b', fontWeight: 'bold' }}>{item.score}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 