"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { clientApi, withEmail } from "../../../components/clientApi";

export default function ProposalDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [proposal, setProposal] = useState(null);

  useEffect(() => {
    if (!session?.user?.email) return;
    clientApi(
      "/api/freelancer/proposals?freelancerEmail=" +
        withEmail(session.user.email),
    )
      .then((rows) =>
        setProposal(rows.find((row) => String(row._id) === String(id))),
      )
      .catch(() => setProposal(null));
  }, [session?.user?.email, id]);

  if (!proposal)
    return (
      <div className="rounded-2xl bg-white p-8 text-slate-500">
        Loading proposal...
      </div>
    );

  return (
    <section className="mx-auto max-w-3xl space-y-5">
      <button
        onClick={() => router.back()}
        className="cursor-pointer text-sm font-semibold text-indigo-600"
      >
        Back to My Proposals
      </button>
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold capitalize text-indigo-600">
          {proposal.task?.category}
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          {proposal.task?.title}
        </h1>
        <p className="mt-5 leading-7 text-slate-600">
          {proposal.task?.description}
        </p>
        <div className="mt-5 flex flex-wrap gap-4 text-sm text-slate-700">
          <span>
            Task budget: {"$"}
            {proposal.task?.budget}
          </span>
          <span>
            Your bid: {"$"}
            {proposal.proposed_budget}
          </span>
          <span>Days: {proposal.estimated_days}</span>
          <span className="font-semibold capitalize">
            Status: {proposal.status}
          </span>
        </div>
      </article>
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-bold text-slate-900">Your Message</h2>
        <p className="mt-3 leading-7 text-slate-600">{proposal.cover_note}</p>
        <p className="mt-4 text-sm text-slate-500">
          Client: {proposal.client?.name || proposal.task?.client_email}
        </p>
      </article>
    </section>
  );
}
