"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";
import ConfirmModal from "../../../components/ConfirmModal";
import { clientApi, withEmail } from "../../../components/clientApi";

export default function TaskDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [action, setAction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  async function load() {
    if (!session?.user?.email || !id) return;
    try {
      const result = await clientApi(
        "/api/client/tasks/" + id + "?email=" + withEmail(session.user.email),
      );
      setData(result);
    } catch (e) {
      setError(e.message);
    }
  }

  useEffect(() => {
    if (!session?.user?.email || !id) return;

    clientApi(
      "/api/client/tasks/" + id + "?email=" + withEmail(session.user.email),
    )
      .then(setData)
      .catch((e) => setError(e.message));
  }, [session, id]);

  async function removeTask() {
    setLoading(true);
    try {
      await clientApi(
        "/api/client/tasks/" + id + "?email=" + withEmail(session.user.email),
        { method: "DELETE" },
      );
      toast.success("Task deleted successfully.");
      router.push("/dashboard/client/my-tasks");
    } catch (e) {
      setError(e.message);
      toast.error(e.message);
    } finally {
      setLoading(false);
      setDeleteOpen(false);
    }
  }

  async function saveTask(event) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    try {
      await clientApi("/api/client/tasks/" + id, {
        method: "PATCH",
        body: JSON.stringify({
          ...values,
          budget: Number(values.budget),
          client_email: session.user.email,
        }),
      });
      setEditing(false);
      toast.success("Task updated successfully.");
      load();
    } catch (e) {
      setError(e.message);
      toast.error(e.message);
    }
  }

  async function rejectProposal(proposalId) {
    setLoading(true);
    try {
      await clientApi("/api/client/proposals/" + proposalId + "/reject", {
        method: "PATCH",
        body: JSON.stringify({ client_email: session.user.email }),
      });
      toast.success("Proposal rejected.");
      setAction(null);
      load();
    } catch (e) {
      setError(e.message);
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function acceptProposal(proposalId) {
    setLoading(true);
    try {
      const result = await clientApi(
        "/api/client/proposals/" + proposalId + "/accept",
        {
          method: "POST",
          body: JSON.stringify({ client_email: session.user.email }),
        },
      );
      toast.success("Proposal accepted. Continue to payment.");
      router.push(
        "/payment/checkout?proposalId=" +
          result.proposalId +
          "&amount=" +
          result.amount,
      );
    } catch (e) {
      setError(e.message);
      toast.error(e.message);
      setLoading(false);
    }
  }

  if (!data) {
    return (
      <div className="rounded-2xl bg-white p-8 text-slate-500">
        Loading task details...
      </div>
    );
  }

  const isOpen = data.task.status === "open";

  return (
    <section className="space-y-6">
      <button
        onClick={() => router.back()}
        className="cursor-pointer text-sm font-semibold text-indigo-600"
      >
        Back to My Tasks
      </button>
      {error && (
        <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">
          {error}
        </p>
      )}

      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        {editing && isOpen ? (
          <form onSubmit={saveTask} className="grid gap-4 sm:grid-cols-2">
            <input
              required
              name="title"
              defaultValue={data.task.title}
              className="rounded-lg border p-3"
            />
            <input
              required
              name="category"
              defaultValue={data.task.category}
              className="rounded-lg border p-3"
            />
            <input
              required
              name="budget"
              type="number"
              defaultValue={data.task.budget}
              className="rounded-lg border p-3"
            />
            <input
              required
              name="deadline"
              type="date"
              defaultValue={String(data.task.deadline).slice(0, 10)}
              className="rounded-lg border p-3"
            />
            <textarea
              required
              name="description"
              defaultValue={data.task.description}
              className="rounded-lg border p-3 sm:col-span-2"
            />
            <div className="flex gap-2 sm:col-span-2">
              <button className="cursor-pointer rounded-lg bg-indigo-600 px-4 py-2 text-white">
                Save
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="cursor-pointer rounded-lg border px-4 py-2"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="flex flex-wrap justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-indigo-600">
                  {data.task.category}
                </p>
                <h1 className="mt-2 text-3xl font-bold text-slate-900">
                  {data.task.title}
                </h1>
              </div>
              <span className="h-fit rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold capitalize">
                {data.task.status.replace("_", " ")}
              </span>
            </div>
            <p className="mt-5 leading-7 text-slate-600">
              {data.task.description}
            </p>
            <p className="mt-4 text-sm font-semibold text-slate-700">
              {"$"}
              {data.task.budget} · Deadline{" "}
              {String(data.task.deadline).slice(0, 10)}
            </p>
            {isOpen && (
              <div className="mt-6 flex gap-2">
                <button
                  onClick={() => setEditing(true)}
                  className="cursor-pointer rounded-lg border px-4 py-2 text-sm font-semibold"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteOpen(true)}
                  className="cursor-pointer rounded-lg border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-600"
                >
                  Delete
                </button>
              </div>
            )}
          </>
        )}
      </article>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Proposals</h2>
        {data.proposals.length === 0 && (
          <p className="rounded-2xl bg-white p-8 text-center text-slate-500">
            No proposals for this task yet.
          </p>
        )}
        {data.proposals.map((proposal) => (
          <article
            key={proposal._id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold text-slate-900">
                  {proposal.freelancer?.name || proposal.freelancer_email}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {"$"}
                  {proposal.proposed_budget} · {proposal.estimated_days} day(s)
                </p>
              </div>
              {proposal.status === "accepted" && (
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Accepted
                </span>
              )}
              {proposal.status === "rejected" && (
                <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
                  Rejected
                </span>
              )}
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              {proposal.cover_note || "No message provided."}
            </p>
            {isOpen && proposal.status === "pending" && (
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() =>
                    setAction({ type: "reject", id: proposal._id })
                  }
                  className="cursor-pointer rounded-lg border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-600"
                >
                  Reject
                </button>
                <button
                  onClick={() =>
                    setAction({ type: "accept", id: proposal._id })
                  }
                  className="cursor-pointer rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white"
                >
                  Accept & Pay
                </button>
              </div>
            )}
          </article>
        ))}
      </section>

      <ConfirmModal
        open={deleteOpen}
        title="Delete this task?"
        description="This permanently removes the open task and its pending proposals."
        confirmLabel="Delete Task"
        danger
        loading={loading}
        onClose={() => setDeleteOpen(false)}
        onConfirm={removeTask}
      />
      <ConfirmModal
        open={Boolean(action)}
        title={
          action?.type === "reject"
            ? "Reject this proposal?"
            : "Accept this proposal?"
        }
        description={
          action?.type === "reject"
            ? "The freelancer will no longer be considered."
            : "You will continue to checkout to pay the freelancer."
        }
        confirmLabel={action?.type === "reject" ? "Reject" : "Continue"}
        danger={action?.type === "reject"}
        loading={loading}
        onClose={() => setAction(null)}
        onConfirm={() =>
          action?.type === "reject"
            ? rejectProposal(action.id)
            : acceptProposal(action.id)
        }
      />
    </section>
  );
}
