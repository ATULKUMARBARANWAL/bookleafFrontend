
import { Suspense } from "react";
import { notFound } from "next/navigation";
import AdminTicketDetailContainer from "@/src/containers/AdminTicketDetailContainer";

type Props = {
  params: Promise<{ id: string }>;
};

async function TicketContent({ params }: Props) {
  const { id } = await params;

  if (!/^\d+$/.test(id) || Number(id) < 1) {
    notFound();
  }

  return <AdminTicketDetailContainer ticketId={Number(id)} />;
}

export default function AdminTicketDetailPage({ params }: Props) {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-sm text-slate-500">
          Loading ticket details...
        </div>
      }
    >
      <TicketContent params={params} />
    </Suspense>
  );
}
