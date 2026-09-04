"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface Game {
  id: string;
  name: string;
  slug: string;
  developer: string;
  image_url: string;
  icon_url: string;
  badge: string;
  badge_color: string;
  subtitle: string;
  sort_order: number;
  products: { price: number }[];
}

const BADGE_COLORS: Record<string, { bg: string; text: string }> = {
  emerald: { bg: "bg-[color:var(--em)]", text: "text-[#04120C]" },
  violet: { bg: "bg-[color:var(--vio)]", text: "text-white" },
  white: { bg: "bg-white", text: "text-[#04120C]" },
};

export default function GamesGrid() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => {
        setGames(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (loading || games.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll("#games .reveal").forEach((el, i) => {
      (el as HTMLElement).style.transitionDelay = `${(i % 4) * 70}ms`;
      io.observe(el);
    });
    return () => io.disconnect();
  }, [loading, games]);

  if (loading) {
    return (
      <section id="games" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="disp text-3xl font-bold sm:text-4xl">
              <span className="skew">GAME POPULER</span>
            </h2>
            <p className="mt-2 text-sm text-[color:var(--muted)]">
              Enam judul yang paling sering di-top up minggu ini.
            </p>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="animate-pulse rounded-2xl bg-[#131E1B]">
              <div className="aspect-square bg-white/5" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-white/10 rounded w-1/2" />
                <div className="h-3 bg-white/10 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="games" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="reveal flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="disp text-3xl font-bold sm:text-4xl">
            <span className="skew">GAME POPULER</span>
          </h2>
          <p className="mt-2 text-sm text-[color:var(--muted)]">
            Enam judul yang paling sering di-top up minggu ini.
          </p>
        </div>
        <Link
          href="/mobile-legends"
          className="rounded-xl border border-white/12 px-4 py-2.5 text-sm font-semibold text-white/80 hover:bg-white/5"
        >
          Mulai dari Mobile Legends
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
        {games.map((game) => {
          const minPrice = game.products?.[0]?.price || 0;
          const badgeStyle = game.badge ? BADGE_COLORS[game.badge_color] || BADGE_COLORS.emerald : null;

          return (
            <Link
              key={game.id}
              href={`/${game.slug}`}
              className="tile card group relative overflow-hidden rounded-2xl reveal"
            >
              {game.badge && badgeStyle && (
                <span
                  className={`absolute left-3 top-3 z-10 rounded-md ${badgeStyle.bg} px-2 py-1 text-[10px] font-extrabold tracking-wider ${badgeStyle.text}`}
                >
                  {game.badge}
                </span>
              )}
              <div className="relative aspect-square overflow-hidden bg-black/40">
                <Image
                  src={game.image_url}
                  alt={game.name}
                  fill
                  className="object-cover object-center"
                  loading="lazy"
                />
                {game.icon_url && (
                  <>
                    <div className="pointer-events-none absolute inset-0 bg-black/35" />
                    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1 px-2 text-center drop-shadow-[0_2px_6px_rgba(0,0,0,.85)]">
                      <Image
                        src={game.icon_url}
                        alt=""
                        width={64}
                        height={64}
                        className="h-12 w-12 sm:h-16 sm:w-16 rounded-xl object-contain"
                      />
                      <p className="disp text-[24px] sm:text-[33px] font-bold uppercase leading-[0.95] tracking-tight text-white">
                        {game.name}
                      </p>
                      {game.subtitle && (
                        <p className="text-[9px] sm:text-[12px] font-bold uppercase leading-none tracking-[0.4em] text-white/85">
                          {game.subtitle}
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
              <div className="border-t border-white/10 p-3 sm:p-4">
                <h3 className="text-sm font-bold sm:text-base">{game.name}</h3>
                <p className="mt-0.5 text-[11px] text-[color:var(--muted)] sm:text-xs">
                  {game.developer}
                </p>
                <p className="mt-2 text-xs text-[color:var(--muted)]">
                  Mulai dari{" "}
                  <span className="font-bold text-[color:var(--em)]">
                    Rp {minPrice.toLocaleString("id-ID")}
                  </span>
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}