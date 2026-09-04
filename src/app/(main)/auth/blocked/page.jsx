"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiAlertTriangle, FiArrowLeft, FiMail } from "react-icons/fi";
import { authClient } from "@/lib/auth-client";

export default function BlockedPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    await authClient.signOut();
    router.replace("/auth/login");
    router.refresh();
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <section className="w-full max-w-lg rounded-3xl border border-rose-100 bg-white p-8 text-center shadow-xl shadow-slate-200/60 sm:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-600">
          <FiAlertTriangle size={30} />
        </div>

        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-rose-600">
          Account access restricted
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
          Your account has been blocked
        </h1>
        <p className="mt-4 text-sm leading-7 text-slate-600">
          Your access to SkillSwap has been suspended because activity on your
          account was found to violate our platform rules or safety guidelines.
          You cannot access marketplace or dashboard pages while this block is
          active.
        </p>

        <div className="mt-6 rounded-2xl bg-slate-50 p-5 text-left">
          <h2 className="font-semibold text-slate-900">What can you do?</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            If you believe this was a mistake, contact our support team and
            include the email address connected to your account. We will review
            the decision and respond with the next steps.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <a
            href="mailto:support@skillswap.com?subject=Account%20block%20review"
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            <FiMail /> Contact Support
          </a>
          <button
            type="button"
            onClick={handleSignOut}
            disabled={loading}
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FiArrowLeft />
            {loading ? "Signing out..." : "Back to Login"}
          </button>
        </div>
      </section>
    </main>
  );
}
