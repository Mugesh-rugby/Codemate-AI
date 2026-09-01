import { useEffect, useRef, useState } from "react";
import { Plus, Send, Bot } from "lucide-react";
import Message from "./Message.jsx";
import WelcomeScreen from "./WelcomeScreen.jsx";

export default function Chat({ messages, onSend, isLoading }) {
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleChange = (e) => {
    setInput(e.target.value);
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 180)}px`;
    }
  };

  return (
    <>
      {messages.length === 0 ? (
        <WelcomeScreen onPick={(q) => setInput(q)} />
      ) : (
        <div className="chat-area">
          {messages.map((m, i) => (
            <Message key={i} role={m.role} content={m.content} />
          ))}

          {isLoading && (
            <div className="thinking-row">
              <div className="avatar" style={{ background: "var(--primary)" }}>
                <Bot size={15} color="white" />
              </div>
              <div className="thinking-bubble">
                <span>CodeMate is thinking</span>
                <span className="dot-pulse">
                  <span />
                  <span />
                  <span />
                </span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>
      )}

      <div className="input-area">
        <div className="input-box">
          <button className="icon-btn" title="Attach (coming soon)" disabled>
            <Plus size={16} />
          </button>
          <textarea
            ref={textareaRef}
            rows={1}
            placeholder="Ask anything about coding..."
            value={input}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
          <button
            className="send-btn"
            onClick={handleSubmit}
            disabled={!input.trim() || isLoading}
            title="Send message"
          >
            <Send size={15} />
          </button>
        </div>
        <p className="input-hint">Enter to send · Shift + Enter for a new line</p>
      </div>
    </>
  );
}
