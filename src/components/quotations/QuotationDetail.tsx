"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/lib/api";
import type { Quotation, QuotationItem, QuotationStatus } from "@/types";
import { Badge, Btn, Card, Detail, One, RowActions, Table, confirmRun, fmtDate, leadLabel, money, useFetch } from "@/components/layout/ui";
import JobForm from "@/components/jobs/JobForm";
import QuotationItemForm from "./QuotationItemForm";

const NEXT: Record<QuotationStatus, QuotationStatus[]> = {
  DRAFT: ["SENT"], SENT: ["ACCEPTED", "REJECTED"], ACCEPTED: ["CONVERTED"], REJECTED: [], CONVERTED: [],
};

export default function QuotationDetail({ id }: { id: number }) {
  const router = useRouter();
  const q = useFetch(() => api.quotations.get(id), [id]);
  const leads = useFetch(api.leads.list);
  const customers = useFetch(api.customers.list);
  const equipment = useFetch(api.equipment.list);
  const [itemEdit, setItemEdit] = useState<QuotationItem | "new" | null>(null);
  const [job, setJob] = useState(false);
  const [busy, setBusy] = useState(false);
  const eq = equipment.data ?? [];

  async function setStatus(status: QuotationStatus) {
    setBusy(true);
    try { await api.quotations.setStatus(id, status); await q.reload(); } catch (e) { alert((e as Error).message); }
    setBusy(false);
  }

  return (
    <One {...q} onRetry={q.reload}>
      {(qt: Quotation) => {
        const items = qt.items ?? [];
        const lead = (leads.data ?? []).find((l) => l.id === qt.leadId);
        const locked = qt.status === "CONVERTED";
        return (
          <>
            <Detail title={`Quotation #${qt.id}`} back="/quotations"
              onDelete={() => confirmRun(`Delete quotation #${id}?`, () => api.quotations.remove(id), () => router.push("/quotations"))}
              actions={qt.status === "ACCEPTED" && <Btn onClick={() => setJob(true)}>Create installation job</Btn>}
              items={[
                ["Lead", <Link key="l" href={`/leads/${qt.leadId}`} className="text-teal-700 hover:underline">{lead ? leadLabel(lead, customers.data ?? []) : `Lead #${qt.leadId}`}</Link>],
                ["Status", <Badge key="s" s={qt.status} />], ["Total price", <b key="t">{money(qt.totalPrice)}</b>], ["Created", fmtDate(qt.createdAt)],
              ]}>
              <Card title="Status">
                {NEXT[qt.status].length === 0 ? <p className="text-sm text-slate-500">No further status changes available.</p> : (
                  <div className="flex flex-wrap gap-2">
                    {NEXT[qt.status].map((s) => (
                      <Btn key={s} variant={s === "REJECTED" ? "danger" : "primary"} disabled={busy} onClick={() => setStatus(s)}>Mark as {s.toLowerCase()}</Btn>
                    ))}
                  </div>
                )}
              </Card>
              <Card title="Items" action={!locked && <Btn variant="ghost" onClick={() => setItemEdit("new")}>Add item</Btn>}>
                {items.length === 0 ? <p className="text-sm text-slate-500">No items on this quotation.</p> : (
                  <Table rows={items} cols={[
                    ["Equipment", (i) => i.equipment?.name ?? eq.find((e) => e.id === i.equipmentId)?.name ?? `#${i.equipmentId}`],
                    ["Qty", (i) => i.quantity], ["Unit price", (i) => money(i.unitPrice)], ["Subtotal", (i) => money(i.subtotal)],
                    ["", (i) => locked ? null : <RowActions onEdit={() => setItemEdit(i)}
                      onDelete={() => confirmRun("Remove this item?", () => api.quotations.removeItem(id, i.id), q.reload)} />],
                  ]} />
                )}
              </Card>
            </Detail>
            {itemEdit && <QuotationItemForm quotationId={id} item={itemEdit === "new" ? null : itemEdit} equipment={eq}
              usedIds={items.map((i) => i.equipmentId)} onClose={() => setItemEdit(null)} onSaved={q.reload} />}
            {job && <JobForm quotations={[qt]} presetId={qt.id} onClose={() => setJob(false)} onSaved={() => router.push("/jobs")} />}
          </>
        );
      }}
    </One>
  );
}
