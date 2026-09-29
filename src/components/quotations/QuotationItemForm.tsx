"use client";
import { useState } from "react";
import { api } from "@/lib/api";
import type { Equipment, QuotationItem } from "@/types";
import { Field, FormModal, inputCls, money } from "@/components/layout/ui";

export default function QuotationItemForm({ quotationId, item, equipment, usedIds, onClose, onSaved }: {
  quotationId: number; item: QuotationItem | null; equipment: Equipment[]; usedIds: number[]; onClose: () => void; onSaved: () => void;
}) {
  const [equipmentId, setEquipmentId] = useState(String(item?.equipmentId ?? ""));
  const [quantity, setQuantity] = useState(String(item?.quantity ?? "1"));
  return (
    <FormModal title={item ? "Edit item quantity" : "Add item"} onClose={onClose} onSubmit={async () => {
      const q = Number(quantity);
      if (!equipmentId) throw new Error("Select equipment.");
      if (!Number.isInteger(q) || q < 1) throw new Error("Quantity must be a whole number of 1 or more.");
      if (item) await api.quotations.updateItem(quotationId, item.id, { quantity: q });
      else await api.quotations.addItem(quotationId, { equipmentId: Number(equipmentId), quantity: q });
      onSaved();
    }}>
      <Field label="Equipment">
        <select className={inputCls} value={equipmentId} disabled={!!item} onChange={(e) => setEquipmentId(e.target.value)}>
          <option value="">Select equipment…</option>
          {equipment.filter((e) => !usedIds.includes(e.id) || e.id === item?.equipmentId).map((e) => (
            <option key={e.id} value={e.id}>{e.name} — {money(e.unitPrice)} ({e.quantity} in stock)</option>
          ))}
        </select>
      </Field>
      <Field label="Quantity"><input type="number" min="1" step="1" className={inputCls} value={quantity} onChange={(e) => setQuantity(e.target.value)} /></Field>
    </FormModal>
  );
}
