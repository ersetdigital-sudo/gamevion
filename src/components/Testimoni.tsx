"use client";

import { useEffect } from "react";

const testimonials = [
  {
    stars: 5,
    quote:
      "Order 1.000 diamond pas rush hour, masuk sebelum match kedua kelar. Nggak perlu bikin akun juga, ini yang bikin nyaman.",
    name: "Rizky A.",
    game: "Mobile Legends",
    city: "Bandung",
    initials: "RA",
    initialsColor: "text-[color:var(--em)]",
    initialsBg: "bg-[color:var(--em)]/15",
  },
  {
    stars: 5,
    quote:
      "Sempat salah masukin server, chat CS jam 1 pagi langsung dibantu koreksi. Jarang nemu yang responsif segini.",
    name: "Dinda P.",
    game: "Genshin Impact",
    city: "Surabaya",
    initials: "DP",
    initialsColor: "text-[color:var(--vio)]",
    initialsBg: "bg-[color:var(--vio)]/20",
  },
  {
    stars: 4,
    quote:
      "Harga UC-nya konsisten, nggak naik-turun aneh. Sekarang tim saya top up rutin di sini tiap season baru.",
    name: "Alvin S.",
    game: "PUBG Mobile",
    city: "Makassar",
    initials: "AS",
    initialsColor: "text-white",
    initialsBg: "bg-white/10",
  },
];

export default function Testimoni() {
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
    <section className="border-y border-white/10 bg-[color:var(--panel)]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="reveal flex flex-wrap items-end justify-between gap-4">
          <h2 className="disp text-3xl font-bold sm:text-4xl">
            <span className="skew">KATA PEMAIN</span>
          </h2>
          <p className="text-sm text-[color:var(--muted)]">
            1.248.903 transaksi sukses sejak GAMEVION dibuka.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.name} className="reveal card rounded-2xl p-6">
              <div className="flex gap-0.5 text-[color:var(--em)]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={i < t.stars ? "" : "opacity-30"}>
                    ★
                  </span>
                ))}
              </div>
              <blockquote className="mt-4 text-sm leading-relaxed text-white/85">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-white/10 pt-4">
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full ${t.initialsBg} text-sm font-bold ${t.initialsColor}`}
                >
                  {t.initials}
                </span>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-[color:var(--muted)]">
                    {t.game} · {t.city}
                  </p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
