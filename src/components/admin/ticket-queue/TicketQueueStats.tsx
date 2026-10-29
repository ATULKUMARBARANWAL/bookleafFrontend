type Props = {
  total: number;
  open: number;
  urgent: number;
  inProgress: number;
};

export default function TicketQueueStats({
  total,
  open,
  urgent,
  inProgress,
}: Props) {
  const stats = [
    {
      label: "Total Tickets",
      value: total,
      description: "All received queries",
    },
    {
      label: "Open Tickets",
      value: open,
      description: "Waiting for action",
    },
    {
      label: "Urgent Tickets",
      value: urgent,
      description: "Critical or high priority",
    },
    {
      label: "In Progress",
      value: inProgress,
      description: "Currently being handled",
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl border border-slate-200 bg-white p-5"
        >
          <p className="text-sm text-slate-500">{stat.label}</p>

          <p className="mt-3 text-3xl font-bold text-slate-900">
            {stat.value}
          </p>

          <p className="mt-2 text-xs text-slate-500">
            {stat.description}
          </p>
        </div>
      ))}
    </section>
  );
}