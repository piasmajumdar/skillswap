"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";
import { clientApi, withEmail } from "../../components/clientApi";

export default function FreelancerProfilePage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [form, setForm] = useState({
    name: "",
    image: "",
    skills: "",
    bio: "",
    hourlyRate: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!session?.user?.email) return;
    clientApi("/api/freelancer/profile?email=" + withEmail(session.user.email))
      .then((user) =>
        setForm({
          name: user.name || "",
          image: user.image || "",
          skills: user.skills || "",
          bio: user.bio || "",
          hourlyRate: user.hourlyRate || "",
        }),
      )
      .catch((e) => toast.error(e.message));
  }, [session?.user?.email]);

  async function save(event) {
    event.preventDefault();
    setSaving(true);
    try {
      const updatedUser = await clientApi("/api/freelancer/profile", {
        method: "PATCH",
        body: JSON.stringify({
          ...form,
          email: session.user.email,
          hourlyRate: Number(form.hourlyRate || 0),
        }),
      });
      setForm({
        name: updatedUser.name || "",
        image: updatedUser.image || "",
        skills: updatedUser.skills || "",
        bio: updatedUser.bio || "",
        hourlyRate: updatedUser.hourlyRate || "",
      });
      toast.success("Profile updated successfully.");
      router.refresh();
      window.setTimeout(() => window.location.reload(), 500);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h1 className="text-2xl font-bold text-slate-900">Edit Profile</h1>
      <p className="mt-2 text-sm text-slate-500">
        Keep your freelancer profile current for clients.
      </p>
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
          Profile Photo Link
          <input
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            className="rounded-xl border p-3 font-normal"
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          Skills{" "}
          <span className="text-xs font-normal text-slate-500">
            (comma separated)
          </span>
          <input
            value={form.skills}
            onChange={(e) => setForm({ ...form, skills: e.target.value })}
            className="rounded-xl border p-3 font-normal"
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          Bio
          <textarea
            rows="5"
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            className="rounded-xl border p-3 font-normal"
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          Hourly Rate (USD)
          <input
            min="0"
            type="number"
            value={form.hourlyRate}
            onChange={(e) => setForm({ ...form, hourlyRate: e.target.value })}
            className="rounded-xl border p-3 font-normal"
          />
        </label>
        <button
          disabled={saving}
          className="cursor-pointer rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </section>
  );
}
