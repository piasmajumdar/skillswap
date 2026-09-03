"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiClock,
  FiDollarSign,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";
import StatCard from "../../components/StatCard";
import { clientApi, withEmail } from "../../components/clientApi";

const money = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));

const formatDate = (value) => {
  if (!value) return "Not available";
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(
    new Date(value),
  );
};

export default function ClientPaymentsHistoryPage() {
  const { data: session, isPending } = authClient.useSession();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.email) return;
    clientApi("/api/client/dashboard?email=" + withEmail(session.user.email))
      .then(setData)
      .catch((e) => {
        setError(e.message);
        toast.error(e.message);
      })
      .finally(() => setLoading(false));
  }, [session?.user?.email]);

  const payments = data?.payments || [];
  const taskMap = Object.fromEntries(
    (data?.tasks || []).map((task) => [String(task._id), task]),
  );
  const totalPaid = useMemo(
    () =>
      payments
        .filter((payment) => payment.payment_status === "paid")
        .reduce((sum, payment) => sum + Number(payment.amount || 0), 0),
    [payments],
  );

  if (isPending || loading) {
    return (
      <div className="space-y-5">
        <div className="h-24 animate-pulse rounded-3xl bg-white" />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="h-32 animate-pulse rounded-2xl bg-white" />
          <div className="h-32 animate-pulse rounded-2xl bg-white" />
        </div>
        <div className="h-96 animate-pulse rounded-3xl bg-white" />
      </div>
    );
  }

  if (!data) {
    return (
      <p className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">
        {error || "Unable to load payment history."}
      </p>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link
            href="/dashboard/client"
            className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            <FiArrowLeft />
            Dashboard
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-slate-900">
            Payments History
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Review every payment made for your accepted proposals.
          </p>
        </div>
      </div>

      {error && (
        <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">
          {error}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          title="Total Paid"
          value={money(totalPaid)}
          icon={FiDollarSign}
          tone="indigo"
        />
        <StatCard
          title="Successful Payments"
          value={
            payments.filter((payment) => payment.payment_status === "paid")
              .length
          }
          icon={FiCheckCircle}
          tone="emerald"
        />
      </div>

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-5">
          <h2 className="font-bold text-slate-900">Transaction History</h2>
        </div>

        {payments.length ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs uppercase tracking-wide text-slate-500">
                    Task
                  </th>
                  <th className="px-6 py-4 text-left text-xs uppercase tracking-wide text-slate-500">
                    Freelancer
                  </th>
                  <th className="px-6 py-4 text-left text-xs uppercase tracking-wide text-slate-500">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs uppercase tracking-wide text-slate-500">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs uppercase tracking-wide text-slate-500">
                    Paid At
                  </th>
                  <th className="px-6 py-4 text-left text-xs uppercase tracking-wide text-slate-500">
                    Transaction ID
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                      {taskMap[String(payment.task_id)]?.title || "Task"}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {payment.freelancer_email}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                      {money(payment.amount)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold capitalize text-emerald-700">
                        {payment.payment_status || "paid"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      <span className="inline-flex items-center gap-2">
                        <FiClock className="text-slate-400" />
                        {formatDate(payment.paid_at)}
                      </span>
                    </td>
                    <td className="max-w-52 break-all px-6 py-4 text-xs text-slate-500">
                      {payment.transaction_id}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-14 text-center">
            <FiDollarSign className="mx-auto text-slate-300" size={34} />
            <p className="mt-3 font-semibold text-slate-800">
              No payment history yet
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Successful proposal payments will appear here.
            </p>
          </div>
        )}
      </section>
    </section>
  );
}
