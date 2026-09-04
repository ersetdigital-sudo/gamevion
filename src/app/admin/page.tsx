"use client";

import { useEffect, useState } from "react";

interface Stats {
  totalOrders: number;
  successOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalCategories: number;
  pendingOrders: number;
}

interface Order {
  id: string;
  invoice: string;
  game_name: string;
  item_name: string;
  total_price: number;
  status: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0, successOrders: 0, totalRevenue: 0,
    totalProducts: 0, totalCategories: 0, pendingOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [ordersRes, productsRes, categoriesRes] = await Promise.all([
        fetch("/api/orders"),
        fetch("/api/products?all=true"),
        fetch("/api/categories"),
      ]);

      const orders = await ordersRes.json();
      const products = await productsRes.json();
      const categories = await categoriesRes.json();

      const allOrders = Array.isArray(orders) ? orders : [];

      setStats({
        totalOrders: allOrders.length,
        successOrders: allOrders.filter((o: Order) => o.status === "Berhasil").length,
        totalRevenue: allOrders.filter((o: Order) => o.status === "Berhasil").reduce((sum: number, o: Order) => sum + (o.total_price || 0), 0),
        totalProducts: Array.isArray(products) ? products.length : 0,
        totalCategories: Array.isArray(categories) ? categories.length : 0,
        pendingOrders: allOrders.filter((o: Order) => o.status === "Menunggu").length,
      });
      setRecentOrders(allOrders.slice(0, 5));
      setLoading(false);
    }
    loadData();
  }, []);

  const CARDS = [
    { label: "Total Pesanan", value: stats.totalOrders, color: "text-white" },
    { label: "Berhasil", value: stats.successOrders, color: "text-emerald-400" },
    { label: "Menunggu", value: stats.pendingOrders, color: "text-amber-400" },
    { label: "Total Pendapatan", value: `Rp ${stats.totalRevenue.toLocaleString("id-ID")}`, color: "text-[color:var(--em)]" },
    { label: "Total Produk", value: stats.totalProducts, color: "text-white" },
    { label: "Total Kategori", value: stats.totalCategories, color: "text-white" },
  ];

  const STATUS_COLORS: Record<string, string> = {
    Berhasil: "bg-emerald-500/20 text-emerald-400",
    Diproses: "bg-blue-500/20 text-blue-400",
    Menunggu: "bg-amber-500/20 text-amber-400",
    Gagal: "bg-red-500/20 text-red-400",
  };

  return (
    <div>
      <h1 className="disp text-2xl font-bold">Dashboard</h1>
      <p className="mt-1 text-sm text-gray-400">Overview data GAMEVION</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map((card) => (
          <div key={card.label} className="rounded-xl border border-white/10 bg-[#131E1B] p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{card.label}</p>
            <p className={`mt-2 disp text-2xl font-bold ${card.color}`}>{loading ? "..." : card.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="disp text-lg font-bold">Pesanan Terbaru</h2>
        <div className="mt-4 overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-[#131E1B]">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Invoice</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Game</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Item</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Total</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Waktu</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">Loading...</td></tr>
              ) : recentOrders.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">Belum ada pesanan</td></tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="px-4 py-3 font-mono text-xs">{order.invoice}</td>
                    <td className="px-4 py-3">{order.game_name}</td>
                    <td className="px-4 py-3">{order.item_name}</td>
                    <td className="px-4 py-3 text-[color:var(--em)]">Rp {order.total_price?.toLocaleString("id-ID")}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-md px-2 py-1 text-xs font-semibold ${STATUS_COLORS[order.status] || ""}`}>{order.status}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">
                      {new Date(order.created_at).toLocaleDateString("id-ID")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}