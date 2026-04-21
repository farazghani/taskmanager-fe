"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import API from "@/api/api";
import { TaskflowShell } from "@/components/taskflow-shell";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getErrorMessage = (error: unknown, fallback: string) => {
    if (
      typeof error === "object" &&
      error !== null &&
      "response" in error
    ) {
      const response = (error as { response?: { data?: { msg?: string } } })
        .response;
      return response?.data?.msg || fallback;
    }

    return fallback;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const detail = {
      email: email.trim().toLowerCase(),
      password: password.trim(),
    };

    if (!detail.email || !detail.password) {
      setError("All fields are required.");
      return;
    }

    const emailPattern = /\S+@\S+\.\S+/;
    if (!emailPattern.test(detail.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const res = await API.post("/user/login", detail);
      localStorage.setItem("token", res.data.token);
      router.push("/tasks");
    } catch (error: unknown) {
      setError(getErrorMessage(error, "Login failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <TaskflowShell mode="login">
      <div className="mx-auto w-full max-w-xl">
        <p className="text-2xl font-semibold tracking-tight text-[#f5efe7] sm:text-4xl xl:text-5xl">
          Welcome back
        </p>
        <p className="mt-2 text-sm leading-7 text-[#d0c9c0] sm:mt-4 sm:text-lg sm:leading-8">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-[#6b5cff] transition-colors hover:text-[#8a7cff]"
          >
            Sign up free
          </Link>
        </p>

        <form onSubmit={handleLogin} className="mt-6 space-y-4 sm:mt-10 sm:space-y-6">
          {error ? (
            <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
              {error}
            </div>
          ) : null}

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-[#c6beb3] sm:mb-3 sm:text-sm">
              Email address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-[#3a3834] px-5 py-3 text-base text-[#f7f1e8] placeholder:text-[#8d857a] outline-none transition focus:border-[#7c6bff] focus:ring-2 focus:ring-[#7c6bff]/20 sm:px-6 sm:py-4 sm:text-lg"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-[#c6beb3] sm:mb-3 sm:text-sm">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-[#3a3834] px-5 py-3 text-base text-[#f7f1e8] placeholder:text-[#8d857a] outline-none transition focus:border-[#7c6bff] focus:ring-2 focus:ring-[#7c6bff]/20 sm:px-6 sm:py-4 sm:text-lg"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="text-sm font-medium text-[#6b5cff] transition-colors hover:text-[#8a7cff] sm:text-lg"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`flex w-full items-center justify-center rounded-2xl border border-white/16 px-6 py-3 text-lg font-medium text-white transition sm:py-4 sm:text-2xl ${
              loading
                ? "cursor-not-allowed bg-[#484540] text-white/60"
                : "bg-[#3d3a37] hover:-translate-y-0.5 hover:bg-[#46423e]"
            }`}
          >
            {loading ? "Signing in..." : "Sign in to TaskFlow"}
          </button>
        </form>
      </div>
    </TaskflowShell>
  );
};

export default LoginPage;
