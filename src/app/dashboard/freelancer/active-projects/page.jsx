"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";
import ConfirmModal from "../../components/ConfirmModal";
import { clientApi, withEmail } from "../../components/clientApi";

export default function ActiveProjectsPage() {
  const { data: session } = authClient.useSession();
  const [projects, setProjects] = useState([]);
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () =>
    clientApi(
      "/api/freelancer/projects?email=" + withEmail(session?.user?.email),
    )
      .then(setProjects)
      .catch(() => setProjects([]));
  useEffect(() => {
    if (session?.user?.email) load();
  }, [session?.user?.email]);

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    const values = Object.fromEntries(new FormData(event.currentTarget));
    try {
      await clientApi(
        "/api/freelancer/projects/" + selected._id + "/deliverable",
        {
          method: "PATCH",
          body: JSON.stringify({
            ...values,
            freelancer_email: session.user.email,
          }),
        },
      );
      toast.success("Deliverable submitted. Project marked completed.");
      setSelected(null);
      load();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Active Projects</h1>
        <p className="mt-1 text-sm text-slate-500">
          Projects connected to your accepted proposals.
        </p>
      </div>
      <div className="grid gap-4">
        {projects.map((project) => (
          <article
            key={project._id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex flex-wrap justify-between gap-3">
              <div>
                <h2 className="font-semibold text-slate-900">
                  {project.title}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Client: {project.client?.name || project.client_email} · {"$"}
                  {project.payment?.amount || project.budget}
                </p>
              </div>
              <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold capitalize text-amber-700">
                {project.status.replace("_", " ")}
              </span>
            </div>
            {project.status === "completed" ? (
              <a
                href={project.deliverable_url}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-block text-sm font-semibold text-indigo-600 underline"
              >
                View deliverable
              </a>
            ) : (
              <button
                onClick={() => setSelected(project)}
                className="mt-4 cursor-pointer rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
              >
                Submit Deliverable
              </button>
            )}
          </article>
        ))}
        {!projects.length && (
          <p className="rounded-2xl bg-white p-10 text-center text-slate-500">
            No active projects yet.
          </p>
        )}
      </div>
      {selected && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 p-4">
          <form
            onSubmit={submit}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <h2 className="text-lg font-bold text-slate-900">
              Submit Deliverable
            </h2>
            <p className="mt-2 text-sm text-slate-500">{selected.title}</p>
            <input
              required
              type="url"
              name="deliverable_url"
              placeholder="https://..."
              className="mt-5 w-full rounded-xl border p-3"
            />
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="cursor-pointer rounded-lg border px-4 py-2 text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                disabled={saving}
                className="cursor-pointer rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
              >
                {saving ? "Saving..." : "Mark Completed"}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
