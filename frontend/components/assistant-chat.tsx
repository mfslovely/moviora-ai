"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Bot, Database, Send, Sparkles } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { assistantPrompts, movies } from "@/lib/movies";

const CHAT_API_URL = "/api/ai/chat";

type ChatMessage = {
  role: "assistant" | "user";
  text: string;
};

const fallbackMessages: ChatMessage[] = [
  {
    role: "assistant",
    text: "Hi, I am Moviora AI. Ask me about a movie story, cast, filming location, reviews, recommendations, or comparisons."
  }
];

async function postJson(url: string, payload: unknown) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}

export function AssistantChat() {
  const searchParams = useSearchParams();
  const movieId = searchParams.get("movieId");
  const initialQuestion = searchParams.get("question");
  const selectedMovie = useMemo(() => movies.find((movie) => movie.id === movieId), [movieId]);
  const [input, setInput] = useState(initialQuestion ?? "");
  const [messages, setMessages] = useState<ChatMessage[]>(fallbackMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState("Your conversation can be saved when you are signed in.");
  const didAutoAsk = useRef(false);
  const sessionIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (initialQuestion && !didAutoAsk.current) {
      didAutoAsk.current = true;
      void askQuestion(initialQuestion, movieId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function ensureSession(activeMovieId: string | null) {
    if (sessionIdRef.current) {
      return sessionIdRef.current;
    }

    const session = await postJson("/api/db/chat-sessions", {
      user_id: getCurrentUser()?.id ?? null,
      movie_id: activeMovieId,
      title: activeMovieId ? `Chat about ${activeMovieId}` : "Movie assistant chat"
    });

    if (session?.id) {
      sessionIdRef.current = session.id;
      setSaveStatus("Saving this conversation to your library.");
      return session.id as number;
    }

    setSaveStatus("Chat works now. Sign in later to keep your conversation history.");
    return null;
  }

  async function saveMessage(role: "assistant" | "user", content: string, activeMovieId: string | null) {
    const sessionId = await ensureSession(activeMovieId);
    if (!sessionId) {
      return;
    }

    const saved = await postJson("/api/db/chat-messages", {
      session_id: sessionId,
      role,
      content
    });

    if (!saved?.id) {
      setSaveStatus("Conversation could not be saved right now. You can still keep chatting.");
    }
  }

  async function fetchAiAnswer(question: string, activeMovieId: string | null) {
    const response = await fetch(CHAT_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question,
        movie_id: activeMovieId,
        top_k: 6
      })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error ?? "Backend unavailable");
    }

    return data.answer as string;
  }

  async function askQuestion(question: string, activeMovieId = movieId) {
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion || isLoading) {
      return;
    }

    setMessages((current) => [...current, { role: "user", text: trimmedQuestion }]);
    setInput("");
    setIsLoading(true);
    void saveMessage("user", trimmedQuestion, activeMovieId);

    try {
      const answer = await fetchAiAnswer(trimmedQuestion, activeMovieId);
      setMessages((current) => [...current, { role: "assistant", text: answer }]);
      void saveMessage("assistant", answer, activeMovieId);
    } catch (error) {
      const message = error instanceof Error ? error.message : "unknown error";
      const answer = `AI backend is not reachable right now (${message}). Start backend with: uvicorn app.main:app --reload`;
      setMessages((current) => [...current, { role: "assistant", text: answer }]);
      void saveMessage("assistant", answer, activeMovieId);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void askQuestion(input);
  }

  return (
    <section className="mx-auto grid max-w-7xl gap-6 px-5 py-10 lg:grid-cols-[0.82fr_1.18fr]">
      <aside className="rounded-md border border-white/10 bg-white/[0.045] p-6">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded bg-ember">
            <Bot size={22} />
          </span>
          <div>
            <h1 className="text-2xl font-semibold">Movie Assistant</h1>
            <p className="text-sm text-white/52">
              {selectedMovie ? `Focused on ${selectedMovie.title}` : "Personal movie guide"}
            </p>
          </div>
        </div>
        <div className="mt-5 flex items-start gap-2 rounded border border-white/10 bg-ink/60 p-3 text-xs leading-5 text-white/52">
          <Database size={15} className="mt-0.5 shrink-0 text-mint" />
          {saveStatus}
        </div>
        <div className="mt-7 space-y-3">
          {assistantPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => askQuestion(prompt)}
              className="flex w-full items-center gap-3 rounded border border-white/10 bg-white/[0.04] p-3 text-left text-sm text-white/72 transition hover:border-ember/40 hover:text-white"
            >
              <Sparkles size={16} className="shrink-0 text-saffron" />
              {prompt}
            </button>
          ))}
        </div>
      </aside>
      <section className="flex min-h-[620px] flex-col rounded-md border border-white/10 bg-white/[0.045]">
        <div className="border-b border-white/10 p-5">
          <h2 className="text-xl font-semibold">AI Movie Chat</h2>
          <p className="mt-1 text-sm text-white/52">Ask about plots, cast, ratings, filming locations, reviews, comparisons, and recommendations.</p>
        </div>
        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`max-w-[84%] rounded-md p-4 leading-7 ${
                message.role === "user"
                  ? "ml-auto bg-ember text-white"
                  : "border border-white/10 bg-ink/70 text-white/74"
              }`}
            >
              {message.text}
            </div>
          ))}
          {isLoading ? (
            <div className="max-w-[84%] rounded-md border border-white/10 bg-ink/70 p-4 text-white/55">
              Asking OpenAI with movie context...
            </div>
          ) : null}
        </div>
        <div className="border-t border-white/10 p-4">
          <form onSubmit={handleSubmit} className="flex items-center gap-3 rounded-md border border-white/10 bg-ink p-2">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              className="min-w-0 flex-1 bg-transparent px-3 py-3 outline-none placeholder:text-white/35"
              placeholder="Ask: Where was Arrival filmed?"
            />
            <button className="grid h-11 w-11 place-items-center rounded bg-ember text-white" disabled={isLoading}>
              <Send size={18} />
            </button>
          </form>
        </div>
      </section>
    </section>
  );
}



