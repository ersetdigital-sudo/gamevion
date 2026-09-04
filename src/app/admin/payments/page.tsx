"use client";

import { useEffect, useState, useRef } from "react";

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  sort_order: number;
  qr_image_url: string | null;
}

export default function PaymentsPage() {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Partial<PaymentMethod>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    const res = await fetch("/api/payment-methods?all=true");
    const data = await res.json();
    setMethods(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  async function handleUpload(file: File) {
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      alert("Hanya file JPG, PNG, WebP yang diizinkan");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran file maksimal 2MB");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) {
        setForm({ ...form, qr_image_url: data.url });
      } else {
        alert("Gagal upload gambar");
      }
    } catch {
      alert("Gagal upload gambar");
    } finally {
      setUploading(false);
    }
  }

  function removeImage() {
    setForm({ ...form, qr_image_url: null });
    if (fileRef.current) fileRef.current.value = "";
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
        <button onClick={() => { setForm({ sort_order: 0 }); setEditingId(null); setShowForm(true); }} className="rounded-lg bg-[color:var(--em)] px-4 py-2 text-sm font-bold text-[#04120C] hover:bg-[#33efb0]">+ Tambah</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0E1614] p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="disp text-lg font-bold">{editingId ? "Edit" : "Tambah"} Metode Bayar</h2>
            <div className="mt-4 space-y-3">
              <div><label className="mb-1 block text-xs font-semibold text-gray-400">Nama</label><input value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} className="fld" placeholder="QRIS" /></div>
              <div><label className="mb-1 block text-xs font-semibold text-gray-400">Deskripsi</label><input value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} className="fld" placeholder="Semua e-wallet & m-banking" /></div>
              <div><label className="mb-1 block text-xs font-semibold text-gray-400">Urutan</label><input type="number" value={form.sort_order || 0} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) })} className="fld" /></div>

              {/* QR Image Upload */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-400">Gambar QRIS (opsional)</label>
                {form.qr_image_url ? (
                  <div className="relative inline-block">
                    <img src={form.qr_image_url} alt="QR Preview" className="h-40 w-40 rounded-xl border border-white/10 object-contain bg-white p-2" />
                    <button onClick={removeImage} className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs text-white hover:bg-red-600">✕</button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileRef.current?.click()}
                      disabled={uploading}
                      className="rounded-xl border border-dashed border-white/20 px-6 py-8 text-center text-sm text-gray-400 hover:border-[color:var(--em)]/50 hover:text-[color:var(--em)] disabled:opacity-50"
                    >
                      {uploading ? (
                        <span className="flex items-center gap-2"><svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Uploading...</span>
                      ) : (
                        <span className="flex flex-col items-center gap-1">
                          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
                          Klik untuk upload gambar QR
                          <span className="text-[10px] text-gray-500">JPG, PNG, WebP (maks 2MB)</span>
                        </span>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={save} disabled={saving} className="flex-1 rounded-lg bg-[color:var(--em)] py-2.5 text-sm font-bold text-[#04120C] disabled:opacity-50">{saving ? "Menyimpan..." : "Simpan"}</button>
              <button onClick={() => { setShowForm(false); setEditingId(null); setForm({}); }} className="flex-1 rounded-lg border border-white/10 py-2.5 text-sm text-gray-400">Batal</button>
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
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">QR</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Urutan</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Aktif</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">Loading...</td></tr>
            ) : methods.map((m) => (
              <tr key={m.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                <td className="px-4 py-3 font-semibold">{m.name}</td>
                <td className="px-4 py-3 text-gray-400">{m.description}</td>
                <td className="px-4 py-3">
                  {m.qr_image_url ? (
                    <img src={m.qr_image_url} alt="QR" className="h-10 w-10 rounded-lg border border-white/10 object-contain bg-white p-0.5" />
                  ) : (
                    <span className="text-xs text-gray-500">-</span>
                  )}
                </td>
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
