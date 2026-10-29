
import type { AuthorBook, SupportTicket } from "@/src/types/author";
import StatCard from "../components/StatCard";
import BookCard from "../components/BookCard";
import TicketCard from "../components/TicketCard";

type Props = {
  books: AuthorBook[];
  tickets: SupportTicket[];
  onNavigate: (tab: "My Books" | "My Tickets" | "Submit Query") => void;
};

const money = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

export default function DashboardOverviewSection({
  books,
  tickets,
  onNavigate,
}: Props) {
  const earned = books.reduce((sum, book) => sum + book.earned, 0);
  const paid = books.reduce((sum, book) => sum + book.paid, 0);
  const pending = books.reduce((sum, book) => sum + book.pending, 0);
  const sold = books.reduce((sum, book) => sum + book.sold, 0);

  const stats = [
    { label: "My Books", value: String(books.length), note: "Books in your account" },
    { label: "Copies Sold", value: sold.toLocaleString("en-IN"), note: "Across all books" },
    { label: "Royalty Earned", value: money(earned), note: "Total earnings" },
    { label: "Royalty Pending", value: money(pending), note: "Awaiting payment" },
  ];

  return (
    <>
      <section className="mb-8 rounded-2xl bg-emerald-800 p-6 text-white md:p-8">
        <p className="text-sm text-emerald-100">Author Dashboard</p>
        <h2 className="mt-2 text-2xl font-bold md:text-3xl">
          Welcome back, Priya!
        </h2>
        <p className="mt-2 max-w-xl text-sm leading-6 text-emerald-100">
          Track your books, monitor your royalties, and get help from
          the BookLeaf support team.
        </p>
        <button
          onClick={() => onNavigate("Submit Query")}
          className="mt-5 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-emerald-900"
        >
          + Raise a Support Ticket
        </button>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="font-bold">Royalty Overview</h2>
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div>
            <p className="text-sm text-slate-500">Total Earned</p>
            <p className="mt-1 text-xl font-bold">{money(earned)}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Total Paid</p>
            <p className="mt-1 text-xl font-bold text-emerald-700">
              {money(paid)}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Pending</p>
            <p className="mt-1 text-xl font-bold text-amber-600">
              {money(pending)}
            </p>
          </div>
        </div>

        <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-emerald-600"
            style={{
              width: `${earned ? (paid / earned) * 100 : 0}%`,
            }}
          />
        </div>
        <p className="mt-2 text-xs text-slate-500">
          {earned ? Math.round((paid / earned) * 100) : 0}% of earned
          royalty paid
        </p>
      </section>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-bold">My Books</h2>
          <button
            onClick={() => onNavigate("My Books")}
            className="text-sm font-semibold text-emerald-800"
          >
            View all →
          </button>
        </div>

        <div className="space-y-4">
          {books.slice(0, 2).map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onAskQuestion={() => onNavigate("Submit Query")}
            />
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-bold">Recent Support Tickets</h2>
          <button
            onClick={() => onNavigate("My Tickets")}
            className="text-sm font-semibold text-emerald-800"
          >
            View all →
          </button>
        </div>
        <div className="space-y-3">
          {tickets.slice(0, 3).map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      </section>
    </>
  );
}
