"use client";

import { useEffect, useMemo, useState } from "react";
import { authClient } from "@/lib/auth-client";
import StatCard from "../../components/StatCard";
import { clientApi, withEmail } from "../../components/clientApi";

const money = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

export default function EarningsPage() {
  const { data: session } = authClient.useSession();
  const [rows, setRows] = useState([]);
  useEffect(() => {
    if (session?.user?.email)
      clientApi(
        "/api/freelancer/earnings?email=" + withEmail(session.user.email),
      )
        .then(setRows)
        .catch(() => setRows([]));
  }, [session?.user?.email]);
  const stats = useMemo(() => {
    const total = rows.reduce((sum, row) => sum + Number(row.amount || 0), 0);
    const month = new Date().getMonth();
    const thisMonth = rows
      .filter((row) => new Date(row.paid_at).getMonth() === month)
      .reduce((sum, row) => sum + Number(row.amount || 0), 0);
    return { total, average: rows.length ? total / rows.length : 0, thisMonth };
  }, [rows]);
  const monthly = Array.from({ length: 12 }, (_, month) =>
    rows
      .filter((row) => new Date(row.paid_at).getMonth() === month)
      .reduce((sum, row) => sum + Number(row.amount || 0), 0),
  );
  const max = Math.max(...monthly, 1);

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Earnings</h1>
        <p className="mt-1 text-sm text-slate-500">
          Your paid work and earnings history.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          title="Total Earned"
          value={money(stats.total)}
          tone="indigo"
        />
        <StatCard
          title="Average Per Task"
          value={money(stats.average)}
          tone="emerald"
        />
        <StatCard
          title="Earned This Month"
          value={money(stats.thisMonth)}
          tone="amber"
        />
      </div>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-bold text-slate-900">Monthly Earnings</h2>
        <div className="mt-6 flex h-56 items-end gap-2 border-b border-slate-100">
          {monthly.map((amount, index) => (
            <div
              key={index}
              className="flex flex-1 flex-col items-center gap-2"
            >
              <div
                title={money(amount)}
                className="w-full rounded-t-md bg-indigo-500 hover:bg-indigo-600"
                style={{
                  height: Math.max((amount / max) * 180, amount ? 8 : 2),
                }}
              />
              <span className="text-[10px] text-slate-400">{index + 1}</span>
            </div>
          ))}
        </div>
      </section>
      <section className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
        <h2 className="p-6 font-bold text-slate-900">Payment Breakdown</h2>
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs uppercase text-slate-500">
                Task Title
              </th>
              <th className="px-6 py-3 text-left text-xs uppercase text-slate-500">
                Client Name
              </th>
              <th className="px-6 py-3 text-left text-xs uppercase text-slate-500">
                Amount Made
              </th>
              <th className="px-6 py-3 text-left text-xs uppercase text-slate-500">
                Completion Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr key={row._id}>
                <td className="px-6 py-4 text-sm font-semibold">
                  {row.task?.title || "Task"}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {row.client?.name || row.client?.email}
                </td>
                <td className="px-6 py-4 text-sm font-semibold">
                  {money(row.amount)}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {new Date(row.paid_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length && (
          <p className="p-8 text-center text-sm text-slate-500">
            No payments received yet.
          </p>
        )}
      </section>
    </section>
  );
}
