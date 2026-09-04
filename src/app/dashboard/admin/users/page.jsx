"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiLock, FiUnlock } from "react-icons/fi";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";
import ConfirmModal from "../../components/ConfirmModal";
import { clientApi } from "../../components/clientApi";

const date = (value) =>
  value ? new Date(value).toLocaleDateString("en-US") : "-";

function Skeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((item) => (
        <div key={item} className="h-16 animate-pulse rounded-xl bg-white" />
      ))}
    </div>
  );
}

export default function AdminUsersPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadUsers = (showLoading = true) => {
    if (showLoading) setLoading(true);
    return clientApi("/api/admin/users")
      .then((result) => setUsers(result.users || []))
      .catch((error) => toast.error(error.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (isPending) return;
    if (!session?.user) return router.replace("/auth/login");
    if (String(session.user.role).toLowerCase() !== "admin")
      return router.replace(`/dashboard/${session.user.role || "client"}`);
    const loadTimer = setTimeout(() => loadUsers(false), 0);
    return () => clearTimeout(loadTimer);
  }, [isPending, session, router]);

  const updateBlock = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await clientApi(`/api/admin/users/${selected.id}/block`, {
        method: "PATCH",
        body: JSON.stringify({ isBlocked: !selected.isBlocked }),
      });
      toast.success(
        selected.isBlocked ? "Account unblocked." : "Account blocked.",
      );
      setSelected(null);
      await loadUsers();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
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
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Manage Users</h1>
        <p className="mt-2 text-slate-500">
          Review platform accounts and control access.
        </p>
      </div>
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => (
                <tr key={String(user._id)}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 overflow-hidden rounded-full bg-indigo-100 text-center text-sm font-bold leading-10 text-indigo-700">
                        {user.image ? (
                          <img
                            src={user.image}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          String(user.name || "U")
                            .charAt(0)
                            .toUpperCase()
                        )}
                      </div>
                      <span className="font-semibold text-slate-900">
                        {user.name || "Unnamed user"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{user.email}</td>
                  <td className="px-6 py-4 capitalize text-slate-600">
                    {user.role || "-"}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {date(user.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${user.isBlocked ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"}`}
                    >
                      {user.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      onClick={() =>
                        setSelected({
                          id: String(user._id),
                          name: user.name,
                          isBlocked: Boolean(user.isBlocked),
                        })
                      }
                      className={`inline-flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-white ${user.isBlocked ? "bg-emerald-600 hover:bg-emerald-700" : "bg-rose-600 hover:bg-rose-700"}`}
                    >
                      <span>{user.isBlocked ? <FiUnlock /> : <FiLock />}</span>
                      {user.isBlocked ? "Unblock" : "Block"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!users.length && (
          <p className="p-6 text-sm text-slate-500">No users found.</p>
        )}
      </section>
      <ConfirmModal
        open={Boolean(selected)}
        title={
          selected?.isBlocked ? "Unblock this account?" : "Block this account?"
        }
        description={
          selected?.isBlocked
            ? `${selected?.name || "This user"} will be able to log in again.`
            : `${selected?.name || "This user"} will lose login access immediately.`
        }
        confirmLabel={selected?.isBlocked ? "Unblock" : "Block"}
        danger={!selected?.isBlocked}
        loading={saving}
        onConfirm={updateBlock}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
