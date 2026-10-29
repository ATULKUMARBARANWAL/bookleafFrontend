import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-7 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="text-lg font-bold text-emerald-800">
          BookLeaf.
        </Link>

        <p className="text-sm text-slate-500">
          © {new Date().getFullYear()} BookLeaf Publishing. All rights reserved.
        </p>

        <div className="flex gap-5 text-sm">
          <Link href="/author/login" className="text-slate-600 hover:text-emerald-800">
            Author Login
          </Link>

          <Link href="/admin/login" className="text-slate-600 hover:text-emerald-800">
            Admin Login
          </Link>
        </div>
      </div>
    </footer>
  );
}