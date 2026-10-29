"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authService } from "@/src/services/auth.service";
import type { UserRole } from "@/src/types/auth.types";

interface LoginFormProps {
  role: UserRole;
}

export default function LoginForm({ role }: LoginFormProps) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isAdmin = role === "ADMIN";
  const title = isAdmin ? "Admin Login" : "Author Login";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authService.login({
        email: email.trim(),
        password,
        role,
      });
      if (response.user && response.user.role !== role) {
        throw new Error("You are not authorized to access this portal.");
      }

      // Assumes the backend sets the authentication cookie.
      // Change these destinations to your actual dashboard routes.
      router.push(isAdmin ? "/admin/dashboard" : "/author/dashboard");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
      <Link
        href="/"
        className="text-xl font-bold text-emerald-800"
      >
        BookLeaf.
      </Link>

      <h1 className="mt-7 text-3xl font-bold text-slate-900">{title}</h1>

      <p className="mt-2 text-sm text-slate-500">
        Enter your credentials to continue.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label
            htmlFor={`${role}-email`}
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Email address
          </label>

          <input
            id={`${role}-email`}
            type="email"
            autoComplete="username"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <div>
          <label
            htmlFor={`${role}-password`}
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Password
          </label>

          <input
            id={`${role}-password`}
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        {error && (
          <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-emerald-800 px-4 py-3 font-semibold text-white transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        {isAdmin ? "Are you an author?" : "Are you an administrator?"}{" "}
        <Link
          href={isAdmin ? "/author/login" : "/admin/login"}
          className="font-semibold text-emerald-800 hover:underline"
        >
          {isAdmin ? "Author Login" : "Admin Login"}
        </Link>
      </p>
    </div>
  );
}