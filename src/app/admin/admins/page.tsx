"use client";

import { useEffect, useState } from "react";

interface Admin {
  id: string;
  email: string;
  name: string;
  role: string;
  created_at: string;
  last_sign_in_at: string | null;
}

export default function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const [aRes, sRes] = await Promise.all([
      fetch("/api/admins"),
      fetch("/api/admins/session"),
    ]);
    const aData = await aRes.json();
    setAdmins(Array.isArray(aData) ? aData : []);
    const sData = await sRes.json();
    setCurrentUser(sData?.email || null);
    setLoading(false);
  }

  function showToast(msg: string, type: "ok" | "err" = "ok") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function handleAdd() {
    if (!form.name || !form.email || !form.password) return;
    setSaving(true);
    const res = await fetch("/api/admins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) {
      setForm({ name: "", email: "", password: "" });
      setShowForm(false);
      showToast("Admin berhasil ditambahkan");
      loadData();
    } else {
      showToast(data.error || "Gagal menambahkan admin", "err");
    }
    setSaving(false);
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Yakin mau cabut akses "${name}"? Admin ini tidak akan bisa login lagi.`)) return;
    setDeleting(id);
    const res = await fetch(`/api/admins/${id}`, { method: "DELETE" });
    if (res.ok) {
      showToast("Akses admin berhasil dicabut");
      loadData();
    } else {
      const data = await res.json();
      showToast(data.error || "Gagal menghapus admin", "err");
    }
    setDeleting(null);
  }

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div>
      {toast && (
        <div className={`fixed right-4 top-4 z-50 rounded-lg px-4 py-3 text-sm font-semibold shadow-lg ${toast.type === "ok" ? "bg-[color:var(--em)] text-[#04120C]" : "bg-red-500 text-white"}`}>
          {toast.msg}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="disp text-2xl font-bold">Admins</h1>
          <p className="mt-1 text-sm text-gray-400">Kelola akses admin panel</p>
        </div>
        <button
          onClick={() => { setForm({ name: "", email: "", password: "" }); setShowForm(true); }}
          className="rounded-lg bg-[color:var(--em)] px-4 py-2 text-sm font-bold text-[#04120C] hover:bg-[#33efb0]"
        >
          + Tambah Admin
        </button>
      </div>

      {/* Add Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0E1614] p-6">
            <h2 className="disp text-lg font-bold">Tambah Admin Baru</h2>
            <div className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-400">Nama</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="fld"
                  placeholder="Nama tampilan"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-400">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="fld"
                  placeholder="admin@gamevion.net"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-400">Password</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="fld"
                  placeholder="Min. 6 karakter"
                />
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={handleAdd}
                disabled={saving || !form.name || !form.email || !form.password}
                className="flex-1 rounded-lg bg-[color:var(--em)] py-2.5 text-sm font-bold text-[#04120C] disabled:opacity-50"
              >
                {saving ? "Menambahkan..." : "Tambah Admin"}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 rounded-lg border border-white/10 py-2.5 text-sm text-gray-400"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="mt-6 overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-[#131E1B]">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Nama</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Email</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Role</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Dibuat</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Terakhir Login</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">Loading...</td></tr>
            ) : admins.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">Belum ada admin</td></tr>
            ) : (
              admins.map((a) => (
                <tr key={a.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="px-4 py-3 font-semibold">
                    {a.name}
                    {a.email === currentUser && (
                      <span className="ml-2 inline-block rounded-full bg-[color:var(--em)]/15 px-2 py-0.5 text-[10px] font-bold text-[color:var(--em)]">Kamu</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-400">{a.email}</td>
                  <td className="px-4 py-3 text-gray-400 capitalize">{a.role}</td>
                  <td className="px-4 py-3 text-gray-400">{formatDate(a.created_at)}</td>
                  <td className="px-4 py-3 text-gray-400">{a.last_sign_in_at ? formatDate(a.last_sign_in_at) : "-"}</td>
                  <td className="px-4 py-3">
                    {a.email !== currentUser && (
                      <button
                        onClick={() => handleDelete(a.id, a.name)}
                        disabled={deleting === a.id}
                        className="text-xs text-red-400 hover:text-red-300 disabled:opacity-50"
                      >
                        {deleting === a.id ? "Menghapus..." : "Cabut Akses"}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
