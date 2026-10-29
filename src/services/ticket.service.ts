
import { apiRequest } from "@/src/lib/api";

export type TicketStatus =
  | "Open"
  | "In Progress"
  | "Resolved"
  | "Closed";

export type SupportTicket = {
  id: number;
  subject: string;
  description: string;
  category: string | null;
  priority: string;
  status: TicketStatus;
  bookId: number | null;
  createdAt: string;
};

export type CreateTicketPayload = {
  bookId: number | null;
  subject: string;
  description: string;
};

export const ticketService = {
  getMyTickets(): Promise<SupportTicket[]> {
    return apiRequest<SupportTicket[]>("/tickets/my-tickets", {
      method: "GET",
    });
  },

  createTicket(payload: CreateTicketPayload): Promise<SupportTicket> {
    return apiRequest<SupportTicket>("/tickets", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};
