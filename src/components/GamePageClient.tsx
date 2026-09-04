"use client";

import { useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GameBanner from "@/components/GameBanner";
import OrderForm from "@/components/OrderForm";
import OrderSidebar from "@/components/OrderSidebar";
import OtherGames from "@/components/OtherGames";

interface AccountField {
  label: string;
  placeholder: string;
  type: string;
}

interface Nominal {
  value: number;
  label: string;
  tag?: string;
}

interface GamePageClientProps {
  gameId: string;
  gameName: string;
  developer: string;
  badge?: string;
  description: string;
  backgroundImage: string;
  gameIcon: string;
  tags: string[];
  accountFields: AccountField[];
  nominals: Nominal[];
  defaultItem: string;
  defaultPrice: number;
}

export default function GamePageClient({
  gameId,
  gameName,
  developer,
  badge,
  description,
  backgroundImage,
  gameIcon,
  tags,
  accountFields,
  nominals,
  defaultItem,
  defaultPrice,
}: GamePageClientProps) {
  const submitRef = useRef<(() => void) | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = useCallback(() => {
    if (submitRef.current) {
      submitRef.current();
    }
  }, []);

  const handleOrderSuccess = useCallback(
    (invoice: string) => {
      router.push(`/invoice/${invoice}`);
    },
    [router],
  );

  return (
    <>
      <Header />
      <GameBanner
        backgroundImage={backgroundImage}
        gameIcon={gameIcon}
        gameName={gameName}
        developer={developer}
        badge={badge}
        tags={tags}
        description={description}
      />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <OrderForm
            gameId={gameId}
            gameName={gameName}
            accountFields={accountFields}
            nominals={nominals}
            onSubmitRef={submitRef}
            onSubmittingChange={setSubmitting}
            onSuccess={handleOrderSuccess}
          />
          <OrderSidebar
            gameName={gameName}
            defaultItem={defaultItem}
            defaultPrice={defaultPrice}
            submitting={submitting}
            onSubmit={handleSubmit}
          />
        </div>
        <OtherGames currentGame={gameName} />
      </main>
      <Footer />
    </>
  );
}
