"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import Link from "next/link";

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  cta_text: string;
  code: string;
  discount_type: string;
  discount_value: number;
  bg_color: string;
  sort_order: number;
}

const DEFAULT_BANNERS: Banner[] = [
  {
    id: "1",
    title: "September Isi Ulang",
    subtitle: "Makin Untung",
    description: "Kode promo spesial, berlaku 1–30 September 2026",
    cta_text: "Pakai Kodenya",
    code: "GVNSEP26",
    discount_type: "fixed",
    discount_value: 5000,
    bg_color: "#0BAF78",
    sort_order: 0,
  },
  {
    id: "2",
    title: "Bundle Diamond",
    subtitle: "Harga Gak Naik",
    description: "Beli sekarang, harga segini terus sampai Minggu malam.",
    cta_text: "Lihat Paket",
    code: "",
    discount_type: "",
    discount_value: 0,
    bg_color: "#0E1614",
    sort_order: 1,
  },
  {
    id: "3",
    title: "Tebak Skor MPL",
    subtitle: "Menang Diamond",
    description: "Tiap akhir pekan, 20 penebak skor paling jitu dapat saldo top up.",
    cta_text: "Ikut Event",
    code: "",
    discount_type: "",
    discount_value: 0,
    bg_color: "#3A2B86",
    sort_order: 2,
  },
];

export default function HeroSlider() {
  const [banners, setBanners] = useState<Banner[]>(DEFAULT_BANNERS);

  useEffect(() => {
    fetch("/api/banners")
      .then((r) => r.json())
      .then((data) => {
        if (data && data.length > 0) {
          setBanners(data);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="relative">
      <Swiper
        modules={[Autoplay, Pagination]}
        loop
        speed={700}
        autoplay={{ delay: 5500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        className="heroSwiper"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <div
              className="bnr bnr-stripes bnr-dots h-[430px] w-full sm:h-[340px] lg:h-[400px]"
              style={{ backgroundColor: banner.bg_color }}
            >
              <div className="relative mx-auto flex h-full max-w-7xl items-center px-4 sm:px-6">
                <div className="relative z-10 w-full max-w-[560px] py-5">
                  <span className="inline-flex items-center gap-1.5 rounded bg-[#04120C] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[color:var(--em)]">
                    gamevion.net
                  </span>
                  <h1 className="disp mt-3 text-[30px] font-bold uppercase leading-[1.05] sm:text-[34px] lg:text-[42px]">
                    <span className="plate bg-[#04120C] text-white">
                      <span>{banner.title}</span>
                    </span>
                    <br />
                    <span className="plate mt-1 bg-white text-[#04120C]">
                      <span>{banner.subtitle}</span>
                    </span>
                  </h1>
                  <p className="mt-3 text-[13px] font-semibold text-[#04120C]/80">
                    {banner.description}
                  </p>

                  {banner.code && (
                    <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:max-w-[520px]">
                      <div className="coupon flex items-center justify-between px-3 py-2">
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-wider text-white/55">
                            Diskon
                          </p>
                          <p className="disp text-base font-bold leading-none text-white">
                            {banner.discount_type === "fixed"
                              ? `Rp ${banner.discount_value.toLocaleString("id-ID")}`
                              : `${banner.discount_value}%`}
                          </p>
                        </div>
                        <p className="code text-[13px] font-bold text-[color:var(--em)]">
                          {banner.code}
                        </p>
                      </div>
                    </div>
                  )}

                  <Link
                    href="#games"
                    className="mt-4 inline-block rounded-lg bg-[#04120C] px-5 py-3 text-[13px] font-bold text-white hover:bg-black"
                  >
                    {banner.cta_text}
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="swiper-pagination absolute bottom-5 left-0 right-0 z-10 flex justify-center gap-2" />
    </section>
  );
}