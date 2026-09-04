"use client";

import { useEffect } from "react";

const steps = [
  {
    number: "01",
    title: "Pilih Game",
    description:
      "Cari lewat search bar atau langsung tap kartu game di grid.",
  },
  {
    number: "02",
    title: "Pilih Nominal",
    description:
      "Masukkan User ID dan server, lalu pilih paket diamond atau voucher.",
  },
  {
    number: "03",
    title: "Bayar",
    description:
      "QRIS, e-wallet, transfer bank, atau gerai retail — pilih yang paling gampang.",
  },
  {
    number: "04",
    title: "Item Masuk",
    description:
      "Item dikirim ke akun game-mu dan bukti order dikirim via WhatsApp/email.",
  },
];

export default function CaraOrder() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section id="cara-order" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="reveal max-w-xl">
        <h2 className="disp text-3xl font-bold sm:text-4xl">
          <span className="skew">CARA ORDER</span>
        </h2>
        <p className="mt-2 text-sm text-[color:var(--muted)]">
          Empat langkah, tanpa registrasi akun.
        </p>
      </div>

      <div className="relative mt-10">
        <div className="glow-line absolute left-0 right-0 top-7 hidden h-px lg:block" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {steps.map((step) => (
            <div key={step.number} className="reveal relative">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[color:var(--em)]/40 bg-[#070B0A] disp text-xl font-bold text-[color:var(--em)]">
                {step.number}
              </div>
              <h3 className="mt-4 text-base font-bold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[color:var(--muted)]">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Cek Transaksi */}
      <div id="cek" className="reveal card mt-12 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-md">
            <h3 className="disp text-xl font-bold sm:text-2xl">
              Cek Transaksi
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[color:var(--muted)]">
              Masukkan ID order atau nomor WhatsApp yang kamu pakai saat
              checkout untuk melihat status pesanan.
            </p>
          </div>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex w-full max-w-xl flex-col gap-3 sm:flex-row"
          >
            <input
              type="text"
              placeholder="Contoh: GVN-84021 atau 08xxxxxxxxxx"
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm outline-none placeholder-white/35 focus:border-[color:var(--em)]"
            />
            <button
              type="submit"
              className="shrink-0 rounded-xl bg-[color:var(--em)] px-6 py-3.5 text-sm font-bold text-[#04120C] hover:bg-[#33efb0]"
            >
              Cek Status
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
