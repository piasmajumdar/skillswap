"use client";

import { useEffect, useState } from "react";
import {
  FiCheckCircle,
  FiCreditCard,
  FiFileText,
  FiMessageCircle,
  FiStar,
  FiUsers,
} from "react-icons/fi";
import { clientApi } from "@/app/dashboard/components/clientApi";

const initialStats = {
  totalPosts: 0,
  totalUsers: 0,
  totalPayouts: 0,
};

const steps = [
  {
    number: "01",
    title: "Post a Task",
    text: "Tell the marketplace what you need, your budget, and when it is due.",
    icon: FiFileText,
  },
  {
    number: "02",
    title: "Get Proposals",
    text: "Review applications from skilled freelancers who understand your brief.",
    icon: FiMessageCircle,
  },
  {
    number: "03",
    title: "Hire and Pay",
    text: "Choose the best fit, pay securely, and keep the work moving forward.",
    icon: FiCheckCircle,
  },
];

const formatDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
};

function Stars() {
  return (
    <div className="flex gap-1 text-amber-400" aria-label="5 out of 5 stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <FiStar key={star} size={16} className="fill-amber-400" />
      ))}
    </div>
  );
}

function SectionTitle({ eyebrow, title, description }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
          {description}
        </p>
      )}
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="h-32 animate-pulse rounded-2xl border border-indigo-100 bg-white"
        />
      ))}
    </div>
  );
}

export default function HomepageExtraSections() {
  const [stats, setStats] = useState(initialStats);
  const [reviews, setReviews] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    clientApi("/api/public/stats")
      .then((result) => {
        if (!isMounted) return;
        setStats({
          totalPosts: Number(result.totalPosts || 0),
          totalUsers: Number(result.totalUsers || 0),
          totalPayouts: Number(result.totalPayouts || 0),
        });
      })
      .catch((requestError) => {
        if (isMounted) setError(requestError.message || "Unable to load statistics.");
      })
      .finally(() => {
        if (isMounted) setLoadingStats(false);
      });

    clientApi("/api/public/reviews?rating=5&limit=3")
      .then((result) => {
        if (isMounted) setReviews(result.reviews || []);
      })
      .catch((requestError) => {
        if (isMounted) setError(requestError.message || "Unable to load testimonials.");
      })
      .finally(() => {
        if (isMounted) setLoadingReviews(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="mx-auto w-11/12 max-w-7xl space-y-24 pb-20 sm:pb-28">
      <section className="home-reveal">
        <SectionTitle
          eyebrow="A simpler workflow"
          title="How SkillSwap works"
          description="From the first brief to the final handoff, every step stays clear and connected."
        />
        <div className="relative mt-10 grid gap-5 md:grid-cols-3">
          <div className="absolute left-[16%] right-[16%] top-9 hidden border-t border-dashed border-indigo-200 md:block" />
          {steps.map(({ number, title, text, icon: Icon }, index) => (
            <article
              key={number}
              className="home-card group relative rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-100/60"
              style={{ animationDelay: `${index * 120}ms` }}
            >
              <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 ring-8 ring-white transition duration-300 group-hover:scale-105 group-hover:bg-indigo-600 group-hover:text-white">
                <Icon size={25} />
              </div>
              <p className="mt-5 text-xs font-bold tracking-[0.18em] text-indigo-500">
                STEP {number}
              </p>
              <h3 className="mt-2 text-lg font-bold text-slate-950">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-reveal relative overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-emerald-50 px-5 py-10 shadow-sm sm:px-10 sm:py-14">
        <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-indigo-200/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-10 h-48 w-48 rounded-full bg-emerald-200/30 blur-3xl" />
        <SectionTitle
          eyebrow="Growing together"
          title="The numbers behind the marketplace"
          description="Real activity from the SkillSwap community and completed payments."
        />
        <div className="mt-9">
          {loadingStats ? (
            <StatsSkeleton />
          ) : (
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                [FiFileText, stats.totalPosts, "Tasks posted", "bg-indigo-100 text-indigo-600"],
                [FiUsers, stats.totalUsers, "Community members", "bg-emerald-100 text-emerald-600"],
                [FiCreditCard, `$${stats.totalPayouts.toLocaleString()}`, "Total payouts", "bg-amber-100 text-amber-600"],
              ].map(([Icon, value, label, iconClass]) => (
                <div
                  key={label}
                  className="flex items-center gap-4 rounded-2xl border border-white bg-white/80 p-5 shadow-sm"
                >
                  <div className={`rounded-xl p-3 ${iconClass}`}>
                    <Icon size={22} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold tracking-tight text-slate-950">
                      {value.toLocaleString ? value.toLocaleString() : value}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="home-reveal">
        <SectionTitle
          eyebrow="Community stories"
          title="Trusted by people who get things done"
          description="A few words from clients and freelancers building great work together."
        />
        <div className="mt-10">
          {loadingReviews ? (
            <div className="grid gap-5 md:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="h-56 animate-pulse rounded-2xl bg-white" />
              ))}
            </div>
          ) : reviews.length ? (
            <div className="grid gap-5 md:grid-cols-3">
              {reviews.map((review, index) => (
                <blockquote
                  key={String(review._id)}
                  className="home-card group relative flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-100/60"
                  style={{ animationDelay: `${index * 120}ms` }}
                >
                  <span className="absolute right-6 top-5 text-4xl font-serif leading-none text-indigo-100 transition-colors group-hover:text-indigo-200">
                    &quot;
                  </span>
                  <Stars />
                  <p className="mt-5 flex-1 text-sm leading-7 text-slate-600">
                    “{review.comment}”
                  </p>
                  <footer className="mt-6 border-t border-slate-100 pt-4">
                    <p className="font-semibold text-slate-900">
                      {review.reviewer_name || review.reviewer_email || "SkillSwap member"}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {review.reviewee_name
                        ? `Worked with ${review.reviewee_name}`
                        : formatDate(review.created_at)}
                    </p>
                  </footer>
                </blockquote>
              ))}
            </div>
          ) : (
            <p className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
              Testimonials will appear here as the community shares feedback.
            </p>
          )}
        </div>
        {error && (
          <p className="mt-5 rounded-xl bg-rose-50 p-3 text-center text-sm text-rose-700">
            {error}
          </p>
        )}
      </section>

      <style jsx>{`
        .home-reveal {
          animation: home-reveal 650ms ease-out both;
        }

        .home-card {
          animation: home-reveal 650ms ease-out both;
        }

        @keyframes home-reveal {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .home-reveal,
          .home-card {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
