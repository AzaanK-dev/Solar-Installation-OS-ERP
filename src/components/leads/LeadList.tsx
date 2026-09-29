"use client";
import { useState } from "react";
import { api } from "@/lib/api";
import type { Lead } from "@/types";
import { Async, Badge, Btn, PageHeader, RowActions, Table, confirmRun, fmtDate, money, nameOf, useFetch } from "@/components/layout/ui";
import LeadForm from "./LeadForm";

export default function LeadList() {
  const { data, error, loading, reload } = useFetch(api.leads.list);
  const customers = useFetch(api.customers.list);
  const cs = customers.data ?? [];
  const [edit, setEdit] = useState<Lead | "new" | null>(null);
  return (
    <>
      <PageHeader title="Leads" action={<Btn onClick={() => setEdit("new")} disabled={!cs.length}>New lead</Btn>} />
      {!customers.loading && !cs.length && <p className="mb-3 text-sm text-amber-700">Add a customer before creating a lead.</p>}
      <Async loading={loading} error={error} data={data} onRetry={reload} empty="No leads yet.">
        {(rows) => (
          <Table rows={rows} cols={[
            ["ID", (l) => `#${l.id}`], ["Customer", (l) => nameOf(cs, l.customerId)],
            ["Est. bill", (l) => money(l.estimatedBill)], ["Status", (l) => <Badge s={l.status} />], ["Created", (l) => fmtDate(l.createdAt)],
            ["", (l) => <RowActions href={`/leads/${l.id}`} onEdit={() => setEdit(l)}
              onDelete={() => confirmRun(`Delete lead #${l.id}?`, () => api.leads.delete(l.id), reload)} />],
          ]} />
        )}
      </Async>
      {edit && <LeadForm lead={edit === "new" ? null : edit} customers={cs} onClose={() => setEdit(null)} onSaved={reload} />}
    </>
  );
}
