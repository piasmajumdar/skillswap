"use client";

import { FiAlertCircle } from "react-icons/fi";

export default function GlobalError({ reset }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <section className="w-full max-w-xl rounded-3xl border border-rose-100 bg-white p-8 text-center shadow-sm sm:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
          <FiAlertCircle size={30} />
        </div>
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900">
          Something went wrong
        </h1>
        <p className="mt-4 text-sm leading-7 text-slate-500">
          We could not load this page right now. Please try again.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-7 cursor-pointer rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Try again
        </button>
      </section>
    </main>
  );
}
