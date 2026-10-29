
"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import type { AuthorBook } from "@/src/types/author";
import {
  ticketService,
  type SupportTicket,
} from "@/src/services/ticket.service";

type Props = {
  books?: AuthorBook[];
  onTicketCreated?: () => void | Promise<void>;
};

const statusStyles: Record<SupportTicket["status"], string> = {
  Open: "bg-blue-50 text-blue-700",
  "In Progress": "bg-amber-50 text-amber-700",
  Resolved: "bg-emerald-50 text-emerald-700",
  Closed: "bg-slate-100 text-slate-600",
};

export default function SubmitQuerySection({
  books = [],
  onTicketCreated,
}: Props) {
  const [bookId, setBookId] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);

  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadTickets = useCallback(async () => {
    try {
      setError("");

      const result = await ticketService.getMyTickets();
      setTickets(Array.isArray(result) ? result : []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load tickets.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTickets();
  }, [loadTickets]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!subject.trim() || !description.trim()) {
      setError("Please enter a subject and describe your issue.");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      // File upload is not implemented yet.
      void attachment;

      await ticketService.createTicket({
        bookId: bookId ? Number(bookId) : null,
        subject: subject.trim(),
        description: description.trim(),
      });

      setSubject("");
      setDescription("");
      setBookId("");
      setAttachment(null);

      const fileInput = document.getElementById(
        "ticket-attachment",
      ) as HTMLInputElement | null;

      if (fileInput) {
        fileInput.value = "";
      }

      setSuccess("Your support ticket has been submitted successfully.");

      if (onTicketCreated) {
        await onTicketCreated();
      } else {
        await loadTickets();
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to submit your ticket. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Create ticket form */}
      <section className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-5 md:p-8">
        <h2 className="text-xl font-bold">Submit a Support Query</h2>

        <p className="mt-2 text-sm text-slate-500">
          Describe your issue so our support team can assist you.
        </p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          <div>
            <label
              htmlFor="bookId"
              className="mb-2 block text-sm font-medium"
            >
              Related book
            </label>

            <select
              id="bookId"
              value={bookId}
              onChange={(event) => setBookId(event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm"
            >
              <option value="">General / Account Level</option>

              {books.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="subject"
              className="mb-2 block text-sm font-medium"
            >
              Subject
            </label>

            <input
              id="subject"
              required
              maxLength={150}
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              placeholder="e.g. Royalty payment not received"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium"
            >
              Describe your issue
            </label>

            <textarea
              id="description"
              required
              minLength={10}
              maxLength={5000}
              rows={6}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Provide details about your issue..."
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="ticket-attachment"
              className="mb-2 block text-sm font-medium"
            >
              Attachment (optional)
            </label>

            <input
              id="ticket-attachment"
              type="file"
              accept="image/*,.pdf"
              onChange={(event) =>
                setAttachment(event.target.files?.[0] ?? null)
              }
              className="block w-full rounded-xl border border-slate-300 p-3 text-sm"
            />

            {attachment && (
              <p className="mt-2 text-xs text-slate-500">
                Selected: {attachment.name}
              </p>
            )}

            <p className="mt-1 text-xs text-slate-400">
              File upload is not connected yet.
            </p>
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          {success && (
            <p
              role="status"
              className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800"
            >
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-emerald-800 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Submit Query"}
          </button>
        </form>
      </section>

      {/* Tickets table */}
      {/* <section className="rounded-2xl border border-slate-200 bg-white p-5 md:p-8">
        <div className="mb-5">
          <h2 className="text-xl font-bold">My Support Tickets</h2>

          <p className="mt-1 text-sm text-slate-500">
            View your submitted queries and their current status.
          </p>
        </div>

        {loading ? (
          <p className="py-8 text-center text-sm text-slate-500">
            Loading tickets...
          </p>
        ) : tickets.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-500">
            No support tickets yet. Submit your first query above.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500">
                  <th className="px-4 py-3 font-medium">Ticket ID</th>
                  <th className="px-4 py-3 font-medium">Subject</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Priority</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>

              <tbody>
                {tickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                  >
                    <td className="px-4 py-4 font-medium">
                      #{ticket.id}
                    </td>

                    <td className="max-w-xs px-4 py-4">
                      <p className="font-medium text-slate-800">
                        {ticket.subject}
                      </p>

                      <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                        {ticket.description}
                      </p>
                    </td>

                    <td className="px-4 py-4">
                      {ticket.category ?? "Pending classification"}
                    </td>

                    <td className="px-4 py-4">{ticket.priority}</td>

                    <td className="whitespace-nowrap px-4 py-4">
                      {new Date(ticket.createdAt).toLocaleDateString("en-IN")}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${
                          statusStyles[ticket.status] ??
                          "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {ticket.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section> */}
    </div>
  );
}
