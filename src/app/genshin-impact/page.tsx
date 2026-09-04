import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GameBanner from "@/components/GameBanner";
import OrderForm from "@/components/OrderForm";
import OrderSidebar from "@/components/OrderSidebar";

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
    <>
      <Header />
      <GameBanner
        backgroundImage="/images/4a402c7a-ca2f-4433-b935-16b26e740ab9.png"
        gameIcon="/images/4a402c7a-ca2f-4433-b935-16b26e740ab9.png"
        gameName="Genshin Impact"
        developer="HoYoverse"
        badge="POPULER"
        tags={[
          "Proses otomatis",
          "Layanan 24 jam",
          "9 metode pembayaran",
          "Garansi refund bila gagal",
        ]}
        description="Top up Genesis Crystal langsung ke akun game. Tanpa registrasi, tanpa login."
      />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <OrderForm
            gameId="genshin-impact"
            gameName="Genshin Impact"
            accountFields={ACCOUNT_FIELDS}
            nominals={NOMINALS}
          />
          <OrderSidebar
            gameName="Genshin Impact"
            defaultItem="60 Genesis Crystal"
            defaultPrice={15000}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
