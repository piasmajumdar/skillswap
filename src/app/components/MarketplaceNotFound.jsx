"use client";

import Link from "next/link";
import { FiArrowLeft, FiSearch } from "react-icons/fi";

export default function MarketplaceNotFound({ type = "task" }) {
  const task = type === "task";
  return (
    <main className="flex min-h-[65vh] items-center justify-center bg-slate-50 px-4 py-12">
      <section className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
          <FiSearch size={28} />
        </div>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
          SkillSwap Marketplace
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
          {task ? "Task not found" : "Freelancer not found"}
        </h1>
        <p className="mt-4 text-sm leading-7 text-slate-500">
          {task
            ? "This task may have been removed, deleted, or is no longer available."
            : "This freelancer profile may have been removed or is no longer available."}
        </p>
        <Link
          href={task ? "/tasks" : "/freelancers"}
          className="mt-7 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          <FiArrowLeft />
          Back to {task ? "Tasks" : "Freelancers"}
        </Link>
      </section>
    </main>
  );
}
