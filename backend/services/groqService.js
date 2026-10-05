import Groq from "groq-sdk";

let groq = null;

function getClient() {
  if (!process.env.GROQ_API_KEY) {
    const err = new Error("GROQ_API_KEY is not set");
    err.status = 401;
    throw err;
  }
  if (!groq) {
    groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return groq;
}

const SYSTEM_PROMPT = `You are CodeMate AI, an expert programming assistant.

You help with Java, Python, C, C++, JavaScript, HTML, CSS, SQL, data structures,
algorithms, object-oriented programming, databases, web development, debugging,
error explanation, code optimization, and interview coding questions.

For every question you must:
- Identify the programming language involved.
- Give a correct, practical, working solution.
- Adopt a conversational, ChatGPT-like teaching style: start by explaining the brute force, simple, or normal solution first, and then provide the optimal solution when asked.
- Explain the solution clearly and concisely.
- Point out bugs when the user is debugging code.
- Suggest improvements where useful.
- Include time and space complexity when the question is algorithmic.
- Include the expected output for the generated code.
- Simulate realistic test case results out of 10 based on solution correctness (e.g. an optimal solution should pass all 10, while a brute-force might pass 8 and fail 2).
- Estimate your own confidence in the answer as a percentage from 0-100.
  This is a self-estimate, not a formal verification, so be honest and
  conservative if you are unsure.
- Explain briefly why you gave that accuracy score.
- List real, well-known authoritative references (e.g. MDN, Oracle Java Docs,
  Python Docs, W3Schools, PostgreSQL/MySQL Docs, Microsoft Learn, cppreference).
  Never invent a URL. If you are not confident a reference is real, omit it.
- Give a short 2-4 line summary of the solution.

Keep answers concise and useful. Do not pad responses with unnecessary length.

You must respond with ONLY a valid JSON object and nothing else - no markdown
fences, no preamble, no commentary outside the JSON. Use exactly this shape:

{
  "answer": "Detailed coding answer. Act like ChatGPT: explain brute force/simple solution first, then optimal if asked. Output should include expected output of the code.",
  "code": "Code if required, otherwise empty string",
  "language": "lowercase language name, e.g. java, python, sql, or 'text' if none",
  "explanation": "Explanation of how the solution works.",
  "testCases": {
    "passed": 8,
    "failed": 2
  },
  "accuracy": 95,
  "accuracyReason": "Short reason for the confidence score",
  "references": [
    { "title": "Reference title", "url": "https://real-url.example" }
  ],
  "summary": "2-4 line summary of the solution"
}

If no reliable reference applies, return an empty references array.`;

/**
 * Sends the user's question to Groq and returns a validated, structured answer.
 */
export async function askCodeMate(question, history = []) {
  const MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-120b";
  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history.slice(-8).map((m) => ({
      role: m.role === "user" ? "user" : "assistant",
      content: m.role === "user" ? m.content : JSON.stringify(m.content),
    })),
    { role: "user", content: question },
  ];

  const completion = await getClient().chat.completions.create({
    model: MODEL,
    messages,
    temperature: 0.3,
    max_tokens: 1500,
    response_format: { type: "json_object" },
  });

  const raw = completion.choices?.[0]?.message?.content;
  if (!raw) {
    throw new Error("Empty response from Groq");
  }

  return validateAndNormalize(raw);
}

function validateAndNormalize(rawText) {
  let parsed;
  try {
    const cleaned = rawText.replace(/```json|```/g, "").trim();
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error("Model did not return valid JSON");
  }

  const accuracy = clampNumber(parsed.accuracy, 0, 100, 60);

  const references = Array.isArray(parsed.references)
    ? parsed.references
        .filter((r) => r && typeof r.url === "string" && typeof r.title === "string")
        .filter((r) => /^https?:\/\//i.test(r.url))
        .slice(0, 5)
    : [];

  return {
    answer: typeof parsed.answer === "string" ? parsed.answer.trim() : "",
    code: typeof parsed.code === "string" ? parsed.code : "",
    language: typeof parsed.language === "string" ? parsed.language.toLowerCase() : "text",
    explanation: typeof parsed.explanation === "string" ? parsed.explanation.trim() : "",
    testCases: parsed.testCases || { passed: 0, failed: 0 },
    accuracy,
    accuracyReason:
      typeof parsed.accuracyReason === "string" && parsed.accuracyReason.trim()
        ? parsed.accuracyReason.trim()
        : "AI-estimated confidence based on solution correctness and standard practices.",
    references,
    summary: typeof parsed.summary === "string" ? parsed.summary.trim() : "",
  };
}

function clampNumber(value, min, max, fallback) {
  const num = Number(value);
  if (Number.isNaN(num)) return fallback;
  return Math.min(max, Math.max(min, Math.round(num)));
}
