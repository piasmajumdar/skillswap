"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiFileText,
} from "react-icons/fi";
import { authClient } from "@/lib/auth-client";
import StatCard from "../components/StatCard";
import { clientApi, withEmail } from "../components/clientApi";

const money = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

export default function FreelancerDashboard() {
  const { data: session, isPending } = authClient.useSession();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const user = session?.user;

  useEffect(() => {
    if (!user?.email) return;
    clientApi("/api/freelancer/dashboard?email=" + withEmail(user.email))
      .then(setData)
      .catch((e) => setError(e.message));
  }, [user?.email]);

  const stats = useMemo(() => {
    const proposals = data?.proposals || [];
    return {
      total: proposals.length,
      pending: proposals.filter((item) => item.status === "pending").length,
      accepted: proposals.filter((item) => item.status === "accepted").length,
      completed: (data?.tasks || []).filter(
        (item) => item.status === "completed",
      ).length,
      earnings: (data?.payments || []).reduce(
        (sum, item) => sum + Number(item.amount || 0),
        0,
      ),
    };
  }, [data]);

  if (isPending || !data) {
    return (
      <div className="space-y-5">
        <div className="h-40 animate-pulse rounded-3xl bg-white" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="h-32 animate-pulse rounded-2xl bg-white"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      {error && (
        <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">
          {error}
        </p>
      )}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">
          Freelancer Dashboard
        </p>
        <div className="mt-4 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Welcome back, {user?.name?.split(" ")[0] || "there"}!
            </h1>
            <p className="mt-3 text-slate-500">
              Track your proposals, active projects, and earnings.
            </p>
          </div>
          <Link
            href="/dashboard/freelancer/browse-tasks"
            className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Browse Tasks
          </Link>
        </div>
      </section>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          title="Total Proposals"
          value={stats.total}
          icon={FiFileText}
          tone="indigo"
        />
        <StatCard
          title="Pending Proposals"
          value={stats.pending}
          icon={FiClock}
          tone="amber"
        />
        <StatCard
          title="Accepted Proposals"
          value={stats.accepted}
          icon={FiCheckCircle}
          tone="emerald"
        />
        <StatCard
          title="Completed"
          value={stats.completed}
          icon={FiCheckCircle}
          tone="slate"
        />
        <StatCard
          title="Total Earnings (USD)"
          value={money(stats.earnings)}
          icon={FiDollarSign}
          tone="rose"
        />
      </section>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-900">Recent Proposals</h2>
          <Link
            href="/dashboard/freelancer/my-proposals"
            className="text-sm font-semibold text-indigo-600"
          >
            View all
          </Link>
        </div>
        <div className="mt-5 divide-y divide-slate-100">
          {(data.proposals || []).slice(0, 5).map((proposal) => (
            <Link
              key={proposal._id}
              href={"/dashboard/freelancer/my-proposals/" + proposal._id}
              className="flex flex-wrap items-center justify-between gap-3 py-4 hover:bg-slate-50"
            >
              <span className="text-sm font-semibold text-slate-800">
                {data.taskMap?.[String(proposal.task_id)]?.title ||
                  "Task proposal"}
              </span>
              <span className="text-sm capitalize text-slate-500">
                {proposal.status}
              </span>
            </Link>
          ))}
          {!data.proposals?.length && (
            <p className="py-8 text-center text-sm text-slate-500">
              No proposals submitted yet.
            </p>
          )}
        </div>
      </section>
    </section>
  );
}
