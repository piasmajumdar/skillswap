"use client";

import { useEffect, useState } from "react";
import { FiStar } from "react-icons/fi";
import { authClient } from "@/lib/auth-client";
import { clientApi, withEmail } from "../../components/clientApi";

function ReviewsSkeleton() {
  return (
    <div className="space-y-5">
      <div className="h-36 animate-pulse rounded-3xl bg-white" />
      {[1, 2, 3].map((item) => (
        <div key={item} className="h-40 animate-pulse rounded-2xl bg-white" />
      ))}
    </div>
  );
}

function Stars({ rating }) {
  return (
    <div
      className="flex items-center gap-1 text-amber-400"
      aria-label={`${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <FiStar
          key={star}
          size={18}
          className={
            star <= Number(rating) ? "fill-amber-400" : "text-slate-200"
          }
        />
      ))}
    </div>
  );
}

export default function FreelancerReviewsPage() {
  const { data: session, isPending } = authClient.useSession();
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const email = session?.user?.email;

  useEffect(() => {
    if (!email) return;
    Promise.all([
      clientApi("/api/freelancer/profile?email=" + withEmail(email)),
      clientApi("/api/freelancer/reviews?email=" + withEmail(email)),
    ])
      .then(([user, reviewData]) => {
        setProfile(user);
        setReviews(reviewData.reviews || []);
      })
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, [email]);

  if (isPending || loading) return <ReviewsSkeleton />;
  if (
    !session?.user ||
    String(session.user.role).toLowerCase() !== "freelancer"
  )
    return null;

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
          Freelancer Feedback
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
          Reviews
        </h1>
        <p className="mt-2 text-slate-500">
          See what clients say about your completed work.
        </p>
      </div>

      {error && (
        <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">
          {error}
        </p>
      )}

      <section className="flex flex-col gap-5 rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <p className="text-sm font-semibold text-slate-600">Your Rating</p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="text-4xl font-bold text-slate-900">
              {Number(profile?.average_ratings || 0).toFixed(1)}
            </span>
            <Stars rating={Number(profile?.average_ratings || 0)} />
          </div>
          <p className="mt-2 text-sm text-slate-500">
            Based on {Number(profile?.total_reviews || 0)}{" "}
            {Number(profile?.total_reviews || 0) === 1 ? "review" : "reviews"}
          </p>
        </div>
        <div className="rounded-2xl bg-white/80 px-5 py-4 text-sm text-slate-600 ring-1 ring-indigo-100">
          Client feedback helps build trust and attract quality projects.
        </div>
      </section>

      <div className="space-y-4">
        {reviews.map((review) => (
          <article
            key={String(review._id)}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 overflow-hidden rounded-full bg-indigo-100 text-center text-sm font-bold leading-[44px] text-indigo-700">
                  {review.reviewer?.image ? (
                    <img
                      src={review.reviewer.image}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    String(review.reviewer?.name || "C")
                      .charAt(0)
                      .toUpperCase()
                  )}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">
                    {review.reviewer?.name || review.reviewer_email}
                  </p>
                  <p className="text-xs text-slate-500">
                    {review.reviewer_email}
                  </p>
                </div>
              </div>
              <Stars rating={review.rating} />
            </div>
            <p className="mt-5 text-sm leading-7 text-slate-600">
              {review.comment}
            </p>
            <div className="mt-4 flex flex-wrap justify-between gap-2 border-t border-slate-100 pt-4 text-xs text-slate-500">
              <span>Task: {review.task_title}</span>
              <span>
                {review.created_at
                  ? new Date(review.created_at).toLocaleDateString("en-US")
                  : "-"}
              </span>
            </div>
          </article>
        ))}
        {!reviews.length && (
          <p className="rounded-2xl bg-white p-10 text-center text-slate-500">
            No client reviews yet.
          </p>
        )}
      </div>
    </section>
  );
}
