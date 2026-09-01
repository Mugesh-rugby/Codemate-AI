# CodeMate AI

**Your AI Coding Assistant** — a chatbot for programming questions, debugging,
and code explanations, powered by the Groq API.

## Features

- Coding chatbot for Java, Python, C, C++, JavaScript, HTML, CSS, SQL,
  data structures, algorithms, OOP, databases, web dev, and interview questions
- AI-generated code with syntax highlighting and a copy button
- AI Estimated Accuracy score with confidence labels (Highly / Mostly /
  Moderate / Low Confidence)
- Accuracy reasoning for every answer
- Authoritative documentation references (no fabricated links)
- Short 2–4 line summaries
- Markdown rendering in responses
- Fully responsive UI (desktop, tablet, mobile)
- Friendly error handling for API/network failures

## Tech Stack

**Frontend:** React, Vite, plain CSS, react-markdown, react-syntax-highlighter, lucide-react
**Backend:** Node.js, Express
**AI:** Groq API (`groq-sdk`)
**Env management:** dotenv

## Project Structure

```
codemate-ai/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Chat.jsx
│   │   │   ├── Message.jsx
│   │   │   ├── CodeBlock.jsx
│   │   │   ├── AccuracyCard.jsx
│   │   │   ├── ReferenceList.jsx
│   │   │   └── WelcomeScreen.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── backend/
│   ├── server.js
│   ├── routes/chat.js
│   ├── services/groqService.js
│   ├── .env.example
│   └── package.json
│
└── README.md
```

## Installation

### 1. Clone / unzip the project

### 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env` and add your key:

```env
GROQ_API_KEY=your_api_key_here
```

Get a free key at https://console.groq.com/keys

Start the backend:

```bash
npm start
```

The API runs at `http://localhost:5000`.

### 3. Frontend setup

In a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173` and proxies `/api` requests to the backend.

## How It Works

1. The user submits a question in the chat input.
2. The frontend sends it to the backend at `POST /api/chat`.
3. The backend calls the Groq API with a system prompt that instructs the
   model to return structured JSON (answer, code, language, explanation,
   accuracy, accuracyReason, references, summary).
4. The backend validates and normalizes the response (clamps accuracy to
   0–100, strips invalid reference URLs) before sending it to the frontend.
5. The frontend renders the structured answer as a message card with a
   code block, accuracy bar, references, and summary.

## Security

- `GROQ_API_KEY` is only ever read on the backend (`process.env`).
- The frontend never receives or stores the API key.
- `.env` is included in `.gitignore`.

## Screenshots

_Add screenshots of the welcome screen and a sample AI response here._

## Future Improvements

- User authentication
- Persistent chat history (database)
- In-browser code execution
- Automated test-case generation
- GitHub integration
- Support for multiple AI models
- Voice coding assistant
- AI code review
- Advanced web search for references
- IDE extension
- Code file upload
