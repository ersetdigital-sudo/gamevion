import Link from "next/link";

const navLinks = [
  { label: "Beranda", href: "/" },
  { label: "Semua Game", href: "#games" },
  { label: "Top Up Mobile Legends", href: "/mobile-legends" },
  { label: "Cara Order", href: "#cara-order" },
  { label: "Cek Transaksi", href: "#cek" },
];

const helpLinks = [
  "Pusat Bantuan",
  "Syarat & Ketentuan",
  "Kebijakan Privasi",
  "Hubungi Support",
];

const paymentMethods = [
  "QRIS",
  "GoPay",
  "OVO",
  "DANA",
  "ShopeePay",
  "BCA Virtual Account",
  "BRI",
  "Mandiri",
  "Alfamart",
  "Indomaret",
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-16 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <img
              src="/logo.png"
              alt="GAMEVION"
              className="block h-[28px] w-auto"
            />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[color:var(--muted)]">
              GAMEVION adalah layanan top up game dan voucher digital. Tanpa
              sistem akun — cukup User ID, pilih nominal, dan lanjut main.
            </p>
            <div className="mt-5 flex gap-2">
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-white/70 hover:border-[color:var(--em)]/50 hover:text-[color:var(--em)]"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="TikTok"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-white/70 hover:border-[color:var(--em)]/50 hover:text-[color:var(--em)]"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16.5 3h-2.7v11.2a2.5 2.5 0 1 1-2.5-2.5c.2 0 .4 0 .6.1V9.1a5.2 5.2 0 1 0 4.6 5.1V8.6a5.4 5.4 0 0 0 3.2 1V7a3.3 3.3 0 0 1-3.2-4z" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-white/70 hover:border-[color:var(--em)]/50 hover:text-[color:var(--em)]"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21.6 7.2a2.6 2.6 0 0 0-1.8-1.8C18.1 5 12 5 12 5s-6.1 0-7.8.4A2.6 2.6 0 0 0 2.4 7.2C2 8.9 2 12 2 12s0 3.1.4 4.8a2.6 2.6 0 0 0 1.8 1.8C5.9 19 12 19 12 19s6.1 0 7.8-.4a2.6 2.6 0 0 0 1.8-1.8C22 15.1 22 12 22 12s0-3.1-.4-4.8M10 15.5v-7l6 3.5z" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="WhatsApp"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-white/70 hover:border-[color:var(--em)]/50 hover:text-[color:var(--em)]"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.4A10 10 0 1 0 12 2m4.9 13.4c-.2.6-1.2 1.2-1.7 1.2-.5.1-1 .1-1.7-.2a11 11 0 0 1-5.7-5c-.4-.7-.6-1.4-.4-2 .1-.5.6-1.3 1.1-1.5.3-.1.7-.1.9.1l.9 1.7c.1.3 0 .5-.1.7l-.4.5c-.1.2-.2.4 0 .6.5.9 1.4 1.8 2.4 2.3.2.1.4.1.6-.1l.6-.6c.2-.2.4-.2.6-.1l1.6.9c.3.2.4.5.3.8" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-white/50">
              Navigasi
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-[color:var(--muted)]">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-white/50">
              Bantuan
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-[color:var(--muted)]">
              {helpLinks.map((label) => (
                <li key={label}>
                  <a href="#" className="hover:text-white">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12">
          <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-white/50">
            Metode pembayaran
          </h4>
          <div className="mt-4 flex flex-wrap gap-2">
            {paymentMethods.map((method) => (
              <span
                key={method}
                className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-semibold text-white/75"
              >
                {method}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-[color:var(--muted)] sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 GAMEVION · gamevion.net</p>
          <p>Semua merek dan nama game adalah milik pemegang hak masing-masing.</p>
        </div>
      </div>
    </footer>
  );
}
