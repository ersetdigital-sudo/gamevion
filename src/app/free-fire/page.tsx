import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GameBanner from "@/components/GameBanner";
import OrderForm from "@/components/OrderForm";
import OrderSidebar from "@/components/OrderSidebar";

export const metadata: Metadata = {
  title: "Top Up Free Fire Termurah — GAMEVION",
  description:
    "Top up Diamond Free Fire langsung ke akun. Proses otomatis, 24 jam.",
  openGraph: {
    title: "Top Up Free Fire Termurah — GAMEVION",
    description: "Top up Diamond Free Fire langsung ke akun. Proses otomatis, 24 jam.",
    images: [{ url: "/og-free-fire.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Top Up Free Fire Termurah — GAMEVION",
    description: "Top up Diamond Free Fire langsung ke akun. Proses otomatis, 24 jam.",
    images: ["/og-free-fire.png"],
  },
};

const NOMINALS = [
  { value: 1400, label: "5 Diamond" },
  { value: 2600, label: "12 Diamond" },
  { value: 8300, label: "50 Diamond" },
  { value: 10500, label: "70 Diamond", tag: "LARIS" },
  { value: 14500, label: "100 Diamond" },
  { value: 20000, label: "140 Diamond" },
  { value: 49500, label: "355 Diamond", tag: "HEMAT" },
  { value: 99000, label: "720 Diamond" },
  { value: 196000, label: "1.450 Diamond" },
  { value: 29000, label: "Membership Mingguan" },
  { value: 89000, label: "Membership Bulanan", tag: "POPULER" },
  { value: 15000, label: "Level Up Pass" },
];

const ACCOUNT_FIELDS = [
  { label: "User ID", placeholder: "Contoh: 987654321", type: "text" },
];

export default function FreeFirePage() {
  return (
    <>
      <Header />
      <GameBanner
        backgroundImage="/images/849e27b6-18a9-49b0-a8fb-d94761a7285b.png"
        gameIcon="/images/849e27b6-18a9-49b0-a8fb-d94761a7285b.png"
        gameName="Free Fire"
        developer="Garena"
        badge="HOT"
        tags={[
          "Proses otomatis",
          "Layanan 24 jam",
          "9 metode pembayaran",
          "Garansi refund bila gagal",
        ]}
        description="Top up Diamond langsung ke akun game. Tanpa registrasi, tanpa login."
      />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <OrderForm
            gameId="free-fire"
            gameName="Free Fire"
            accountFields={ACCOUNT_FIELDS}
            nominals={NOMINALS}
          />
          <OrderSidebar
            gameName="Free Fire"
            defaultItem="5 Diamond"
            defaultPrice={1400}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
