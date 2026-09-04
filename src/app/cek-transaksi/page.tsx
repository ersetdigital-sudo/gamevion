"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Transaction {
  id: string;
  invoice: string;
  status: string;
  game_name: string;
  item_name: string;
  account_id: string;
  account_zone: string;
  payment_method: string;
  customer_phone: string;
  total_price: number;
  notes: string;
  created_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  Berhasil: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Diproses: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Menunggu: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Gagal: "bg-red-500/20 text-red-400 border-red-500/30",
};

const STATUS_STEPS: Record<string, number> = {
  Menunggu: 1,
  Diproses: 2,
  Berhasil: 4,
  Gagal: 3,
};

const STEPS = ["Pesanan Dibuat", "Pembayaran Diterima", "Item Dikirim", "Selesai"];

export default function CekTransaksiPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Transaction[]>([]);
  const [selected, setSelected] = useState<Transaction | null>(null);
  const [error, setError] = useState(false);
  const [contacts, setContacts] = useState<{ phone_number: string; wa_link: string }[]>([]);

  useEffect(() => {
    fetch("/api/contacts")
      .then((r) => r.json())
      .then((data) => setContacts(data || []))
      .catch(() => {});
  }, []);

  const handleSubmit = async () => {
    const val = query.trim();
    if (!val) return;

    setLoading(true);
    setResults([]);
    setSelected(null);
    setError(false);

    try {
      const isInvoice = val.toUpperCase().startsWith("GVN");
      const url = isInvoice
        ? `/api/orders?invoice=${encodeURIComponent(val)}`
        : `/api/orders?phone=${encodeURIComponent(val)}`;

      const res = await fetch(url);
      const data = await res.json();

      if (res.ok && Array.isArray(data) && data.length > 0) {
        setResults(data);
        if (data.length === 1) {
          setSelected(data[0]);
        }
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const getStepCount = (status: string) => STATUS_STEPS[status] || 0;

  const defaultContact = contacts[0]?.wa_link || "https://wa.me/6281234567890";

  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <h1 className="disp text-3xl font-bold sm:text-4xl">
          <span className="skew">CEK TRANSAKSI</span>
        </h1>
        <p className="mt-2 text-sm text-[color:var(--muted)]">
          Masukkan ID order atau nomor WhatsApp untuk melihat status pesananmu.
        </p>

        {/* Form */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Contoh: GVN-84021 atau 08xxxxxxxxxx"
            className="fld flex-1"
          />
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || !query.trim()}
            className="rounded-xl bg-[color:var(--em)] px-6 py-3 text-sm font-bold text-[#04120C] transition-colors hover:bg-[#33efb0] disabled:opacity-50"
          >
            {loading ? "Mengecek..." : "Cek Status"}
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="mt-8 space-y-4">
            <div className="card animate-pulse rounded-2xl p-6">
              <div className="h-6 w-32 rounded bg-white/10" />
              <div className="mt-4 h-4 w-48 rounded bg-white/10" />
              <div className="mt-3 h-4 w-36 rounded bg-white/10" />
              <div className="mt-6 flex gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-8 flex-1 rounded bg-white/5" />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !selected && !error && results.length === 0 && (
          <div className="mt-12 flex flex-col items-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-[color:var(--panel)]">
              <svg className="h-10 w-10 text-[color:var(--muted)]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <p className="mt-4 text-sm text-[color:var(--muted)]">
              Masukkan ID order atau nomor WhatsApp untuk cek status pesananmu.
            </p>
          </div>
        )}

        {/* Multiple Results */}
        {results.length > 1 && !selected && !loading && (
          <div className="mt-8 space-y-3">
            <p className="text-sm text-[color:var(--muted)]">Ditemukan {results.length} pesanan. Pilih salah satu:</p>
            {results.map((tx) => (
              <button
                key={tx.id}
                onClick={() => setSelected(tx)}
                className="w-full rounded-xl border border-white/10 bg-[color:var(--panel)] p-4 text-left transition-colors hover:bg-[color:var(--panel-2)]"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-mono text-sm font-semibold">{tx.invoice}</p>
                    <p className="text-xs text-[color:var(--muted)]">{tx.game_name} · {tx.item_name}</p>
                  </div>
                  <span className={`rounded-lg border px-2 py-1 text-xs font-bold ${STATUS_COLORS[tx.status] || ""}`}>
                    {tx.status}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="mt-8 rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center">
            <svg className="mx-auto h-10 w-10 text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <p className="mt-3 text-sm font-semibold text-red-400">Transaksi tidak ditemukan</p>
            <p className="mt-1 text-xs text-red-400/70">
              Cek kembali ID order atau nomor WhatsApp yang kamu masukkan.
            </p>
          </div>
        )}

        {/* Result */}
        {selected && !loading && (
          <div className="mt-8 space-y-5">
            {/* Status Badge */}
            <div className="flex items-center gap-3">
              <span className={`rounded-lg border px-3 py-1.5 text-xs font-bold ${STATUS_COLORS[selected.status] || ""}`}>
                {selected.status}
              </span>
              <span className="text-sm text-[color:var(--muted)]">{selected.invoice}</span>
            </div>

            {/* Main Card */}
            <div className="card rounded-2xl p-5 sm:p-6">
              <h2 className="disp text-lg font-bold">Ringkasan Pesanan</h2>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-[color:var(--muted)]">No. Invoice</dt>
                  <dd className="code text-right font-semibold">{selected.invoice}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[color:var(--muted)]">Game</dt>
                  <dd className="text-right font-semibold">{selected.game_name}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[color:var(--muted)]">Item</dt>
                  <dd className="text-right font-semibold">{selected.item_name}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[color:var(--muted)]">Akun Tujuan</dt>
                  <dd className="code text-right text-xs">
                    {selected.account_id}
                    {selected.account_zone && ` (${selected.account_zone})`}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[color:var(--muted)]">Metode Bayar</dt>
                  <dd className="text-right font-semibold">{selected.payment_method}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[color:var(--muted)]">Waktu Order</dt>
                  <dd className="text-right text-xs">
                    {new Date(selected.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })} WIB
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-t border-white/10 pt-3">
                  <dt className="text-[color:var(--muted)]">Total Bayar</dt>
                  <dd className="disp text-right text-xl font-bold text-[color:var(--em)]">
                    Rp {selected.total_price?.toLocaleString("id-ID")}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Timeline */}
            <div className="card rounded-2xl p-5 sm:p-6">
              <h2 className="disp text-lg font-bold">Status Pesanan</h2>
              <div className="mt-8">
                <div className="flex items-start">
                  {STEPS.map((step, i) => {
                    const stepCount = getStepCount(selected.status);
                    const active = i < stepCount;
                    const current = i === stepCount - 1;
                    return (
                      <div key={step} className="flex flex-1 flex-col items-center relative">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-xs font-bold z-10 ${
                          active
                            ? "border-[color:var(--em)] bg-[color:var(--em)] text-[#04120C]"
                            : "border-white/15 bg-[color:var(--panel)] text-[color:var(--muted)]"
                        }`}>
                          {active ? (
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                          ) : (
                            i + 1
                          )}
                        </div>
                        <p className={`mt-2 text-center text-[10px] font-semibold leading-tight sm:text-[11px] ${
                          current ? "text-[color:var(--em)]" : active ? "text-white/80" : "text-[color:var(--muted)]"
                        }`}>
                          {step}
                        </p>
                        {i < STEPS.length - 1 && (
                          <div className={`absolute top-5 left-1/2 h-0.2 w-full ${
                            i < stepCount - 1 ? "bg-[color:var(--em)]" : "bg-white/10"
                          }`} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/"
                className="flex-1 rounded-xl border border-white/12 px-5 py-3 text-center text-sm font-semibold text-white/80 transition-colors hover:bg-white/5"
              >
                Top Up Lagi
              </Link>
              <a
                href={defaultContact}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 rounded-xl bg-[color:var(--em)] px-5 py-3 text-center text-sm font-bold text-[#04120C] transition-colors hover:bg-[#33efb0]"
              >
                Hubungi CS
              </a>
            </div>

            {results.length > 1 && (
              <button
                onClick={() => { setSelected(null); setResults([]); setQuery(""); }}
                className="w-full rounded-xl border border-white/10 px-5 py-3 text-sm text-[color:var(--muted)] hover:bg-white/5"
              >
                Cek Pesanan Lain
              </button>
            )}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}