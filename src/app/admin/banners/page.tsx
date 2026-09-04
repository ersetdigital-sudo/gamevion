"use client";

import { useEffect, useState } from "react";

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  cta_text: string;
  code: string;
  discount_type: string;
  discount_value: number;
  is_active: boolean;
  sort_order: number;
  bg_color: string;
}

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Partial<Banner>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    const res = await fetch("/api/banners");
    const data = await res.json();
    setBanners(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  async function save() {
    if (!form.title) return;
    setSaving(true);
    if (editingId) {
      await fetch(`/api/banners/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch("/api/banners", {
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
    await fetch(`/api/banners/${id}`, { method: "DELETE" });
    setBanners(banners.filter((b) => b.id !== id));
  }

  async function toggleActive(id: string, current: boolean) {
    await fetch(`/api/banners/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !current }),
    });
    setBanners(banners.map((b) => (b.id === id ? { ...b, is_active: !current } : b)));
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="disp text-2xl font-bold">Banner / Promo</h1>
          <p className="mt-1 text-sm text-gray-400">Kelola banner hero & promo</p>
        </div>
        <button onClick={() => { setForm({}); setEditingId(null); setShowForm(true); }} className="rounded-lg bg-[color:var(--em)] px-4 py-2 text-sm font-bold text-[#04120C] hover:bg-[#33efb0]">+ Tambah</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0E1614] p-6 max-h-[80vh] overflow-y-auto">
            <h2 className="disp text-lg font-bold">{editingId ? "Edit" : "Tambah"} Banner</h2>
            <div className="mt-4 space-y-3">
              <div><label className="mb-1 block text-xs font-semibold text-gray-400">Judul</label><input value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} className="fld" /></div>
              <div><label className="mb-1 block text-xs font-semibold text-gray-400">Subjudul</label><input value={form.subtitle || ""} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} className="fld" /></div>
              <div><label className="mb-1 block text-xs font-semibold text-gray-400">Deskripsi</label><input value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} className="fld" /></div>
              <div><label className="mb-1 block text-xs font-semibold text-gray-400">CTA Text</label><input value={form.cta_text || ""} onChange={(e) => setForm({ ...form, cta_text: e.target.value })} className="fld" placeholder="Lihat Paket" /></div>
              <div><label className="mb-1 block text-xs font-semibold text-gray-400">Kode Promo</label><input value={form.code || ""} onChange={(e) => setForm({ ...form, code: e.target.value })} className="fld" placeholder="GVNSEP26" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="mb-1 block text-xs font-semibold text-gray-400">Tipe Diskon</label><select value={form.discount_type || ""} onChange={(e) => setForm({ ...form, discount_type: e.target.value })} className="fld"><option value="">-</option><option value="fixed">Fixed (Rp)</option><option value="percent">Persen (%)</option></select></div>
                <div><label className="mb-1 block text-xs font-semibold text-gray-400">Nilai Diskon</label><input type="number" value={form.discount_value || ""} onChange={(e) => setForm({ ...form, discount_value: parseInt(e.target.value) })} className="fld" /></div>
              </div>
              <div><label className="mb-1 block text-xs font-semibold text-gray-400">Warna Background</label><input value={form.bg_color || ""} onChange={(e) => setForm({ ...form, bg_color: e.target.value })} className="fld" placeholder="#0BAF78" /></div>
              <div><label className="mb-1 block text-xs font-semibold text-gray-400">Urutan</label><input type="number" value={form.sort_order || 0} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) })} className="fld" /></div>
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={save} disabled={saving} className="flex-1 rounded-lg bg-[color:var(--em)] py-2.5 text-sm font-bold text-[#04120C] disabled:opacity-50">{saving ? "Menyimpan..." : "Simpan"}</button>
              <button onClick={() => { setShowForm(false); setEditingId(null); }} className="flex-1 rounded-lg border border-white/10 py-2.5 text-sm text-gray-400">Batal</button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 space-y-3">
        {loading ? <p className="text-gray-500">Loading...</p> : banners.length === 0 ? (
          <p className="text-gray-500">Belum ada banner</p>
        ) : banners.map((b) => (
          <div key={b.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-[#131E1B] p-4">
            <div>
              <p className="font-semibold">{b.title} <span className="text-[color:var(--em)]">{b.subtitle}</span></p>
              <p className="text-xs text-gray-400">{b.description}</p>
              {b.code && <p className="mt-1 text-xs">Kode: <span className="font-mono text-[color:var(--em)]">{b.code}</span></p>}
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => toggleActive(b.id, b.is_active)} className={`h-5 w-9 rounded-full transition-colors ${b.is_active ? "bg-[color:var(--em)]" : "bg-white/20"}`}>
                <div className={`h-4 w-4 rounded-full bg-white transition-transform ${b.is_active ? "translate-x-4" : "translate-x-0.5"}`} />
              </button>
              <button onClick={() => { setForm(b); setEditingId(b.id); setShowForm(true); }} className="text-xs text-blue-400">Edit</button>
              <button onClick={() => remove(b.id)} className="text-xs text-red-400">Hapus</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}