"use client";

import { useEffect, useState } from "react";
import type { AuthorTab } from "@/src/types/author";
import {
  getMyProfile,
  type CurrentUser,
} from "@/src/services/user.service";

export default function AuthorHeader({
  activeTab,
}: {
  activeTab: AuthorTab;
}) {
  const [user, setUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    let isMounted = true;

    getMyProfile()
      .then((data) => {
        if (isMounted) {
          setUser(data);
        }
      })
      .catch((error) => {
        console.error("Failed to load author profile:", error);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = () => {
    // Clear authentication cookies
    document.cookie =
      "access_token=; Max-Age=0; path=/";
    document.cookie =
      "refresh_token=; Max-Age=0; path=/";

    // Redirect using the current domain
    window.location.href = `${window.location.origin}/author/login`;
  };

  const initials =
    user?.name
      ?.trim()
      .split(/\s+/)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "AU";

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 md:px-8">
      <div>
        <p className="text-sm text-slate-500">Author Workspace</p>
        <h1 className="text-lg font-bold">{activeTab}</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold">
            {user?.name || "Loading..."}
          </p>
          <p className="text-xs text-slate-500">
            {user?.role || "Author"}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-800">
          {initials}
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <path d="M16 17l5-5-5-5" />
            <path d="M21 12H9" />
          </svg>
          Logout
        </button>
      </div>
    </header>
  );
}