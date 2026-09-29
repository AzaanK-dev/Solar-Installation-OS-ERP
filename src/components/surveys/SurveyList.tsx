"use client";
import { useState } from "react";
import { api } from "@/lib/api";
import type { Survey } from "@/types";
import { Async, Btn, PageHeader, RowActions, Table, confirmRun, fmtDate, leadLabel, useFetch } from "@/components/layout/ui";
import SurveyForm from "./SurveyForm";

export default function SurveyList() {
  const { data, error, loading, reload } = useFetch(api.surveys.list);
  const leads = useFetch(api.leads.list);
  const customers = useFetch(api.customers.list);
  const ls = leads.data ?? [], cs = customers.data ?? [];
  const [edit, setEdit] = useState<Survey | "new" | null>(null);
  return (
    <>
      <PageHeader title="Site surveys" action={<Btn onClick={() => setEdit("new")} disabled={!ls.length}>New survey</Btn>} />
      <Async loading={loading} error={error} data={data} onRetry={reload} empty="No site surveys yet. Create one from an existing lead.">
        {(rows) => (
          <Table rows={rows} cols={[
            ["ID", (s) => `#${s.id}`],
            ["Lead", (s) => { const l = ls.find((x) => x.id === s.leadId); return l ? leadLabel(l, cs) : `Lead #${s.leadId}`; }],
            ["Area", (s) => s.area], ["Created", (s) => fmtDate(s.createdAt)],
            ["", (s) => <RowActions href={`/surveys/${s.id}`} onEdit={() => setEdit(s)}
              onDelete={() => confirmRun(`Delete survey #${s.id}?`, () => api.surveys.remove(s.id), reload)} />],
          ]} />
        )}
      </Async>
      {edit && <SurveyForm survey={edit === "new" ? null : edit} leads={ls} customers={cs} onClose={() => setEdit(null)} onSaved={reload} />}
    </>
  );
}
