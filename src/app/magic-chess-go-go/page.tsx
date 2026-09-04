import type { Metadata } from "next";
import GamePageClient from "@/components/GamePageClient";
import { getNominals } from "@/lib/nominals";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Top Up Magic Chess: Go Go — GAMEVION",
  description:
    "Top up Magic Chess: Go Go (Diamond) di GAMEVION. Masukkan User ID, pilih nominal, bayar — tanpa perlu bikin akun.",
};

const ACCOUNT_FIELDS = [
  { label: "User ID", placeholder: "Contoh: 123456789", type: "text" },
  { label: "Zone ID", placeholder: "Contoh: 2345", type: "text" },
];

export default async function MagicChessGoGoPage() {
  const nominals = await getNominals("magic-chess-go-go");

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
      nominals={nominals}
      defaultItem="5 Diamond"
      defaultPrice={1500}
    />
  );
}
