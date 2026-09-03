import ReactMarkdown from "react-markdown";
import { Bot, User } from "lucide-react";
import CodeBlock from "./CodeBlock.jsx";
import AccuracyCard from "./AccuracyCard.jsx";
import TestCaseCard from "./TestCaseCard.jsx";
import ReferenceList from "./ReferenceList.jsx";

export default function Message({ role, content }) {
  const isUser = role === "user";

  return (
    <div className={`message-row ${isUser ? "user" : "assistant"}`}>
      <div className="avatar">
        {isUser ? <User size={15} /> : <Bot size={15} />}
      </div>

      <div className="message-content">
        {isUser ? (
          <p>{content}</p>
        ) : content.error ? (
          <div className="error-banner">{content.error}</div>
        ) : (
          <>
            {content.answer && (
              <>
                <div className="section-label">Solution</div>
                <ReactMarkdown
                  components={{
                    // Inline code — rendered by ReactMarkdown
                    code({ node, inline, className, children, ...props }) {
                      const lang = (className || "").replace("language-", "");
                      // Block code inside markdown — wrap in CodeBlock
                      if (!inline && lang) {
                        return (
                          <CodeBlock
                            code={String(children).replace(/\n$/, "")}
                            language={lang}
                          />
                        );
                      }
                      return <code className={className} {...props}>{children}</code>;
                    },
                  }}
                >
                  {content.answer}
                </ReactMarkdown>
              </>
            )}

            {/* Main code block from structured response */}
            {content.code && content.code.trim() && (
              <CodeBlock code={content.code} language={content.language} />
            )}

            {content.explanation && (
              <>
                <div className="section-label">Explanation</div>
                <ReactMarkdown>{content.explanation}</ReactMarkdown>
              </>
            )}

            {typeof content.accuracy === "number" && (
              <>
                <div className="section-label">AI Confidence</div>
                <AccuracyCard accuracy={content.accuracy} reason={content.accuracyReason} />
              </>
            )}

            {content.testCases && (content.testCases.passed > 0 || content.testCases.failed > 0) && (
              <>
                <div className="section-label">Test Cases</div>
                <TestCaseCard passed={content.testCases.passed} failed={content.testCases.failed} />
              </>
            )}

            {content.references !== undefined && (
              <>
                <div className="section-label">References</div>
                <ReferenceList references={content.references} />
              </>
            )}

            {content.summary && (
              <>
                <div className="section-label">Summary</div>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.65 }}>
                  {content.summary}
                </p>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
