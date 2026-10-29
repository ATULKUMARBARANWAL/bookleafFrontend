
import { apiRequest } from "@/src/lib/api";
import type { AuthorBook, SupportTicket } from "@/src/types/author";

type BookApiResponse = {
  id: number;
  bookCode: string;
  title: string;
  isbn: string | null;
  genre: string | null;
  status: string;
  mrp: number | string | null;
  totalCopiesSold: number;
  totalRoyaltyEarned: number | string;
  royaltyPaid: number | string;
  royaltyPending: number | string;
};

export const demoTickets: SupportTicket[] = [
  {
    id: "TKT-1001",
    subject: "Royalty payment status",
    category: "Royalty & Payments",
    status: "In Progress",
    date: "26 Oct 2026",
    description: "Request for an update on pending royalty payment.",
    priority: "Medium",
  },
  {
    id: "TKT-1002",
    subject: "Book distribution query",
    category: "Distribution & Availability",
    status: "Open",
    date: "24 Oct 2026",
    description: "Request for an update on book distribution.",
    priority: "Low",
  },
];

function mapBook(book: BookApiResponse): AuthorBook {
  return {
    id: String(book.id),
    title: book.title,
    genre: book.genre ?? "Uncategorized",
    isbn: book.isbn ?? "Not available",
    status: book.status,
    sold: Number(book.totalCopiesSold),
    earned: Number(book.totalRoyaltyEarned),
    paid: Number(book.royaltyPaid),
    pending: Number(book.royaltyPending),
  };
}

export const authorService = {
  async getMyBooks(): Promise<AuthorBook[]> {
    const response = await apiRequest<BookApiResponse[]>("/books", {
      method: "GET",
    });

    return response.map(mapBook);
  },
};
