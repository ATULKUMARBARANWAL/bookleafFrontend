
import type { SupportTicket } from "@/src/types/author";

type Props = {
  ticket: SupportTicket;
};

const statusStyles: Record<SupportTicket["status"], string> = {
  Open: "bg-blue-50 text-blue-700",
  "In Progress": "bg-amber-50 text-amber-700",
  Resolved: "bg-emerald-50 text-emerald-700",
  Closed: "bg-slate-100 text-slate-600",
};

export default function TicketCard({ ticket }: Props) {
  const dateValue = ticket.createdAt ?? ticket.date;

  const formattedDate = dateValue
    ? new Date(dateValue).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Date unavailable";

  return (
    <article className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-emerald-200 sm:flex-row sm:items-center">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <span>Ticket #{ticket.id}</span>
          <span>·</span>
          <span>{formattedDate}</span>
        </div>

        <h3 className="mt-2 break-words font-semibold text-slate-900">
          {ticket.subject}
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          {ticket.category ?? "Pending classification"}
        </p>

        {ticket.description && (
          <p className="mt-2 line-clamp-2 text-sm text-slate-500">
            {ticket.description}
          </p>
        )}

        <p className="mt-2 text-xs text-slate-500">
          Priority: <span className="font-medium">{ticket.priority}</span>
        </p>
      </div>

      <span
        className={`h-fit w-fit shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
          statusStyles[ticket.status] ?? "bg-slate-100 text-slate-600"
        }`}
      >
        {ticket.status}
      </span>
    </article>
  );
}
