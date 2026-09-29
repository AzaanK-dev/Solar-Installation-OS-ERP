"use client";
import { useState } from "react";
import { api } from "@/lib/api";
import type { Customer, Equipment, Lead } from "@/types";
import { Btn, Field, FormModal, inputCls, leadLabel, money } from "@/components/layout/ui";

type Row = { equipmentId: string; quantity: string };

export default function QuotationForm({ leads, customers, equipment, onClose, onSaved }: {
  leads: Lead[]; customers: Customer[]; equipment: Equipment[]; onClose: () => void; onSaved: () => void;
}) {
  const [leadId, setLeadId] = useState("");
  const [rows, setRows] = useState<Row[]>([{ equipmentId: "", quantity: "1" }]);
  const upd = (i: number, p: Partial<Row>) => setRows(rows.map((r, j) => (j === i ? { ...r, ...p } : r)));
  // Preview only — the backend calculates the real totalPrice.
  const preview = rows.reduce((s, r) => s + (equipment.find((e) => e.id === Number(r.equipmentId))?.unitPrice ?? 0) * (Number(r.quantity) || 0), 0);
  return (
    <FormModal title="New quotation" label="Create quotation" onClose={onClose} onSubmit={async () => {
      if (!leadId) throw new Error("Select a lead.");
      const items = rows.map((r) => ({ equipmentId: Number(r.equipmentId), quantity: Number(r.quantity) }));
      if (items.some((i) => !i.equipmentId)) throw new Error("Select equipment for every row.");
      if (items.some((i) => !Number.isInteger(i.quantity) || i.quantity < 1)) throw new Error("Quantities must be whole numbers of 1 or more.");
      if (new Set(items.map((i) => i.equipmentId)).size !== items.length) throw new Error("Each equipment item can only be added once.");
      await api.quotations.create({ leadId: Number(leadId), items });
      onSaved();
    }}>
      <Field label="Lead">
        <select className={inputCls} value={leadId} onChange={(e) => setLeadId(e.target.value)}>
          <option value="">Select lead…</option>
          {leads.map((l) => <option key={l.id} value={l.id}>{leadLabel(l, customers)}</option>)}
        </select>
      </Field>
      <div className="space-y-2">
        <span className="block text-sm font-medium text-slate-700">Items</span>
        {rows.map((r, i) => (
          <div key={i} className="flex gap-2">
            <select className={inputCls} value={r.equipmentId} onChange={(e) => upd(i, { equipmentId: e.target.value })}>
              <option value="">Select equipment…</option>
              {equipment.map((e) => <option key={e.id} value={e.id}>{e.name} — {money(e.unitPrice)} ({e.quantity} in stock)</option>)}
            </select>
            <input type="number" min="1" step="1" className={`${inputCls} w-24`} value={r.quantity} onChange={(e) => upd(i, { quantity: e.target.value })} />
            <Btn type="button" variant="danger" disabled={rows.length === 1} onClick={() => setRows(rows.filter((_, j) => j !== i))}>✕</Btn>
          </div>
        ))}
        <Btn type="button" variant="ghost" onClick={() => setRows([...rows, { equipmentId: "", quantity: "1" }])}>Add item</Btn>
      </div>
      <p className="text-sm text-slate-600">Estimated total: <b>{money(preview)}</b> <span className="text-xs">(final price is calculated by the server)</span></p>
    </FormModal>
  );
}
