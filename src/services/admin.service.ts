
import type { AdminTicket } from "@/src/types/admin";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    cache: "no-store",
    headers: {
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(
      message || `Request failed: ${response.status}`,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export type AdminTicketDetail = AdminTicket & {
  description: string;
  aiSuggestedReply: string | null;
  replies: {
    id: number;
    message: string;
    isInternal: boolean;
    createdAt: string;
    author?: { name?: string };
  }[];
};

export const adminService = {
  async getTickets(): Promise<AdminTicket[]> {
    const result = await request<
      AdminTicket[] | { items: AdminTicket[] }
    >("/admin/tickets");

    const tickets = Array.isArray(result)
      ? result
      : result.items;

    if (!Array.isArray(tickets)) {
      throw new Error("Invalid tickets API response");
    }

    return tickets.map((ticket: any): AdminTicket => ({
      id: ticket.id,
      ticketNumber: ticket.ticketNumber ?? `BL-${ticket.id}`,
      author:
        ticket.author?.name ??
        ticket.authorName ??
        "Unknown Author",
      subject: ticket.subject,
      category: ticket.category ?? "General Inquiry",
      priority: String(ticket.priority ?? "MEDIUM").toUpperCase() as AdminTicket["priority"],
      status: String(ticket.status ?? "OPEN")
        .toUpperCase()
        .replaceAll(" ", "_") as AdminTicket["status"],
      createdAt: ticket.createdAt,
      assignedTo:
        ticket.assignedAdmin?.name ??
        ticket.assignedTo ??
        null,
    }));
  },

async getTicket(id: number): Promise<AdminTicketDetail> {
  const ticket = await request<any>(`/admin/tickets/${id}`);

  return {
    ...ticket,
    author:
      typeof ticket.author === "object"
        ? ticket.author?.name ?? "Unknown Author"
        : ticket.author ?? "Unknown Author",
    assignedTo:
      typeof ticket.assignedAdmin === "object"
        ? ticket.assignedAdmin?.name ?? null
        : ticket.assignedTo ?? null,
    aiSuggestedReply: ticket.aiSuggestedReply ?? null,
    replies: Array.isArray(ticket.replies) ? ticket.replies : [],
  };
},

  async updateStatus(
    id: number,
    status: string,
  ): Promise<unknown> {
    return request(`/admin/tickets/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  async createReply(
    id: number,
    message: string,
    isInternal: boolean,
  ): Promise<unknown> {
    return request(`/admin/tickets/${id}/replies`, {
      method: "POST",
      body: JSON.stringify({ message, isInternal }),
    });
  },
};
