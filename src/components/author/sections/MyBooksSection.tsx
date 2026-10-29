
import type { AuthorBook } from "@/src/types/author";
import BookCard from "../components/BookCard";

export default function MyBooksSection({
  books,
  onAskQuestion,
}: {
  books: AuthorBook[];
  onAskQuestion: () => void;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6">
      <h2 className="text-lg font-bold">My Books</h2>
      <p className="mt-1 text-sm text-slate-500">
        Sales and royalty details for your books.
      </p>

      <div className="mt-5 space-y-4">
        {books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onAskQuestion={onAskQuestion}
          />
        ))}
        {books.length === 0 && (
          <p className="py-8 text-center text-sm text-slate-500">
            No books found in your account.
          </p>
        )}
      </div>
    </section>
  );
}
