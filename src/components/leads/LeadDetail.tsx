"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/lib/api";
import { Badge, Card, Detail, One, confirmRun, fmtDate, money, nameOf, useFetch } from "@/components/layout/ui";
import LeadForm from "./LeadForm";

export default function LeadDetail({ id }: { id: number }) {
  const router = useRouter();
  const l = useFetch(() => api.leads.get(id), [id]);
  const customers = useFetch(api.customers.list);
  const surveys = useFetch(api.surveys.list);
  const quotes = useFetch(api.quotations.list);
  const [edit, setEdit] = useState(false);
  const cs = customers.data ?? [];
  return (
    <One {...l} onRetry={l.reload}>
      {(lead) => {
        const sv = (surveys.data ?? []).filter((s) => s.leadId === id);
        const qs = (quotes.data ?? []).filter((q) => q.leadId === id);
        return (
          <>
            <Detail title={`Lead #${lead.id}`} back="/leads" onEdit={() => setEdit(true)}
              onDelete={() => confirmRun(`Delete lead #${id}?`, () => api.leads.remove(id), () => router.push("/leads"))}
              items={[
                ["Customer", <Link key="c" href={`/customers/${lead.customerId}`} className="text-teal-700 hover:underline">{nameOf(cs, lead.customerId)}</Link>],
                ["Status", <Badge key="s" s={lead.status} />], ["Estimated bill", money(lead.estimatedBill)], ["Created", fmtDate(lead.createdAt)],
              ]}>
              <Card title="Site survey">
                {sv.length === 0 ? <p className="text-sm text-slate-500">No survey yet. <Link href="/surveys" className="text-teal-700 underline">Add one</Link>.</p>
                  : sv.map((s) => <Link key={s.id} href={`/surveys/${s.id}`} className="text-sm text-teal-700 hover:underline">Survey #{s.id} — {s.area} area</Link>)}
              </Card>
              <Card title="Quotations">
                {qs.length === 0 ? <p className="text-sm text-slate-500">No quotation yet. <Link href="/quotations" className="text-teal-700 underline">Create one</Link>.</p> : (
                  <ul className="divide-y divide-slate-100 text-sm">
                    {qs.map((q) => (
                      <li key={q.id} className="flex items-center justify-between py-2">
                        <Link href={`/quotations/${q.id}`} className="text-teal-700 hover:underline">Quotation #{q.id}</Link>
                        <span>{money(q.totalPrice)}</span><Badge s={q.status} />
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            </Detail>
            {edit && <LeadForm lead={lead} customers={cs} onClose={() => setEdit(false)} onSaved={l.reload} />}
          </>
        );
      }}
    </One>
  );
}
