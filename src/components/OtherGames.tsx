"use client";

import Link from "next/link";

interface GameLink {
  name: string;
  developer: string;
  href: string;
  image: string;
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

interface OtherGamesProps {
  currentGame?: string;
}

export default function OtherGames({ currentGame }: OtherGamesProps) {
  const games = OTHER_GAMES.filter(
    (g) => g.name.toLowerCase() !== currentGame?.toLowerCase()
  );

  return (
    <section className="mt-10">
      <h3 className="disp text-lg font-bold sm:text-xl">Game Lainnya</h3>
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {games.map((game) => (
          <Link
            key={game.href}
            href={game.href}
            className="card group flex items-center gap-3 rounded-xl p-3 transition-colors hover:border-[color:var(--em)]/45 sm:p-3.5"
          >
            <div className="h-14 w-12 shrink-0 overflow-hidden rounded-lg bg-[color:var(--panel-2)] sm:h-16 sm:w-14">
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
    </section>
  );
}
