import type { Metadata } from "next";
import GamePageClient from "@/components/GamePageClient";
import { getNominals } from "@/lib/nominals";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Top Up Call of Duty: Mobile — GAMEVION",
  description:
    "Top up Call of Duty: Mobile (CP) di GAMEVION. Masukkan Open ID, pilih nominal, bayar — tanpa perlu bikin akun.",
};

const ACCOUNT_FIELDS = [
  {
    label: "Open ID",
    placeholder: "Contoh: 7412589630012345",
    type: "text",
  },
];

export default async function CallOfDutyMobilePage() {
  const nominals = await getNominals("call-of-duty-mobile");

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
      nominals={nominals}
      defaultItem="80 CP"
      defaultPrice={12000}
    />
  );
}
