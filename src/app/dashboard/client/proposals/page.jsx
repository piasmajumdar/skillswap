"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import { clientApi, withEmail } from "../../components/clientApi";
import ConfirmModal from "../../components/ConfirmModal";

export default function ProposalsPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");
  const [selectedAction, setSelectedAction] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const load = () =>
    session?.user?.email &&
    clientApi(`/api/client/proposals?email=${withEmail(session.user.email)}`)
      .then(setRows)
      .catch((e) => setError(e.message));
  useEffect(() => {
    if (session?.user?.email)
      clientApi(`/api/client/proposals?email=${withEmail(session.user.email)}`)
        .then(setRows)
        .catch((e) => setError(e.message));
  }, [session]);
  async function reject(id) {
    setActionLoading(true);
    try {
      await clientApi(`/api/client/proposals/${id}/reject`, {
        method: "PATCH",
        body: JSON.stringify({ client_email: session.user.email }),
      });
      toast.success("Proposal rejected.");
      load();
      setSelectedAction(null);
    } catch (e) {
      setError(e.message);
      toast.error(e.message);
    } finally {
      setActionLoading(false);
    }
  }
  async function accept(id) {
    try {
      const result = await clientApi(`/api/client/proposals/${id}/accept`, {
        method: "POST",
        body: JSON.stringify({ client_email: session.user.email }),
      });
      toast.success("Proposal accepted. Continue to payment.");
      router.push(
        `/payment/checkout?proposalId=${result.proposalId}&amount=${result.amount}`,
      );
    } catch (e) {
      setError(e.message);
    }
  }
  return (
    <section className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Manage Proposals</h1>
        <p className="mt-1 text-sm text-slate-500">
          Review freelancer applications for your tasks.
        </p>
      </div>
      {error && (
        <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">
          {error}
        </p>
      )}
      <div className="grid gap-4">
        {rows.map((row) => (
          <article
            key={row._id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex flex-wrap justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                  {row.task_title}
                </p>
                <h2 className="mt-1 text-lg font-semibold text-slate-900">
                  {row.freelancer?.name || row.freelancer_email}
                </h2>
              </div>
              <span className="inline-flex min-w-24 items-center justify-center rounded-full bg-slate-100 px-3 py-1 text-center text-xs font-semibold capitalize">
                {String(row.status).replace(/_/g, " ")}
              </span>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              {row.cover_note || "No message provided."}
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-semibold text-slate-800">
                ${row.proposed_budget} · {row.estimated_days} day(s)
              </p>
              {row.status === "pending" && (
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setSelectedAction({ type: "reject", id: row._id })
                    }
                    className="cursor-pointer rounded-lg border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-600"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() =>
                      setSelectedAction({ type: "accept", id: row._id })
                    }
                    className="cursor-pointer rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white"
                  >
                    Accept & Pay
                  </button>
                </div>
              )}
            </div>
          </article>
        ))}
        {!rows.length && (
          <p className="rounded-2xl bg-white p-10 text-center text-slate-500">
            No proposals found.
          </p>
        )}
      </div>
      <ConfirmModal
        open={Boolean(selectedAction)}
        title={
          selectedAction?.type === "reject"
            ? "Reject this proposal?"
            : "Accept this proposal?"
        }
        description={
          selectedAction?.type === "reject"
            ? "The freelancer will no longer be considered for this task."
            : "You will continue to checkout to pay the freelancer."
        }
        confirmLabel={selectedAction?.type === "reject" ? "Reject" : "Continue"}
        danger={selectedAction?.type === "reject"}
        loading={actionLoading}
        onClose={() => setSelectedAction(null)}
        onConfirm={() =>
          selectedAction?.type === "reject"
            ? reject(selectedAction.id)
            : accept(selectedAction.id)
        }
      />
    </section>
  );
}
