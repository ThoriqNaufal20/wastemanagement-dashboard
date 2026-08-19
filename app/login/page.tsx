"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock } from "lucide-react";
import { Logo } from "@/components/dashboard/logo";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    setLoading(false);

    if (res.ok) {
      const redirectTo = searchParams.get("from") || "/dashboard";
      router.push(redirectTo);
      router.refresh();
    } else {
      setError("Password salah, coba lagi.");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/20 p-6">
      <div className="w-full max-w-sm rounded-2xl bg-card p-8 shadow-[0_4px_6px_rgba(16,24,40,0.05),0_10px_15px_rgba(16,24,40,0.08)]">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <Logo size={48} className="rounded-2xl" />
          <div>
            <h1 className="text-lg font-semibold text-foreground">
              Waste Management Dashboard
            </h1>
            <p className="mt-1 text-xs text-muted-foreground">
              PT. Adira Semesta Industry
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-xs font-medium text-muted-foreground"
            >
              Password akses
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                autoFocus
                className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-3 text-sm text-foreground outline-none ring-primary/30 transition-shadow focus:ring-2"
              />
            </div>
          </div>

          {error && <p className="text-xs text-status-critical">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Memeriksa..." : "Masuk"}
          </button>
        </form>

        <p className="mt-6 text-center text-[11px] text-muted-foreground">
          Akses internal — hubungi admin kalau lupa password.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
