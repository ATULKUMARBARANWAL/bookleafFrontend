import type { AdminTicket } from "@/src/types/admin";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const adminTicketQueueService = {
  async getTickets(): Promise<AdminTicket[]> {
    const response = await fetch(`${API_URL}/admin/tickets`, {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Tickets API failed: ${response.status}`);
    }

    const result = await response.json();

    // IMPORTANT: inspect the actual backend response

    const rows = Array.isArray(result)
      ? result
      : Array.isArray(result?.data)
        ? result.data
        : Array.isArray(result?.data?.tickets)
          ? result.data.tickets
          : Array.isArray(result?.tickets)
            ? result.tickets
            : Array.isArray(result?.items)
              ? result.items
              : null;

    if (!rows) {
      console.error("Unexpected API response structure:", result);
      throw new Error("Could not find tickets array in API response");
    }

  
 return rows.map((item: any) => ({
  id: item.id,
  ticketNumber:
    item.ticketNumber ??
    item.ticket_number ??
    `T-${item.id}`,

  author:
    typeof item.author === "string"
      ? item.author
      : item.author?.name ??
        item.authorName ??
        item.author_name ??
        "Unknown Author",

  subject:
    item.subject ?? item.title ?? item.query ?? "No subject",

  category:
    typeof item.category === "string"
      ? item.category
      : item.category?.name ?? "General Inquiry",

  priority: String(item.priority ?? "MEDIUM").toUpperCase(),
  status: String(item.status ?? "OPEN").toUpperCase(),

  createdAt: item.createdAt ?? item.created_at ?? "",

  assignedTo:
    typeof item.assignedTo === "string"
      ? item.assignedTo
      : item.assignedTo?.name ??
        item.assigned_to?.name ??
        item.assigned_to ??
        null,
})) as AdminTicket[];
  },
};