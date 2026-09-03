"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import { clientApi, withEmail } from "../../components/clientApi";
import ConfirmModal from "../../components/ConfirmModal";

const label = (value) => String(value || "open").replace(/_/g, " ");
export default function MyTasksPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null);
  const [deleteTask, setDeleteTask] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const load = () =>
    session?.user?.email &&
    clientApi(`/api/client/tasks?email=${withEmail(session.user.email)}`)
      .then(setTasks)
      .catch((e) => setError(e.message));
  useEffect(() => {
    if (session?.user?.email)
      clientApi(`/api/client/tasks?email=${withEmail(session.user.email)}`)
        .then(setTasks)
        .catch((e) => setError(e.message));
  }, [session]);
  async function remove(id) {
    setDeleting(true);
    try {
      await clientApi(
        `/api/client/tasks/${id}?email=${withEmail(session.user.email)}`,
        { method: "DELETE" },
      );
      await clientApi(
        `/api/client/tasks?email=${withEmail(session.user.email)}`,
      ).then(setTasks);
      setDeleteTask(null);
      toast.success("Task deleted successfully.");
    } catch (e) {
      setError(e.message);
      toast.error(e.message);
    } finally {
      setDeleting(false);
    }
  }
  async function save(event, id) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    try {
      await clientApi(`/api/client/tasks/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          ...values,
          budget: Number(values.budget),
          client_email: session.user.email,
        }),
      });
      setEditing(null);
      toast.success("Task updated successfully.");
      await clientApi(
        `/api/client/tasks?email=${withEmail(session.user.email)}`,
      ).then(setTasks);
    } catch (e) {
      setError(e.message);
    }
  }
  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Tasks</h1>
          <p className="mt-1 text-sm text-slate-500">
            Every task posted from your client account.
          </p>
        </div>
        <button
          onClick={() => router.push("/dashboard/client/post-task")}
          className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white"
        >
          Post a Task
        </button>
      </div>
      {error && (
        <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">
          {error}
        </p>
      )}
      <div className="grid gap-4">
        {tasks.map((task) =>
          editing === String(task._id) ? (
            <form
              key={task._id}
              onSubmit={(e) => save(e, task._id)}
              className="grid gap-3 rounded-2xl border border-indigo-200 bg-white p-5 sm:grid-cols-2"
            >
              <input
                required
                name="title"
                defaultValue={task.title}
                className="rounded-lg border p-2"
              />
              <input
                required
                name="category"
                defaultValue={task.category}
                className="rounded-lg border p-2"
              />
              <input
                required
                name="budget"
                type="number"
                defaultValue={task.budget}
                className="rounded-lg border p-2"
              />
              <input
                required
                name="deadline"
                type="date"
                defaultValue={String(task.deadline).slice(0, 10)}
                className="rounded-lg border p-2"
              />
              <textarea
                required
                name="description"
                defaultValue={task.description}
                className="rounded-lg border p-2 sm:col-span-2"
              />
              <div className="flex gap-2 sm:col-span-2">
                <button className="rounded-lg bg-indigo-600 px-4 py-2 text-white">
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="rounded-lg border px-4 py-2"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <article
              key={task._id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-blue-200 hover:scale-101"
            >
              <Link href={`/dashboard/client/tasks/${task._id}`}>
                <div className="flex flex-wrap justify-between gap-3">
                  <div>
                    <div
                      className="font-semibold text-slate-900 hover:text-indigo-600"
                    >
                      {task.title}
                    </div>
                    <p className="mt-1 text-sm text-slate-500">
                      {task.category} · ${task.budget} · Deadline{" "}
                      {String(task.deadline).slice(0, 10)}
                    </p>
                  </div>
                  <span className="h-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize">
                    {label(task.status)}
                  </span>
                </div>
                <p className="mt-3 text-sm text-slate-600">{task.description}</p>
                {task.status === "open" && (
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => setEditing(String(task._id))}
                      className="cursor-pointer rounded-lg border px-3 py-2 text-sm font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteTask(task)}
                      className="cursor-pointer rounded-lg border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-600"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </Link></article>
          ),
        )}
        {!tasks.length && (
          <p className="rounded-2xl bg-white p-10 text-center text-slate-500">
            No tasks posted yet.
          </p>
        )}
      </div>
      <ConfirmModal
        open={Boolean(deleteTask)}
        title="Delete this task?"
        description="This permanently removes the open task and its pending proposals."
        confirmLabel="Delete Task"
        danger
        loading={deleting}
        onClose={() => setDeleteTask(null)}
        onConfirm={() => remove(deleteTask._id)}
      />
    </section >
  );
}
