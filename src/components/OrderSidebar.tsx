"use client";

interface OrderSidebarProps {
  gameName: string;
  defaultItem: string;
  defaultPrice: number;
  currentItem?: string;
  currentPayment?: string;
  currentPrice?: number;
  submitting?: boolean;
  onSubmit?: () => void;
}

export default function OrderSidebar({
  gameName,
  defaultItem,
  defaultPrice,
  currentItem,
  currentPayment,
  currentPrice,
  submitting,
  onSubmit,
}: OrderSidebarProps) {
  const item = currentItem || defaultItem;
  const payment = currentPayment || "QRIS";
  const price = currentPrice || defaultPrice;

  return (
    <div className="lg:sticky lg:top-24 lg:self-start">
      <div className="card rounded-2xl p-5">
        <h2 className="disp text-lg font-bold">Ringkasan Pesanan</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-[color:var(--muted)]">Game</dt>
            <dd className="text-right font-semibold">{gameName}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-[color:var(--muted)]">Item</dt>
            <dd id="sumItem" className="text-right font-semibold">
              {item}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-[color:var(--muted)]">Pembayaran</dt>
            <dd id="sumPay" className="text-right font-semibold">
              {payment}
            </dd>
          </div>
          <div className="flex justify-between gap-4 border-t border-white/10 pt-3">
            <dt className="text-[color:var(--muted)]">Total</dt>
            <dd
              id="sumTotal"
              className="disp text-right text-xl font-bold text-[color:var(--em)]"
            >
              Rp {price.toLocaleString("id-ID")}
            </dd>
          </div>
        </dl>

        <button
          type="button"
          onClick={onSubmit}
          disabled={submitting || !onSubmit}
          className="mt-5 w-full rounded-xl bg-[color:var(--em)] px-5 py-3.5 text-sm font-bold text-[#04120C] transition-colors hover:bg-[#33efb0] disabled:opacity-50"
        >
          {submitting ? "Memproses..." : "Pesan Sekarang"}
        </button>
      </div>
    </div>
  );
}
