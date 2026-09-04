"use client";

import { useEffect, useState } from "react";

interface Setting {
  id: string;
  key: string;
  value: string;
  description: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Partial<Setting>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    const res = await fetch("/api/settings");
    const data = await res.json();
    setSettings(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  async function save() {
    if (!form.key || !form.value) return;
    setSaving(true);
    if (editingId) {
      await fetch(`/api/settings/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setShowForm(false); setForm({}); setEditingId(null); loadData();
    setSaving(false);
  }

  async function remove(id: string) {
    if (!confirm("Yakin hapus setting ini?")) return;
    await fetch(`/api/settings/${id}`, { method: "DELETE" });
    setSettings(settings.filter((s) => s.id !== id));
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="disp text-2xl font-bold">Pengaturan</h1>
          <p className="mt-1 text-sm text-gray-400">Pengaturan umum website GAMEVION</p>
        </div>
        <button onClick={() => { setForm({}); setEditingId(null); setShowForm(true); }} className="rounded-lg bg-[color:var(--em)] px-4 py-2 text-sm font-bold text-[#04120C] hover:bg-[#33efb0]">+ Tambah</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0E1614] p-6">
            <h2 className="disp text-lg font-bold">{editingId ? "Edit" : "Tambah"} Pengaturan</h2>
            <div className="mt-4 space-y-3">
              <div><label className="mb-1 block text-xs font-semibold text-gray-400">Key</label><input value={form.key || ""} onChange={(e) => setForm({ ...form, key: e.target.value })} className="fld" placeholder="site_name" disabled={!!editingId} /></div>
              <div><label className="mb-1 block text-xs font-semibold text-gray-400">Value</label>
                {form.key?.includes("description") || form.key?.includes("meta") ? (
                  <textarea value={form.value || ""} onChange={(e) => setForm({ ...form, value: e.target.value })} className="fld min-h-[100px]" />
                ) : (
                  <input value={form.value || ""} onChange={(e) => setForm({ ...form, value: e.target.value })} className="fld" />
                )}
              </div>
              <div><label className="mb-1 block text-xs font-semibold text-gray-400">Deskripsi</label><input value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} className="fld" placeholder="Nama situs" /></div>
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={save} disabled={saving} className="flex-1 rounded-lg bg-[color:var(--em)] py-2.5 text-sm font-bold text-[#04120C] disabled:opacity-50">{saving ? "Menyimpan..." : "Simpan"}</button>
              <button onClick={() => { setShowForm(false); setEditingId(null); }} className="flex-1 rounded-lg border border-white/10 py-2.5 text-sm text-gray-400">Batal</button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-[#131E1B]">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Key</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Value</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Deskripsi</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-500">Loading...</td></tr>
            ) : settings.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-500">Belum ada pengaturan</td></tr>
            ) : settings.map((s) => (
              <tr key={s.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                <td className="px-4 py-3 font-mono text-xs">{s.key}</td>
                <td className="px-4 py-3 max-w-xs truncate text-gray-300">{s.value}</td>
                <td className="px-4 py-3 text-gray-400">{s.description}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => { setForm(s); setEditingId(s.id); setShowForm(true); }} className="text-xs text-blue-400">Edit</button>
                  <button onClick={() => remove(s.id)} className="text-xs text-red-400">Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}