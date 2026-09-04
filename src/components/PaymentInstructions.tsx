"use client";

interface PaymentInstructionsProps {
  method: string;
  invoice: string;
  amount: number;
  qrImageUrl?: string | null;
}

export default function PaymentInstructions({
  method,
  invoice,
  amount,
  qrImageUrl,
}: PaymentInstructionsProps) {
  const m = method.toLowerCase();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // QRIS
  if (m.includes("qris")) {
    return (
      <div className="card rounded-2xl p-5 sm:p-6">
        <h3 className="text-base font-bold">Instruksi Pembayaran</h3>
        <p className="mt-1 text-xs text-[color:var(--muted)]">
          Scan QRIS di bawah ini menggunakan e-wallet atau m-banking apapun.
        </p>
        <div className="mt-5 flex flex-col items-center">
          {qrImageUrl ? (
            <div className="flex h-48 w-48 items-center justify-center rounded-2xl border border-white/10 bg-white p-4">
              <img
                src={qrImageUrl}
                alt="QRIS Code"
                className="h-full w-full object-contain"
              />
            </div>
          ) : (
            <div className="flex h-48 w-48 flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 bg-white/[0.03] p-4">
              <svg className="h-10 w-10 text-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <p className="mt-2 text-center text-xs text-gray-400">QR belum tersedia. Hubungi admin.</p>
            </div>
          )}
          <p className="mt-3 text-center text-xs text-[color:var(--muted)]">
            Buka GoPay, DANA, OVO, ShopeePay, LinkAja, atau m-banking lalu
            pilih &quot;Scan QR&quot;.
          </p>
        </div>
      </div>
    );
  }

  // E-Wallet (GoPay, DANA, OVO, ShopeePay)
  if (m.includes("gopay") || m.includes("dana") || m.includes("ovo") || m.includes("shopeepay") || m.includes("linkaja")) {
    const name = method;
    const deeplinks: Record<string, string> = {
      gopay: "gopay://",
      dana: "dana://",
      ovo: "ovo://",
      shopeepay: "shopeepay://",
      linkaja: "linkaja://",
    };
    const linkKey = Object.keys(deeplinks).find((k) => m.includes(k)) || "";
    return (
      <div className="card rounded-2xl p-5 sm:p-6">
        <h3 className="text-base font-bold">Instruksi Pembayaran</h3>
        <p className="mt-1 text-xs text-[color:var(--muted)]">
          Bayar menggunakan {name}.
        </p>
        <div className="mt-5 space-y-3">
          <a
            href={deeplinks[linkKey] || "#"}
            className="block w-full rounded-xl bg-[color:var(--em)] py-3 text-center text-sm font-bold text-[#04120C] transition-colors hover:bg-[#33efb0]"
          >
            Buka Aplikasi {name}
          </a>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs font-semibold text-white/70">Atau bayar manual:</p>
            <ol className="mt-2 space-y-1 text-xs text-[color:var(--muted)]">
              <li>1. Buka aplikasi {name}</li>
              <li>2. Pilih &quot;Bayar&quot; atau &quot;Scan&quot;</li>
              <li>3. Masukkan nominal <span className="font-semibold text-white">Rp {amount.toLocaleString("id-ID")}</span></li>
              <li>4. Masukkan kode: <span className="font-mono font-semibold text-white">{invoice}</span></li>
              <li>5. Konfirmasi pembayaran</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  // Virtual Account (BCA, Mandiri, BNI, BRI, etc.)
  if (m.includes("virtual") || m.includes("va") || m.includes("bca") || m.includes("mandiri") || m.includes("bni") || m.includes("bri")) {
    const vaNumber = `8808${invoice.replace("GVN-", "").replace("-", "")}`;
    const bankName = m.includes("bca") ? "BCA" : m.includes("mandiri") ? "Mandiri" : m.includes("bni") ? "BNI" : m.includes("bri") ? "BRI" : "Virtual Account";
    return (
      <div className="card rounded-2xl p-5 sm:p-6">
        <h3 className="text-base font-bold">Instruksi Pembayaran</h3>
        <p className="mt-1 text-xs text-[color:var(--muted)]">
          Transfer ke {bankName} Virtual Account.
        </p>
        <div className="mt-5 space-y-4">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center">
            <p className="text-xs text-[color:var(--muted)]">Nomor Virtual Account</p>
            <p className="mt-1 font-mono text-2xl font-bold tracking-wider text-white">
              {vaNumber}
            </p>
            <button
              onClick={() => copyToClipboard(vaNumber)}
              className="mt-2 rounded-lg border border-white/10 px-3 py-1 text-xs text-[color:var(--muted)] hover:bg-white/5"
            >
              Salin
            </button>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs font-semibold text-white/70">Cara bayar:</p>
            <ol className="mt-2 space-y-1 text-xs text-[color:var(--muted)]">
              <li>1. Buka aplikasi m-banking {bankName}</li>
              <li>2. Pilih &quot;Transfer&quot; &gt; &quot;Virtual Account&quot;</li>
              <li>3. Masukkan nomor VA di atas</li>
              <li>4. Pastikan nominal <span className="font-semibold text-white">Rp {amount.toLocaleString("id-ID")}</span> sudah benar</li>
              <li>5. Konfirmasi dan selesaikan pembayaran</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  // Retail (Alfamart, Indomaret)
  if (m.includes("alfamart") || m.includes("indomaret") || m.includes("retail")) {
    const payCode = invoice.replace("GVN-", "");
    return (
      <div className="card rounded-2xl p-5 sm:p-6">
        <h3 className="text-base font-bold">Instruksi Pembayaran</h3>
        <p className="mt-1 text-xs text-[color:var(--muted)]">
          Bayar di {m.includes("alfamart") ? "Alfamart" : "Indomaret"} terdekat.
        </p>
        <div className="mt-5 space-y-4">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center">
            <p className="text-xs text-[color:var(--muted)]">Kode Pembayaran</p>
            <p className="mt-1 font-mono text-2xl font-bold tracking-wider text-white">
              {payCode}
            </p>
            <button
              onClick={() => copyToClipboard(payCode)}
              className="mt-2 rounded-lg border border-white/10 px-3 py-1 text-xs text-[color:var(--muted)] hover:bg-white/5"
            >
              Salin
            </button>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs font-semibold text-white/70">Cara bayar:</p>
            <ol className="mt-2 space-y-1 text-xs text-[color:var(--muted)]">
              <li>1. Datang ke kasir {m.includes("alfamart") ? "Alfamart" : "Indomaret"}</li>
              <li>2. Sebutkan ingin bayar <span className="font-semibold text-white">Game Top Up</span></li>
              <li>3. Tunjukkan/kasir kode: <span className="font-mono font-semibold text-white">{payCode}</span></li>
              <li>4. Bayar sejumlah <span className="font-semibold text-white">Rp {amount.toLocaleString("id-ID")}</span></li>
              <li>5. Simpan struk sebagai bukti</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  // Default / Transfer Bank
  return (
    <div className="card rounded-2xl p-5 sm:p-6">
      <h3 className="text-base font-bold">Instruksi Pembayaran</h3>
      <p className="mt-1 text-xs text-[color:var(--muted)]">
        Selesaikan pembayaran melalui {method}.
      </p>
      <div className="mt-5 space-y-4">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center">
          <p className="text-xs text-[color:var(--muted)]">Kode Pembayaran</p>
          <p className="mt-1 font-mono text-2xl font-bold tracking-wider text-white">
            {invoice}
          </p>
          <button
            onClick={() => copyToClipboard(invoice)}
            className="mt-2 rounded-lg border border-white/10 px-3 py-1 text-xs text-[color:var(--muted)] hover:bg-white/5"
          >
            Salin
          </button>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs font-semibold text-white/70">Cara bayar:</p>
          <ol className="mt-2 space-y-1 text-xs text-[color:var(--muted)]">
            <li>1. Buka aplikasi m-banking atau kunjungi ATM</li>
            <li>2. Pilih Transfer dan masukkan kode di atas</li>
            <li>3. Pastikan nominal <span className="font-semibold text-white">Rp {amount.toLocaleString("id-ID")}</span> sudah benar</li>
            <li>4. Selesaikan pembayaran</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
