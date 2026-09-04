"use client";

import { useEffect, useState } from "react";

interface Order {
  id: string;
  invoice: string;
  game_name: string;
  item_name: string;
  account_id: string;
  account_zone: string;
  payment_method: string;
  customer_phone: string;
  total_price: number;
  status: string;
  notes: string;
  created_at: string;
}

const STATUS_OPTIONS = ["Menunggu", "Diproses", "Berhasil", "Gagal"];
const STATUS_COLORS: Record<string, string> = {
  Berhasil: "bg-emerald-500/20 text-emerald-400",
  Diproses: "bg-blue-500/20 text-blue-400",
  Menunggu: "bg-amber-500/20 text-amber-400",
  Gagal: "bg-red-500/20 text-red-400",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Semua");
  const [editing, setEditing] = useState<string | null>(null);

  useEffect(() => {
    async function loadOrders() {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
      setLoading(false);
    }
    loadOrders();
  }, []);

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setOrders(orders.map((o) => (o.id === id ? { ...o, status } : o)));
    setEditing(null);
  }

  async function deleteOrder(id: string) {
    if (!confirm("Yakin hapus pesanan ini?")) return;
    await fetch(`/api/orders/${id}`, { method: "DELETE" });
    setOrders(orders.filter((o) => o.id !== id));
  }

  const filtered = filter === "Semua" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="disp text-2xl font-bold">Pesanan</h1>
          <p className="mt-1 text-sm text-gray-400">Kelola semua pesanan masuk</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {["Semua", ...STATUS_OPTIONS].map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${filter === s ? "bg-[color:var(--em)] text-[#04120C]" : "border border-white/10 text-gray-400 hover:bg-white/5"}`}>{s}</button>
        ))}
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-[#131E1B]">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Invoice</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Game</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Item</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Akun</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Bayar</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Total</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-500">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-500">Tidak ada pesanan</td></tr>
            ) : (
              filtered.map((order) => (
                <tr key={order.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="px-4 py-3 font-mono text-xs">{order.invoice}</td>
                  <td className="px-4 py-3">{order.game_name}</td>
                  <td className="px-4 py-3">{order.item_name}</td>
                  <td className="px-4 py-3 font-mono text-xs">{order.account_id}</td>
                  <td className="px-4 py-3 text-xs">{order.payment_method}</td>
                  <td className="px-4 py-3 text-[color:var(--em)]">Rp {order.total_price?.toLocaleString("id-ID")}</td>
                  <td className="px-4 py-3">
                    {editing === order.id ? (
                      <select autoFocus defaultValue={order.status} onChange={(e) => updateStatus(order.id, e.target.value)} onBlur={() => setEditing(null)} className="rounded border border-white/20 bg-[#131E1B] px-2 py-1 text-xs">
                        {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    ) : (
                      <button onClick={() => setEditing(order.id)} className={`rounded-md px-2 py-1 text-xs font-semibold ${STATUS_COLORS[order.status] || ""}`}>{order.status}</button>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => deleteOrder(order.id)} className="text-xs text-red-400 hover:text-red-300">Hapus</button>
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