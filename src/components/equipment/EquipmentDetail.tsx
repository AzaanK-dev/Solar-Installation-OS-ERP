"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/lib/api";
import { Detail, One, confirmRun, fmtDate, money, useFetch } from "@/components/layout/ui";
import EquipmentForm from "./EquipmentForm";
import { StockCell } from "./EquipmentList";

export default function EquipmentDetail({ id }: { id: number }) {
  const router = useRouter();
  const e = useFetch(() => api.equipment.get(id), [id]);
  const [edit, setEdit] = useState(false);
  return (
    <One {...e} onRetry={e.reload}>
      {(eq) => (
        <>
          <Detail title={eq.name} back="/equipment" onEdit={() => setEdit(true)}
            onDelete={() => confirmRun(`Delete ${eq.name}?`, () => api.equipment.remove(id), () => router.push("/equipment"))}
            items={[["Type", eq.type], ["Stock", <StockCell key="q" qty={eq.quantity} />], ["Unit price", money(eq.unitPrice)], ["Created", fmtDate(eq.createdAt)]]} />
          {edit && <EquipmentForm item={eq} onClose={() => setEdit(false)} onSaved={e.reload} />}
        </>
      )}
    </One>
  );
}
