import type { Metadata } from "next";
import GamePageClient from "@/components/GamePageClient";

export const metadata: Metadata = {
  title: "Top Up Mobile Legends Termurah — GAMEVION",
  description:
    "Top up Diamond ML langsung ke akun. Proses otomatis, 24 jam.",
  openGraph: {
    title: "Top Up Mobile Legends Termurah — GAMEVION",
    description: "Top up Diamond ML langsung ke akun. Proses otomatis, 24 jam.",
    images: [{ url: "/og-mobile-legends.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Top Up Mobile Legends Termurah — GAMEVION",
    description: "Top up Diamond ML langsung ke akun. Proses otomatis, 24 jam.",
    images: ["/og-mobile-legends.png"],
  },
};

const NOMINALS = [
  { value: 1500, label: "5 Diamond" },
  { value: 3400, label: "12 Diamond" },
  { value: 7900, label: "28 Diamond" },
  { value: 12300, label: "44 Diamond", tag: "LARIS" },
  { value: 16500, label: "59 Diamond" },
  { value: 23500, label: "85 Diamond" },
  { value: 46500, label: "170 Diamond", tag: "HEMAT" },
  { value: 65000, label: "240 Diamond" },
  { value: 80000, label: "296 Diamond" },
  { value: 152000, label: "568 Diamond" },
  { value: 233000, label: "875 Diamond" },
  { value: 28000, label: "Weekly Diamond Pass", tag: "POPULER" },
];

const ACCOUNT_FIELDS = [
  { label: "User ID", placeholder: "Contoh: 123456789", type: "text" },
  { label: "Zone ID", placeholder: "Contoh: 2345", type: "text" },
];

export default function MobileLegendsPage() {
  return (
    <GamePageClient
      gameId="mobile-legends"
      gameName="Mobile Legends"
      developer="Moonton"
      badge="BEST SELLER"
      description="Top up Diamond langsung ke akun game. Tanpa registrasi, tanpa login."
      backgroundImage="/images/602df167-7ace-40bc-bf94-069fdea17603.png"
      gameIcon="/images/65bfc705-5c40-4680-a896-abc1cb7bb978.svg"
      tags={[
        "Proses otomatis",
        "Layanan 24 jam",
        "9 metode pembayaran",
        "Garansi refund bila gagal",
      ]}
      accountFields={ACCOUNT_FIELDS}
      nominals={NOMINALS}
      defaultItem="5 Diamond"
      defaultPrice={1500}
    />
  );
}
