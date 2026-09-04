"use client";


import Header from "@/components/Header";
import HeroSlider from "@/components/HeroSlider";
import TrustStrip from "@/components/TrustStrip";
import GamesGrid from "@/components/GamesGrid";
import WhySection from "@/components/WhySection";
import CaraOrder from "@/components/CaraOrder";
import Testimoni from "@/components/Testimoni";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <HeroSlider />
      <TrustStrip />
      <GamesGrid />
      <WhySection />
      <CaraOrder />
      <Testimoni />
      <Footer />
    </>
  );
}
