import { useState, useEffect } from "react";
import { Code2, Sun, Moon } from "lucide-react";
import Chat from "./components/Chat.jsx";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("codemate-theme") || "light";
  });

  // Apply theme to <html> so CSS vars work globally
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("codemate-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  const handleSend = async (question) => {
    const userMessage = { role: "user", content: question };
    const history = messages.map((m) => ({
      role: m.role,
      content: m.role === "user" ? m.content : m.content,
    }));

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const apiBaseUrl = import.meta.env.VITE_API_URL || "";
      const res = await fetch(`${apiBaseUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, history }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: { error: data.error || "Unable to generate a response right now. Please try again." } },
        ]);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: data }]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: { error: "Network error. Please check your connection and try again." } },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => setMessages([]);

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <div className="brand-mark">
            <Code2 size={18} />
          </div>
          <div className="brand-text">
            <h1>CodeMate AI</h1>
            <p>Your AI Coding Assistant</p>
          </div>
        </div>

        <div className="header-actions">
          {messages.length > 0 && (
            <button className="clear-btn" onClick={handleClear}>
              Clear Chat
            </button>
          )}

          {/* Theme toggle */}
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
          >
            {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          <div className="status-pill">
            <span className="status-dot" />
            <span>AI Online</span>
          </div>
        </div>
      </header>

      <Chat messages={messages} onSend={handleSend} isLoading={isLoading} />
    </div>
  );
}
