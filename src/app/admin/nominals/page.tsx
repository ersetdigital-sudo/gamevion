"use client";

import { useState, useEffect, useCallback } from "react";

interface Nominal {
  id: string;
  game_id: string;
  value: number;
  label: string;
  tag: string | null;
  sort_order: number;
}

const GAMES = [
  { id: "mobile-legends", name: "Mobile Legends" },
  { id: "free-fire", name: "Free Fire" },
  { id: "pubg-mobile", name: "PUBG Mobile" },
  { id: "genshin-impact", name: "Genshin Impact" },
  { id: "call-of-duty-mobile", name: "Call of Duty Mobile" },
  { id: "magic-chess-go-go", name: "Magic Chess: Go Go" },
];

const TAG_OPTIONS = ["", "TERLARIS", "HEMAT", "POPULER"];

export default function AdminNominalsPage() {
  const [selectedGame, setSelectedGame] = useState("mobile-legends");
  const [nominals, setNominals] = useState<Nominal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Nominal | null>(null);
  const [form, setForm] = useState({ value: "", label: "", tag: "", sort_order: "0" });
  const [saving, setSaving] = useState(false);

  const fetchNominals = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/nominals?game_id=${selectedGame}`);
    const data = await res.json();
    setNominals(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [selectedGame]);

  useEffect(() => {
    fetchNominals();
  }, [fetchNominals]);

  const formatRupiah = (num: string) => {
    const raw = num.replace(/\D/g, "");
    if (!raw) return "";
    return "Rp " + parseInt(raw).toLocaleString("id-ID");
  };

  const parseRupiah = (formatted: string) => {
    return formatted.replace(/[^\d]/g, "");
  };

  const openAdd = () => {
    setEditing(null);
    setForm({ value: "", label: "", tag: "", sort_order: String(nominals.length) });
    setShowForm(true);
  };

  const openEdit = (n: Nominal) => {
    setEditing(n);
    setForm({
      value: String(n.value),
      label: n.label,
      tag: n.tag || "",
      sort_order: String(n.sort_order),
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.value || !form.label) return;
    setSaving(true);

    const body = {
      game_id: selectedGame,
      value: parseInt(form.value),
      label: form.label,
      tag: form.tag || null,
      sort_order: parseInt(form.sort_order) || 0,
    };

    if (editing) {
      await fetch(`/api/nominals/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } else {
      await fetch("/api/nominals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    }

    setSaving(false);
    setShowForm(false);
    fetchNominals();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus nominal ini?")) return;
    await fetch(`/api/nominals/${id}`, { method: "DELETE" });
    fetchNominals();
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Nominal</h1>
        <button
          onClick={openAdd}
          className="rounded-lg bg-[color:var(--em)] px-4 py-2 text-sm font-bold text-[#04120C] hover:bg-[#33efb0]"
        >
          + Tambah Nominal
        </button>
      </div>

      {/* Game selector */}
      <div className="mt-6 flex flex-wrap gap-2">
        {GAMES.map((g) => (
          <button
            key={g.id}
            onClick={() => setSelectedGame(g.id)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              selectedGame === g.id
                ? "bg-[color:var(--em)]/15 text-[color:var(--em)]"
                : "bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            {g.name}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="mt-6 overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/5 text-left text-xs uppercase tracking-wider text-white/50">
              <th className="px-4 py-3">Urutan</th>
              <th className="px-4 py-3">Label</th>
              <th className="px-4 py-3 text-right">Harga</th>
              <th className="px-4 py-3">Badge/Tag</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-white/40">
                  Memuat...
                </td>
              </tr>
            ) : nominals.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-white/40">
                  Belum ada nominal.
                </td>
              </tr>
            ) : (
              nominals.map((n) => (
                <tr key={n.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="px-4 py-3 text-white/50">{n.sort_order}</td>
                  <td className="px-4 py-3 font-semibold">{n.label}</td>
                  <td className="px-4 py-3 text-right font-semibold text-[color:var(--em)]">
                    Rp {n.value.toLocaleString("id-ID")}
                  </td>
                  <td className="px-4 py-3">
                    {n.tag ? (
                      <span className="inline-block rounded-full bg-[color:var(--em)]/12 px-2 py-0.5 text-xs font-bold uppercase text-[color:var(--em)]">
                        {n.tag}
                      </span>
                    ) : (
                      <span className="text-white/30">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => openEdit(n)}
                      className="mr-2 text-xs text-white/50 hover:text-white"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(n.id)}
                      className="text-xs text-red-400/70 hover:text-red-400"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0E1614] p-6">
            <h2 className="text-lg font-bold">
              {editing ? "Edit Nominal" : "Tambah Nominal"}
            </h2>
            <div className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-white/60">Harga</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={form.value ? formatRupiah(form.value) : ""}
                  onChange={(e) => setForm({ ...form, value: parseRupiah(e.target.value) })}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-[color:var(--em)]"
                  placeholder="Rp 0"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-white/60">Label</label>
                <input
                  type="text"
                  value={form.label}
                  onChange={(e) => setForm({ ...form, label: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-[color:var(--em)]"
                  placeholder="60 Diamond"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-white/60">Badge / Tag</label>
                <select
                  value={form.tag}
                  onChange={(e) => setForm({ ...form, tag: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-[color:var(--em)]"
                >
                  {TAG_OPTIONS.map((t) => (
                    <option key={t} value={t}>
                      {t || "- Tanpa Badge -"}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-white/60">Urutan</label>
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-[color:var(--em)]"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="rounded-lg px-4 py-2 text-sm text-white/60 hover:text-white"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.value || !form.label}
                className="rounded-lg bg-[color:var(--em)] px-4 py-2 text-sm font-bold text-[#04120C] hover:bg-[#33efb0] disabled:opacity-50"
              >
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
