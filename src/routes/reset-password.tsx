import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, CheckCircle } from "lucide-react";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [{ title: "Set New Password | LUMEN Client Dashboard" }],
  }),
  validateSearch: (search: Record<string, unknown>) => ({
    token: (search["token"] as string) || "",
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const { token } = Route.useSearch();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to reset password");
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md text-center">
          <Link to="/" className="inline-block">
            <span className="font-display text-3xl font-bold tracking-[0.25em] text-foreground">
              LUMEN
            </span>
            <span className="block text-[10px] font-medium uppercase tracking-[0.35em] text-gold">
              Digital Experiences
            </span>
          </Link>
          <h1 className="mt-8 font-display text-3xl text-foreground">
            Invalid Link
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This password reset link is invalid or missing a token.
          </p>
          <Link
            to="/forgot-password"
            className="mt-6 inline-block text-sm font-medium text-gold underline underline-offset-4 transition-colors hover:text-gold/80"
          >
            Request a new reset link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center">
          <Link to="/" className="inline-block">
            <span className="font-display text-3xl font-bold tracking-[0.25em] text-foreground">
              LUMEN
            </span>
            <span className="block text-[10px] font-medium uppercase tracking-[0.35em] text-gold">
              Digital Experiences
            </span>
          </Link>
          <h1 className="mt-8 font-display text-3xl text-foreground">
            Set New Password
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your new password below.
          </p>
        </div>

        {success ? (
          <div className="mt-8 rounded-xl border border-gold/30 bg-gold/5 p-6 text-center">
            <CheckCircle className="mx-auto h-10 w-10 text-gold" />
            <p className="mt-4 text-sm text-foreground">
              Your password has been reset successfully.
            </p>
            <button
              onClick={() => navigate({ to: "/login" })}
              className="mt-6 inline-block text-sm font-medium text-gold underline underline-offset-4 transition-colors hover:text-gold/80"
            >
              Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                New Password
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                placeholder="Minimum 8 characters"
              />
            </div>

            <div>
              <label
                htmlFor="confirm"
                className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Confirm Password
              </label>
              <input
                id="confirm"
                type="password"
                required
                minLength={8}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                placeholder="Re-enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-full gold-fill px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-gold-glow transition hover:brightness-110 disabled:opacity-50"
            >
              <Lock className="h-4 w-4" />
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link
            to="/login"
            className="font-medium text-gold underline underline-offset-4 transition-colors hover:text-gold/80"
          >
            Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
