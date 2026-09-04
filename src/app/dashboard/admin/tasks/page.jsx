"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";
import ConfirmModal from "../../components/ConfirmModal";
import { clientApi } from "../../components/clientApi";

const date = (value) =>
  value ? new Date(value).toLocaleDateString("en-US") : "-";
const money = (value) => `$${Number(value || 0).toLocaleString("en-US")}`;
const statusLabel = (value) => String(value || "open").replace("_", " ");

function Skeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((item) => (
        <div key={item} className="h-16 animate-pulse rounded-xl bg-white" />
      ))}
    </div>
  );
}

export default function AdminTasksPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadTasks = (showLoading = true) => {
    if (showLoading) setLoading(true);
    return clientApi("/api/admin/tasks")
      .then((result) => setTasks(result.tasks || []))
      .catch((error) => toast.error(error.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (isPending) return;
    if (!session?.user) return router.replace("/auth/login");
    if (String(session.user.role).toLowerCase() !== "admin")
      return router.replace(`/dashboard/${session.user.role || "client"}`);
    const loadTimer = setTimeout(() => loadTasks(false), 0);
    return () => clearTimeout(loadTimer);
  }, [isPending, session, router]);

  const deleteTask = async () => {
    if (!selected) return;
    setDeleting(true);
    try {
      await clientApi(`/api/admin/tasks/${selected.id}`, { method: "DELETE" });
      toast.success("Task deleted.");
      setSelected(null);
      await loadTasks();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setDeleting(false);
    }
  };

  if (isPending || loading) return <Skeleton />;
  if (!session?.user || String(session.user.role).toLowerCase() !== "admin")
    return null;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
          Administration
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Manage Tasks</h1>
        <p className="mt-2 text-slate-500">
          Review every task and remove unsafe open listings.
        </p>
      </div>
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-6 py-4">Task</th>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Budget</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Proposals</th>
                <th className="px-6 py-4">Created</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tasks.map((task) => (
                <tr key={String(task._id)}>
                  <td className="max-w-[280px] px-6 py-4">
                    <p className="truncate font-semibold text-slate-900">
                      {task.title}
                    </p>
                    <p className="mt-1 capitalize text-xs text-slate-500">
                      {task.category || "-"}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {task.client?.name || task.client_email || "-"}
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-900">
                    {money(task.budget)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-700">
                      {statusLabel(task.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {task.proposalCount || 0}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {date(task.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {task.status === "open" && (
                      <button
                        type="button"
                        onClick={() =>
                          setSelected({
                            id: String(task._id),
                            title: task.title,
                          })
                        }
                        className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-700"
                      >
                        <FiTrash2 /> Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!tasks.length && (
          <p className="p-6 text-sm text-slate-500">No tasks found.</p>
        )}
      </section>
      <ConfirmModal
        open={Boolean(selected)}
        title="Delete this task?"
        description={`This will permanently remove ${selected?.title || "the task"} and its proposals.`}
        confirmLabel="Delete task"
        danger
        loading={deleting}
        onConfirm={deleteTask}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
