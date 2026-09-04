"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FiArrowLeft, FiStar } from "react-icons/fi";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";
import { clientApi, withEmail } from "../../../../components/clientApi";

function ReviewSkeleton() {
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="h-8 w-2/3 animate-pulse rounded-lg bg-white" />
      <div className="h-32 animate-pulse rounded-2xl bg-white" />
      <div className="h-72 animate-pulse rounded-2xl bg-white" />
    </div>
  );
}

export default function ClientReviewPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session, isPending } = authClient.useSession();
  const [data, setData] = useState(null);
  const [rating, setRating] = useState("5");
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isPending) return;
    if (!session?.user) {
      router.replace("/auth/login");
      return;
    }
    if (String(session.user.role).toLowerCase() !== "client") {
      router.replace(`/dashboard/${session.user.role || "client"}`);
      return;
    }
    clientApi(
      `/api/client/tasks/${params.id}/review?email=${withEmail(session.user.email)}`,
    )
      .then((result) => {
        setData(result);
        if (result.review) {
          setRating(String(result.review.rating));
          setComment(result.review.comment || "");
        }
      })
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, [isPending, params.id, router, session]);

  const submitReview = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await clientApi(`/api/client/tasks/${params.id}/review`, {
        method: "POST",
        body: JSON.stringify({
          reviewer_email: session.user.email,
          rating: Number(rating),
          comment,
        }),
      });
      toast.success("Review submitted successfully.");
      router.push("/dashboard/client/my-tasks");
      router.refresh();
    } catch (requestError) {
      setError(requestError.message);
      toast.error(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (isPending || loading) return <ReviewSkeleton />;
  if (!session?.user || String(session.user.role).toLowerCase() !== "client") {
    return null;
  }
  if (error && !data) {
    return (
      <p className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{error}</p>
    );
  }

  const alreadyReviewed = Boolean(data?.review);

  return (
    <section className="mx-auto max-w-2xl space-y-6">
      <Link
        href="/dashboard/client/my-tasks"
        className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600"
      >
        <FiArrowLeft /> Back to My Tasks
      </Link>

      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
          Completed Task Review
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
          Review {data?.freelancer?.name || data?.reviewee_email}
        </h1>
        <p className="mt-2 text-slate-500">{data?.task?.title}</p>
      </div>

      {error && (
        <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">
          {error}
        </p>
      )}

      {alreadyReviewed ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
          <p className="font-semibold text-emerald-800">
            You already reviewed this task.
          </p>
          <p className="mt-2 text-sm text-emerald-700">
            Your {data.review.rating}-star review has been saved.
          </p>
          <p className="mt-3 text-sm text-emerald-700">{data.review.comment}</p>
        </div>
      ) : (
        <form
          onSubmit={submitReview}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <fieldset>
            <legend className="block text-sm font-semibold text-slate-700">
              Rating
            </legend>
            <div
              className="mt-3 flex items-center gap-1"
              onMouseLeave={() => setHoveredRating(0)}
            >
              {[1, 2, 3, 4, 5].map((value) => {
                const activeRating = hoveredRating || Number(rating);
                const isActive = value <= activeRating;
                return (
                  <button
                    key={value}
                    type="button"
                    aria-label={`${value} ${value === 1 ? "star" : "stars"}`}
                    aria-pressed={Number(rating) === value}
                    onClick={() => setRating(String(value))}
                    onMouseEnter={() => setHoveredRating(value)}
                    className="cursor-pointer rounded-md p-1 text-3xl text-slate-300 transition hover:scale-110 focus:outline-none focus:ring-2 focus:ring-amber-300"
                  >
                    <FiStar
                      className={
                        isActive ? "fill-amber-400 text-amber-400" : ""
                      }
                    />
                  </button>
                );
              })}
              <span className="ml-2 text-sm text-slate-500">
                {rating} {Number(rating) === 1 ? "star" : "stars"}
              </span>
            </div>
          </fieldset>

          <label
            className="mt-5 block text-sm font-semibold text-slate-700"
            htmlFor="comment"
          >
            Your review
          </label>
          <textarea
            id="comment"
            required
            minLength={3}
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Share your experience with this freelancer..."
            className="mt-2 min-h-36 w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />

          <button
            type="submit"
            disabled={submitting}
            className="mt-5 w-full cursor-pointer rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      )}
    </section>
  );
}
