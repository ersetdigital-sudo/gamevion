"use client";

import { useEffect, useState } from "react";

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  sort_order: number;
}

export default function PaymentsPage() {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Partial<PaymentMethod>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    const res = await fetch("/api/payment-methods");
    const data = await res.json();
    setMethods(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  async function save() {
    if (!form.name) return;
    setSaving(true);
    if (editingId) {
      await fetch(`/api/payment-methods/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch("/api/payment-methods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setShowForm(false); setForm({}); setEditingId(null); loadData();
    setSaving(false);
  }

  async function remove(id: string) {
    if (!confirm("Yakin hapus?")) return;
    await fetch(`/api/payment-methods/${id}`, { method: "DELETE" });
    setMethods(methods.filter((m) => m.id !== id));
  }

  async function toggleActive(id: string, current: boolean) {
    await fetch(`/api/payment-methods/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !current }),
    });
    setMethods(methods.map((m) => (m.id === id ? { ...m, is_active: !current } : m)));
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="disp text-2xl font-bold">Metode Pembayaran</h1>
          <p className="mt-1 text-sm text-gray-400">Kelola metode pembayaran yang tersedia</p>
        </div>
        <button onClick={() => { setForm({}); setEditingId(null); setShowForm(true); }} className="rounded-lg bg-[color:var(--em)] px-4 py-2 text-sm font-bold text-[#04120C] hover:bg-[#33efb0]">+ Tambah</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0E1614] p-6">
            <h2 className="disp text-lg font-bold">{editingId ? "Edit" : "Tambah"} Metode Bayar</h2>
            <div className="mt-4 space-y-3">
              <div><label className="mb-1 block text-xs font-semibold text-gray-400">Nama</label><input value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} className="fld" placeholder="QRIS" /></div>
              <div><label className="mb-1 block text-xs font-semibold text-gray-400">Deskripsi</label><input value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} className="fld" placeholder="Semua e-wallet & m-banking" /></div>
              <div><label className="mb-1 block text-xs font-semibold text-gray-400">Urutan</label><input type="number" value={form.sort_order || 0} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) })} className="fld" /></div>
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
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Nama</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Deskripsi</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Urutan</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Aktif</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">Loading...</td></tr>
            ) : methods.map((m) => (
              <tr key={m.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                <td className="px-4 py-3 font-semibold">{m.name}</td>
                <td className="px-4 py-3 text-gray-400">{m.description}</td>
                <td className="px-4 py-3 text-gray-400">{m.sort_order}</td>
                <td className="px-4 py-3">
                  <button onClick={() => toggleActive(m.id, m.is_active)} className={`h-5 w-9 rounded-full transition-colors ${m.is_active ? "bg-[color:var(--em)]" : "bg-white/20"}`}>
                    <div className={`h-4 w-4 rounded-full bg-white transition-transform ${m.is_active ? "translate-x-4" : "translate-x-0.5"}`} />
                  </button>
                </td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => { setForm(m); setEditingId(m.id); setShowForm(true); }} className="text-xs text-blue-400">Edit</button>
                  <button onClick={() => remove(m.id)} className="text-xs text-red-400">Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}