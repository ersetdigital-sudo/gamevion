import type { Metadata } from "next";
import GamePageClient from "@/components/GamePageClient";
import { getNominals } from "@/lib/nominals";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Top Up Genshin Impact — GAMEVION",
  description:
    "Top up Genshin Impact (Genesis Crystal) di GAMEVION. Masukkan UID, pilih nominal, bayar — tanpa perlu bikin akun.",
};

const ACCOUNT_FIELDS = [
  { label: "UID", placeholder: "Contoh: 812345678", type: "text" },
];

export default async function GenshinImpactPage() {
  const nominals = await getNominals("genshin-impact");

  return (
    <GamePageClient
      gameId="genshin-impact"
      gameName="Genshin Impact"
      developer="HoYoverse"
      badge="POPULER"
      description="Top up Genesis Crystal langsung ke akun game. Tanpa registrasi, tanpa login."
      backgroundImage="/images/4a402c7a-ca2f-4433-b935-16b26e740ab9.png"
      gameIcon="/images/4a402c7a-ca2f-4433-b935-16b26e740ab9.png"
      tags={[
        "Proses otomatis",
        "Layanan 24 jam",
        "9 metode pembayaran",
        "Garansi refund bila gagal",
      ]}
      accountFields={ACCOUNT_FIELDS}
      nominals={nominals}
      defaultItem="60 Genesis Crystal"
      defaultPrice={15000}
    />
  );
}
