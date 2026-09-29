"use client";
import { useState } from "react";
import { api } from "@/lib/api";
import type { Customer, Lead, Survey } from "@/types";
import { Field, FormModal, inputCls, leadLabel } from "@/components/layout/ui";

export default function SurveyForm({ survey, leads, customers, onClose, onSaved }: {
  survey: Survey | null; leads: Lead[]; customers: Customer[]; onClose: () => void; onSaved: () => void;
}) {
  const [leadId, setLeadId] = useState(String(survey?.leadId ?? ""));
  const [area, setArea] = useState(String(survey?.area ?? ""));
  return (
    <FormModal title={survey ? "Edit site survey" : "New site survey"} onClose={onClose} onSubmit={async () => {
      if (!leadId) throw new Error("Select a lead.");
      const a = Number(area);
      if (area === "" || isNaN(a) || a <= 0) throw new Error("Enter a site area greater than 0.");
      if (survey) await api.surveys.update(survey.id, { area: a });
      else await api.surveys.create({ leadId: Number(leadId), area: a });
      onSaved();
    }}>
      <Field label="Lead">
        <select className={inputCls} value={leadId} disabled={!!survey} onChange={(e) => setLeadId(e.target.value)}>
          <option value="">Select lead…</option>
          {leads.map((l) => <option key={l.id} value={l.id}>{leadLabel(l, customers)}</option>)}
        </select>
      </Field>
      <Field label="Site area">
        <input type="number" min="0" step="any" className={inputCls} value={area} onChange={(e) => setArea(e.target.value)} />
      </Field>
    </FormModal>
  );
}
