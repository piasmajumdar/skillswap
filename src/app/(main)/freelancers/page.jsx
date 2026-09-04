"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiDollarSign,
  FiSearch,
  FiStar,
} from "react-icons/fi";
import { clientApi } from "../../dashboard/components/clientApi";
import MarketplaceSkeleton from "../../components/MarketplaceSkeleton";

const PAGE_LIMIT = 9;

const formatSkills = (skills) =>
  String(skills || "")
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);

function Stars({ rating }) {
  return (
    <div className="flex items-center gap-0.5 text-amber-400">
      {[1, 2, 3, 4, 5].map((star) => (
        <FiStar
          key={star}
          size={15}
          className={
            star <= Number(rating) ? "fill-amber-400" : "text-slate-200"
          }
        />
      ))}
    </div>
  );
}

export default function FreelancersPage() {
  const [freelancers, setFreelancers] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("top_rated");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(PAGE_LIMIT),
        sort,
      });
      if (search.trim()) params.set("search", search.trim());

      setLoading(true);
      clientApi("/api/freelancers?" + params.toString())
        .then((result) => {
          setFreelancers(result.freelancers || []);
          setPagination(result.pagination || { totalPages: 0 });
          setError("");
        })
        .catch((requestError) => setError(requestError.message))
        .finally(() => setLoading(false));
    }, 150);

    return () => clearTimeout(timer);
  }, [page, search, sort]);

  return (
    <main className="mx-auto w-11/12 max-w-7xl py-8 sm:py-12">
      <header className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
          SkillSwap Talent
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Find the right freelancer
        </h1>
        <p className="mt-3 text-slate-500">
          Connect with skilled professionals ready to bring your next idea to
          life.
        </p>
      </header>

      <section className="mx-auto mt-8 grid max-w-5xl gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:grid-cols-[minmax(0,1fr)_220px]">
        <label className="relative block">
          <span className="sr-only">Search freelancers</span>
          <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search by name, skill, or bio..."
            className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </label>
        <label className="relative block">
          <span className="sr-only">Sort freelancers</span>
          <select
            value={sort}
            onChange={(event) => {
              setSort(event.target.value);
              setPage(1);
            }}
            className="w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-9 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          >
            <option value="top_rated">Top Rated</option>
            <option value="hourly_rate">Hourly Rate</option>
          </select>
          <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
        </label>
      </section>

      {error && (
        <p className="mx-auto mt-6 max-w-5xl rounded-xl bg-rose-50 p-3 text-sm text-rose-700">
          {error}
        </p>
      )}

      <div className="mt-8">
        {loading ? (
          <MarketplaceSkeleton variant="page" />
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {freelancers.map((freelancer) => (
              <article
                key={String(freelancer._id)}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="h-16 w-16 overflow-hidden rounded-2xl bg-indigo-100 text-center text-xl font-bold leading-[64px] text-indigo-700">
                    {freelancer.image ? (
                      <img
                        src={freelancer.image}
                        alt={freelancer.name || "Freelancer"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      String(freelancer.name || "F")
                        .charAt(0)
                        .toUpperCase()
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">Hourly rate</p>
                    <p className="mt-1 flex items-center justify-end gap-1 text-lg font-bold text-indigo-600">
                      <FiDollarSign size={17} />
                      {Number(freelancer.hourlyRate || 0)}
                    </p>
                  </div>
                </div>
                <h2 className="mt-5 text-xl font-bold text-slate-900">
                  {freelancer.name || "Unnamed freelancer"}
                </h2>
                <div className="mt-2 flex items-center gap-2">
                  <Stars rating={freelancer.average_ratings} />
                  <span className="text-xs text-slate-500">
                    {Number(freelancer.average_ratings || 0).toFixed(1)} (
                    {freelancer.total_reviews || 0} reviews)
                  </span>
                </div>
                <p className="mt-4 line-clamp-3 min-h-[72px] text-sm leading-6 text-slate-500">
                  {freelancer.bio || "This freelancer has not added a bio yet."}
                </p>
                <div className="mt-4 flex min-h-7 flex-wrap gap-2">
                  {formatSkills(freelancer.skills)
                    .slice(0, 3)
                    .map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                      >
                        {skill}
                      </span>
                    ))}
                </div>
                <Link
                  href={`/freelancers/${freelancer._id}`}
                  className="mt-6 inline-flex w-full cursor-pointer items-center justify-center rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  View Details
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>

      {!loading && !freelancers.length && !error && (
        <p className="mt-8 rounded-2xl bg-white p-10 text-center text-slate-500">
          No freelancers match your search.
        </p>
      )}

      {!loading && pagination.totalPages > 0 && (
        <nav
          className="mt-10 flex w-full flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-4"
          aria-label="Freelancer pagination"
        >
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(current - 1, 1))}
            disabled={page === 1}
            className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
          >
            <FiChevronLeft />
            Previous
          </button>
          <div className="flex max-w-full flex-wrap items-center justify-center gap-2 px-1">
            {Array.from(
              { length: pagination.totalPages },
              (_, index) => index + 1,
            ).map((number) => (
              <button
                key={number}
                type="button"
                onClick={() => setPage(number)}
                className={
                  (number === page
                    ? "bg-indigo-600 text-white "
                    : "bg-white text-slate-600 ") +
                  "h-9 min-w-9 cursor-pointer rounded-lg px-2 text-sm font-semibold hover:bg-indigo-50"
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
            className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
          >
            Next
            <FiChevronRight />
          </button>
        </nav>
      )}
    </main>
  );
}
