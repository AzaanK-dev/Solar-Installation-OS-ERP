"use client";
import Link from "next/link";
import { api } from "@/lib/api";
import { LOW_STOCK_THRESHOLD } from "@/types";
import { Badge, Card, One, PageHeader, useFetch } from "@/components/layout/ui";

/* eslint-disable @typescript-eslint/no-explicit-any */
const pick = (o: any, ...keys: string[]) => {
  for (const k of keys) {
    if (o?.[k] !== undefined && o?.[k] !== null) {
      return o[k];
    }
    return undefined;
  }
};
const total = (v: any) => (typeof v === "number" ? v : Number(v?.total ?? v?.count ?? 0));

const countStatuses = (obj: Record<string, number> = {}) =>
  Object.values(obj).reduce((sum, count) => sum + count, 0);

const groups = (v: any): [string, number][] =>
  !v ? [] : Array.isArray(v)
    ? v.map((r: any) => [String(r.status), Number(r.count ?? r._count?.status ?? r._count?.id ?? r._count ?? 0)])
    : Object.entries(v).map(([k, n]) => [k, Number(n)]);

function Stat({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <Link href={href} className="rounded-lg border border-slate-200 bg-white p-4 hover:border-teal-500">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-1 text-3xl font-semibold text-[#0f2a47]">{value}</div>
    </Link>
  );
}

function Breakdown({ title, rows }: { title: string; rows: [string, number][] }) {
  const max = Math.max(1, ...rows.map((r) => r[1]));
  return (
    <Card title={title}>
      {rows.length === 0 ? <p className="text-sm text-slate-500">No data yet.</p> : (
        <ul className="space-y-2">
          {rows.map(([s, n]) => (
            <li key={s} className="flex items-center gap-3 text-sm">
              <span className="w-28"><Badge s={s} /></span>
              <div className="h-2 flex-1 rounded bg-slate-100"><div className="h-2 rounded bg-teal-500" style={{ width: `${(n / max) * 100}%` }} /></div>
              <span className="w-8 text-right font-medium">{n}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}




export default function Dashboard() {
  const d = useFetch(api.dashboard);

  return (
    <>
      <PageHeader title="Dashboard" />
      <One {...d} onRetry={d.reload}>
        {(r: any) => {
          const low = r.lowStockEquipments ?? [];
          return (
            <>
              {/* Main numbers */}
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
                <Stat
                  label="Customers"
                  href="/customers"
                  value={r.customersCount}
                />
                <Stat
                  label="Leads"
                  href="/leads"
                  value={countStatuses(r.leadsCount)}
                />
                <Stat
                  label="Site surveys"
                  href="/surveys"
                  value={r.siteSurveysCount}
                />
                <Stat
                  label="Quotations"
                  href="/quotations"
                  value={countStatuses(r.quotationsCount)}
                />
                <Stat
                  label="Installation jobs"
                  href="/jobs"
                  value={countStatuses(r.jobsCount)}
                />
              </div>

              {/* Status breakdowns */}
              <div className="grid gap-4 lg:grid-cols-3">
                <Breakdown
                  title="Leads by status"
                  rows={groups(r.leadsCount)}
                />
                <Breakdown
                  title="Quotations by status"
                  rows={groups(r.quotationsCount)}
                />
                <Breakdown
                  title="Jobs by status"
                  rows={groups(r.jobsCount)}
                />
              </div>

              {/* Low stock */}
              <Card
                title={`Low-stock equipment (under ${LOW_STOCK_THRESHOLD} in stock)`}
              >
                {low.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    Stock levels look healthy.
                  </p>
                ) : (
                  <ul className="divide-y divide-slate-100 text-sm">
                    {low.map((e: any) => (
                      <li
                        key={e.id}
                        className="flex justify-between py-2"
                      >
                        <Link
                          href={`/equipment/${e.id}`}
                          className="text-teal-700 hover:underline"
                        >
                          {e.name}
                        </Link>

                        <span className="font-medium text-amber-700">
                          {e.quantity} left
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            </>
          );
        }}
      </One>
    </>
  );
}