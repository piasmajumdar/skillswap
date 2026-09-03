"use client";

import React from "react";
import Link from "next/link";
import { FiArrowRight, FiClock, FiLayers } from "react-icons/fi";

const statusStyles = {
  open: "bg-sky-50 text-sky-700 ring-sky-100",
  in_progress: "bg-amber-50 text-amber-700 ring-amber-100",
  completed: "bg-emerald-50 text-emerald-700 ring-emerald-100",
};

const normalizeStatus = (status) => {
  return String(status || "open").trim().toLowerCase();
};

const formatDate = (value) => {
  if (!value) return "No deadline";

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsed);
};

const StatusBadge = ({ status }) => {
  const normalized = normalizeStatus(status);
  const styles = statusStyles[normalized] || statusStyles.open;

  return (
    <span
      className={`
                inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize
                ring-1 ${styles}
            `}
    >
      {normalized.replace("_", " ")}
    </span>
  );
};

const RecentTasksTable = ({
  tasks = [],
  viewAllHref = "/dashboard/client/my-tasks",
}) => {
  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
              <FiLayers className="text-indigo-600" />
              Recent Tasks
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Keep an eye on applications, delivery dates, and work in motion.
            </p>
          </div>

          <Link
            href={viewAllHref}
            className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-indigo-700"
          >
            View all tasks
            <FiArrowRight size={16} />
          </Link>
        </div>
      </div>

      {tasks.length ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50/80">
              <tr>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-6">
                  Task
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Applications
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Deadline
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 bg-white">
              {tasks.map((task) => (
                <tr
                  key={task.id}
                  className="transition-colors hover:bg-slate-50/70"
                >
                  <td className="px-5 py-4 sm:px-6">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-900">
                        {task.title}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {task.category}
                      </p>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-sm font-medium text-slate-700">
                    {task.applications}
                  </td>

                  <td className="px-5 py-4">
                    <StatusBadge status={task.status} />
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-700">
                    <div className="inline-flex items-center gap-2">
                      <FiClock className="text-slate-400" />
                      {formatDate(task.deadline)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="px-5 py-12 text-center sm:px-6">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <FiLayers size={22} />
          </div>

          <h3 className="mt-4 text-lg font-semibold text-slate-900">
            No tasks yet
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            Post your first task to start receiving proposals and tracking
            progress here.
          </p>

          <Link
            href="/dashboard/client/post-task"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-indigo-700"
          >
            Post a New Task
          </Link>
        </div>
      )}
    </section>
  );
};

export default RecentTasksTable;
