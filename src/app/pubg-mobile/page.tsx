import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GameBanner from "@/components/GameBanner";
import OrderForm from "@/components/OrderForm";
import OrderSidebar from "@/components/OrderSidebar";

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

const NOMINALS = [
  { value: 13500, label: "60 UC" },
  { value: 26500, label: "120 UC" },
  { value: 39500, label: "180 UC" },
  { value: 65000, label: "325 UC", tag: "LARIS" },
  { value: 78000, label: "385 UC" },
  { value: 129000, label: "660 UC", tag: "HEMAT" },
  { value: 349000, label: "1.800 UC" },
  { value: 699000, label: "3.850 UC" },
  { value: 1399000, label: "8.100 UC" },
  { value: 99000, label: "Royale Pass", tag: "POPULER" },
  { value: 249000, label: "RP Elite Plus" },
  { value: 59000, label: "UC Voucher 300" },
];

const ACCOUNT_FIELDS = [
  {
    label: "Character ID",
    placeholder: "Contoh: 5123456789",
    type: "text",
  },
];

export default function PubgMobilePage() {
  return (
    <>
      <Header />
      <GameBanner
        backgroundImage="/images/12af396c-da57-4a23-b13b-16c4d480adc2.png"
        gameIcon="/images/12af396c-da57-4a23-b13b-16c4d480adc2.png"
        gameName="PUBG Mobile"
        developer="Level Infinite"
        tags={[
          "Proses otomatis",
          "Layanan 24 jam",
          "9 metode pembayaran",
          "Garansi refund bila gagal",
        ]}
        description="Top up UC langsung ke akun game. Tanpa registrasi, tanpa login."
      />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <OrderForm
            gameId="pubg-mobile"
            gameName="PUBG Mobile"
            accountFields={ACCOUNT_FIELDS}
            nominals={NOMINALS}
          />
          <OrderSidebar
            gameName="PUBG Mobile"
            defaultItem="60 UC"
            defaultPrice={13500}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
