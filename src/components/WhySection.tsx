"use client";

import { useEffect } from "react";

const features = [
  {
    title: "Proses Cepat",
    description:
      "Order diteruskan otomatis ke server game begitu pembayaran terkonfirmasi.",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2 4.5 13.5H11l-1 8.5L19.5 10H13z" />
      </svg>
    ),
  },
  {
    title: "Harga Kompetitif",
    description:
      "Harga transparan di halaman produk. Tidak ada biaya tersembunyi saat checkout.",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v18" />
        <path d="M17 7H9.5a2.5 2.5 0 0 0 0 5H14a2.5 2.5 0 0 1 0 5H6" />
      </svg>
    ),
  },
  {
    title: "Pembayaran Aman",
    description:
      "Kanal pembayaran resmi dengan enkripsi. Data order tersimpan rapi dan bisa dilacak.",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="10" width="18" height="11" rx="2.5" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </svg>
    ),
  },
  {
    title: "Support 24/7",
    description:
      "Ada kendala order? Chat tim kami kapan saja, dibalas orang sungguhan.",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a3 3 0 0 1-3 3H8l-5 4V6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3z" />
      </svg>
    ),
  },
];

export default function WhySection() {
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
    <section className="relative overflow-hidden border-y border-white/10 bg-[color:var(--panel)]">
      <div className="pointer-events-none absolute -left-24 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-[color:var(--em)]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-[color:var(--vio)]/10 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <h2 className="reveal disp text-3xl font-bold sm:text-4xl">
          <span className="skew">KENAPA PILIH GAMEVION</span>
        </h2>
        <p className="reveal mt-2 max-w-lg text-sm text-[color:var(--muted)]">
          Empat hal yang kami jaga di setiap transaksi.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.title} className="reveal card rounded-2xl p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[color:var(--em)]/12 text-[color:var(--em)]">
                {feature.icon}
              </div>
              <h3 className="mt-4 text-base font-bold">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[color:var(--muted)]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
