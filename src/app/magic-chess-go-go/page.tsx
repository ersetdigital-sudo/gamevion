import type { Metadata } from "next";
import GamePageClient from "@/components/GamePageClient";

export const metadata: Metadata = {
  title: "Top Up Magic Chess: Go Go — GAMEVION",
  description:
    "Top up Magic Chess: Go Go (Diamond) di GAMEVION. Masukkan User ID, pilih nominal, bayar — tanpa perlu bikin akun.",
};

const NOMINALS = [
  { value: 1500, label: "5 Diamond" },
  { value: 3900, label: "14 Diamond" },
  { value: 7900, label: "28 Diamond" },
  { value: 15500, label: "56 Diamond", tag: "LARIS" },
  { value: 30500, label: "112 Diamond" },
  { value: 60500, label: "224 Diamond", tag: "HEMAT" },
  { value: 149000, label: "560 Diamond" },
  { value: 295000, label: "1.120 Diamond" },
  { value: 45000, label: "Chess Pass", tag: "POPULER" },
  { value: 120000, label: "Chess Pass Plus" },
];

const ACCOUNT_FIELDS = [
  { label: "User ID", placeholder: "Contoh: 123456789", type: "text" },
  { label: "Zone ID", placeholder: "Contoh: 2345", type: "text" },
];

export default function MagicChessGoGoPage() {
  return (
    <GamePageClient
      gameId="magic-chess-go-go"
      gameName="Magic Chess: Go Go"
      developer="Moonton"
      description="Top up Diamond langsung ke akun game. Tanpa registrasi, tanpa login."
      backgroundImage="/images/90841904-8491-403e-a9f5-c8f53b796a8d.png"
      gameIcon="/images/90841904-8491-403e-a9f5-c8f53b796a8d.png"
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
