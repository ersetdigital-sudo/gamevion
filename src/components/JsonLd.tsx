export default function JsonLd() {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "GAMEVION",
    alternateName: "GAMEVION Top Up Game",
    url: "https://gamevion.net",
    description: "Top up diamond, UC, genesis crystal langsung ke akun game. Tanpa registrasi, proses otomatis 24 jam.",
    inLanguage: "id",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://gamevion.net/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "GAMEVION",
    url: "https://gamevion.net",
    logo: "https://gamevion.net/logo.png",
    description: "Layanan top up game dan voucher digital Indonesia",
    sameAs: [],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Game Top Up",
    provider: {
      "@type": "Organization",
      name: "GAMEVION",
    },
    areaServed: "ID",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Top Up Game",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "Top Up Mobile Legends Diamond",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "Top Up PUBG Mobile UC",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "Top Up Free Fire Diamond",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "Top Up Genshin Impact Genesis Crystal",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "Top Up Call of Duty Mobile CP",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "Top Up Magic Chess Go Go Crystal",
          },
        },
      ],
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Bagaimana cara top up game di GAMEVION?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Pilih game, masukkan User ID, pilih nominal, pilih metode pembayaran, bayar. Item otomatis masuk ke akun game kamu dalam hitungan menit.",
        },
      },
      {
        "@type": "Question",
        name: "Game apa saja yang didukung GAMEVION?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "GAMEVION mendukung Mobile Legends, PUBG Mobile, Free Fire, Genshin Impact, Call of Duty Mobile, dan Magic Chess: Go Go.",
        },
      },
      {
        "@type": "Question",
        name: "Metode pembayaran apa saja yang tersedia?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "QRIS, GoPay, OVO, DANA, ShopeePay, LinkAja, Virtual Account (BCA, Mandiri, BRI), Alfamart, dan Indomaret.",
        },
      },
      {
        "@type": "Question",
        name: "Apakah perlu registrasi akun untuk top up?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Tidak perlu. Cukup masukkan User ID game kamu, pilih nominal, bayar, dan item langsung masuk.",
        },
      },
      {
        "@type": "Question",
        name: "Berapa lama proses top up?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Proses otomatis dan biasanya selesai dalam 1-5 menit setelah pembayaran terkonfirmasi.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
