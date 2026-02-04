"use client";
import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [audit, setAudit] = useState("");
  const [loading, setLoading] = useState(false);

  const executeAudit = async () => {
    if (!text) return alert("Bhai, idea toh likho!");
    setLoading(true);
    setAudit("");

    try {
      // Sahi path: kyunki root directory ab blank hai
      const response = await fetch("/api/challenge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      
      if (data.error) {
        setAudit(`ERROR: ${data.error}`);
      } else {
        setAudit(data.response);
      }
    } catch (err) {
      setAudit("CRITICAL_ERROR: Node Connection Lost.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif", maxWidth: "600px", margin: "0 auto" }}>
      <h1>😈 Devil's Advocate AI</h1>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Apna startup idea dalo yahan..."
        style={{ width: "100%", height: "150px", marginBottom: "1rem", padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
      />
      <button
        onClick={executeAudit}
        disabled={loading}
        style={{
          width: "100%",
          padding: "1rem",
          backgroundColor: loading ? "#666" : "#e63946",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold"
        }}
      >
        {loading ? "SAVAGING YOUR IDEA..." : "EXECUTE STRATEGIC AUDIT"}
      </button>

      {audit && (
        <div style={{ marginTop: "2rem", padding: "1rem", backgroundColor: "#f1f1f1", borderRadius: "8px" }}>
          <h3>AUDIT REPORT:</h3>
          <pre style={{ whiteSpace: "pre-wrap" }}>{audit}</pre>
        </div>
      )}
    </main>
  );
}