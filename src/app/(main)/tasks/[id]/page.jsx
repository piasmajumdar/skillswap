"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  FiCalendar,
  FiClock,
  FiDollarSign,
  FiShield,
  FiTag,
  FiUser,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";
import { clientApi } from "../../../dashboard/components/clientApi";
import { IoTime } from "react-icons/io5";
import MarketplaceNotFound from "../../../components/MarketplaceNotFound";
import MarketplaceSkeleton from "../../../components/MarketplaceSkeleton";

export default function PublicTaskDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    clientApi(
      "/api/freelancer/tasks/" +
        id +
        "?email=" +
        encodeURIComponent(session?.user?.email || ""),
    )
      .then(setData)
      .catch((e) => {
        setNotFound(e.message.toLowerCase().includes("not found"));
        setError(e.message);
      });
  }, [id, session?.user?.email]);

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    try {
      await clientApi("/api/freelancer/proposals", {
        method: "POST",
        body: JSON.stringify({
          ...values,
          task_id: id,
          freelancer_email: session.user.email,
          proposed_budget: Number(values.proposed_budget),
          estimated_days: Number(values.estimated_days),
        }),
      });
      toast.success("Proposal submitted successfully.");
      const result = await clientApi(
        "/api/freelancer/tasks/" +
          id +
          "?email=" +
          encodeURIComponent(session.user.email),
      );
      setData(result);
      form.reset();
    } catch (e) {
      setError(e.message);
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  }

  if (!data && !error) {
    return (
      <main className="mx-auto w-11/12 max-w-7xl py-10">
        <MarketplaceSkeleton variant="detail" />
      </main>
    );
  }
  if (notFound) return <MarketplaceNotFound type="task" />;
  if (!data)
    return (
      <p className="mx-auto max-w-5xl rounded-xl bg-rose-50 p-4 text-sm text-rose-700">
        {error || "Unable to load this task."}
      </p>
    );

  const isFreelancer = session?.user?.role?.toLowerCase() === "freelancer";
  const canSubmit =
    isFreelancer && data.task.status === "open" && !data.proposal;

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto grid w-11/12 max-w-7xl gap-6 py-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.8fr)]">
        <div className="space-y-5">
          <Link
            href="/tasks"
            className="inline-flex text-sm font-semibold text-slate-600 hover:text-indigo-600"
          >
            ← Back to Browse Tasks
          </Link>
          {error && (
            <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">
              {error}
            </p>
          )}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-700">
                {data.task.category}
              </span>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold capitalize text-emerald-700">
                {data.task.status}
              </span>
            </div>
            <h1 className="mt-5 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              {data.task.title}
            </h1>
            <p className="mt-3 text-sm text-slate-500">
              Posted by {data.client?.name || data.task.client_email}
            </p>
            <div className="py-2 mt-3">
              <h2 className="flex items-center gap-2 font-bold text-slate-900">
                <FiTag className="text-indigo-600" /> Description
              </h2>
              <p className="mt-2 text-slate-600">{data.task.description}</p>
            </div>
          </section>
          {canSubmit ? (
            <form
              onSubmit={submit}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
            >
              <h2 className="text-xl font-bold text-slate-900">
                Submit a Proposal
              </h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <input
                  required
                  min="1"
                  type="number"
                  name="proposed_budget"
                  placeholder="Proposed Budget (USD)"
                  className="rounded-xl border p-3"
                />
                <input
                  required
                  min="1"
                  type="number"
                  name="estimated_days"
                  placeholder="Estimated Days"
                  className="rounded-xl border p-3"
                />
              </div>
              <textarea
                required
                name="cover_note"
                rows="5"
                placeholder="Explain why you are the best fit for this task..."
                className="mt-4 w-full rounded-xl border p-3"
              />
              <button
                disabled={saving}
                className="mt-4 w-full cursor-pointer rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Submitting..." : "Submit Proposal"}
              </button>
            </form>
          ) : data.proposal ? (
            <p className="rounded-xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
              You already submitted a {data.proposal.status} proposal for this
              task.
            </p>
          ) : isFreelancer ? (
            <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-700">
              This task is no longer open for proposals.
            </p>
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-8">
              <h2 className="text-xl font-bold text-slate-900">
                Want to submit a proposal?
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Log in with a freelancer account to apply for this task.
              </p>
              <Link
                href="/auth/login"
                className="mt-5 inline-flex rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white"
              >
                Log in as Freelancer
              </Link>
            </div>
          )}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="font-bold text-slate-900">How Proposals Work</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <div className="text-sm text-slate-600">
                <FiShield className="mb-2 text-indigo-600" />
                Submit your price and timeline.
              </div>
              <div className="text-sm text-slate-600">
                <FiUser className="mb-2 text-indigo-600" />
                The client reviews applications.
              </div>
              <div className="text-sm text-slate-600">
                <FiClock className="mb-2 text-indigo-600" />
                Work starts after selection.
              </div>
            </div>
          </section>
        </div>
        <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-6">
          <div className="divide-y divide-slate-100">
            <div className="flex items-center gap-3 py-4">
              <FiDollarSign className="rounded-full bg-amber-50 p-2 text-4xl text-amber-600" />
              <div>
                <p className="text-xs text-slate-500">Budget</p>
                <p className="font-bold text-amber-600">
                  {"$"}
                  {data.task.budget}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 py-4">
              <FiCalendar className="rounded-full bg-indigo-50 p-2 text-4xl text-indigo-600" />
              <div>
                <p className="text-xs text-slate-500">Deadline</p>
                <p className="font-semibold text-slate-800">
                  {String(data.task.deadline).slice(0, 10)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 py-4">
              <IoTime className="rounded-full bg-indigo-50 p-2 text-4xl text-indigo-600" />
              <div>
                <p className="text-xs text-slate-500">Posted</p>
                <p className="font-semibold text-slate-800">
                  {String(data.task.createdAt).slice(0, 10)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 py-4">
              <FiUser className="rounded-full bg-slate-100 p-2 text-4xl text-slate-600" />
              <div>
                <p className="text-xs text-slate-500">Client</p>
                <p className="font-semibold text-slate-800">
                  {data.client?.name || data.task.client_email}
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
