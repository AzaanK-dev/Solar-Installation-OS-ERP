"use client";
import { useState } from "react";
import { api } from "@/lib/api";
import type { Job, JobStatus } from "@/types";
import { Btn } from "@/components/layout/ui";

const NEXT: Record<JobStatus, JobStatus | null> = { SCHEDULED: "IN_PROGRESS", IN_PROGRESS: "COMPLETED", COMPLETED: null };
const LABEL: Record<JobStatus, string> = { SCHEDULED: "", IN_PROGRESS: "Start job", COMPLETED: "Mark completed" };

export default function JobStatusControl({ job, onChanged }: { job: Job; onChanged: () => void }) {
  const [busy, setBusy] = useState(false);
  const next = NEXT[job.status];
  if (!next) return <span className="text-xs text-slate-500">Completed</span>;
  return (
    <Btn disabled={busy} onClick={async () => {
      setBusy(true);
      try { await api.jobs.changeStatus(job.id, next); onChanged(); } catch (e) { alert((e as Error).message); }
      setBusy(false);
    }}>{LABEL[next]}</Btn>
  );
}
