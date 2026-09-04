"use client";

import { useEffect, useState } from "react";

interface Contact {
  id: string;
  label: string;
  phone_number: string;
  wa_link: string;
  is_active: boolean;
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Partial<Contact>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    const res = await fetch("/api/contacts");
    const data = await res.json();
    setContacts(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  async function save() {
    if (!form.label || !form.phone_number) return;
    setSaving(true);
    const wa_link = `https://wa.me/${form.phone_number.replace(/^0/, "62")}`;
    const payload = { ...form, wa_link };
    if (editingId) {
      await fetch(`/api/contacts/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
    setShowForm(false); setForm({}); setEditingId(null); loadData();
    setSaving(false);
  }

  async function remove(id: string) {
    if (!confirm("Yakin hapus?")) return;
    await fetch(`/api/contacts/${id}`, { method: "DELETE" });
    setContacts(contacts.filter((c) => c.id !== id));
  }

  async function toggleActive(id: string, current: boolean) {
    await fetch(`/api/contacts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !current }),
    });
    setContacts(contacts.map((c) => (c.id === id ? { ...c, is_active: !current } : c)));
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="disp text-2xl font-bold">Kontak WhatsApp</h1>
          <p className="mt-1 text-sm text-gray-400">Nomor WA untuk CS & support</p>
        </div>
        <button onClick={() => { setForm({}); setEditingId(null); setShowForm(true); }} className="rounded-lg bg-[color:var(--em)] px-4 py-2 text-sm font-bold text-[#04120C] hover:bg-[#33efb0]">+ Tambah</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0E1614] p-6">
            <h2 className="disp text-lg font-bold">{editingId ? "Edit" : "Tambah"} Kontak</h2>
            <div className="mt-4 space-y-3">
              <div><label className="mb-1 block text-xs font-semibold text-gray-400">Label</label><input value={form.label || ""} onChange={(e) => setForm({ ...form, label: e.target.value })} className="fld" placeholder="CS Utama" /></div>
              <div><label className="mb-1 block text-xs font-semibold text-gray-400">Nomor WhatsApp</label><input value={form.phone_number || ""} onChange={(e) => setForm({ ...form, phone_number: e.target.value })} className="fld" placeholder="081234567890" /></div>
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
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Label</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Nomor</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">WA Link</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Aktif</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">Loading...</td></tr>
            ) : contacts.map((c) => (
              <tr key={c.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                <td className="px-4 py-3 font-semibold">{c.label}</td>
                <td className="px-4 py-3 font-mono">{c.phone_number}</td>
                <td className="px-4 py-3"><a href={c.wa_link} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-400 hover:underline">{c.wa_link}</a></td>
                <td className="px-4 py-3">
                  <button onClick={() => toggleActive(c.id, c.is_active)} className={`h-5 w-9 rounded-full transition-colors ${c.is_active ? "bg-[color:var(--em)]" : "bg-white/20"}`}>
                    <div className={`h-4 w-4 rounded-full bg-white transition-transform ${c.is_active ? "translate-x-4" : "translate-x-0.5"}`} />
                  </button>
                </td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => { setForm(c); setEditingId(c.id); setShowForm(true); }} className="text-xs text-blue-400">Edit</button>
                  <button onClick={() => remove(c.id)} className="text-xs text-red-400">Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}