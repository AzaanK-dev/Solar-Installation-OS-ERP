"use client";
import { useState } from "react";
import { api } from "@/lib/api";
import type { Quotation } from "@/types";
import { Field, FormModal, inputCls, money } from "@/components/layout/ui";

export default function JobForm({ quotations, presetId, onClose, onSaved }: {
  quotations: Quotation[]; presetId?: number; onClose: () => void; onSaved: () => void;
}) {
  const [quotationId, setQuotationId] = useState(String(presetId ?? ""));
  const [scheduledDate, setDate] = useState("");
  return (
    <FormModal title="New installation job" onClose={onClose} onSubmit={async () => {
      if (!quotationId) throw new Error("Select an accepted quotation.");
      if (!scheduledDate) throw new Error("Choose a scheduled date.");
      await api.jobs.create({ quotationId: Number(quotationId), scheduledDate });
      onSaved();
    }}>
      <Field label="Accepted quotation">
        <select className={inputCls} value={quotationId} disabled={!!presetId} onChange={(e) => setQuotationId(e.target.value)}>
          <option value="">Select quotation…</option>
          {quotations.map((q) => <option key={q.id} value={q.id}>Quotation #{q.id} — {money(q.totalPrice)}</option>)}
        </select>
      </Field>
      <Field label="Scheduled date"><input type="date" className={inputCls} value={scheduledDate} onChange={(e) => setDate(e.target.value)} /></Field>
    </FormModal>
  );
}
