"use client";

import Link from "next/link";

interface GameLink {
  name: string;
  developer: string;
  href: string;
  image: string;
}

interface OrderSidebarProps {
  gameName: string;
  defaultItem: string;
  defaultPrice: number;
  currentItem?: string;
  currentPayment?: string;
  currentPrice?: number;
}

const OTHER_GAMES: GameLink[] = [
  {
    name: "Mobile Legends",
    developer: "Moonton",
    href: "/mobile-legends",
    image: "/images/602df167-7ace-40bc-bf94-069fdea17603.png",
  },
  {
    name: "Free Fire",
    developer: "Garena",
    href: "/free-fire",
    image: "/images/849e27b6-18a9-49b0-a8fb-d94761a7285b.png",
  },
  {
    name: "PUBG Mobile",
    developer: "Level Infinite",
    href: "/pubg-mobile",
    image: "/images/12af396c-da57-4a23-b13b-16c4d480adc2.png",
  },
  {
    name: "Genshin Impact",
    developer: "HoYoverse",
    href: "/genshin-impact",
    image: "/images/4a402c7a-ca2f-4433-b935-16b26e740ab9.png",
  },
  {
    name: "Magic Chess: Go Go",
    developer: "Moonton",
    href: "/magic-chess-go-go",
    image: "/images/90841904-8491-403e-a9f5-c8f53b796a8d.png",
  },
  {
    name: "Call of Duty Mobile",
    developer: "Activision",
    href: "/call-of-duty-mobile",
    image: "/images/e8937151-775d-48a3-9abe-c4d7aa28cb03.png",
  },
];

export default function OrderSidebar({
  gameName,
  defaultItem,
  defaultPrice,
  currentItem,
  currentPayment,
  currentPrice,
}: OrderSidebarProps) {
  const item = currentItem || defaultItem;
  const payment = currentPayment || "QRIS";
  const price = currentPrice || defaultPrice;

  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
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
      </div>

      <div className="mt-4 space-y-2">
        <h3 className="px-1 text-xs font-bold uppercase tracking-[.18em] text-white/50">
          Game lainnya
        </h3>
        {OTHER_GAMES.map((game) => (
          <Link
            key={game.href}
            href={game.href}
            className="card group flex items-center gap-3 rounded-xl p-2.5 hover:border-[color:var(--em)]/45"
          >
            <div className="h-12 w-10 shrink-0 overflow-hidden rounded-lg bg-[color:var(--panel-2)]">
              <img
                src={game.image}
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{game.name}</p>
              <p className="text-[11px] text-[color:var(--muted)]">
                {game.developer}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </aside>
  );
}
