"use client";
import { useState } from "react";
import { api } from "@/lib/api";
import { EQUIPMENT_TYPES, type Equipment } from "@/types";
import { Field, FormModal, inputCls } from "@/components/layout/ui";

export default function EquipmentForm({ item, onClose, onSaved }: { item: Equipment | null; onClose: () => void; onSaved: () => void }) {
  const [f, setF] = useState({ name: item?.name ?? "", type: item?.type ?? "", quantity: String(item?.quantity ?? ""), unitPrice: String(item?.unitPrice ?? "") });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });
  return (
    <FormModal title={item ? "Edit equipment" : "New equipment"} onClose={onClose} onSubmit={async () => {
      const quantity = Number(f.quantity), unitPrice = Number(f.unitPrice);
      if (!f.name.trim()) throw new Error("Name is required.");
      if (!f.type.trim()) throw new Error("Type is required.");
      if (f.quantity === "" || !Number.isInteger(quantity) || quantity < 0) throw new Error("Quantity must be a whole number, 0 or more.");
      if (f.unitPrice === "" || isNaN(unitPrice) || unitPrice < 0) throw new Error("Enter a valid unit price.");
      const body = { name: f.name.trim(), type: f.type.trim(), quantity, unitPrice };
      if (item) await api.equipment.update(item.id, body);
      else await api.equipment.create(body);
      onSaved();
    }}>
      <Field label="Name"><input className={inputCls} value={f.name} onChange={set("name")} /></Field>
      <Field label="Type">
        <input list="eq-types" className={inputCls} value={f.type} onChange={set("type")} />
        <datalist id="eq-types">{EQUIPMENT_TYPES.map((t) => <option key={t} value={t} />)}</datalist>
      </Field>
      <Field label="Quantity in stock"><input type="number" min="0" step="1" className={inputCls} value={f.quantity} onChange={set("quantity")} /></Field>
      <Field label="Unit price"><input type="number" min="0" step="any" className={inputCls} value={f.unitPrice} onChange={set("unitPrice")} /></Field>
    </FormModal>
  );
}
