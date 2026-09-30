"use client";
import { useState } from "react";
import { api } from "@/lib/api";
import { LOW_STOCK_THRESHOLD, type Equipment } from "@/types";
import { Async, Btn, PageHeader, RowActions, Table, confirmRun, money, useFetch } from "@/components/layout/ui";
import EquipmentForm from "./EquipmentForm";

export const StockCell = ({ qty }: { qty: number }) => (
  <span className={qty < LOW_STOCK_THRESHOLD ? "font-medium text-amber-700" : ""}>{qty}{qty < LOW_STOCK_THRESHOLD && " (low)"}</span>
);

export default function EquipmentList() {
  const { data, error, loading, reload } = useFetch(api.equipment.list);
  const [edit, setEdit] = useState<Equipment | "new" | null>(null);
  return (
    <>
      <PageHeader title="Equipment" action={
        <Btn onClick={() => setEdit("new")}>
          New equipment
        </Btn>}
      />

      <Async loading={loading} error={error} data={data} onRetry={reload} empty="No equipment yet. Add panels, inverters and batteries to quote with.">

        {(rows) => (
          <Table rows={rows} cols={[
            ["Name", (e) => <span className="font-medium">{e.name}</span>],
            ["Type", (e) => e.type],
            ["Stock", (e) => <StockCell qty={e.quantity} />],
            ["Unit price", (e) => money(e.unitPrice)],
            ["", (e) =>
              <RowActions
                href={`/equipment/${e.id}`}
                onEdit={() => setEdit(e)}
                onDelete={() => confirmRun(`Delete ${e.name}?`, () => api.equipment.delete(e.id), reload)}
              />],

          ]} />
        )}
      </Async>
      {edit && <EquipmentForm item={edit === "new" ? null : edit} onClose={() => setEdit(null)} onSaved={reload} />}
    </>
  );
}
