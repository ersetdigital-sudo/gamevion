import type { Metadata } from "next";
import GamePageClient from "@/components/GamePageClient";
import { getNominals } from "@/lib/nominals";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Top Up PUBG Mobile Termurah — GAMEVION",
  description:
    "Top up UC PUBG Mobile langsung ke akun. Proses otomatis, 24 jam.",
  openGraph: {
    title: "Top Up PUBG Mobile Termurah — GAMEVION",
    description: "Top up UC PUBG Mobile langsung ke akun. Proses otomatis, 24 jam.",
    images: [{ url: "/og-pubg-mobile.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Top Up PUBG Mobile Termurah — GAMEVION",
    description: "Top up UC PUBG Mobile langsung ke akun. Proses otomatis, 24 jam.",
    images: ["/og-pubg-mobile.png"],
  },
};

const ACCOUNT_FIELDS = [
  {
    label: "Character ID",
    placeholder: "Contoh: 5123456789",
    type: "text",
  },
];

export default async function PubgMobilePage() {
  const nominals = await getNominals("pubg-mobile");

  return (
    <GamePageClient
      gameId="pubg-mobile"
      gameName="PUBG Mobile"
      developer="Level Infinite"
      description="Top up UC langsung ke akun game. Tanpa registrasi, tanpa login."
      backgroundImage="/images/12af396c-da57-4a23-b13b-16c4d480adc2.png"
      gameIcon="/images/12af396c-da57-4a23-b13b-16c4d480adc2.png"
      tags={[
        "Proses otomatis",
        "Layanan 24 jam",
        "9 metode pembayaran",
        "Garansi refund bila gagal",
      ]}
      accountFields={ACCOUNT_FIELDS}
      nominals={nominals}
      defaultItem="60 UC"
      defaultPrice={13500}
    />
  );
}
