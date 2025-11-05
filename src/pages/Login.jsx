import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

function TypedText({ text, speed = 50, className = "" }) {
  const [shown, setShown] = useState("");
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      setShown(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);

  return (
    <span className={className}>
      {shown}
      <span className="inline-block w-[0.6ch] -translate-y-px animate-[blink_1s_steps(2,start)_infinite]">▌</span>
    </span>
  );
}

export default function Login() {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login, setError, error } = useAuth();
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError?.(null);
    try {
      await login(emailOrUsername, password);
      navigate('/dashboard')
 // go home (change to wherever you want)
    } catch (err) {
      setError?.(err.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-[calc(100dvh-theme(spacing.24))] flex items-start md:items-center justify-center px-6 pt-16 md:pt-0">
      <div className="w-full max-w-xl">
        <h1 className="text-5xl md:text-6xl font-semibold tracking-tight text-accent mb-10">
          <TypedText text="Login" speed={75} />
        </h1>

        <form className="space-y-8" onSubmit={onSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm text-text-muted mb-2">
              Email or Username
            </label>
            <input
              id="email"
              name="email"
              type="text"
              autoComplete="username"
              placeholder="you@example.com"
              className="w-full bg-transparent text-text placeholder:text-text-muted/70 border-b border-border focus:border-accent focus:outline-none focus:ring-0 py-3"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm text-text-muted mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full bg-transparent text-text placeholder:text-text-muted/70 border-b border-border focus:border-accent focus:outline-none focus:ring-0 py-3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm" role="alert" aria-live="polite">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center w-full h-12 rounded-xl bg-accent text-bg font-medium hover:bg-accent-hover transition shadow-[var(--shadow-glow)] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
