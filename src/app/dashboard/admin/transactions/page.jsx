"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";
import { clientApi } from "../../components/clientApi";

const date = (value) => (value ? new Date(value).toLocaleString("en-US") : "-");
const money = (value) => `$${Number(value || 0).toLocaleString("en-US")}`;

function Skeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((item) => (
        <div key={item} className="h-16 animate-pulse rounded-xl bg-white" />
      ))}
    </div>
  );
}

export default function AdminTransactionsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isPending) return;
    if (!session?.user) return router.replace("/auth/login");
    if (String(session.user.role).toLowerCase() !== "admin")
      return router.replace(`/dashboard/${session.user.role || "client"}`);
    clientApi("/api/admin/payments")
      .then((result) => setPayments(result.payments || []))
      .catch((error) => toast.error(error.message))
      .finally(() => setLoading(false));
  }, [isPending, session, router]);

  if (isPending || loading) return <Skeleton />;
  if (!session?.user || String(session.user.role).toLowerCase() !== "admin")
    return null;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
          Administration
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Transactions</h1>
        <p className="mt-2 text-slate-500">
          A complete history of successful Stripe payments.
        </p>
      </div>
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-6 py-4">Client Email</th>
                <th className="px-6 py-4">Freelancer Email</th>
                <th className="px-6 py-4">Task</th>
                <th className="px-6 py-4">Payout</th>
                <th className="px-6 py-4">Payment Date</th>
                <th className="px-6 py-4">Payment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.map((payment) => (
                <tr key={String(payment._id)}>
                  <td className="px-6 py-4 text-slate-700">
                    {payment.client_email}
                  </td>
                  <td className="px-6 py-4 text-slate-700">
                    {payment.freelancer_email}
                  </td>
                  <td className="max-w-[240px] truncate px-6 py-4 text-slate-600">
                    {payment.task_title || payment.task_id}
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-900">
                    {money(payment.amount)}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {date(payment.paid_at)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold capitalize text-emerald-700">
                      {payment.payment_status || "paid"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!payments.length && (
          <p className="p-6 text-sm text-slate-500">No payments found.</p>
        )}
      </section>
    </div>
  );
}
