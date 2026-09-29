"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/lib/api";
import { Detail, One, confirmRun, fmtDate, leadLabel, useFetch } from "@/components/layout/ui";
import SurveyForm from "./SurveyForm";

export default function SurveyDetail({ id }: { id: number }) {
  const router = useRouter();
  const s = useFetch(() => api.surveys.get(id), [id]);
  const leads = useFetch(api.leads.list);
  const customers = useFetch(api.customers.list);
  const [edit, setEdit] = useState(false);
  const ls = leads.data ?? [], cs = customers.data ?? [];
  return (
    <One {...s} onRetry={s.reload}>
      {(sv) => {
        const l = ls.find((x) => x.id === sv.leadId);
        return (
          <>
            <Detail title={`Survey #${sv.id}`} back="/surveys" onEdit={() => setEdit(true)}
              onDelete={() => confirmRun(`Delete survey #${id}?`, () => api.surveys.remove(id), () => router.push("/surveys"))}
              items={[
                ["Lead", <Link key="l" href={`/leads/${sv.leadId}`} className="text-teal-700 hover:underline">{l ? leadLabel(l, cs) : `Lead #${sv.leadId}`}</Link>],
                ["Site area", sv.area], ["Created", fmtDate(sv.createdAt)],
              ]} />
            {edit && <SurveyForm survey={sv} leads={ls} customers={cs} onClose={() => setEdit(false)} onSaved={s.reload} />}
          </>
        );
      }}
    </One>
  );
}
