
"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import AdminSidebar from "@/src/components/admin/AdminSidebar";
import {
  adminService,
  type AdminTicketDetail,
} from "@/src/services/admin.service";

const STATUSES = [
  { value: "OPEN", label: "Open" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "RESOLVED", label: "Resolved" },
  { value: "CLOSED", label: "Closed" },
];

export default function AdminTicketDetailContainer({
  ticketId,
}: {
  ticketId: number;
}) {
  const [ticket, setTicket] = useState<AdminTicketDetail | null>(null);
  const [reply, setReply] = useState("");
  const [internalNote, setInternalNote] = useState("");
  const [status, setStatus] = useState("OPEN");

  const [loading, setLoading] = useState(true);
  const [savingStatus, setSavingStatus] = useState(false);
  const [sendingReply, setSendingReply] = useState(false);
  const [savingNote, setSavingNote] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadTicket = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await adminService.getTicket(ticketId);

      setTicket(data);
      setStatus(
        String(data.status ?? "OPEN")
          .toUpperCase()
          .replaceAll(" ", "_"),
      );
      setReply(data.aiSuggestedReply ?? "");
    } catch (err) {
      setTicket(null);
      setError(
        err instanceof Error ? err.message : "Failed to load ticket.",
      );
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  useEffect(() => {
    void loadTicket();
  }, [loadTicket]);

  async function handleStatusUpdate() {
    if (!ticket) return;

    setSavingStatus(true);
    setError("");
    setSuccess("");

    try {
      await adminService.updateStatus(ticket.id, status);
      setTicket((current) =>
        current ? { ...current, status: status as AdminTicketDetail["status"] } : current,
      );
      setSuccess("Ticket status updated successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update status.",
      );
    } finally {
      setSavingStatus(false);
    }
  }

  async function handleReplySubmit(isInternal: boolean) {
    const message = (isInternal ? internalNote : reply).trim();

    if (!ticket || !message) return;

    if (isInternal) setSavingNote(true);
    else setSendingReply(true);

    setError("");
    setSuccess("");

    try {
      await adminService.createReply(ticket.id, message, isInternal);

      if (isInternal) {
        setInternalNote("");
        setSuccess("Internal note saved successfully.");
      } else {
        setReply("");
        setSuccess("Response sent successfully.");
      }

      // Fetch persisted replies and the latest ticket data.
      await loadTicket();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to submit message.",
      );
    } finally {
      setSavingNote(false);
      setSendingReply(false);
    }
  }

  if (loading) {
    return (
      <div className="p-10 text-slate-500">
        Loading ticket...
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <AdminSidebar />
        <main className="min-w-0 flex-1 p-8">
          <h1 className="text-xl font-bold text-slate-900">
            Unable to load ticket
          </h1>
          <p className="mt-2 text-sm text-red-600">
            {error || "Ticket not found."}
          </p>
          <button
            type="button"
            onClick={() => void loadTicket()}
            className="mt-4 rounded-lg bg-emerald-800 px-4 py-2 text-sm font-semibold text-white"
          >
            Retry
          </button>
          <Link
            href="/admin/tickets"
            className="ml-4 text-sm text-emerald-800 underline"
          >
            Back to Ticket Queue
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />

      <main className="min-w-0 flex-1 p-5 lg:p-8">
        <Link
          href="/admin/tickets"
          className="text-sm font-medium text-emerald-800 hover:underline"
        >
          ← Back to Ticket Queue
        </Link>

        {error && (
          <div
            role="alert"
            className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {success && (
          <div
            role="status"
            className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800"
          >
            {success}
          </div>
        )}

        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">
                {ticket.ticketNumber}
              </p>
              <h1 className="mt-2 text-2xl font-bold text-slate-900">
                {ticket.subject}
              </h1>
           <p>
  Submitted by{" "}
  {typeof ticket.author === "object" && ticket.author !== null
    ? ticket.author.name
    : ticket.author || "Unknown Author"}
</p>
            </div>

            <span className="rounded-full bg-orange-50 px-3 py-1.5 text-sm font-semibold text-orange-700">
              {ticket.priority}
            </span>
          </div>

          <div className="mt-6 border-t border-slate-100 pt-5">
            <p className="text-sm font-medium text-slate-500">
              Description
            </p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-800">
              {ticket.description || "No description provided."}
            </p>
          </div>

          <div className="mt-5 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2">
            <div>
              <p className="text-sm text-slate-500">Category</p>
              <p className="mt-1 font-medium text-slate-800">
                {ticket.category}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Assigned to</p>
              <p className="mt-1 font-medium text-slate-800">
                {ticket.assignedTo ?? "Unassigned"}
              </p>
            </div>
          </div>
        </section>

        <div className="mt-5 grid gap-5 xl:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="font-semibold text-slate-900">
              Ticket Management
            </h2>

            <label
              htmlFor="ticket-status"
              className="mt-5 block text-sm font-medium text-slate-700"
            >
              Update Status
            </label>

            <select
              id="ticket-status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm"
            >
              {STATUSES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>

            <button
              type="button"
              disabled={savingStatus || status === ticket.status}
              onClick={() => void handleStatusUpdate()}
              className="mt-3 rounded-xl bg-emerald-800 px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              {savingStatus ? "Saving..." : "Save Status"}
            </button>

            <div className="mt-6 border-t border-slate-100 pt-5">
              <h3 className="text-sm font-semibold text-slate-900">
                Internal Note
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                For the support team only. Ensure the backend keeps
                internal notes hidden from authors.
              </p>

              <textarea
                value={internalNote}
                onChange={(event) => setInternalNote(event.target.value)}
                placeholder="Add a private note..."
                rows={4}
                className="mt-3 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-emerald-700"
              />

              <button
                type="button"
                disabled={savingNote || !internalNote.trim()}
                onClick={() => void handleReplySubmit(true)}
                className="mt-3 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                {savingNote ? "Saving..." : "Save Internal Note"}
              </button>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="font-semibold text-slate-900">
              AI-Assisted Response
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Review and edit the saved AI suggestion before sending it
              to the author.
            </p>

            <textarea
              value={reply}
              onChange={(event) => setReply(event.target.value)}
              placeholder="No AI suggestion is available. Enter a response..."
              rows={8}
              className="mt-5 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-emerald-700"
            />

            <button
              type="button"
              disabled={sendingReply || !reply.trim()}
              onClick={() => void handleReplySubmit(false)}
              className="mt-3 rounded-xl bg-emerald-800 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {sendingReply ? "Sending..." : "Send Response"}
            </button>

            <div className="mt-6 border-t border-slate-100 pt-5">
              <h3 className="font-semibold text-slate-900">
                Conversation
              </h3>

              <div className="mt-3 space-y-3">
                {(ticket.replies ?? []).length === 0 ? (
                  <p className="text-sm text-slate-500">
                    No replies or notes yet.
                  </p>
                ) : (
                  ticket.replies.map((item) => (
                    <article
                      key={item.id}
                      className="rounded-xl border border-slate-200 p-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-sm font-semibold text-slate-800">
                          {item.author?.name ??
                            (item.isInternal ? "Internal Note" : "Support")}
                        </span>
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${
                            item.isInternal
                              ? "bg-amber-50 text-amber-800"
                              : "bg-emerald-50 text-emerald-800"
                          }`}
                        >
                          {item.isInternal ? "Internal" : "Public Reply"}
                        </span>
                      </div>
                      <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">
                        {item.message}
                      </p>
                      <p className="mt-2 text-xs text-slate-400">
                        {new Date(item.createdAt).toLocaleString()}
                      </p>
                    </article>
                  ))
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
