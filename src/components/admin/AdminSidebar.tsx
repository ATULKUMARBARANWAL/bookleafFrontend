"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Overview", href: "/admin/dashboard", icon: "▦" },
  { label: "Ticket Queue", href: "/admin/tickets", icon: "▤" },
  // { label: "Authors", href: "/admin/authors", icon: "♙" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex min-h-screen w-[250px] shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="flex h-[88px] items-center gap-3 border-b border-slate-100 px-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-800 text-xl font-bold text-white">
          B
        </div>

        <div>
          <h1 className="text-lg font-bold text-slate-900">
            BookLeaf
          </h1>
          <p className="text-xs text-slate-500">
            Admin Workspace
          </p>
        </div>
      </div>

      <div className="px-5 pt-8">
        <p className="mb-4 text-xs font-semibold tracking-wider text-slate-400">
          WORKSPACE
        </p>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const active =
              pathname === item.href ||
              (item.href === "/admin/tickets" &&
                pathname.startsWith("/admin/tickets"));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                  active
                    ? "bg-emerald-50 font-semibold text-emerald-800"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto border-t border-slate-100 p-5">
        <p className="text-sm font-semibold text-slate-800">
          BookLeaf Support
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Author communication portal
        </p>
      </div>
    </aside>
  );
}