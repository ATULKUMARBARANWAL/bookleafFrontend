
"use client";

import { useCallback, useEffect, useState } from "react";
import type { AuthorBook, SupportTicket } from "@/src/types/author";
import { ticketService } from "@/src/services/ticket.service";
import TicketCard from "../components/TicketCard";
import SubmitQuerySection from "./SubmitQuerySection";

type Props = {
  books: AuthorBook[];
  onNewTicket?: () => void;
};

export default function MyTicketsSection({ books }: Props) {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadTickets = useCallback(async () => {
    try {
      setError("");
      const result = await ticketService.getMyTickets();
      setTickets(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load your support tickets.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTickets();
  }, [loadTickets]);

  useEffect(() => {
    if (!isModalOpen) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsModalOpen(false);
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isModalOpen]);

  return (
    <>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              My Support Tickets
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Track your queries and support responses.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="rounded-xl bg-emerald-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-900"
          >
            + New Ticket
          </button>
        </div>

        <div className="mt-5 space-y-3">
          {loading ? (
            <p className="py-8 text-center text-sm text-slate-500">
              Loading your tickets...
            </p>
          ) : error ? (
            <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
              <p>{error}</p>
              <button
                type="button"
                onClick={() => {
                  setLoading(true);
                  void loadTickets();
                }}
                className="mt-2 font-semibold underline"
              >
                Try again
              </button>
            </div>
          ) : tickets.length === 0 ? (
            <div className="rounded-xl bg-slate-50 px-4 py-10 text-center">
              <p className="font-medium text-slate-700">
                No support tickets yet
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Submit a query to get help from the BookLeaf support team.
              </p>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="mt-4 text-sm font-semibold text-emerald-800 hover:underline"
              >
                Create your first ticket
              </button>
            </div>
          ) : (
            <>
              {tickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))}

              <div className="border-t border-slate-100 pt-3 text-xs text-slate-400">
                Total tickets: {tickets.length}
              </div>

              <button
                type="button"
                onClick={() => {
                  setLoading(true);
                  void loadTickets();
                }}
                className="text-sm font-medium text-emerald-800 hover:underline"
              >
                Refresh tickets
              </button>
            </>
          )}
        </div>
      </section>

      {/* New Ticket Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3 backdrop-blur-sm sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsModalOpen(false);
            }
          }}
        >
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-3">
  <div className="relative max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
    <button
      type="button"
      onClick={() => setIsModalOpen(false)}
      aria-label="Close modal"
      className="absolute right-5 top-5 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
    >
      ✕
    </button>

    <h2 className="pr-10 text-xl font-semibold tracking-tight text-slate-900">
      Create New Ticket
    </h2>
    <p className="mt-1 text-sm text-slate-500">
      Tell us how we can help you.
    </p>

    <div className="mt-5 border-t border-slate-100 pt-5">
      <SubmitQuerySection
        books={books ?? []}
        onTicketCreated={async () => {
          await loadTickets();
          setIsModalOpen(false);
        }}
      />
    </div>
  </div>
</div>
        </div>
      )}
    </>
  );
}
