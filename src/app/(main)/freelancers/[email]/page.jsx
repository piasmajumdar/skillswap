"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  FiArrowLeft,
  FiCalendar,
  FiCheckCircle,
  FiDollarSign,
  FiMail,
  FiStar,
} from "react-icons/fi";
import { clientApi } from "../../../dashboard/components/clientApi";

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-US", { dateStyle: "medium" })
    : "-";
const skills = (value) =>
  String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

function Stars({ rating, large = false }) {
  return (
    <div className="flex items-center gap-1 text-amber-400">
      {[1, 2, 3, 4, 5].map((star) => (
        <FiStar
          key={star}
          size={large ? 22 : 17}
          className={
            star <= Number(rating) ? "fill-amber-400" : "text-slate-200"
          }
        />
      ))}
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="h-72 animate-pulse rounded-3xl bg-white" />
      <div className="h-56 animate-pulse rounded-3xl bg-white" />
    </div>
  );
}

export default function FreelancerDetailsPage() {
  const params = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!params.email) return;
    clientApi("/api/freelancers/" + encodeURIComponent(params.email))
      .then(setData)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, [params.email]);

  if (loading) return <DetailSkeleton />;
  if (error || !data?.freelancer)
    return (
      <p className="mx-auto max-w-5xl rounded-xl bg-rose-50 p-4 text-sm text-rose-700">
        {error || "Freelancer not found."}
      </p>
    );

  const freelancer = data.freelancer;

  return (
    <main className="mx-auto w-11/12 max-w-5xl py-8 sm:py-12">
      <Link
        href="/freelancers"
        className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600"
      >
        <FiArrowLeft />
        Back to Freelancers
      </Link>

      <section className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="bg-gradient-to-r from-indigo-50 via-white to-emerald-50 p-6 sm:p-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className="h-28 w-28 shrink-0 overflow-hidden rounded-3xl bg-indigo-100 text-center text-4xl font-bold leading-[112px] text-indigo-700">
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
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                  {freelancer.name || "Unnamed freelancer"}
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold capitalize text-emerald-700">
                  <FiCheckCircle />
                  {freelancer.isBlocked ? "Blocked" : "Active"}
                </span>
              </div>
              <p className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                <FiMail />
                {freelancer.email}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Stars rating={freelancer.average_ratings} large />
                <span className="font-semibold text-slate-700">
                  {Number(freelancer.average_ratings || 0).toFixed(1)} from{" "}
                  {freelancer.total_reviews || 0} reviews
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-px bg-slate-100 sm:grid-cols-3">
          <div className="bg-white p-5">
            <p className="text-xs text-slate-400">Hourly Rate</p>
            <p className="mt-2 flex items-center gap-1 text-xl font-bold text-indigo-600">
              <FiDollarSign />
              {Number(freelancer.hourlyRate || 0)}
            </p>
          </div>
          <div className="bg-white p-5">
            <p className="text-xs text-slate-400">Member Since</p>
            <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <FiCalendar />
              {formatDate(freelancer.createdAt)}
            </p>
          </div>
          <div className="bg-white p-5">
            <p className="text-xs text-slate-400">Last Updated</p>
            <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <FiCalendar />
              {formatDate(freelancer.updatedAt)}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.15fr]">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">About</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            {freelancer.bio || "This freelancer has not added a bio yet."}
          </p>
          <h3 className="mt-6 text-sm font-bold text-slate-900">Skills</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {skills(freelancer.skills).map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700"
              >
                {skill}
              </span>
            ))}
            {!skills(freelancer.skills).length && (
              <span className="text-sm text-slate-500">No skills added.</span>
            )}
          </div>
          <div className="mt-6 border-t border-slate-100 pt-4 text-sm">
            <span className="text-slate-400">Email verified: </span>
            <strong
              className={
                freelancer.emailVerified ? "text-emerald-600" : "text-slate-600"
              }
            >
              {freelancer.emailVerified ? "Yes" : "No"}
            </strong>
          </div>
        </article>
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-slate-900">Client Reviews</h2>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {data.reviews.length}
            </span>
          </div>
          <div className="mt-5 space-y-4">
            {data.reviews.map((review) => (
              <div
                key={String(review._id)}
                className="rounded-2xl bg-slate-50 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900">
                      {review.reviewer?.name || review.reviewer_email}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Task: {review.task_title}
                    </p>
                  </div>
                  <Stars rating={review.rating} />
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {review.comment}
                </p>
                <p className="mt-3 text-xs text-slate-400">
                  {formatDate(review.created_at)}
                </p>
              </div>
            ))}
            {!data.reviews.length && (
              <p className="py-8 text-center text-sm text-slate-500">
                No client reviews yet.
              </p>
            )}
          </div>
        </article>
      </section>
    </main>
  );
}
