"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/src/components/admin/AdminSidebar";
import AdminHeader from "@/src/components/admin/AdminHeader";
import AdminStatCard from "@/src/components/admin/AdminStatCard";
import TicketQueue from "@/src/components/admin/TicketQueue";
import { adminService } from "@/src/services/admin.service";
import type { AdminTicket } from "@/src/types/admin";

export default function AdminDashboardContainer() {
  const router = useRouter();

  const [tickets, setTickets] = useState<AdminTicket[]>([]);
  const [status, setStatus] = useState("ALL");
  const [priority, setPriority] = useState("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    adminService
      .getTickets()
      .then((data) => {
        if (!cancelled) setTickets(data);
      })
      .catch((error) => {
        console.error("Failed to load tickets", error);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredTickets = useMemo(() => {
    return tickets
      .filter((ticket) => {
        const matchesStatus =
          status === "ALL" || ticket.status === status;

        const matchesPriority =
          priority === "ALL" || ticket.priority === priority;

        const query = search.toLowerCase();

        const matchesSearch =
          !query ||
          ticket.ticketNumber.toLowerCase().includes(query) ||
          ticket.subject.toLowerCase().includes(query) ||
          ticket.author.toLowerCase().includes(query);

        return matchesStatus && matchesPriority && matchesSearch;
      })
      .sort((a, b) => {
        const priorityOrder = {
          CRITICAL: 0,
          HIGH: 1,
          MEDIUM: 2,
          LOW: 3,
        };

        const aUnresolved = !["RESOLVED", "CLOSED"].includes(a.status);
        const bUnresolved = !["RESOLVED", "CLOSED"].includes(b.status);

        if (aUnresolved !== bUnresolved) {
          return aUnresolved ? -1 : 1;
        }

        const priorityDifference =
          priorityOrder[a.priority] - priorityOrder[b.priority];

        if (priorityDifference !== 0) return priorityDifference;

        return (
          new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime()
        );
      });
  }, [tickets, status, priority, search]);

  const openCount = tickets.filter(
    (t) => t.status === "OPEN"
  ).length;

  const inProgressCount = tickets.filter(
    (t) => t.status === "IN_PROGRESS"
  ).length;

  const resolvedCount = tickets.filter(
    (t) => t.status === "RESOLVED"
  ).length;

  const urgentCount = tickets.filter(
    (t) =>
      ["CRITICAL", "HIGH"].includes(t.priority) &&
      !["RESOLVED", "CLOSED"].includes(t.status)
  ).length;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />

      <div className="min-w-0 flex-1">
        <AdminHeader />

        <main className="space-y-7 p-6 lg:p-8">
          <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-emerald-800 p-7 text-white">
            <div>
              <p className="text-sm text-emerald-100">
                Support Operations
              </p>

              <h1 className="mt-2 text-3xl font-bold">
                Welcome to BookLeaf Support
              </h1>

              <p className="mt-3 max-w-xl text-sm text-emerald-50">
                Manage author queries, prioritize urgent tickets,
                and resolve issues efficiently with AI assistance.
              </p>
            </div>

            <button
              onClick={() => router.push("/admin/tickets")}
              className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-emerald-900 hover:bg-emerald-50"
            >
              View Ticket Queue →
            </button>
          </section>

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <AdminStatCard
              label="Total Tickets"
              value={tickets.length}
              description="All support requests"
              icon="▤"
            />

            <AdminStatCard
              label="Open Tickets"
              value={openCount}
              description="Waiting for action"
              icon="◷"
            />

            <AdminStatCard
              label="Urgent Tickets"
              value={urgentCount}
              description="Critical or high priority, unresolved"
              icon="!"
            />

            <AdminStatCard
              label="Resolved Tickets"
              value={resolvedCount}
              description={`${inProgressCount} currently in progress`}
              icon="✓"
            />
          </section>

          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Ticket Queue
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Review and prioritize incoming author queries.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search ticket, author or subject..."
                className="min-w-[220px] flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-700"
              />

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
              >
                <option value="ALL">All statuses</option>
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
              </select>

              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
              >
                <option value="ALL">All priorities</option>
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>

            {loading ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500">
                Loading tickets...
              </div>
            ) : (
              <TicketQueue
                tickets={filteredTickets}
                onOpenTicket={(ticket) =>
                  router.push(`/admin/tickets/${ticket.id}`)
                }
              />
            )}
          </section>
        </main>
      </div>
    </div>
  );
}