"use client";
import { useState } from "react";
import { api } from "@/lib/api";
import type { Customer } from "@/types";
import { Async, Btn, PageHeader, RowActions, Table, confirmRun, useFetch } from "@/components/layout/ui";
import CustomerForm from "./CustomerForm";

export default function CustomerList() {
  const { data, error, loading, reload } = useFetch(api.customers.list);

  console.log("CUSTOMERS DATA:", data);
  console.log("CUSTOMERS ERROR:", error);

  const [edit, setEdit] = useState<Customer | "new" | null>(null);
  return (
    <>
      <PageHeader title="Customers" action={<Btn onClick={() => setEdit("new")}>New customer</Btn>} />
      <Async loading={loading} error={error} data={data} onRetry={reload} empty="No customers yet. Add your first customer to start a lead.">
        {(rows) => (
          <Table rows={rows} cols={[
            ["Name", (c) => <span className="font-medium">{c.name}</span>],
            ["Email", (c) => c.email], ["Contact", (c) => c.contact], ["Address", (c) => c.address],
            ["", (c) => <RowActions href={`/customers/${c.id}`} onEdit={() => setEdit(c)}
              onDelete={() => confirmRun(`Delete ${c.name}?`, () => api.customers.delete(c.id), reload)} />],
          ]} />
        )}
      </Async>

      {edit && <CustomerForm customer={edit === "new" ? null : edit} onClose={() => setEdit(null)} onSaved={reload} />}
    </>
  );
}
