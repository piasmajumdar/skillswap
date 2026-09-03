"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiList,
  FiPlus,
  FiShield,
} from "react-icons/fi";
import { authClient } from "@/lib/auth-client";
import StatCard from "../components/StatCard";
import RecentTasksTable from "../components/RecentTasksTable";
import { clientApi, withEmail } from "../components/clientApi";

const normalize = (value) =>
  String(value || "open")
    .toLowerCase()
    .replace(/[- ]/g, "_");
const money = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

export default function ClientDashboard() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [data, setData] = useState({ tasks: [], proposals: [], payments: [] });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const user = session?.user;

  useEffect(() => {
    if (isPending) return;
    if (!user) {
      router.replace("/auth/login");
      return;
    }
    if (String(user.role).toLowerCase() !== "client") {
      router.replace(`/dashboard/${user.role || ""}` || "/");
      return;
    }
    clientApi(`/api/client/dashboard?email=${withEmail(user.email)}`)
      .then(setData)
      .catch((e) => setMessage(e.message))
      .finally(() => setLoading(false));
  }, [isPending, user, router]);

  const stats = useMemo(() => {
    const tasks = data.tasks || [];
    const count = (values) =>
      tasks.filter((task) => values.includes(normalize(task.status))).length;
    return {
      total: tasks.length,
      open: count(["open"]),
      progress: count(["in_progress"]),
      completed: count(["completed"]),
      spent: (data.payments || [])
        .filter((p) => String(p.payment_status).toLowerCase() === "paid")
        .reduce((sum, p) => sum + Number(p.amount || 0), 0),
    };
  }, [data]);

  const recent = (data.tasks || [])
    .slice(0, 6)
    .map((task) => ({
      id: String(task._id),
      title: task.title,
      category: task.category,
      status: task.status,
      deadline: task.deadline,
      applications: (data.proposals || []).filter(
        (p) => String(p.task_id) === String(task._id),
      ).length,
    }));
  if (isPending || loading)
    return (
      <div className="space-y-6">
        <div className="h-40 animate-pulse rounded-3xl bg-white" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-white" />
          ))}
        </div>
        <div className="h-96 animate-pulse rounded-3xl bg-white" />
      </div>
    );
  if (!user || String(user.role).toLowerCase() !== "client") return null;

  return (
    <div className="space-y-6">
      {message && (
        <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {message}
        </p>
      )}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-indigo-700">
              Client Dashboard
            </span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
              Welcome back, {user.name?.split(" ")[0] || "there"}!
            </h1>
            <p className="mt-3 text-slate-500">
              Manage your tasks, proposals, and payments from one workspace.
            </p>
          </div>
          <Link
            href="/dashboard/client/post-task"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            <FiPlus /> Post a New Task
          </Link>
        </div>
      </section>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          title="Total Tasks"
          value={stats.total}
          icon={FiList}
          tone="indigo"
        />
        <StatCard
          title="Open Tasks"
          value={stats.open}
          icon={FiClock}
          tone="amber"
        />
        <StatCard
          title="Tasks In Progress"
          value={stats.progress}
          icon={FiShield}
          tone="slate"
        />
        <StatCard
          title="Completed"
          value={stats.completed}
          icon={FiCheckCircle}
          tone="emerald"
        />
        <StatCard
          title="Total Spent (USD)"
          value={money(stats.spent)}
          icon={FiDollarSign}
          tone="rose"
        />
      </section>
      <RecentTasksTable tasks={recent} />
    </div>
  );
}
