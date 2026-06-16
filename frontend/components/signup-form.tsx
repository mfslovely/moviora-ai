"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import { setCurrentUser } from "@/lib/auth";

export function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/db/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Signup failed");
      }

      setCurrentUser(data);
      router.push("/dashboard");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Signup failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-md border border-white/10 bg-white/[0.045] p-6">
      <div className="mb-6 flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded bg-ember">
          <UserPlus size={22} />
        </span>
        <div>
          <h2 className="text-2xl font-semibold">Sign up</h2>
          <p className="text-sm text-white/52">Name and email are enough to start.</p>
        </div>
      </div>
      <label className="block text-sm text-white/62">Name</label>
      <input
        value={name}
        onChange={(event) => setName(event.target.value)}
        required
        className="mt-2 w-full rounded border border-white/10 bg-ink px-4 py-3 outline-none focus:border-ember"
        placeholder="Lovely Gupta"
      />
      <label className="mt-5 block text-sm text-white/62">Email</label>
      <input
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
        type="email"
        className="mt-2 w-full rounded border border-white/10 bg-ink px-4 py-3 outline-none focus:border-ember"
        placeholder="lovely@example.com"
      />
      {status ? <p className="mt-4 rounded border border-ember/30 bg-ember/10 p-3 text-sm text-white/72">{status}</p> : null}
      <button className="mt-6 w-full rounded bg-ember px-5 py-3 font-medium text-white" disabled={isLoading}>
        {isLoading ? "Creating..." : "Continue"}
      </button>
    </form>
  );
}

