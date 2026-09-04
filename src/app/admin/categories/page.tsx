"use client";

import { useEffect, useState } from "react";

interface Category {
  id: string;
  name: string;
  slug: string;
  developer: string;
  image_url: string;
  icon_url: string;
  badge: string;
  badge_color: string;
  sort_order: number;
  is_active: boolean;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Partial<Category>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  async function saveCategory() {
    if (!form.name || !form.slug) return;
    setSaving(true);

    if (editingId) {
      await fetch(`/api/categories/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }

    setShowForm(false); setForm({}); setEditingId(null); loadData();
    setSaving(false);
  }

  async function deleteCategory(id: string) {
    if (!confirm("Yakin hapus kategori ini?")) return;
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    setCategories(categories.filter((c) => c.id !== id));
  }

  async function toggleActive(id: string, current: boolean) {
    await fetch(`/api/categories/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !current }),
    });
    setCategories(categories.map((c) => (c.id === id ? { ...c, is_active: !current } : c)));
  }

  function startEdit(cat: Category) {
    setForm(cat); setEditingId(cat.id); setShowForm(true);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="disp text-2xl font-bold">Kategori Game</h1>
          <p className="mt-1 text-sm text-gray-400">Kelola daftar game yang tersedia</p>
        </div>
        <button onClick={() => { setForm({}); setEditingId(null); setShowForm(true); }} className="rounded-lg bg-[color:var(--em)] px-4 py-2 text-sm font-bold text-[#04120C] hover:bg-[#33efb0]">+ Tambah</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0E1614] p-6">
            <h2 className="disp text-lg font-bold">{editingId ? "Edit Kategori" : "Tambah Kategori"}</h2>
            <div className="mt-4 space-y-3">
              <div><label className="mb-1 block text-xs font-semibold text-gray-400">Nama</label><input value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} className="fld" placeholder="Mobile Legends" /></div>
              <div><label className="mb-1 block text-xs font-semibold text-gray-400">Slug</label><input value={form.slug || ""} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="fld" placeholder="mobile-legends" /></div>
              <div><label className="mb-1 block text-xs font-semibold text-gray-400">Developer</label><input value={form.developer || ""} onChange={(e) => setForm({ ...form, developer: e.target.value })} className="fld" placeholder="Moonton" /></div>
              <div><label className="mb-1 block text-xs font-semibold text-gray-400">Image URL</label><input value={form.image_url || ""} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="fld" placeholder="/images/xxx.png" /></div>
              <div><label className="mb-1 block text-xs font-semibold text-gray-400">Icon URL</label><input value={form.icon_url || ""} onChange={(e) => setForm({ ...form, icon_url: e.target.value })} className="fld" placeholder="/images/xxx.svg" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="mb-1 block text-xs font-semibold text-gray-400">Badge</label><input value={form.badge || ""} onChange={(e) => setForm({ ...form, badge: e.target.value })} className="fld" placeholder="HOT" /></div>
                <div><label className="mb-1 block text-xs font-semibold text-gray-400">Badge Color</label><select value={form.badge_color || ""} onChange={(e) => setForm({ ...form, badge_color: e.target.value })} className="fld"><option value="">-</option><option value="emerald">Emerald</option><option value="violet">Violet</option><option value="white">White</option></select></div>
              </div>
              <div><label className="mb-1 block text-xs font-semibold text-gray-400">Urutan</label><input type="number" value={form.sort_order || 0} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) })} className="fld" /></div>
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={saveCategory} disabled={saving} className="flex-1 rounded-lg bg-[color:var(--em)] py-2.5 text-sm font-bold text-[#04120C] disabled:opacity-50">{saving ? "Menyimpan..." : "Simpan"}</button>
              <button onClick={() => { setShowForm(false); setEditingId(null); }} className="flex-1 rounded-lg border border-white/10 py-2.5 text-sm text-gray-400 hover:bg-white/5">Batal</button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-[#131E1B]">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Nama</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Slug</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Developer</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Badge</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Urutan</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Aktif</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-500">Loading...</td></tr>
            ) : categories.map((cat) => (
              <tr key={cat.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                <td className="px-4 py-3 font-semibold">{cat.name}</td>
                <td className="px-4 py-3 font-mono text-xs">{cat.slug}</td>
                <td className="px-4 py-3 text-gray-400">{cat.developer}</td>
                <td className="px-4 py-3">{cat.badge && <span className="rounded bg-white/10 px-2 py-0.5 text-xs">{cat.badge}</span>}</td>
                <td className="px-4 py-3 text-gray-400">{cat.sort_order}</td>
                <td className="px-4 py-3">
                  <button onClick={() => toggleActive(cat.id, cat.is_active)} className={`h-5 w-9 rounded-full transition-colors ${cat.is_active ? "bg-[color:var(--em)]" : "bg-white/20"}`}>
                    <div className={`h-4 w-4 rounded-full bg-white transition-transform ${cat.is_active ? "translate-x-4" : "translate-x-0.5"}`} />
                  </button>
                </td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => startEdit(cat)} className="text-xs text-blue-400 hover:text-blue-300">Edit</button>
                  <button onClick={() => deleteCategory(cat.id)} className="text-xs text-red-400 hover:text-red-300">Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}