"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  FiCalendar,
  FiClock,
  FiDollarSign,
  FiTag,
  FiUser,
} from "react-icons/fi";
import { authClient } from "@/lib/auth-client";
import { clientApi, withEmail } from "../../components/clientApi";

const formatDate = (value) => {
  if (!value) return "Not available";
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(
    new Date(value),
  );
};

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
      .catch((e) => toast.error(e.message));

  useEffect(() => {
    if (!session?.user?.email) return;

    clientApi(
      "/api/freelancer/projects?email=" + withEmail(session.user.email),
    )
      .then(setProjects)
      .catch((e) => toast.error(e.message));
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

  const inProgress = projects.filter(
    (project) => project.status === "in_progress",
  );
  const completed = projects.filter(
    (project) => project.status === "completed",
  );

  const ProjectCard = ({ project }) => (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{project.title}</h2>
          <p className="mt-2 text-sm text-slate-500">{project.description}</p>
        </div>
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize ${project.status === "completed" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}
        >
          {project.status.replace("_", " ")}
        </span>
      </div>

      <div className="mt-5 grid gap-3 border-y border-slate-100 py-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <FiTag className="text-indigo-600" />
          <span className="capitalize">{project.category}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <FiDollarSign className="text-emerald-600" />
          <span>
            Bid: {"$"}
            {project.proposal?.proposed_budget || project.payment?.amount}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <FiCalendar className="text-indigo-600" />
          <span>Due: {formatDate(project.deadline)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <FiClock className="text-amber-600" />
          <span>Posted: {formatDate(project.createdAt)}</span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-sm text-slate-600">
          <FiUser className="text-slate-400" /> Client:{" "}
          {project.client?.name || project.client_email}
        </p>
        {project.status === "completed" ? (
          <a
            href={project.deliverable_url}
            target="_blank"
            rel="noreferrer"
            className="cursor-pointer text-sm font-semibold text-indigo-600 underline"
          >
            View deliverable
          </a>
        ) : (
          <button
            onClick={() => setSelected(project)}
            className="cursor-pointer rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Submit Deliverable
          </button>
        )}
      </div>
    </article>
  );

  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Active Projects</h1>
        <p className="mt-1 text-sm text-slate-500">
          Accepted projects, task details, and delivery progress.
        </p>
      </div>
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="h-3 w-3 rounded-full bg-amber-500" />
          <h2 className="text-xl font-bold text-slate-900">In Progress</h2>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
            {inProgress.length}
          </span>
        </div>
        {inProgress.map((project) => (
          <ProjectCard key={project._id} project={project} />
        ))}
        {!inProgress.length && (
          <p className="rounded-2xl bg-white p-8 text-center text-sm text-slate-500">
            No projects in progress.
          </p>
        )}
      </section>
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="h-3 w-3 rounded-full bg-emerald-500" />
          <h2 className="text-xl font-bold text-slate-900">Completed</h2>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
            {completed.length}
          </span>
        </div>
        {completed.map((project) => (
          <ProjectCard key={project._id} project={project} />
        ))}
        {!completed.length && (
          <p className="rounded-2xl bg-white p-8 text-center text-sm text-slate-500">
            No completed projects yet.
          </p>
        )}
      </section>
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
