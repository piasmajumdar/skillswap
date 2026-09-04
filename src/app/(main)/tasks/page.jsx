"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiSearch,
} from "react-icons/fi";
import { authClient } from "@/lib/auth-client";
import { clientApi, withEmail } from "../../dashboard/components/clientApi";

const PAGE_LIMIT = 9;
const categories = [
  "all",
  "design",
  "writing",
  "development",
  "marketing",
  "other",
];

const categoryLabels = {
  all: "All Categories",
  design: "Design",
  writing: "Writing",
  development: "Development",
  marketing: "Marketing",
  other: "Other",
};

const formatDate = (value) => {
  if (!value) return "-";
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(
    new Date(value),
  );
};

function TasksSkeleton() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
        <div key={item} className="h-64 animate-pulse rounded-2xl bg-white" />
      ))}
    </div>
  );
}

export default function PublicTasksPage() {
  const { data: session } = authClient.useSession();
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_LIMIT,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTimer = setTimeout(() => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(PAGE_LIMIT),
      });
      if (search.trim()) params.set("search", search.trim());
      if (category !== "all") params.set("category", category);
      params.set("sort", sort);
      if (session?.user?.email)
        params.set("email", withEmail(session.user.email));

      clientApi("/api/freelancer/tasks?" + params.toString())
        .then((result) => {
          setTasks(result.tasks || []);
          setPagination(
            result.pagination || {
              page,
              limit: PAGE_LIMIT,
              total: 0,
              totalPages: 0,
            },
          );
          setError("");
        })
        .catch((requestError) => setError(requestError.message))
        .finally(() => setLoading(false));
    }, 150);

    return () => clearTimeout(loadTimer);
  }, [category, page, search, session?.user?.email, sort]);

  const handleSearch = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleCategory = (event) => {
    setCategory(event.target.value);
    setPage(1);
  };

  const handleSort = (event) => {
    setSort(event.target.value);
    setPage(1);
  };

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

      <section className="mx-auto mt-10 grid max-w-5xl gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:grid-cols-[minmax(0,1fr)_220px_180px]">
        <label className="relative block">
          <span className="sr-only">Search tasks by title</span>
          <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={handleSearch}
            placeholder="Search tasks by title..."
            className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </label>
        <label>
          <span className="sr-only">Filter tasks by category</span>
          <select
            value={category}
            onChange={handleCategory}
            className="w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm capitalize text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item === "all" ? "All categories" : item}
              </option>
            ))}
          </select>
        </label>
        <label className="relative block">
          <span className="sr-only">Sort tasks</span>
          <select
            value={sort}
            onChange={handleSort}
            className="w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-9 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="price">Price</option>
          </select>
          <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
        </label>
      </section>

      {error && (
        <p className="mx-auto mt-8 max-w-3xl rounded-xl bg-rose-50 p-3 text-sm text-rose-700">
          {error}
        </p>
      )}

      <div className="mt-10 grid gap-8 md:grid-cols-[190px_minmax(0,1fr)] lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="hidden md:block">
          <h2 className="mb-4 text-sm font-bold text-slate-900">Categories</h2>
          <div className="space-y-1">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setCategory(item);
                  setPage(1);
                }}
                className={
                  "flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm capitalize transition " +
                  (category === item
                    ? "bg-indigo-50 font-semibold text-indigo-700"
                    : "text-slate-600 hover:bg-white hover:text-slate-900")
                }
              >
                <span
                  className={
                    "h-3 w-3 rounded-full border-2 " +
                    (category === item
                      ? "border-indigo-600 bg-indigo-600"
                      : "border-slate-400")
                  }
                />
                {categoryLabels[item]}
              </button>
            ))}
          </div>
        </aside>

        <section>
          {loading ? (
            <TasksSkeleton />
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
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
                    <span>
                      Client: {task.client?.name || task.client_email}
                    </span>
                    <span>Due {formatDate(task.deadline)}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>

      {!loading && !tasks.length && !error && (
        <p className="mx-auto mt-10 max-w-3xl rounded-2xl bg-white p-10 text-center text-slate-500">
          No open tasks match your search.
        </p>
      )}

      {!loading && pagination.totalPages > 0 && (
        <nav
          className="mt-10 flex items-center justify-center gap-4"
          aria-label="Task pagination"
        >
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(current - 1, 1))}
            disabled={page === 1}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FiChevronLeft /> Previous
          </button>
          <div className="flex items-center gap-2">
            {Array.from(
              { length: pagination.totalPages },
              (_, index) => index + 1,
            ).map((number) => (
              <button
                key={number}
                type="button"
                onClick={() => setPage(number)}
                className={
                  "h-9 min-w-9 cursor-pointer rounded-lg px-2 text-sm font-semibold " +
                  (number === page
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-slate-600 hover:bg-indigo-50")
                }
                aria-current={number === page ? "page" : undefined}
              >
                {number}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() =>
              setPage((current) => Math.min(current + 1, pagination.totalPages))
            }
            disabled={page === pagination.totalPages}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next <FiChevronRight />
          </button>
        </nav>
      )}
    </main>
  );
}
