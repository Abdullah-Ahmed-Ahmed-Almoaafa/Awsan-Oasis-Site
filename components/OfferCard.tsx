"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { IOffer } from "@/types/offer";
import StockBadge from "@/components/StockBadge";

interface OfferCardProps {
  offer: IOffer;
}

export default function OfferCard({ offer }: OfferCardProps) {
  const images = offer.images && offer.images.length > 0 ? offer.images.slice(0, 4) : [];
  const [order, setOrder] = useState<number[]>(images.map((_, i) => i));
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const hasMultipleImages = images.length > 1;
  const currencySymbol = offer.currency || "ر.ي";
  const isOutOfStock = offer.stockStatus === "OUT_OF_STOCK";

  // حساب نسبة الخصم والتوفير
  const savings = offer.originalPrice - offer.offerPrice;
  const discountPercentage =
    offer.originalPrice > 0 ? Math.round((savings / offer.originalPrice) * 100) : 0;

  // القيم المباشرة لحركة الماوس
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // إضافة مرونة وانسيابية عالية جداً للحركة (Springs)
  const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [7, -7]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-7, 7]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isOutOfStock) return;
    const rect = cardRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseEnter = () => {
    if (isOutOfStock) return;
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // عند المغادرة نعيد القيم إلى الصفر لتعود البطاقة إلى وضعها الطبيعي بسلاسة عبر الـ Spring
    x.set(0);
    y.set(0);
  };

  // تبديل ترتيب الصور في المصفوفة تلقائياً
  useEffect(() => {
    if (!hasMultipleImages || isOutOfStock || isHovered) return;

    const interval = setInterval(() => {
      setOrder((prevOrder) => {
        const next = [...prevOrder];
        const last = next.pop();
        if (last !== undefined) next.unshift(last);
        return next;
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [hasMultipleImages, isOutOfStock, isHovered]);

  const handleSelectImage = (targetIndex: number) => {
    if (isOutOfStock) return;
    const currentIndex = order.indexOf(targetIndex);
    if (currentIndex === -1) return;
    const newOrder = [...order];
    const removed = newOrder.splice(currentIndex, 1);
    newOrder.unshift(removed[0]);
    setOrder(newOrder);
  };

  const getGridStyle = (indexInGrid: number, total: number) => {
    if (total === 1) return { gridColumn: "span 12 / span 12", gridRow: "span 2 / span 2" };
    if (total === 2) return { gridColumn: "span 6 / span 6", gridRow: "span 2 / span 2" };
    if (total === 3) {
      return indexInGrid === 0
        ? { gridColumn: "span 8 / span 8", gridRow: "span 2 / span 2" }
        : { gridColumn: "span 4 / span 4", gridRow: "span 1 / span 1" };
    }
    if (indexInGrid === 0) return { gridColumn: "span 7 / span 7", gridRow: "span 2 / span 2" };
    if (indexInGrid === 1) return { gridColumn: "span 5 / span 5", gridRow: "span 1 / span 1" };
    return { gridColumn: "span 2.5 / span 2.5", gridRow: "span 1 / span 1" };
  };

  return (
    <div className="relative [perspective:1000px] h-full">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX: isOutOfStock ? 0 : rotateX,
          rotateY: isOutOfStock ? 0 : rotateY,
          transformStyle: "preserve-3d",
        }}
        className={`group relative flex flex-col h-full rounded-2xl border transition-colors duration-300 overflow-hidden shadow-xl ${
          isOutOfStock
            ? "border-red-500/50 bg-slate-900/60 opacity-75 grayscale-[30%]"
            : "border-amber-500/30 bg-slate-900/90 hover:border-amber-400 hover:shadow-amber-500/10"
        }`}
      >
        {/* هالة ضوئية خلفية ناعمة عند الحوام */}
        {!isOutOfStock && (
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-amber-500/20 via-amber-300/10 to-amber-600/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 pointer-events-none" />
        )}

        {/* 1. قسم معرض الصور التفاعلي (Animated Bento Grid) */}
        <div className="relative h-48 sm:h-52 w-full bg-slate-950 overflow-hidden flex-shrink-0">
          {discountPercentage > 0 && !isOutOfStock && (
            <div className="absolute top-2 left-2 z-20 w-12 h-12 drop-shadow-md select-none pointer-events-none transition-transform hover:scale-105">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <defs>
                  <linearGradient id="badgeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFE066" />
                    <stop offset="100%" stopColor="#F59E0B" />
                  </linearGradient>
                </defs>
                <path
                  d="M50 0 L58 5 L68 2 L73 11 L83 12 L84 22 L93 27 L90 37 L98 44 L92 53 L97 62 L89 68 L91 78 L80 81 L78 91 L67 90 L61 98 L50 94 L39 98 L33 90 L22 91 L20 81 L9 78 L11 68 L3 62 L8 53 L2 44 L10 37 L7 27 L16 22 L17 12 L27 11 L32 2 L42 5 Z"
                  fill="url(#badgeGradient)"
                  stroke="#FFF"
                  strokeWidth="2"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center font-black leading-tight text-slate-950">
                <span className="text-[8px] font-bold uppercase">توفير</span>
                <span className="text-xs tracking-tight -mt-0.5">{discountPercentage}%</span>
              </div>
            </div>
          )}

          {isOutOfStock && (
            <div className="absolute inset-0 z-30 bg-slate-950/70 backdrop-blur-[1px] flex items-center justify-center pointer-events-none">
              <span className="bg-red-600/90 text-white font-black text-xs px-3 py-1.5 rounded-full shadow-lg border border-red-400/30 uppercase tracking-wider">
                نفدت الكمية
              </span>
            </div>
          )}

          {images.length > 0 ? (
            <div className="grid grid-cols-12 grid-rows-2 gap-1 w-full h-full p-1 bg-slate-950">
              {order.map((imgIndex, gridIndex) => (
                <motion.div
                  key={images[imgIndex]}
                  layout
                  style={getGridStyle(gridIndex, images.length)}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 24,
                    mass: 0.8,
                  }}
                  className={`relative w-full h-full overflow-hidden rounded-lg bg-slate-900 ${
                    !isOutOfStock ? "cursor-pointer group/img" : ""
                  }`}
                  onClick={() => handleSelectImage(imgIndex)}
                >
                  <Image
                    src={images[imgIndex]}
                    alt={`${offer.title} - صورة ${imgIndex + 1}`}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className={`object-cover w-full h-full transition-transform duration-500 ${
                      isOutOfStock ? "" : "hover:scale-105"
                    }`}
                  />
                  <div className="absolute inset-0 bg-black/10 hover:bg-transparent transition-colors duration-300" />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center bg-slate-950 text-slate-500 text-[11px] gap-1">
              <Image
                src="/logo.png"
                alt="واحة أوسان"
                width={36}
                height={36}
                className="opacity-40 object-contain"
              />
              <span>لا توجد صور للعرض</span>
            </div>
          )}

          {hasMultipleImages && !isOutOfStock && (
            <div className="absolute bottom-2 inset-x-0 z-20 flex items-center justify-center gap-1.5 pointer-events-auto">
              {images.map((_, idx) => {
                const isActive = order[0] === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectImage(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      isActive
                        ? "w-5 bg-amber-400 shadow-lg shadow-amber-500/50"
                        : "w-1.5 bg-white/40 hover:bg-white/80"
                    }`}
                    aria-label={`عرض الصورة ${idx + 1}`}
                  />
                );
              })}
            </div>
          )}

          {offer.tagline && (
            <div className="absolute top-2 right-2 z-20">
              <div className="bg-slate-950/80 backdrop-blur-md border border-amber-500/40 text-amber-400 text-[11px] font-bold px-2.5 py-1 rounded-md shadow-sm">
                {offer.tagline}
              </div>
            </div>
          )}
        </div>

        {/* 2. تفاصيل العرض */}
        <div className="p-3 flex flex-col justify-between flex-1 gap-2 z-10">
          <div>
            <div className="flex items-center justify-between gap-1.5">
              <h3
                className={`text-sm font-bold transition-colors line-clamp-1 leading-snug flex-1 ${
                  isOutOfStock
                    ? "text-slate-400"
                    : "text-amber-300 group-hover:text-amber-400"
                }`}
              >
                {offer.title}
              </h3>

              <div className="flex-shrink-0 self-center">
                <StockBadge
                  status={offer.stockStatus}
                  remainingQuantity={offer.remainingQuantity}
                  unit={offer.unit}
                />
              </div>
            </div>

            <p className="mt-1 text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
              {offer.description}
            </p>

            {offer.items && offer.items.length > 0 && (
              <div className="mt-2 space-y-0.5 bg-slate-950/50 p-1.5 rounded-md border border-slate-800">
                {offer.items.slice(0, 2).map((item, idx) => (
                  <div key={idx} className="flex items-center gap-1 text-[10px] text-slate-300">
                    <span className={isOutOfStock ? "text-slate-500 font-bold" : "text-amber-400 font-bold"}>
                      ✓
                    </span>
                    <span className="line-clamp-1">{item}</span>
                  </div>
                ))}
                {offer.items.length > 2 && (
                  <span className="text-[9px] text-slate-500 block pt-0.5">+ المزيد...</span>
                )}
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-slate-800 flex flex-col gap-2 mt-auto">
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-1">
                <span
                  className={`text-lg font-black ${
                    isOutOfStock ? "text-slate-400" : "text-amber-400"
                  }`}
                >
                  {offer.offerPrice}
                </span>
                <span
                  className={`text-[10px] font-bold ${
                    isOutOfStock ? "text-slate-500" : "text-amber-500"
                  }`}
                >
                  {currencySymbol}
                </span>
              </div>
              {offer.originalPrice > offer.offerPrice && (
                <span className="text-[11px] text-slate-500 line-through font-medium">
                  {offer.originalPrice} {currencySymbol}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {isOutOfStock ? (
                <button
                  disabled
                  className="flex items-center justify-center gap-1 rounded-xl bg-slate-800/50 text-slate-500 cursor-not-allowed py-1.5 text-[11px] font-bold border border-slate-800"
                >
                  <span>التفاصيل</span>
                </button>
              ) : (
                <Link
                  href={`/offers/${offer.id}`}
                  aria-label={`عرض تفاصيل العرض ${offer.title}`}
                  className="group/btn flex items-center justify-center gap-1 rounded-xl bg-slate-800 text-amber-400 hover:bg-amber-500 hover:text-slate-950 py-1.5 text-[11px] font-black shadow-[inset_0_4px_8px_rgba(0,0,0,0.35),0_6px_20px_rgba(245,158,11,0.25)] active:translate-y-[1px] active:shadow-[inset_0_6px_10px_rgba(0,0,0,0.45),0_2px_6px_rgba(0,0,0,0.2)] transition-all duration-200 ease-in-out"
                >
                  <span>التفاصيل</span>
                  <svg
                    className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:-translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </Link>
              )}

              {isOutOfStock ? (
                <button
                  disabled
                  className="flex items-center justify-center gap-1 rounded-xl bg-slate-800/80 text-slate-500 cursor-not-allowed py-1.5 text-[11px] font-bold border border-slate-700/50"
                >
                  <span>غير متوفر</span>
                </button>
              ) : (
                <a
                  href={`https://wa.me/967777376160?text=${encodeURIComponent(
                    `السلام عليكم، أرغب في الاستفادة من العرض التالي:\n*${offer.title}*\nالسعر: ${offer.offerPrice}${currencySymbol}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 py-1.5 text-[11px] font-bold shadow-md transition"
                >
                  <span>💬</span>
                  <span>طلب العرض</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}