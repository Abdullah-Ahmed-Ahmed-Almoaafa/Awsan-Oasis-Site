"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getOfferById } from "@/lib/offers.service";
import { IOffer } from "@/types/offer";
import StockBadge from "@/components/StockBadge";

export default function OfferDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();

  const [offer, setOffer] = useState<IOffer | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);

  useEffect(() => {
    async function fetchOffer() {
      if (!resolvedParams.id) return;
      try {
        const data = await getOfferById(resolvedParams.id);
        setOffer(data);
      } catch (err) {
        console.error("خطأ في جلب تفاصيل العرض:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOffer();
  }, [resolvedParams.id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsZoomed(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-bold text-slate-300">العرض غير موجود أو تم إزالته.</h2>
        <button
          onClick={() => router.push("/offers")}
          className="mt-4 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-bold text-slate-950 hover:bg-amber-400 transition"
        >
          العودة لكافة العروض
        </button>
      </div>
    );
  }

  const images = offer.images && offer.images.length > 0 ? offer.images.slice(0, 4) : [];
  const savings = offer.originalPrice - offer.offerPrice;
  const discountPercentage = offer.originalPrice > 0 
    ? Math.round((savings / offer.originalPrice) * 100) 
    : 0;

  // جلب رمز العملة الديناميكي أو استخدام "ر.ي" كقيمة افتراضية
  const currencySymbol = offer.currency || "ر.ي";

  const handleNextImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // تضمين رمز العملة الديناميكي في رسالة الواتساب
  const whatsappMessage =
    `السلام عليكم، أرغب في طلب العرض التالي:\n` +
    `العنوان: ${offer.title}\n` +
    `سعر العرض: ${offer.offerPrice} ${currencySymbol}`;

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 text-sm font-semibold text-amber-400 hover:text-amber-300 transition cursor-pointer"
      >
        <span>←</span>
        <span>الرجوع للعروض</span>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 rounded-2xl border border-amber-500/20 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-md">
        {/* قسم المعرض */}
        <div className="flex flex-col gap-4">
          <div
            onClick={() => images.length > 0 && setIsZoomed(true)}
            className={`relative h-72 sm:h-80 w-full overflow-hidden rounded-xl bg-slate-950 border border-slate-800 group ${
              images.length > 0 ? "cursor-zoom-in" : ""
            }`}
          >
            {images.length > 0 ? (
              <>
                <Image
                  src={images[selectedImageIndex]}
                  alt={offer.title}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={handlePrevImage}
                      aria-label="الصورة السابقة"
                      className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-slate-950/70 text-amber-400 border border-slate-700/80 shadow-md backdrop-blur-md hover:bg-amber-500 hover:text-slate-950 transition"
                    >
                      ❮
                    </button>
                    <button
                      type="button"
                      onClick={handleNextImage}
                      aria-label="الصورة التالية"
                      className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-slate-950/70 text-amber-400 border border-slate-700/80 shadow-md backdrop-blur-md hover:bg-amber-500 hover:text-slate-950 transition"
                    >
                      ❯
                    </button>
                  </>
                )}

                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <span className="bg-slate-900/80 text-amber-400 text-xs px-3 py-1.5 rounded-full border border-amber-500/30 backdrop-blur-sm">
                    🔍 اضغط للتكبير
                  </span>
                </div>
              </>
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center bg-slate-950 text-slate-500 text-xs gap-2 select-none">
                <Image 
                  src="/logo.png" 
                  alt="واحة أوسان" 
                  width={48} 
                  height={48} 
                  className="opacity-40 object-contain"
                />
                <span>لا توجد صور معروضة</span>
              </div>
            )}
          </div>

          {/* المصغرات */}
          {images.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition ${
                    selectedImageIndex === idx ? "border-amber-500 scale-105" : "border-slate-800 opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`صورة العرض ${idx + 1}`}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* تفاصيل العرض */}
        <div className="flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              {offer.tagline && (
                <span className="inline-block bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold px-2.5 py-1 rounded-md mb-2">
                   {offer.tagline}
                </span>
              )}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-amber-300 leading-snug">
                {offer.title}
              </h1>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {offer.description}
            </p>

            {/* العناصر المشمولة */}
            {offer.items && offer.items.length > 0 && (
              <div className="border border-slate-800 bg-slate-950/60 p-3.5 rounded-xl space-y-2">
                <span className="text-xs font-bold text-amber-400 block mb-1">
                  محتويات هذه الباقة:
                </span>
                {offer.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-200">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            )}

            {/* الأسعار والحسابات */}
            <div className="border-t border-slate-800 pt-4 space-y-2">
              
              {/* شارة حالة العرض */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <span className="text-xs text-slate-400">حالة العرض:</span>
                <StockBadge 
                  status={offer.stockStatus} 
                  remainingQuantity={offer.remainingQuantity} 
                  unit={offer.unit} 
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">سعر العرض الخاص:</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-amber-400">{offer.offerPrice}</span>
                  <span className="text-xs font-bold text-amber-500">{currencySymbol}</span>
                </div>
              </div>

              {offer.originalPrice > offer.offerPrice && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">السعر الأصلي:</span>
                  <span className="text-sm text-slate-500 line-through">
                    {offer.originalPrice} {currencySymbol}
                  </span>
                </div>
              )}

              {discountPercentage > 0 && (
                <div className="flex items-center justify-between text-xs text-emerald-400 pt-1 font-bold">
                  <span>وفرت مع هذا العرض:</span>
                  <span>{savings} {currencySymbol} ({discountPercentage}%)</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 border-t border-slate-800 pt-4">
            <a
              href={`https://wa.me/967777376160?text=${encodeURIComponent(whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white shadow-lg hover:bg-emerald-500 transition"
            >
              <span>💬</span>
              <span>طلب العرض عبر الواتساب</span>
            </a>
          </div>
        </div>
      </div>

      {/* نافذة التكبير Lightbox */}
      {isZoomed && images.length > 0 && (
        <div
          onClick={() => setIsZoomed(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 transition-all"
        >
          <button
            onClick={() => setIsZoomed(false)}
            className="absolute top-5 left-5 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-slate-800/80 text-white hover:bg-red-600 transition border border-slate-700 shadow-lg"
          >
            ✕
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrevImage}
                aria-label="الصورة السابقة"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-slate-900/80 text-amber-400 border border-slate-700 hover:bg-amber-500 hover:text-slate-950 transition"
              >
                ❮
              </button>
              <button
                type="button"
                onClick={handleNextImage}
                aria-label="الصورة التالية"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-slate-900/80 text-amber-400 border border-slate-700 hover:bg-amber-500 hover:text-slate-950 transition"
              >
                ❯
              </button>
            </>
          )}

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-xl shadow-2xl border border-slate-800"
          >
            <img
              src={images[selectedImageIndex]}
              alt={offer.title}
              className="max-h-[85vh] max-w-[90vw] object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}