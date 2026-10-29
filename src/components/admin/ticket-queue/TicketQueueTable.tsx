import type { AdminTicket } from "@/src/types/admin";

type Props = {
  tickets: AdminTicket[];
  onOpen: (ticket: AdminTicket) => void;
};

const priorityStyles: Record<string, string> = {
  CRITICAL: "bg-red-50 text-red-700",
  HIGH: "bg-orange-50 text-orange-700",
  MEDIUM: "bg-amber-50 text-amber-700",
  LOW: "bg-slate-100 text-slate-600",
};

const statusStyles: Record<string, string> = {
  OPEN: "bg-blue-50 text-blue-700",
  IN_PROGRESS: "bg-violet-50 text-violet-700",
  RESOLVED: "bg-emerald-50 text-emerald-700",
  CLOSED: "bg-slate-100 text-slate-600",
};

export default function TicketQueueTable({
  tickets,
  onOpen,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 p-5">
        <h2 className="font-semibold text-slate-900">
          Incoming Queries
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          {tickets.length} tickets found
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs text-slate-500">
            <tr>
              {[
                "Ticket",
                "Author / Subject",
                "Category",
                "Priority",
                "Status",
                "Created",
                "Assigned To",
                "Action",
              ].map((heading) => (
                <th key={heading} className="whitespace-nowrap px-4 py-4 font-medium">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {tickets.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-slate-50">
                <td className="whitespace-nowrap px-4 py-4 font-semibold">
                  {ticket.ticketNumber}
                </td>

                <td className="min-w-[220px] px-4 py-4">
                  <p className="font-medium text-slate-900">
                    {ticket.subject}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {ticket.author}
                  </p>
                </td>

                <td className="min-w-[180px] px-4 py-4 text-slate-600">
                  {ticket.category}
                </td>

                <td className="whitespace-nowrap px-4 py-4">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${priorityStyles[ticket.priority]}`}>
                    {ticket.priority}
                  </span>
                </td>

                <td className="whitespace-nowrap px-4 py-4">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[ticket.status]}`}>
                    {ticket.status.replace("_", " ")}
                  </span>
                </td>

                <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                  {new Date(ticket.createdAt).toLocaleDateString("en-IN")}
                </td>

                <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                  {ticket.assignedTo ?? "Unassigned"}
                </td>

                <td className="whitespace-nowrap px-4 py-4">
                  <button
                    type="button"
                    onClick={() => onOpen(ticket)}
                    className="font-semibold text-emerald-800 hover:underline"
                  >
                    View Ticket →
                  </button>
                </td>
              </tr>
            ))}

            {tickets.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-5 py-12 text-center text-slate-500"
                >
                  No tickets found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}