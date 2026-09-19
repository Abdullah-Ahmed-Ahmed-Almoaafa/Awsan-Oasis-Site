"use client";

import { useEffect, useState } from "react";
import { getActiveOffers } from "@/lib/offers.service";
import { IOffer } from "@/types/offer";
import OfferCard from "@/components/OfferCard";
import HoneyBackground from "@/components/HoneyBackground";
import InfoSideWidget from "@/components/InfoSideWidget";

export default function OffersPage() {
  const [offers, setOffers] = useState<IOffer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchOffers() {
      try {
        const data = await getActiveOffers();
        setOffers(data);
      } catch (err) {
        console.error("فشل جلب العروض:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOffers();
  }, []);

  return (
    <section className="py-6 relative min-h-screen">
      {/* خلفية العسل الضبابية */}
      <HoneyBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* الهيدر الترويجي للعروض */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold px-3 py-1.5 rounded-full mb-3 backdrop-blur-sm">
            <span>...</span>
            <span>توفير أكثر مع باقاتنا الخاصة</span>
            <span>...</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-amber-400 mb-2 tracking-tight">
            عروض واحة أوسان الحصرية
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            استمتع بأفضل الباقات المجهزة بعناية من العسل اليمني الفاخر والمكسرات الطبيعية بأسعار استثنائية.
          </p>
        </div>

        {/* شبكة العروض */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-96 rounded-2xl bg-slate-900/80 animate-pulse border border-slate-800"
              />
            ))}
          </div>
        ) : offers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border border-dashed border-slate-800 rounded-2xl bg-slate-900/50 backdrop-blur-md">
            <p className="text-slate-200 font-semibold text-base mb-2">
              لا توجد عروض متاحة حالياً.
            </p>
            <p className="text-xs text-slate-300">
              ترقبوا إطلاق باقاتنا الفاخرة القادمة قريباً!
            </p>
          </div>
        )}

        <InfoSideWidget />
      </div>
    </section>
  );
}