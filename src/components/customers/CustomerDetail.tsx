"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/lib/api";
import { Badge, Card, Detail, One, confirmRun, fmtDate, money, useFetch } from "@/components/layout/ui";
import CustomerForm from "./CustomerForm";

export default function CustomerDetail({ id }: { id: number }) {
  const router = useRouter();
  const c = useFetch(() => api.customers.get(id), [id]);
  const leads = useFetch(api.leads.list);
  const [edit, setEdit] = useState(false);
  return (
    <One {...c} onRetry={c.reload}>
      {(cu) => {
        const mine = (leads.data ?? []).filter((l) => l.customerId === cu.id);
        return (
          <>
            <Detail title={cu.name} back="/customers" onEdit={() => setEdit(true)}
              onDelete={() => confirmRun(`Delete ${cu.name}?`, () => api.customers.remove(id), () => router.push("/customers"))}
              items={[["Email", cu.email], ["Contact", cu.contact], ["Address", cu.address], ["Created", fmtDate(cu.createdAt)]]}>
              <Card title="Leads">
                {mine.length === 0 ? <p className="text-sm text-slate-500">No leads for this customer.</p> : (
                  <ul className="divide-y divide-slate-100 text-sm">
                    {mine.map((l) => (
                      <li key={l.id} className="flex items-center justify-between py-2">
                        <Link href={`/leads/${l.id}`} className="text-teal-700 hover:underline">Lead #{l.id}</Link>
                        <span>Est. bill {money(l.estimatedBill)}</span><Badge s={l.status} />
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            </Detail>
            {edit && <CustomerForm customer={cu} onClose={() => setEdit(false)} onSaved={c.reload} />}
          </>
        );
      }}
    </One>
  );
}
