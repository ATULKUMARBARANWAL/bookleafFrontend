"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/src/components/admin/AdminSidebar";
import TicketQueueHeader from "@/src/components/admin/ticket-queue/TicketQueueHeader";
import TicketQueueStats from "@/src/components/admin/ticket-queue/TicketQueueStats";
import TicketQueueFilters from "@/src/components/admin/ticket-queue/TicketQueueFilters";
import TicketQueueTable from "@/src/components/admin/ticket-queue/TicketQueueTable";
import { adminTicketQueueService } from "../services/adminTicketQueue.service";
import type { AdminTicket } from "@/src/types/admin";

export default function AdminTicketQueueContainer() {
  const router = useRouter();

  const [tickets, setTickets] = useState<AdminTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [priority, setPriority] = useState("ALL");
  const [category, setCategory] = useState("ALL");
  const [date, setDate] = useState("");

  useEffect(() => {
    let active = true;

    adminTicketQueueService
      .getTickets()
      .then((data) => {
        if (active) setTickets(data);
      })
      .catch((error) => console.error("Failed to load tickets", error))
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const categories = useMemo(
    () => [...new Set(tickets.map((ticket) => ticket.category))],
    [tickets],
  );

  const filteredTickets = useMemo(() => {
    const priorityOrder = {
      CRITICAL: 0,
      HIGH: 1,
      MEDIUM: 2,
      LOW: 3,
    };

    return tickets
      .filter((ticket) => {
        const query = search.trim().toLowerCase();

        return (
          (!query ||
            ticket.ticketNumber.toLowerCase().includes(query) ||
            ticket.author.toLowerCase().includes(query) ||
            ticket.subject.toLowerCase().includes(query)) &&
          (status === "ALL" || ticket.status === status) &&
          (priority === "ALL" || ticket.priority === priority) &&
          (category === "ALL" || ticket.category === category) &&
          (!date || ticket.createdAt.slice(0, 10) === date)
        );
      })
      .sort((a, b) => {
        const aUnresolved = !["RESOLVED", "CLOSED"].includes(a.status);
        const bUnresolved = !["RESOLVED", "CLOSED"].includes(b.status);

        if (aUnresolved !== bUnresolved) return aUnresolved ? -1 : 1;

        const difference = priorityOrder[a.priority] - priorityOrder[b.priority];

        if (difference !== 0) return difference;

        return (
          new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime()
        );
      });
  }, [tickets, search, status, priority, category, date]);

  const resetFilters = () => {
    setSearch("");
    setStatus("ALL");
    setPriority("ALL");
    setCategory("ALL");
    setDate("");
  };

  const open = tickets.filter((t) => t.status === "OPEN").length;

  const urgent = tickets.filter(
    (t) =>
      ["CRITICAL", "HIGH"].includes(t.priority) &&
      !["RESOLVED", "CLOSED"].includes(t.status),
  ).length;

  const inProgress = tickets.filter(
    (t) => t.status === "IN_PROGRESS",
  ).length;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />

      <main className="min-w-0 flex-1 space-y-6 p-5 lg:p-8">
        <TicketQueueHeader />

        <TicketQueueStats
          total={tickets.length}
          open={open}
          urgent={urgent}
          inProgress={inProgress}
        />

        <TicketQueueFilters
          search={search}
          status={status}
          priority={priority}
          category={category}
          date={date}
          categories={categories}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
          onPriorityChange={setPriority}
          onCategoryChange={setCategory}
          onDateChange={setDate}
          onReset={resetFilters}
        />

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500">
            Loading tickets...
          </div>
        ) : (
          <TicketQueueTable
            tickets={filteredTickets}
            onOpen={(ticket) =>
              router.push(`/admin/tickets/${ticket.id}`)
            }
          />
        )}
      </main>
    </div>
  );
}