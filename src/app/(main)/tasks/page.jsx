"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { clientApi, withEmail } from "../../dashboard/components/clientApi";
import { authClient } from "@/lib/auth-client";

const formatDate = (value) =>
  new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(
    new Date(value),
  );

export default function PublicTasksPage() {
  const { data: session } = authClient.useSession();
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    clientApi("/api/freelancer/tasks?email=" + withEmail(session?.user?.email))
      .then(setTasks)
      .catch((e) => setError(e.message));
  }, [session?.user?.email]);

  return (
    <main className="mx-auto w-11/12 max-w-7xl py-10 sm:py-14">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
          SkillSwap Opportunities
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
          Find work worth doing
        </h1>
        <p className="mt-3 text-slate-500">
          Browse open client tasks and submit a proposal that matches your
          skills.
        </p>
      </div>

      {error && (
        <p className="mx-auto mt-8 max-w-3xl rounded-xl bg-rose-50 p-3 text-sm text-rose-700">
          {error}
        </p>
      )}

      <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {tasks.map((task) => (
          <Link
            key={task._id}
            href={"/tasks/" + task._id}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold capitalize text-indigo-700">
                {task.category}
              </span>
              <span className="text-lg font-bold text-slate-900">
                {"$"}
                {task.budget}
              </span>
            </div>
            <h2 className="mt-5 text-xl font-bold text-slate-900">
              {task.title}
            </h2>
            <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
              {task.description}
            </p>
            <div className="mt-6 flex flex-wrap justify-between gap-2 text-xs text-slate-500">
              <span>Client: {task.client?.name || task.client_email}</span>
              <span>Due {formatDate(task.deadline)}</span>
            </div>
          </Link>
        ))}
      </div>

      {!tasks.length && !error && (
        <p className="mx-auto mt-10 max-w-3xl rounded-2xl bg-white p-10 text-center text-slate-500">
          No open tasks are available right now.
        </p>
      )}
    </main>
  );
}
