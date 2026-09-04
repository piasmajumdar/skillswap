"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FiArrowRight,
  FiCalendar,
  FiDollarSign,
  FiStar,
} from "react-icons/fi";
import { clientApi } from "@/app/dashboard/components/clientApi";

const initialData = {
  tasks: [],
  freelancers: [],
};

const formatDate = (value) => {
  if (!value) return "Date unavailable";

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Date unavailable"
    : date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
};

const formatSkills = (skills) =>
  String(skills || "")
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean)
    .slice(0, 3);

function SectionHeading({ eyebrow, title, href, linkText }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
          {eyebrow}
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
          {title}
        </h2>
      </div>
      <Link
        href={href}
        className="group inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 transition hover:text-indigo-800"
      >
        {linkText}
        <FiArrowRight className="transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
}

function SectionSkeleton({ type }) {
  return (
    <div
      className={
        type === "tasks"
          ? "grid gap-4 lg:grid-cols-3"
          : "grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      }
    >
      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="h-56 animate-pulse rounded-2xl border border-slate-200 bg-white"
        />
      ))}
    </div>
  );
}

function Stars({ rating }) {
  return (
    <div className="flex items-center gap-0.5 text-amber-400" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <FiStar
          key={star}
          size={14}
          className={star <= Number(rating) ? "fill-amber-400" : "text-slate-200"}
        />
      ))}
    </div>
  );
}

export default function MarketplaceHighlights() {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    Promise.all([
      clientApi("/api/freelancer/tasks?page=1&limit=3&sort=newest"),
      clientApi("/api/freelancers?page=1&limit=4&sort=top_rated"),
    ])
      .then(([taskResult, freelancerResult]) => {
        if (!isMounted) return;

        setData({
          tasks: taskResult.tasks || [],
          freelancers: freelancerResult.freelancers || [],
        });
        setError("");
      })
      .catch((requestError) => {
        if (isMounted) setError(requestError.message || "Unable to load highlights.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="mx-auto w-11/12 max-w-7xl space-y-20 py-16 sm:py-24">
      <section>
        <SectionHeading
          eyebrow="Fresh opportunities"
          title="Latest featured tasks"
          href="/tasks"
          linkText="View all tasks"
        />

        <div className="mt-7">
          {loading ? (
            <SectionSkeleton type="tasks" />
          ) : data.tasks.length ? (
            <div className="grid gap-4 lg:grid-cols-3">
              {data.tasks.map((task) => (
                <Link
                  key={String(task._id)}
                  href={`/tasks/${task._id}`}
                  className="group flex min-h-56 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-100/60"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold capitalize text-indigo-700">
                      {task.category || "Other"}
                    </span>
                    <span className="flex items-center gap-1 text-lg font-bold text-slate-950">
                      <FiDollarSign size={16} className="text-indigo-500" />
                      {Number(task.budget || 0).toLocaleString()}
                    </span>
                  </div>
                  <h3 className="mt-5 line-clamp-2 text-lg font-bold leading-7 text-slate-950 group-hover:text-indigo-700">
                    {task.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                    {task.description || "Explore this opportunity on SkillSwap."}
                  </p>
                  <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-5 text-xs text-slate-500">
                    <span>Client: {task.client?.name || task.client_email}</span>
                    <span className="inline-flex items-center gap-1">
                      <FiCalendar />
                      Due {formatDate(task.deadline)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
              No open tasks are available right now.
            </p>
          )}
        </div>
      </section>

      <section>
        <SectionHeading
          eyebrow="Trusted talent"
          title="Top freelancers"
          href="/freelancers"
          linkText="Meet all freelancers"
        />

        <div className="mt-7">
          {loading ? (
            <SectionSkeleton type="freelancers" />
          ) : data.freelancers.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {data.freelancers.map((freelancer) => {
                const skills = formatSkills(freelancer.skills);
                const rating = Number(freelancer.average_ratings || 0).toFixed(1);

                return (
                  <article
                    key={String(freelancer._id)}
                    className="flex min-h-64 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-100/60"
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-indigo-100 text-center text-xl font-bold leading-[56px] text-indigo-700">
                        {freelancer.image ? (
                          <img
                            src={freelancer.image}
                            alt={freelancer.name || "Freelancer"}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          String(freelancer.name || "F").charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="truncate font-bold text-slate-950">
                          {freelancer.name || "Unnamed freelancer"}
                        </h3>
                        <div className="mt-1 flex items-center gap-1.5">
                          <Stars rating={rating} />
                          <span className="text-xs font-semibold text-slate-600">
                            {rating} ({freelancer.total_reviews || 0})
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="mt-4 line-clamp-2 min-h-12 text-sm leading-6 text-slate-500">
                      {freelancer.bio || "Skilled professional ready to help."}
                    </p>
                    <div className="mt-4 flex min-h-7 flex-wrap gap-2">
                      {skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                    <div className="mt-auto flex items-end justify-between gap-3 pt-5">
                      <div>
                        <p className="text-xs text-slate-400">Finished jobs</p>
                        <p className="mt-1 font-bold text-slate-900">
                          {Number(freelancer.completed_jobs || 0).toLocaleString()}
                        </p>
                      </div>
                      <Link
                        href={`/freelancers/${freelancer._id}`}
                        className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                      >
                        View profile <FiArrowRight size={15} />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <p className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
              No freelancer profiles are available right now.
            </p>
          )}
        </div>
      </section>

      {error && (
        <p className="rounded-xl bg-rose-50 p-3 text-center text-sm text-rose-700">
          {error}
        </p>
      )}
    </div>
  );
}
