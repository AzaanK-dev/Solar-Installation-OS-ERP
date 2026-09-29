"use client";
import Link from "next/link";
import { ReactNode, useCallback, useEffect, useState } from "react";
import type { Customer, Lead } from "@/types";

export const money = (n: unknown) => Number(n ?? 0).toLocaleString(undefined, { maximumFractionDigits: 2 });
export const fmtDate = (d?: string | null) => (d ? new Date(d).toLocaleDateString() : "—");
export const nameOf = (cs: Customer[], id: number) => cs.find((c) => c.id === id)?.name ?? `#${id}`;
export const leadLabel = (l: Lead, cs: Customer[]) => `Lead #${l.id} — ${nameOf(cs, l.customerId)}`;

export function useFetch<T>(fn: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const load = useCallback(async () => {
    setLoading(true); setError("");
    try { setData(await fn()); } catch (e) { setError((e as Error).message); } finally { setLoading(false); }
  }, deps);
  useEffect(() => { load(); }, [load]);
  return { data, error, loading, reload: load };
}

export async function confirmRun(msg: string, fn: () => Promise<unknown>, after: () => void) {
  if (!confirm(msg)) return;
  try { await fn(); after(); } catch (e) { alert((e as Error).message); }
}

const tone: Record<string, string> = {
  NEW: "bg-sky-100 text-sky-800", SURVEYED: "bg-indigo-100 text-indigo-800", QUOTED: "bg-amber-100 text-amber-800",
  CONVERTED: "bg-teal-100 text-teal-800", DRAFT: "bg-slate-200 text-slate-700", SENT: "bg-sky-100 text-sky-800",
  ACCEPTED: "bg-emerald-100 text-emerald-800", REJECTED: "bg-red-100 text-red-700", SCHEDULED: "bg-amber-100 text-amber-800",
  IN_PROGRESS: "bg-sky-100 text-sky-800", COMPLETED: "bg-emerald-100 text-emerald-800",
};
export const Badge = ({ s }: { s: string }) => (
  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${tone[s] ?? "bg-slate-100 text-slate-700"}`}>{s.replace("_", " ")}</span>
);

type BtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "danger" };
export function Btn({ variant = "primary", className = "", ...p }: BtnProps) {
  const v = {
    primary: "bg-teal-600 text-white hover:bg-teal-700",
    ghost: "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
    danger: "bg-red-50 text-red-700 hover:bg-red-100",
  }[variant];
  return <button {...p} className={`rounded-md px-3 py-1.5 text-sm font-medium disabled:opacity-50 ${v} ${className}`} />;
}

export const inputCls =
  "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 disabled:bg-slate-100";

export const Field = ({ label, children }: { label: string; children: ReactNode }) => (
  <label className="block text-sm">
    <span className="mb-1 block font-medium text-slate-700">{label}</span>
    {children}
  </label>
);

export function PageHeader({ title, back, action }: { title: string; back?: string; action?: ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <div>
        {back && <Link href={back} className="text-xs text-teal-700 hover:underline">← Back</Link>}
        <h1 className="text-2xl font-semibold text-[#0f2a47]">{title}</h1>
      </div>
      {action}
    </div>
  );
}

export const Card = ({ title, children, action }: { title?: string; children: ReactNode; action?: ReactNode }) => (
  <section className="mt-6 rounded-lg border border-slate-200 bg-white p-4">
    {(title || action) && (
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-medium text-[#0f2a47]">{title}</h2>{action}
      </div>
    )}
    {children}
  </section>
);

export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h2 className="mb-4 text-lg font-semibold text-[#0f2a47]">{title}</h2>
        {children}
      </div>
    </div>
  );
}

export function FormModal({ title, onClose, onSubmit, children, label = "Save" }: {
  title: string; onClose: () => void; onSubmit: () => Promise<void>; children: ReactNode; label?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  return (
    <Modal title={title} onClose={onClose}>
      <form className="space-y-3" onSubmit={async (e) => {
        e.preventDefault(); setBusy(true); setErr("");
        try { await onSubmit(); onClose(); } catch (x) { setErr((x as Error).message); setBusy(false); }
      }}>
        {children}
        {err && <p className="rounded bg-red-50 p-2 text-sm text-red-700">{err}</p>}
        <div className="flex justify-end gap-2 pt-2">
          <Btn type="button" variant="ghost" onClick={onClose}>Cancel</Btn>
          <Btn disabled={busy}>{busy ? "Saving…" : label}</Btn>
        </div>
      </form>
    </Modal>
  );
}

const ErrorBox = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">{error}
    <button className="ml-2 underline" onClick={onRetry}>Retry</button>
  </div>
);
const Loading = () => <p className="py-10 text-center text-sm text-slate-500">Loading…</p>;

export function Async<T>({ loading, error, data, onRetry, empty, children }: {
  loading: boolean; error: string; data: T[] | null; onRetry: () => void; empty: string; children: (d: T[]) => ReactNode;
}) {
  if (error) return <ErrorBox error={error} onRetry={onRetry} />;
  if (loading && !data) return <Loading />;
  if (!Array.isArray(data) || !data.length)
    return <p className="rounded-md border border-dashed border-slate-300 py-10 text-center text-sm text-slate-500">{empty}</p>;
  return <>{children(data)}</>;
}

export function One<T>({ loading, error, data, onRetry, children }: {
  loading: boolean; error: string; data: T | null; onRetry: () => void; children: (d: T) => ReactNode;
}) {
  if (error) return <ErrorBox error={error} onRetry={onRetry} />;
  if (loading && !data) return <Loading />;
  if (!data) return <p className="py-10 text-center text-sm text-slate-500">Not found.</p>;
  return <>{children(data)}</>;
}

export function Table<T extends { id: number }>({ rows, cols }: { rows: T[]; cols: [string, (r: T) => ReactNode][] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs text-slate-500">
          <tr>{cols.map(([h]) => <th key={h} className="px-4 py-2.5 font-medium">{h}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((r) => (
            <tr key={r.id} className="hover:bg-slate-50">
              {cols.map(([h, f]) => <td key={h} className="px-4 py-2.5">{f(r)}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function RowActions({ href, onEdit, onDelete }: { href?: string; onEdit?: () => void; onDelete?: () => void }) {
  return (
    <div className="flex justify-end gap-3 text-sm">
      {href && <Link href={href} className="text-teal-700 hover:underline">View</Link>}
      {onEdit && <button onClick={onEdit} className="text-slate-600 hover:underline">Edit</button>}
      {onDelete && <button onClick={onDelete} className="text-red-600 hover:underline">Delete</button>}
    </div>
  );
}

export function Detail({ title, back, items, onEdit, onDelete, actions, children }: {
  title: string; back: string; items: [string, ReactNode][]; onEdit?: () => void; onDelete?: () => void; actions?: ReactNode; children?: ReactNode;
}) {
  return (
    <>
      <PageHeader title={title} back={back} action={
        <div className="flex gap-2">
          {actions}
          {onEdit && <Btn variant="ghost" onClick={onEdit}>Edit</Btn>}
          {onDelete && <Btn variant="danger" onClick={onDelete}>Delete</Btn>}
        </div>} />
      <dl className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 sm:grid-cols-2">
        {items.map(([k, v]) => (
          <div key={k}><dt className="text-xs text-slate-500">{k}</dt><dd className="mt-0.5 text-sm">{v ?? "—"}</dd></div>
        ))}
      </dl>
      {children}
    </>
  );
}
