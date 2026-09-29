"use client";
import { useState } from "react";
import { api } from "@/lib/api";
import { LEAD_STATUSES, type Customer, type Lead, type LeadStatus } from "@/types";
import { Field, FormModal, inputCls } from "@/components/layout/ui";

export default function LeadForm({ lead, customers, onClose, onSaved }: { lead: Lead | null; customers: Customer[]; onClose: () => void; onSaved: () => void }) {
  const [customerId, setCustomerId] = useState(String(lead?.customerId ?? ""));
  const [bill, setBill] = useState(String(lead?.estimatedBill ?? ""));
  const [status, setStatus] = useState<LeadStatus>(lead?.status ?? "NEW");

  return (
    <FormModal title={lead ? "Edit lead" : "New lead"} onClose={onClose} onSubmit={async () => {
      if (!customerId) throw new Error("Select a customer.");
      const estimatedBill = Number(bill);
      if (bill === "" || isNaN(estimatedBill) || estimatedBill < 0) throw new Error("Enter a valid estimated bill.");
      
      if (lead) await api.leads.update(lead.id, { customerId: Number(customerId), estimatedBill, status });
      else await api.leads.create({ customerId: Number(customerId), estimatedBill, status });
      
      onSaved();
    }}>
      <Field label="Customer">
        <select className={inputCls} value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
          <option value="">Select customer…</option>
          {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </Field>
      <Field label="Estimated monthly bill">
        <input type="number" min="0" step="any" className={inputCls} value={bill} onChange={(e) => setBill(e.target.value)} />
      </Field>
      {lead && (
        <Field label="Status">
          <select className={inputCls} value={status} onChange={(e) => setStatus(e.target.value as LeadStatus)}>
            {LEAD_STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </Field>
      )}
    </FormModal>
  );
}
