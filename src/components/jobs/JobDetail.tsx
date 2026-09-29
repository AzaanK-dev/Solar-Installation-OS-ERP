"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Badge, Detail, One, confirmRun, fmtDate, money, useFetch } from "@/components/layout/ui";
import JobStatusControl from "./JobStatusControl";

export default function JobDetail({ id }: { id: number }) {
  const router = useRouter();
  const j = useFetch(() => api.jobs.get(id), [id]);
  const quotes = useFetch(api.quotations.list);
  return (
    <One {...j} onRetry={j.reload}>
      {(job) => {
        const q = (quotes.data ?? []).find((x) => x.id === job.quotationId);
        return (
          <Detail title={`Job #${job.id}`} back="/jobs" actions={<JobStatusControl job={job} onChanged={j.reload} />}
            onDelete={() => confirmRun(`Delete job #${id}?`, () => api.jobs.remove(id), () => router.push("/jobs"))}
            items={[
              ["Quotation", <Link key="q" href={`/quotations/${job.quotationId}`} className="text-teal-700 hover:underline">#{job.quotationId}{q ? ` — ${money(q.totalPrice)}` : ""}</Link>],
              ["Status", <Badge key="s" s={job.status} />], ["Scheduled date", fmtDate(job.scheduledDate)], ["Created", fmtDate(job.createdAt)],
            ]} />
        );
      }}
    </One>
  );
}
