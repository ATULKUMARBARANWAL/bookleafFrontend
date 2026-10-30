
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authService } from "@/src/services/auth.service";
import type { UserRole } from "@/src/types/auth.types";

interface LoginFormProps {
  role: UserRole;
}

const testAuthors = [
  "priya.sharma@email.com",
  "diya.chatterjee@email.com",
  "farhan.sheikh@email.com",
  "kavita.deshmukh@email.com",
  "vikram.joshi@email.com",
];

const TEST_AUTHOR_PASSWORD = "Author@123";
const TEST_ADMIN_EMAIL = "admin@bookleaf.com";
const TEST_ADMIN_PASSWORD = "Admin@123";

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
        throw new Error(
          "You are not authorized to access this portal."
        );
      }

      router.push(
        isAdmin ? "/admin/dashboard" : "/author/dashboard"
      );
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function selectTestAuthor(testEmail: string) {
    setEmail(testEmail);
    setPassword(TEST_AUTHOR_PASSWORD);
    setError("");
  }

  function selectTestAdmin() {
    setEmail(TEST_ADMIN_EMAIL);
    setPassword(TEST_ADMIN_PASSWORD);
    setError("");
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
      <Link
        href="/"
        className="text-xl font-bold text-emerald-800"
      >
        BookLeaf.
      </Link>

      <h1 className="mt-7 text-3xl font-bold text-slate-900">
        {title}
      </h1>

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
          <p
            role="alert"
            className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
          >
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

      {/* Test Credentials */}
      {isAdmin ? (
        <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-4">
          <h3 className="text-sm font-bold text-blue-900">
            Test Admin Credentials
          </h3>

          <p className="mt-2 break-all text-xs text-slate-700">
            {TEST_ADMIN_EMAIL}
          </p>

          <p className="mt-2 text-xs font-semibold text-blue-900">
            Password: {TEST_ADMIN_PASSWORD}
          </p>

          <button
            type="button"
            onClick={selectTestAdmin}
            className="mt-3 w-full rounded-lg bg-blue-800 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-900"
          >
            Use Admin Credentials
          </button>
        </div>
      ) : (
        <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <h3 className="text-sm font-bold text-emerald-900">
            Test Author Credentials
          </h3>

          <p className="mt-2 text-xs text-emerald-700">
            Select any account to autofill login details.
          </p>

          <div className="mt-3 space-y-2">
            {testAuthors.map((testEmail) => (
              <div
                key={testEmail}
                className="flex items-center justify-between gap-2 rounded-lg bg-white p-2"
              >
                <span className="break-all text-xs text-slate-700">
                  {testEmail}
                </span>

                <button
                  type="button"
                  onClick={() => selectTestAuthor(testEmail)}
                  className="shrink-0 rounded-md bg-emerald-800 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-900"
                >
                  Use
                </button>
              </div>
            ))}
          </div>

          <div className="mt-3 rounded-lg bg-emerald-100 px-3 py-2">
            <p className="text-xs font-semibold text-emerald-900">
              Password: {TEST_AUTHOR_PASSWORD}
            </p>
          </div>
        </div>
      )}

      <p className="mt-6 text-center text-sm text-slate-500">
        {isAdmin
          ? "Are you an author?"
          : "Are you an administrator?"}{" "}
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
