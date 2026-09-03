"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import { clientApi } from "../../components/clientApi";

export default function PostTaskPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    const values = Object.fromEntries(new FormData(event.currentTarget));

    try {
      await clientApi("/api/client/tasks", {
        method: "POST",
        body: JSON.stringify({
          ...values,
          category: String(values.category).trim().toLowerCase(),
          budget: Number(values.budget),
          client_email: session.user.email,
        }),
      });
      toast.success("Task posted successfully.");
      router.push("/dashboard/client/my-tasks");
    } catch (e) {
      setError(e.message);
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h1 className="text-2xl font-bold text-slate-900">Post a Task</h1>
      <p className="mt-2 text-sm text-slate-500">
        Tell skilled freelancers what you need delivered.
      </p>
      {error && (
        <p className="mt-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
          {error}
        </p>
      )}

      <form onSubmit={submit} className="mt-6 grid gap-5">
        <label className="grid gap-2 text-sm font-semibold">
          Title
          <input
            required
            name="title"
            className="rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-indigo-500"
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          Description
          <textarea
            required
            name="description"
            rows="5"
            className="rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-indigo-500"
          />
        </label>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-semibold">
            Category
            <select
              required
              name="category"
              defaultValue=""
              className="cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-3 font-normal outline-none focus:border-indigo-500"
            >
              <option value="" disabled>
                Select a category
              </option>
              <option value="design">Design</option>
              <option value="writing">Writing</option>
              <option value="development">Development</option>
              <option value="marketing">Marketing</option>
              <option value="other">Other</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            Budget (USD)
            <input
              required
              min="1"
              type="number"
              name="budget"
              className="rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-indigo-500"
            />
          </label>
        </div>
        <label className="grid gap-2 text-sm font-semibold">
          Deadline
          <input
            required
            type="date"
            name="deadline"
            className="rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-indigo-500"
          />
        </label>
        <button
          disabled={saving}
          className="cursor-pointer rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Publishing..." : "Publish Task"}
        </button>
      </form>
    </section>
  );
}
