"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiArrowRight, FiCreditCard, FiFileText, FiUsers } from "react-icons/fi";
import { authClient } from "@/lib/auth-client";

const API_URL =
  process.env.NEXT_PUBLIC_BACKEND_SERVER_URL || "http://localhost:8000";

const initialStats = {
  totalPosts: 0,
  totalUsers: 0,
  totalPayouts: 0,
};

const stats = [
  { key: "totalPosts", label: "Total Posts", icon: FiFileText },
  { key: "totalUsers", label: "Users", icon: FiUsers },
  { key: "totalPayouts", label: "Payouts", icon: FiCreditCard },
];

export default function HeroBanner() {
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const [platformStats, setPlatformStats] = useState(initialStats);
  const [isLoading, setIsLoading] = useState(true);
  const isClient =
    !isSessionPending && session?.user?.role?.toLowerCase() === "client";

  useEffect(() => {
    let isMounted = true;

    async function loadStats() {
      try {
        const response = await fetch(`${API_URL}/api/public/stats`);
        if (!response.ok) {
          throw new Error("Unable to load platform statistics.");
        }

        const data = await response.json();
        if (isMounted) {
          setPlatformStats({
            totalPosts: Number(data.totalPosts || 0),
            totalUsers: Number(data.totalUsers || 0),
            totalPayouts: Number(data.totalPayouts || 0),
          });
        }
      } catch {
        // Keep the stats area stable if the API is temporarily unavailable.
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadStats();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="relative isolate min-h-[620px] overflow-hidden border-y border-indigo-100 bg-[#f7f7ff] shadow-[0_24px_70px_-38px_rgba(55,48,163,0.25)] sm:min-h-[680px]">
      <Image
        src="/banner.png"
        alt="Freelancer working on a laptop"
        fill
        priority
        sizes="(max-width: 768px) 100vw, 1200px"
        className="-z-20 object-cover object-right"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#f7f7ff] via-[#f7f7ff]/75 to-[#f7f7ff]/15" />

      <div className="hero-fade-up relative mx-auto flex min-h-[620px] w-11/12 max-w-7xl items-center px-0 py-14 sm:min-h-[680px] sm:py-20">
        <div className="max-w-2xl">
        <p className="mb-5 inline-flex items-center rounded-full border border-indigo-200 bg-white/75 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600 backdrop-blur-sm">
          Freelance • Simple • Reliable
        </p>
        <h1 className="max-w-xl text-4xl font-bold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
          Get your tasks done by{" "}
          <span className="text-indigo-600">skilled freelancers</span>
        </h1>
        <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
          Post a task, get proposals from talented freelancers, compare
          profiles, and hire the best fit, all in one place.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          {isClient && (
            <Link
              href="/dashboard/client/post-task"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Post a Task
              <FiArrowRight className="transition-transform group-hover:translate-x-1" />
            </Link>
          )}
          <Link
            href="/tasks"
            className="group inline-flex items-center justify-center gap-2 rounded-xl border border-indigo-500 bg-white/85 px-5 py-3 text-sm font-semibold text-indigo-600 shadow-sm backdrop-blur-sm transition hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Browse Tasks
            <FiArrowRight className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-12 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-indigo-100">
          {stats.map(({ key, label, icon: Icon }, index) => (
            <div
              key={key}
              className="hero-stat flex items-center gap-3 rounded-2xl border border-white/80 bg-white/70 p-3 shadow-sm backdrop-blur-sm sm:rounded-none sm:border-0 sm:bg-transparent sm:px-5 sm:shadow-none sm:first:pl-0"
              style={{ animationDelay: `${index * 100 + 250}ms` }}
            >
              <div className="rounded-xl bg-indigo-100 p-2.5 text-indigo-600">
                <Icon aria-hidden="true" />
              </div>
              <div>
              <p className="text-2xl font-bold tracking-tight text-slate-950">
                {isLoading ? (
                  <span className="inline-block h-7 w-12 animate-pulse rounded-md bg-slate-200" />
                ) : (
                  key === "totalPayouts"
                    ? `$${platformStats[key].toLocaleString()}`
                    : platformStats[key].toLocaleString()
                )}
              </p>
              <p className="mt-1 text-xs font-medium text-slate-500">
                {label}
              </p>
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>

      <style jsx>{`
        .hero-fade-up {
          animation: hero-fade-up 700ms ease-out both;
        }

        .hero-stat {
          animation: hero-fade-up 600ms ease-out both;
        }

        @keyframes hero-fade-up {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-fade-up,
          .hero-stat {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
