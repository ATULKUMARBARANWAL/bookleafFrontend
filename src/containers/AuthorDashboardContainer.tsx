
"use client";

import { useEffect, useState } from "react";
import type { AuthorBook, AuthorTab } from "@/src/types/author";
import { authorService } from "@/src/services/author.service";
import { demoTickets } from "@/src/services/author.service";
import AuthorHeader from "@/src/components/author/components/AuthorHeader";
import DashboardOverviewSection from "@/src/components/author/sections/DashboardOverviewSection";
import MyBooksSection from "@/src/components/author/sections/MyBooksSection";
import MyTicketsSection from "@/src/components/author/sections/MyTicketsSection";
import SubmitQuerySection from "@/src/components/author/sections/SubmitQuerySection";

const navItems: AuthorTab[] = [
  "Overview",
  "My Books",
  "My Tickets",
  "Submit Query",
];

export default function AuthorDashboardContainer() {
  
  const [activeTab, setActiveTab] = useState<AuthorTab>("Overview");
  const [books, setBooks] = useState<AuthorBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let active = true;

    async function loadBooks() {
      try {
        setLoading(true);
        setError(null);

        const result = await authorService.getMyBooks();
        if (active) {
          setBooks(result);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load your books.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadBooks();

    return () => {
      active = false;
    };
  }, []);

  function navigate(tab: AuthorTab) {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-slate-500">Loading your books...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6">
        <p className="text-center text-red-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-lg bg-emerald-800 px-4 py-2 text-white"
        >
          Try again
        </button>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white p-5 md:flex">
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-800 text-xl font-bold text-white">
              B
            </div>
            <div>
              <p className="text-lg font-bold">BookLeaf</p>
              <p className="text-xs text-slate-500">Author Portal</p>
            </div>
          </div>

          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Workspace
          </p>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => navigate(item)}
                className={`w-full rounded-xl px-4 py-3 text-left text-sm font-medium ${
                  activeTab === item
                    ? "bg-emerald-50 text-emerald-800"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {item}
              </button>
            ))}
          </nav>

          <div className="mt-auto rounded-2xl bg-emerald-50 p-4">
            <p className="font-semibold text-emerald-900">
              Need assistance?
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Contact our support team for help with your books.
            </p>
            <button
              onClick={() => navigate("Submit Query")}
              className="mt-3 text-sm font-semibold text-emerald-800"
            >
              Contact support →
            </button>
          </div>
        </aside>

        <main className="min-w-0 flex-1 pb-20 md:pb-0">
          <AuthorHeader activeTab={activeTab} />

          <div className="p-5 md:p-8">
            {activeTab === "Overview" && (
              <DashboardOverviewSection
                books={books}
                tickets={demoTickets}
                onNavigate={navigate}
              />
            )}

            {activeTab === "My Books" && (
              <MyBooksSection
                books={books}
                onAskQuestion={() => navigate("Submit Query")}
              />
            )}

            {activeTab === "My Tickets" && (
              <MyTicketsSection
                tickets={demoTickets}
                onNewTicket={() => navigate("Submit Query")}
              />
            )}

            {activeTab === "Submit Query" && (
              <SubmitQuerySection books={books} />
            )}
          </div>
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-10 grid grid-cols-4 border-t border-slate-200 bg-white p-2 md:hidden">
        {navItems.map((item) => (
          <button
            key={item}
            onClick={() => navigate(item)}
            className={`rounded-lg px-1 py-3 text-xs ${
              activeTab === item
                ? "bg-emerald-50 font-semibold text-emerald-800"
                : "text-slate-600"
            }`}
          >
            {item}
          </button>
        ))}
      </nav>
    </div>
  );
}
