"use client";

import { useEffect, useState } from "react";

interface Product {
  id: string;
  category_id: string;
  name: string;
  price: number;
  tag: string;
  is_active: boolean;
  sort_order: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Partial<Product>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [filterCat, setFilterCat] = useState("Semua");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const [pRes, cRes] = await Promise.all([
      fetch("/api/products?all=true"),
      fetch("/api/categories"),
    ]);
    const pData = await pRes.json();
    const cData = await cRes.json();
    setProducts(Array.isArray(pData) ? pData : []);
    setCategories(Array.isArray(cData) ? cData : []);
    setLoading(false);
  }

  async function saveProduct() {
    if (!form.name || !form.category_id || !form.price) return;
    setSaving(true);

    if (editingId) {
      await fetch(`/api/products/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }

    setShowForm(false);
    setForm({});
    setEditingId(null);
    loadData();
    setSaving(false);
  }

  async function deleteProduct(id: string) {
    if (!confirm("Yakin hapus produk ini?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    setProducts(products.filter((p) => p.id !== id));
  }

  async function toggleActive(id: string, current: boolean) {
    await fetch(`/api/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !current }),
    });
    setProducts(products.map((p) => (p.id === id ? { ...p, is_active: !current } : p)));
  }

  const formatRupiah = (num: number | undefined) => {
    if (!num) return "";
    return num.toLocaleString("id-ID");
  };

  function startEdit(prod: Product) {
    setForm(prod);
    setEditingId(prod.id);
    setShowForm(true);
  }

  const filtered = filterCat === "Semua" ? products : products.filter((p) => p.category_id === filterCat);
  const getCatName = (id: string) => categories.find((c) => c.id === id)?.name || "-";

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="disp text-2xl font-bold">Produk</h1>
          <p className="mt-1 text-sm text-gray-400">Kelola nominal dan harga item</p>
        </div>
        <button
          onClick={() => { setForm({}); setEditingId(null); setShowForm(true); }}
          className="rounded-lg bg-[color:var(--em)] px-4 py-2 text-sm font-bold text-[#04120C] hover:bg-[#33efb0]"
        >
          + Tambah
        </button>
      </div>

      {/* Filter */}
      <div className="mt-6 flex flex-wrap gap-2">
        <button
          onClick={() => setFilterCat("Semua")}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${filterCat === "Semua" ? "bg-[color:var(--em)] text-[#04120C]" : "border border-white/10 text-gray-400 hover:bg-white/5"}`}
        >
          Semua
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setFilterCat(c.id)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${filterCat === c.id ? "bg-[color:var(--em)] text-[#04120C]" : "border border-white/10 text-gray-400 hover:bg-white/5"}`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0E1614] p-6">
            <h2 className="disp text-lg font-bold">{editingId ? "Edit Produk" : "Tambah Produk"}</h2>
            <div className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-400">Kategori</label>
                <select value={form.category_id || ""} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="fld">
                  <option value="">Pilih Game</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-400">Nama Item</label>
                <input value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} className="fld" placeholder="85 Diamond" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-400">Harga</label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">Rp</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={formatRupiah(form.price)}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\D/g, "");
                      setForm({ ...form, price: raw ? parseInt(raw) : 0 });
                    }}
                    className="fld !pl-10"
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-400">Tag</label>
                  <select value={form.tag || ""} onChange={(e) => setForm({ ...form, tag: e.target.value })} className="fld">
                    <option value="">-</option>
                    <option value="TERLARIS">TERLARIS</option>
                    <option value="HEMAT">HEMAT</option>
                    <option value="POPULER">POPULER</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-400">Urutan</label>
                  <input type="number" value={form.sort_order || 0} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) })} className="fld" />
                </div>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={saveProduct} disabled={saving} className="flex-1 rounded-lg bg-[color:var(--em)] py-2.5 text-sm font-bold text-[#04120C] hover:bg-[#33efb0] disabled:opacity-50">
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
              <button onClick={() => { setShowForm(false); setEditingId(null); }} className="flex-1 rounded-lg border border-white/10 py-2.5 text-sm text-gray-400 hover:bg-white/5">Batal</button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="mt-4 overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-[#131E1B]">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Nama</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Kategori</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Harga</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Tag</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Aktif</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">Belum ada produk</td></tr>
            ) : (
              filtered.map((prod) => (
                <tr key={prod.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="px-4 py-3 font-semibold">{prod.name}</td>
                  <td className="px-4 py-3 text-gray-400">{getCatName(prod.category_id)}</td>
                  <td className="px-4 py-3 text-[color:var(--em)]">Rp {prod.price?.toLocaleString("id-ID")}</td>
                  <td className="px-4 py-3">
                    {prod.tag && <span className="rounded bg-white/10 px-2 py-0.5 text-xs">{prod.tag}</span>}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleActive(prod.id, prod.is_active)} className={`h-5 w-9 rounded-full transition-colors ${prod.is_active ? "bg-[color:var(--em)]" : "bg-white/20"}`}>
                      <div className={`h-4 w-4 rounded-full bg-white transition-transform ${prod.is_active ? "translate-x-4" : "translate-x-0.5"}`} />
                    </button>
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button onClick={() => startEdit(prod)} className="text-xs text-blue-400 hover:text-blue-300">Edit</button>
                    <button onClick={() => deleteProduct(prod.id)} className="text-xs text-red-400 hover:text-red-300">Hapus</button>
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