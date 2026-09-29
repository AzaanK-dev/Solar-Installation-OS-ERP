"use client";
import { useState } from "react";
import { api } from "@/lib/api";
import { Async, Badge, Btn, PageHeader, RowActions, Table, confirmRun, fmtDate, leadLabel, money, useFetch } from "@/components/layout/ui";
import QuotationForm from "./QuotationForm";

export default function QuotationList() {
  const { data, error, loading, reload } = useFetch(api.quotations.list);
  const leads = useFetch(api.leads.list);
  const customers = useFetch(api.customers.list);
  const equipment = useFetch(api.equipment.list);
  const ls = leads.data ?? [], cs = customers.data ?? [], eq = equipment.data ?? [];
  const [open, setOpen] = useState(false);
  return (
    <>
      <PageHeader title="Quotations" action={<Btn onClick={() => setOpen(true)} disabled={!ls.length || !eq.length}>New quotation</Btn>} />
      {!leads.loading && !equipment.loading && (!ls.length || !eq.length) &&
        <p className="mb-3 text-sm text-amber-700">You need at least one lead and one equipment item to create a quotation.</p>}
      <Async loading={loading} error={error} data={data} onRetry={reload} empty="No quotations yet.">
        {(rows) => (
          <Table rows={rows} cols={[
            ["ID", (q) => `#${q.id}`],
            ["Lead", (q) => { const l = ls.find((x) => x.id === q.leadId); return l ? leadLabel(l, cs) : `Lead #${q.leadId}`; }],
            ["Total", (q) => money(q.totalPrice)], ["Status", (q) => <Badge s={q.status} />], ["Created", (q) => fmtDate(q.createdAt)],
            ["", (q) => <RowActions href={`/quotations/${q.id}`}
              onDelete={() => confirmRun(`Delete quotation #${q.id}?`, () => api.quotations.remove(q.id), reload)} />],
          ]} />
        )}
      </Async>
      {open && <QuotationForm leads={ls} customers={cs} equipment={eq} onClose={() => setOpen(false)} onSaved={reload} />}
    </>
  );
}
