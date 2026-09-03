"use client";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import { clientApi, withEmail } from "../../components/clientApi";

export default function ProfilePage() {
  const { data: session } = authClient.useSession();
  const [form, setForm] = useState({ name: "", image: "" });
  const [message, setMessage] = useState("");
  useEffect(() => {
    if (session?.user?.email)
      clientApi(`/api/client/profile?email=${withEmail(session.user.email)}`)
        .then((u) => setForm({ name: u.name || "", image: u.image || "" }))
        .catch((e) => setMessage(e.message));
  }, [session]);
  async function save(e) {
    e.preventDefault();
    try {
      await clientApi("/api/client/profile", {
        method: "PATCH",
        body: JSON.stringify({ ...form, email: session.user.email }),
      });
      setMessage("Profile updated successfully.");
      toast.success("Profile updated successfully.");
    } catch (e) {
      setMessage(e.message);
      toast.error(e.message);
    }
  }
  return (
    <section className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h1 className="text-2xl font-bold text-slate-900">Edit Profile</h1>
      {message && (
        <p className="mt-4 rounded-lg bg-indigo-50 p-3 text-sm text-indigo-700">
          {message}
        </p>
      )}
      <form onSubmit={save} className="mt-6 grid gap-5">
        <label className="grid gap-2 text-sm font-semibold">
          Name
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="rounded-xl border p-3 font-normal"
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          Profile image URL
          <input
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            className="rounded-xl border p-3 font-normal"
          />
        </label>
        <p className="text-sm text-slate-500">Email: {session?.user?.email}</p>
        <button className="cursor-pointer rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white">
          Save Changes
        </button>
      </form>
    </section>
  );
}
