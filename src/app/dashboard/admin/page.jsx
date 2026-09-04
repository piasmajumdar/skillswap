"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiActivity,
  FiCheckCircle,
  FiCreditCard,
  FiUsers,
} from "react-icons/fi";
import { authClient } from "@/lib/auth-client";
import StatCard from "../components/StatCard";
import { clientApi } from "../components/clientApi";

const money = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const date = (value) =>
  value ? new Date(value).toLocaleDateString("en-US") : "-";
const label = (value) => String(value || "open").replace("_", " ");

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-28 animate-pulse rounded-3xl bg-white" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="h-32 animate-pulse rounded-2xl bg-white" />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="h-72 animate-pulse rounded-3xl bg-white" />
        <div className="h-72 animate-pulse rounded-3xl bg-white" />
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isPending) return;
    if (!session?.user) {
      router.replace("/auth/login");
      return;
    }
    if (String(session.user.role).toLowerCase() !== "admin") {
      router.replace(`/dashboard/${session.user.role || "client"}`);
      return;
    }
    clientApi("/api/admin/dashboard")
      .then(setData)
      .catch((requestError) => setError(requestError.message));
  }, [isPending, session, router]);

  if (isPending || (!data && !error)) return <DashboardSkeleton />;
  if (!session?.user || String(session.user.role).toLowerCase() !== "admin")
    return null;

  const roleEntries = Object.entries(data?.roleCounts || {});
  const roleTotal = roleEntries.reduce(
    (sum, [, value]) => sum + Number(value || 0),
    0,
  );
  const roleColors = ["#4f46e5", "#10b981", "#f59e0b", "#f43f5e"];
  let offset = 0;
  const roleGradient = roleEntries.length
    ? `conic-gradient(${roleEntries
        .map(([, value], index) => {
          const start = offset;
          offset += (Number(value) / roleTotal) * 100;
          return `${roleColors[index % roleColors.length]} ${start}% ${offset}%`;
        })
        .join(", ")})`
    : "#e2e8f0";

  return (
    <div className="space-y-6">
      {error && (
        <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </p>
      )}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
          Admin Overview
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
          Welcome back, {session.user.name?.split(" ")[0] || "Admin"}.
        </h1>
        <p className="mt-2 text-slate-500">
          Monitor platform activity and keep the marketplace healthy.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Users"
          value={data?.totalUsers || 0}
          icon={FiUsers}
          tone="indigo"
        />
        <StatCard
          title="Total Tasks"
          value={data?.totalTasks || 0}
          icon={FiActivity}
          tone="amber"
        />
        <StatCard
          title="Total Revenue"
          value={money(data?.totalRevenue)}
          icon={FiCreditCard}
          tone="emerald"
        />
        <StatCard
          title="Active Tasks"
          value={data?.activeTasks || 0}
          icon={FiCheckCircle}
          tone="rose"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Users by Role</h2>
          <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
            <div
              className="h-40 w-40 rounded-full"
              style={{ background: roleGradient }}
            />
            <div className="space-y-3">
              {roleEntries.map(([role, count], index) => (
                <div
                  key={role}
                  className="flex items-center gap-3 text-sm text-slate-600"
                >
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{
                      backgroundColor: roleColors[index % roleColors.length],
                    }}
                  />
                  <span className="capitalize">{role}</span>
                  <strong className="text-slate-900">{count}</strong>
                </div>
              ))}
            </div>
          </div>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Tasks by Status</h2>
          <div className="mt-6 space-y-5">
            {[
              ["open", "bg-amber-500"],
              ["in_progress", "bg-indigo-600"],
              ["completed", "bg-emerald-500"],
            ].map(([status, color]) => {
              const count = Number(data?.statusCounts?.[status] || 0);
              const width = data?.totalTasks
                ? Math.max((count / data.totalTasks) * 100, count ? 4 : 0)
                : 0;
              return (
                <div key={status}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="capitalize text-slate-600">
                      {label(status)}
                    </span>
                    <strong className="text-slate-900">{count}</strong>
                  </div>
                  <div className="h-3 rounded-full bg-slate-100">
                    <div
                      className={`h-3 rounded-full ${color}`}
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </article>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 p-6">
          <h2 className="text-lg font-bold text-slate-900">Recent Payments</h2>
          <Link
            href="/dashboard/admin/transactions"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            View all
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Freelancer</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(data?.recentPayments || []).map((payment) => (
                <tr key={String(payment._id)}>
                  <td className="px-6 py-4 text-slate-700">
                    {payment.client_email}
                  </td>
                  <td className="px-6 py-4 text-slate-700">
                    {payment.freelancer_email}
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-900">
                    {money(payment.amount)}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {date(payment.paid_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!data?.recentPayments?.length && (
            <p className="p-6 text-sm text-slate-500">No payments found.</p>
          )}
        </div>
      </section>
    </div>
  );
}
