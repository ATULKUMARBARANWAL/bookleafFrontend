import Link from "next/link";

export default function Navbar() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link
          href="/"
          className="text-2xl font-bold tracking-tight text-emerald-800"
        >
          BookLeaf<span className="text-slate-900">.</span>
        </Link>

        <div className="flex items-center gap-5">
          <Link
            href="/author/login"
            className="text-sm font-semibold text-slate-700 hover:text-emerald-800"
          >
            Author Login
          </Link>

          <Link
            href="/admin/login"
            className="rounded-lg bg-emerald-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-900"
          >
            Admin Login
          </Link>
        </div>
      </nav>
    </header>
  );
}