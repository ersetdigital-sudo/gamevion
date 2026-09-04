import type { Metadata } from "next";
import GamePageClient from "@/components/GamePageClient";

export const metadata: Metadata = {
  title: "Top Up Genshin Impact — GAMEVION",
  description:
    "Top up Genshin Impact (Genesis Crystal) di GAMEVION. Masukkan UID, pilih nominal, bayar — tanpa perlu bikin akun.",
};

const NOMINALS = [
  { value: 15000, label: "60 Genesis Crystal" },
  { value: 73000, label: "300 + 30 Crystal" },
  { value: 229000, label: "980 + 110 Crystal", tag: "LARIS" },
  { value: 459000, label: "1.980 + 260 Crystal" },
  { value: 759000, label: "3.280 + 600 Crystal" },
  { value: 1499000, label: "6.480 + 1.600 Crystal" },
  { value: 79000, label: "Blessing of the Moon", tag: "POPULER" },
  { value: 159000, label: "Battle Pass Gnostic Hymn" },
];

const ACCOUNT_FIELDS = [
  { label: "UID", placeholder: "Contoh: 812345678", type: "text" },
];

export default function GenshinImpactPage() {
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
      nominals={NOMINALS}
      defaultItem="60 Genesis Crystal"
      defaultPrice={15000}
    />
  );
}
