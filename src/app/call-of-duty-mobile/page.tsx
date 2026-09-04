import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GameBanner from "@/components/GameBanner";
import OrderForm from "@/components/OrderForm";
import OrderSidebar from "@/components/OrderSidebar";

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
    <>
      <Header />
      <GameBanner
        backgroundImage="/images/e8937151-775d-48a3-9abe-c4d7aa28cb03.png"
        gameIcon="/images/e8937151-775d-48a3-9abe-c4d7aa28cb03.png"
        gameName="Call of Duty Mobile"
        developer="Activision"
        badge="TRENDING"
        tags={[
          "Proses otomatis",
          "Layanan 24 jam",
          "9 metode pembayaran",
          "Garansi refund bila gagal",
        ]}
        description="Top up CP langsung ke akun game. Tanpa registrasi, tanpa login."
      />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <OrderForm
            gameId="call-of-duty-mobile"
            gameName="Call of Duty Mobile"
            accountFields={ACCOUNT_FIELDS}
            nominals={NOMINALS}
          />
          <OrderSidebar
            gameName="Call of Duty Mobile"
            defaultItem="80 CP"
            defaultPrice={12000}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
