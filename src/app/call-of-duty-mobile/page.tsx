import type { Metadata } from "next";
import GamePageClient from "@/components/GamePageClient";

export const metadata: Metadata = {
  title: "Top Up Call of Duty: Mobile — GAMEVION",
  description:
    "Top up Call of Duty: Mobile (CP) di GAMEVION. Masukkan Open ID, pilih nominal, bayar — tanpa perlu bikin akun.",
};

const NOMINALS = [
  { value: 12000, label: "80 CP" },
  { value: 23000, label: "160 CP" },
  { value: 34000, label: "240 CP" },
  { value: 59000, label: "420 CP", tag: "LARIS" },
  { value: 109000, label: "800 CP" },
  { value: 159000, label: "1.200 CP", tag: "HEMAT" },
  { value: 309000, label: "2.400 CP" },
  { value: 629000, label: "5.000 CP" },
  { value: 89000, label: "Battle Pass", tag: "POPULER" },
  { value: 229000, label: "BP Plus" },
];

const ACCOUNT_FIELDS = [
  {
    label: "Open ID",
    placeholder: "Contoh: 7412589630012345",
    type: "text",
  },
];

export default function CallOfDutyMobilePage() {
  return (
    <GamePageClient
      gameId="call-of-duty-mobile"
      gameName="Call of Duty Mobile"
      developer="Activision"
      badge="TRENDING"
      description="Top up CP langsung ke akun game. Tanpa registrasi, tanpa login."
      backgroundImage="/images/e8937151-775d-48a3-9abe-c4d7aa28cb03.png"
      gameIcon="/images/e8937151-775d-48a3-9abe-c4d7aa28cb03.png"
      tags={[
        "Proses otomatis",
        "Layanan 24 jam",
        "9 metode pembayaran",
        "Garansi refund bila gagal",
      ]}
      accountFields={ACCOUNT_FIELDS}
      nominals={NOMINALS}
      defaultItem="80 CP"
      defaultPrice={12000}
    />
  );
}
