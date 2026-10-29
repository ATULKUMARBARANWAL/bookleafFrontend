
import type { AuthorBook } from "@/src/types/author";

type Props = {
  book: AuthorBook;
  onAskQuestion?: () => void;
};

export default function BookCard({ book, onAskQuestion }: Props) {
  const money = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  return (
    <article className="rounded-xl border border-slate-200 p-4">
      <div className="flex flex-wrap justify-between gap-3">
        <div>
          <h3 className="font-semibold">{book.title}</h3>
          <p className="mt-1 text-sm text-slate-500">{book.genre}</p>
          <p className="mt-1 text-xs text-slate-400">
            ISBN: {book.isbn}
          </p>
        </div>

        <span className="h-fit rounded-full bg-emerald-50 px-3 py-1 text-xs text-emerald-800">
          {book.status}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["Copies sold", book.sold.toLocaleString("en-IN")],
          ["Earned", money(book.earned)],
          ["Paid", money(book.paid)],
          ["Pending", money(book.pending)],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg bg-slate-50 p-3">
            <p className="text-xs text-slate-500">{label}</p>
            <p className="mt-2 break-words text-sm font-semibold">
              {value}
            </p>
          </div>
        ))}
      </div>

      {onAskQuestion && (
        <button
          onClick={onAskQuestion}
          className="mt-4 text-sm font-semibold text-emerald-800 hover:underline"
        >
          Ask about this book →
        </button>
      )}
    </article>
  );
}
