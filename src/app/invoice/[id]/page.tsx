"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PaymentInstructions from "@/components/PaymentInstructions";

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

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  Menunggu: {
    label: "Menunggu Pembayaran",
    color: "text-amber-400",
    bg: "bg-amber-500/15 border-amber-500/30",
    icon: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  Diproses: {
    label: "Sedang Diproses",
    color: "text-blue-400",
    bg: "bg-blue-500/15 border-blue-500/30",
    icon: "M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182",
  },
  Berhasil: {
    label: "Pembayaran Berhasil",
    color: "text-emerald-400",
    bg: "bg-emerald-500/15 border-emerald-500/30",
    icon: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  Gagal: {
    label: "Pembayaran Gagal",
    color: "text-red-400",
    bg: "bg-red-500/15 border-red-500/30",
    icon: "M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z",
  },
};

export default function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);
  const [invoiceId, setInvoiceId] = useState("");
  const [qrImageUrl, setQrImageUrl] = useState<string | null>(null);

  useEffect(() => {
    params.then((p) => setInvoiceId(p.id));
  }, [params]);

  const fetchOrder = useCallback(async () => {
    if (!invoiceId) return;
    try {
      const res = await fetch(`/api/orders?invoice=${encodeURIComponent(invoiceId)}`);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setOrder(data[0]);
        setNotFound(false);
        // Fetch QR image URL for this payment method
        const pmRes = await fetch(`/api/payment-methods?all=true`);
        const pmData = await pmRes.json();
        const pm = Array.isArray(pmData)
          ? pmData.find((m: { name: string }) => m.name === data[0].payment_method)
          : null;
        setQrImageUrl(pm?.qr_image_url || null);
      } else {
        setNotFound(true);
      }
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [invoiceId]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  // Polling: refresh status setiap 10 detik selama status masih Menunggu/Diproses
  useEffect(() => {
    if (!order || !["Menunggu", "Diproses"].includes(order.status)) return;
    const interval = setInterval(fetchOrder, 10000);
    return () => clearInterval(interval);
  }, [order, fetchOrder]);

  const copyInvoice = () => {
    if (order?.invoice) {
      navigator.clipboard.writeText(order.invoice);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 rounded bg-white/10" />
            <div className="h-32 rounded-2xl bg-white/5" />
            <div className="h-48 rounded-2xl bg-white/5" />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (notFound || !order) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
          <div className="card rounded-2xl p-8">
            <svg className="mx-auto h-16 w-16 text-[color:var(--muted)]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <h1 className="mt-4 text-xl font-bold">Invoice Tidak Ditemukan</h1>
            <p className="mt-2 text-sm text-[color:var(--muted)]">
              Invoice dengan ID <span className="font-mono font-semibold text-white">{invoiceId}</span> tidak ditemukan.
            </p>
            <Link
              href="/cek-transaksi"
              className="mt-6 inline-block rounded-xl bg-[color:var(--em)] px-6 py-3 text-sm font-bold text-[#04120C] hover:bg-[#33efb0]"
            >
              Cek Transaksi Lain
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.Menunggu;

  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        {/* Status Badge */}
        <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${status.bg}`}>
          <svg className={`h-6 w-6 ${status.color}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d={status.icon} />
          </svg>
          <span className={`text-sm font-bold ${status.color}`}>{status.label}</span>
        </div>

        {/* Invoice Number */}
        <div className="mt-6">
          <p className="text-xs text-[color:var(--muted)]">Nomor Invoice</p>
          <div className="mt-1 flex items-center gap-3">
            <h1 className="font-mono text-2xl font-bold tracking-wide text-white sm:text-3xl">
              {order.invoice}
            </h1>
            <button
              onClick={copyInvoice}
              className="shrink-0 rounded-lg border border-white/10 p-2 text-[color:var(--muted)] transition-colors hover:bg-white/5 hover:text-white"
              title="Salin invoice"
            >
              {copied ? (
                <svg className="h-5 w-5 text-[color:var(--em)]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
          {/* Left: Ringkasan */}
          <div className="space-y-6">
            <div className="card rounded-2xl p-5 sm:p-6">
              <h2 className="text-base font-bold">Ringkasan Pesanan</h2>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-[color:var(--muted)]">Game</dt>
                  <dd className="text-right font-semibold">{order.game_name}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[color:var(--muted)]">Item</dt>
                  <dd className="text-right font-semibold">{order.item_name}</dd>
                </div>
                {order.account_id && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-[color:var(--muted)]">ID Akun</dt>
                    <dd className="font-mono text-right text-xs">
                      {order.account_id}
                      {order.account_zone && ` (${order.account_zone})`}
                    </dd>
                  </div>
                )}
                <div className="flex justify-between gap-4">
                  <dt className="text-[color:var(--muted)]">Metode Bayar</dt>
                  <dd className="text-right font-semibold">{order.payment_method}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[color:var(--muted)]">No. HP</dt>
                  <dd className="text-right font-semibold">{order.customer_phone}</dd>
                </div>
                <div className="flex justify-between gap-4 border-t border-white/10 pt-3">
                  <dt className="text-[color:var(--muted)]">Total</dt>
                  <dd className="text-right text-xl font-bold text-[color:var(--em)]">
                    Rp {order.total_price?.toLocaleString("id-ID")}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Footer info */}
            <div className="card rounded-2xl p-5">
              <p className="text-xs leading-relaxed text-[color:var(--muted)]">
                Pastikan ID akun sudah benar. Item yang sudah dikirim ke ID yang
                salah tidak dapat ditarik kembali.
              </p>
              <Link
                href={`/cek-transaksi?q=${order.invoice}`}
                className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-[color:var(--em)] hover:underline"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                Cek Status Transaksi
              </Link>
            </div>
          </div>

          {/* Right: Payment Instructions */}
          <div>
            <PaymentInstructions
              method={order.payment_method}
              invoice={order.invoice}
              amount={order.total_price}
              qrImageUrl={qrImageUrl}
            />

            {/* Countdown timer (simplified) */}
            {["Menunggu", "Diproses"].includes(order.status) && (
              <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-center">
                <p className="text-xs text-amber-400/80">
                  Selesaikan pembayaran dalam waktu{" "}
                  <span className="font-bold text-amber-400">30 menit</span>
                </p>
                <p className="mt-1 text-[10px] text-[color:var(--muted)]">
                  Pesanan otomatis dibatalkan jika pembayaran tidak diterima.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
