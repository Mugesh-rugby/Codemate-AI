import { Terminal, Sparkles } from "lucide-react";

const SUGGESTIONS = [
  { icon: "💻", text: "Explain recursion in Java" },
  { icon: "🐍", text: "Fix this Python error: list index out of range" },
  { icon: "🗄️", text: "Write a MySQL query to find duplicate records" },
  { icon: "⚡", text: "What is the time complexity of binary search?" },
];

export default function WelcomeScreen({ onPick }) {
  return (
    <div className="welcome-screen">
      <div className="welcome-icon">
        <Terminal size={26} />
      </div>
      <div>
        <h2>How can I help you code today?</h2>
        <p style={{ marginTop: 8 }}>
          Ask a coding question, paste an error, or drop in a snippet — I'll
          walk you through the fix.
        </p>
      </div>
      <div className="suggestion-grid">
        {SUGGESTIONS.map((s) => (
          <button
            key={s.text}
            className="suggestion-card"
            onClick={() => onPick(s.text)}
          >
            <span style={{ fontSize: 18, lineHeight: 1 }}>{s.icon}</span>
            <span>{s.text}</span>
          </button>
        ))}
      </div>
      <p style={{ fontSize: 12, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 5 }}>
        <Sparkles size={12} />
        Powered by Groq
      </p>
    </div>
  );
}
