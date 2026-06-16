import { Navigation } from "@/components/navigation";
import { SignupForm } from "@/components/signup-form";

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-ink">
      <Navigation />
      <section className="mx-auto grid max-w-5xl gap-8 px-5 py-14 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-ember">Moviora account</p>
          <h1 className="mt-3 text-5xl font-semibold leading-tight">Create your movie library</h1>
          <p className="mt-5 max-w-xl leading-8 text-white/68">
            Save movies, keep your watchlist, and continue AI conversations from your personal dashboard.
          </p>
        </div>
        <SignupForm />
      </section>
    </main>
  );
}
