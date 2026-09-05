"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FiCheckCircle, FiDollarSign, FiUser } from "react-icons/fi";
import { clientApi } from "@/app/dashboard/components/clientApi";

export default function PaymentSuccessContent() {
  const params = useSearchParams();
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const confirmingSessionRef = useRef("");
  const sessionId = params.get("session_id");

  useEffect(() => {
    if (!sessionId || confirmingSessionRef.current === sessionId) return;
    confirmingSessionRef.current = sessionId;

    clientApi("/api/client/payments/confirm-session", {
      method: "POST",
      body: JSON.stringify({ session_id: sessionId }),
    })
      .then(setResult)
      .catch((requestError) => {
        confirmingSessionRef.current = "";
        setError(requestError.message);
      });
  }, [sessionId]);

  if (!sessionId && !error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <section className="w-full max-w-md rounded-3xl border border-rose-100 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-slate-900">
            Payment could not be confirmed
          </h1>
          <p className="mt-3 text-sm text-rose-600">
            A valid Stripe checkout session is required.
          </p>
          <Link
            href="/dashboard/client/proposals"
            className="mt-6 inline-flex rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white"
          >
            Back to Proposals
          </Link>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <section className="w-full max-w-md rounded-3xl border border-rose-100 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-slate-900">
            Payment could not be confirmed
          </h1>
          <p className="mt-3 text-sm text-rose-600">{error}</p>
          <Link
            href="/dashboard/client/proposals"
            className="mt-6 inline-flex rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white"
          >
            Back to Proposals
          </Link>
        </section>
      </main>
    );
  }

  if (!result) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <p className="text-slate-500">Confirming your payment...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <section className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl sm:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <FiCheckCircle size={34} />
        </div>
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900">
          Payment Successful
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Your payment has been confirmed and the task is now in progress.
        </p>
        <div className="mt-8 space-y-4 rounded-2xl bg-slate-50 p-5 text-left">
          <div>
            <p className="text-xs text-slate-500">Task</p>
            <p className="mt-1 font-semibold text-slate-900">
              {result.task?.title}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <FiUser className="text-indigo-600" />
            <div>
              <p className="text-xs text-slate-500">Freelancer</p>
              <p className="font-semibold text-slate-900">
                {result.freelancer?.name || result.payment?.freelancer_email}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FiDollarSign className="text-emerald-600" />
            <div>
              <p className="text-xs text-slate-500">Amount paid</p>
              <p className="font-semibold text-slate-900">
                ${result.payment?.amount}
              </p>
            </div>
          </div>
          <div>
            <p className="text-xs text-slate-500">Transaction ID</p>
            <p className="mt-1 break-all text-sm text-slate-700">
              {result.payment?.transaction_id}
            </p>
          </div>
        </div>
        <Link
          href="/dashboard/client"
          className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
        >
          Go to Dashboard
        </Link>
      </section>
    </main>
  );
}
