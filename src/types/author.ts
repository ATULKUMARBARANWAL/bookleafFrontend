
export type AuthorBook = {
  id: string;
  title: string;
  genre: string;
  isbn: string;
  status: string;
  sold: number;
  earned: number;
  paid: number;
  pending: number;
};


export type SupportTicket = {
  id: number | string;
  subject: string;
  description: string;
  category: string | null;
  priority: string;
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  bookId?: number | null;
  createdAt?: string;
  updatedAt?: string;
  date?: string;
};


export type AuthorTab =
  | "Overview"
  | "My Books"
  | "My Tickets"
  | "Submit Query";
