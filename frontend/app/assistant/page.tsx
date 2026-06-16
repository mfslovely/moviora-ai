import { Suspense } from "react";
import { Navigation } from "@/components/navigation";
import { AssistantChat } from "@/components/assistant-chat";

export default function AssistantPage() {
  return (
    <main className="min-h-screen bg-ink">
      <Navigation />
      <Suspense fallback={<div className="mx-auto max-w-7xl px-5 py-10 text-white/60">Loading assistant...</div>}>
        <AssistantChat />
      </Suspense>
    </main>
  );
}
