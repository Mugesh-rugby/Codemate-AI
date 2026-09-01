import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check } from "lucide-react";

export default function CodeBlock({ code, language }) {
  const [copied, setCopied] = useState(false);

  if (!code || !code.trim()) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable
    }
  };

  const displayLang = (language || "text").toLowerCase();

  return (
    <div className="code-block">
      {/* ── Header bar ── */}
      <div className="code-block-header">
        <span className="code-lang-label">{displayLang}</span>
        <button
          className={`copy-btn${copied ? " copied" : ""}`}
          onClick={handleCopy}
          title="Copy code"
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          <span>{copied ? "Copied!" : "Copy code"}</span>
        </button>
      </div>

      {/* ── Code body — white background, clean oneLight theme ── */}
      <div className="code-body">
        <SyntaxHighlighter
          language={displayLang}
          style={oneLight}
          showLineNumbers={true}
          lineNumberStyle={{
            minWidth: "3em",
            paddingRight: "1.2em",
            color: "#aaa",
            fontSize: "12px",
            userSelect: "none",
            textAlign: "right",
          }}
          customStyle={{
            margin: 0,
            padding: "16px 20px",
            background: "#fafafa",
            fontSize: "13.5px",
            lineHeight: "1.7",
            fontFamily:
              '"JetBrains Mono", "Fira Code", "SFMono-Regular", Consolas, monospace',
            borderRadius: 0,
            overflowX: "auto",
          }}
          codeTagProps={{
            style: {
              fontFamily: "inherit",
              fontSize: "inherit",
            },
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
