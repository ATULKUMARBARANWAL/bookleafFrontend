"use client";

import type {
  AdminTicket,
  TicketPriority,
  TicketStatus,
} from "@/src/types/admin";

type Props = {
  tickets: AdminTicket[];
  onOpenTicket: (ticket: AdminTicket) => void;
};

const priorityStyles: Record<TicketPriority, string> = {
  CRITICAL: "bg-red-50 text-red-700",
  HIGH: "bg-orange-50 text-orange-700",
  MEDIUM: "bg-amber-50 text-amber-700",
  LOW: "bg-slate-100 text-slate-600",
};

const statusStyles: Record<TicketStatus, string> = {
  OPEN: "bg-blue-50 text-blue-700",
  IN_PROGRESS: "bg-violet-50 text-violet-700",
  RESOLVED: "bg-emerald-50 text-emerald-700",
  CLOSED: "bg-slate-100 text-slate-600",
};

export default function TicketQueue({
  tickets,
  onOpenTicket,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5">
        <div>
          <h3 className="font-semibold text-slate-900">
            Recent Support Tickets
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Prioritized by urgency and status
          </p>
        </div>

        <a
          href="/admin/tickets"
          className="text-sm font-semibold text-emerald-800 hover:text-emerald-900"
        >
          View all tickets →
        </a>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs text-slate-500">
            <tr>
              <th className="px-5 py-4 font-medium">Ticket</th>
              <th className="px-5 py-4 font-medium">Author / Subject</th>
              <th className="px-5 py-4 font-medium">Priority</th>
              <th className="px-5 py-4 font-medium">Status</th>
              <th className="px-5 py-4 font-medium">Assigned to</th>
              <th className="px-5 py-4 font-medium">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {tickets.map((ticket) => (
              <tr
                key={ticket.id}
                className="hover:bg-slate-50/70"
              >
                <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-700">
                  {ticket.ticketNumber}
                </td>

                <td className="min-w-[240px] px-5 py-4">
                  <p className="font-medium text-slate-900">
                    {ticket.subject}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {ticket.author} · {ticket.category}
                  </p>
                </td>

                <td className="whitespace-nowrap px-5 py-4">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${priorityStyles[ticket.priority]}`}>
                    {ticket.priority}
                  </span>
                </td>

                <td className="whitespace-nowrap px-5 py-4">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[ticket.status]}`}>
                    {ticket.status.replace("_", " ")}
                  </span>
                </td>

                <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                  {ticket.assignedTo ?? "Unassigned"}
                </td>

                <td className="whitespace-nowrap px-5 py-4">
                  <button
                    onClick={() => onOpenTicket(ticket)}
                    className="font-semibold text-emerald-800 hover:underline"
                  >
                    Open
                  </button>
                </td>
              </tr>
            ))}

            {tickets.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-12 text-center text-slate-500"
                >
                  No tickets match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}