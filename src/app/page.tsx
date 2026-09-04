"use client";

import { useEffect } from "react";
import Header from "@/components/Header";
import HeroSlider from "@/components/HeroSlider";
import TrustStrip from "@/components/TrustStrip";
import GamesGrid from "@/components/GamesGrid";
import WhySection from "@/components/WhySection";
import CaraOrder from "@/components/CaraOrder";
import Testimoni from "@/components/Testimoni";
import Footer from "@/components/Footer";

export default function Home() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    document.querySelectorAll(".reveal").forEach((el, i) => {
      (el as HTMLElement).style.transitionDelay = `${(i % 4) * 70}ms`;
      io.observe(el);
    });

    return () => io.disconnect();
  }, []);

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
