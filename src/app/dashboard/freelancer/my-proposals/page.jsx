"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { clientApi, withEmail } from "../../components/clientApi";

const formatDate = (value) => {
  const date = value || "";
  return date
    ? new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(
        new Date(date),
      )
    : "Unknown";
};

export default function MyProposalsPage() {
  const { data: session } = authClient.useSession();
  const [proposals, setProposals] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!session?.user?.email) return;
    clientApi(
      "/api/freelancer/proposals?freelancerEmail=" +
        withEmail(session.user.email),
    )
      .then(setProposals)
      .catch((e) => setError(e.message));
  }, [session?.user?.email]);

  return (
    <section className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Proposals</h1>
        <p className="mt-1 text-sm text-slate-500">
          Track every application submitted from your account.
        </p>
      </div>
      {error && (
        <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">
          {error}
        </p>
      )}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-slate-500">
                Task Title
              </th>
              <th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-slate-500">
                Budget Bid
              </th>
              <th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-slate-500">
                Date Sent
              </th>
              <th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-slate-500">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {proposals.map((proposal) => (
              <tr key={proposal._id} className="hover:bg-slate-50">
                <td className="px-5 py-4">
                  <Link
                    href={"/dashboard/freelancer/my-proposals/" + proposal._id}
                    className="font-semibold text-slate-800 hover:text-indigo-600"
                  >
                    {proposal.task?.title || "Task details"}
                  </Link>
                </td>
                <td className="px-5 py-4 text-sm text-slate-700">
                  {"$"}
                  {proposal.proposed_budget}
                </td>
                <td className="px-5 py-4 text-sm text-slate-500">
                  {formatDate(proposal.submitted_time || proposal.submitted_at)}
                </td>
                <td className="px-5 py-4 text-sm font-semibold capitalize text-slate-700">
                  {proposal.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!proposals.length && (
          <p className="p-10 text-center text-sm text-slate-500">
            No proposals submitted yet.
          </p>
        )}
      </div>
    </section>
  );
}
