import { Bot, Send, Sparkles } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { assistantPrompts } from "@/lib/movies";

const messages = [
  {
    role: "assistant",
    text:
      "Ask me about themes, audience reaction, similarities, recommendations, or why a movie worked for viewers."
  },
  {
    role: "user",
    text: "Suggest movies with time travel and emotional storytelling."
  },
  {
    role: "assistant",
    text:
      "Based on retrieved movie context, start with Interstellar, Arrival, About Time, and Your Name. They combine time, memory, grief, and human connection instead of using time travel only as a plot device."
  }
];

export default function AssistantPage() {
  return (
    <main className="min-h-screen bg-ink">
      <Navigation />
      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-10 lg:grid-cols-[0.82fr_1.18fr]">
        <aside className="rounded-md border border-white/10 bg-white/[0.045] p-6">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded bg-ember">
              <Bot size={22} />
            </span>
            <div>
              <h1 className="text-2xl font-semibold">Movie Assistant</h1>
              <p className="text-sm text-white/52">RAG chat with citation-ready context</p>
            </div>
          </div>
          <div className="mt-7 space-y-3">
            {assistantPrompts.map((prompt) => (
              <button
                key={prompt}
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
            <h2 className="text-xl font-semibold">Grounded answer workspace</h2>
            <p className="mt-1 text-sm text-white/52">Backend endpoint: POST /api/v1/ai/chat</p>
          </div>
          <div className="flex-1 space-y-5 p-5">
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
          </div>
          <div className="border-t border-white/10 p-4">
            <div className="flex items-center gap-3 rounded-md border border-white/10 bg-ink p-2">
              <input
                className="min-w-0 flex-1 bg-transparent px-3 py-3 outline-none placeholder:text-white/35"
                placeholder="Ask: Compare Dune 2 and Blade Runner 2049..."
              />
              <button className="grid h-11 w-11 place-items-center rounded bg-ember text-white">
                <Send size={18} />
              </button>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
