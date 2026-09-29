"use client";
import { useState } from "react";
import { api } from "@/lib/api";
import { Async, Badge, Btn, PageHeader, RowActions, Table, confirmRun, fmtDate, money, useFetch } from "@/components/layout/ui";
import JobForm from "./JobForm";
import JobStatusControl from "./JobStatusControl";

export default function JobList() {
  const { data, error, loading, reload } = useFetch(api.jobs.list);
  const quotes = useFetch(api.quotations.list);
  const qs = quotes.data ?? [];
  const usable = qs.filter((q) => q.status === "ACCEPTED" && !(data ?? []).some((j) => j.quotationId === q.id));
  const [open, setOpen] = useState(false);
  return (
    <>
      <PageHeader title="Installation jobs" action={<Btn onClick={() => setOpen(true)} disabled={!usable.length}>New job</Btn>} />
      {!quotes.loading && !usable.length && <p className="mb-3 text-sm text-slate-500">Jobs can be created from accepted quotations that don&apos;t have a job yet.</p>}
      <Async loading={loading} error={error} data={data} onRetry={reload} empty="No installation jobs yet.">
        {(rows) => (
          <Table rows={rows} cols={[
            ["ID", (j) => `#${j.id}`],
            ["Quotation", (j) => { const q = qs.find((x) => x.id === j.quotationId); return `#${j.quotationId}${q ? ` — ${money(q.totalPrice)}` : ""}`; }],
            ["Scheduled", (j) => fmtDate(j.scheduledDate)], ["Status", (j) => <Badge s={j.status} />],
            ["", (j) => (
              <div className="flex items-center justify-end gap-3">
                <JobStatusControl job={j} onChanged={reload} />
                <RowActions href={`/jobs/${j.id}`} onDelete={() => confirmRun(`Delete job #${j.id}?`, () => api.jobs.remove(j.id), reload)} />
              </div>)],
          ]} />
        )}
      </Async>
      {open && <JobForm quotations={usable} onClose={() => setOpen(false)} onSaved={reload} />}
    </>
  );
}
