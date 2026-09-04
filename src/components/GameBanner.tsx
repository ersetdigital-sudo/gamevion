"use client";

import Link from "next/link";

interface GameBannerProps {
  backgroundImage: string;
  gameIcon: string;
  gameName: string;
  developer: string;
  tags: string[];
  description: string;
  badge?: string;
}

export default function GameBanner({
  backgroundImage,
  gameIcon,
  gameName,
  developer,
  tags,
  description,
  badge,
}: GameBannerProps) {
  return (
    <section className="relative overflow-hidden border-b border-white/10">
      <img
        src={backgroundImage}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-20 blur-md"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#070B0A] via-[#070B0A]/85 to-[#070B0A]/60" />
      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        <nav className="text-xs text-[color:var(--muted)]">
          <Link href="/" className="hover:text-white">
            Beranda
          </Link>{" "}
          <span className="px-1">/</span>{" "}
          <Link href="/#games" className="hover:text-white">
            Semua Game
          </Link>{" "}
          <span className="px-1">/</span>{" "}
          <span className="text-white/80">{gameName}</span>
        </nav>
        <div className="mt-5 flex items-end gap-4 sm:gap-6">
          <div className="relative shrink-0">
            <div className="relative h-28 w-24 overflow-hidden rounded-2xl border border-white/12 sm:h-36 sm:w-28">
              <img
                src={backgroundImage}
                alt={gameName}
                className="h-full w-full object-cover object-[50%_16%]"
              />
              <div className="pointer-events-none absolute inset-0 bg-black/35" />
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-0.5 px-2 text-center drop-shadow-[0_2px_6px_rgba(0,0,0,.85)]">
                <img
                  src={gameIcon}
                  alt=""
                  className="h-8 w-8 sm:h-11 sm:w-11 rounded-lg object-contain"
                />
                <p className="disp text-[13px] sm:text-[17px] font-bold uppercase leading-[0.95] tracking-tight text-white">
                  {gameName.split(":")[0]}
                </p>
                {gameName.includes(":") && (
                  <p className="text-[6px] sm:text-[8px] font-bold uppercase leading-none tracking-[.35em] text-white/85">
                    {gameName.split(":")[1]?.trim()}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="pb-1">
            <div className="flex flex-wrap items-center gap-2">
              {badge && (
                <span className="rounded-md bg-[color:var(--em)] px-2 py-1 text-[10px] font-extrabold tracking-wider text-[#04120C]">
                  {badge}
                </span>
              )}
              <span className="rounded-md border border-white/12 px-2 py-1 text-[10px] font-bold tracking-wider text-white/70">
                {developer}
              </span>
            </div>
            <h1 className="disp mt-2 text-2xl font-bold leading-tight sm:text-4xl">
              <span className="skew">{gameName.toUpperCase()}</span>
            </h1>
            <p className="mt-2 text-sm text-[color:var(--muted)]">
              {description}
            </p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-2 text-[11px] font-semibold">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-lg border border-white/10 bg-white/[.04] px-3 py-1.5 text-white/80"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
