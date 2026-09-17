"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { IProduct } from "@/types/product";

interface ProductCardProps {
  product: IProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const currencySymbol = product.currency || "ر.ي";
  const unitLabel = product.unit || "كيلو";
  const imagesCount = product.images?.length || 0;
  const hasMultipleImages = imagesCount > 1;

  // 1. تنظيف المؤقت بشكل صارم وضبط الـ Dependencies
  useEffect(() => {
    if (!hasMultipleImages) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imagesCount);
    }, 2500);

    return () => clearInterval(interval); // Cleanup
  }, [hasMultipleImages, imagesCount]);

  return (
    <div className="group flex flex-col h-full rounded-2xl border border-slate-800/80 bg-slate-900/90 overflow-hidden shadow-xl hover:border-amber-500/40 hover:shadow-amber-500/5 transition-all duration-300">
      {/* 1. قسم الصورة */}
      <div className="relative h-48 w-full bg-slate-950 overflow-hidden flex-shrink-0">
        {product.images && product.images.length > 0 ? (
          <Image
            src={product.images[currentImageIndex]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-slate-950 p-4">
            <div className="relative h-14 w-14 opacity-30">
              <Image 
                src="/logo.png" 
                alt="واحة أوسان" 
                fill 
                sizes="56px"
                className="object-contain" 
              />
            </div>
            <span className="mt-1.5 text-xs text-slate-500 font-medium">لا توجد صورة</span>
          </div>
        )}

        {/* شارة الكمية */}
        {product.quantity > 0 ? (
          <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-md border border-amber-500/30 rounded-full px-2.5 py-1 shadow-md select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-bold text-slate-200">المتوفر:</span>
            <span className="text-xs font-black text-amber-400">
              {product.quantity} {unitLabel}
            </span>
          </div>
        ) : (
          <div className="absolute top-2.5 right-2.5 z-10 rounded-full bg-red-500/90 backdrop-blur-md border border-red-400/30 px-2.5 py-1 text-xs font-bold text-white shadow-md">
            نفذت الكمية
          </div>
        )}

        {/* 2. مؤشرات الصور تحولت إلى أزرار للوصولية */}
        {hasMultipleImages && (
          <div 
            className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10 bg-slate-950/60 backdrop-blur-md px-2 py-1 rounded-full border border-white/5"
            aria-label="مؤشرات صور المنتج"
          >
            {product.images.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentImageIndex(idx)}
                aria-label={`الانتقال إلى الصورة رقم ${idx + 1}`}
                className={`h-1 rounded-full transition-all duration-300 focus:outline-none ${
                  idx === currentImageIndex ? "bg-amber-400 w-3.5" : "bg-slate-500/40 w-1"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* 2. قسم المحتوى */}
      <div className="p-3.5 flex flex-col justify-between flex-1 gap-2.5">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-amber-400 group-hover:text-amber-500 transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="pt-2.5 border-t border-slate-800/80 flex flex-col gap-2 mt-auto">
          {/* قسم السعر */}
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-lg sm:text-xl font-black text-amber-400">
                {product.newPrice}
              </span>
              <span className="text-xs font-bold text-amber-500/90">
                {currencySymbol}
              </span>
            </div>

            {product.oldPrice && product.oldPrice > 0 ? (
              <span className="text-xs text-slate-500 line-through font-medium">
                {product.oldPrice} {currencySymbol}
              </span>
            ) : null}
          </div>

          {/* 3. زر التفاصيل بالألوان والمؤثرات المطلوبة */}
          <Link
            href={`/product/${product.id}`}
            aria-label={`عرض تفاصيل المنتج ${product.name}`}
            className="group/btn w-full flex items-center justify-center gap-1.5 rounded-xl bg-slate-800 text-amber-400 hover:bg-amber-500 hover:text-slate-950 py-2 text-xs font-black shadow-[inset_0_4px_8px_rgba(0,0,0,0.35),0_6px_20px_rgba(245,158,11,0.25)] active:translate-y-[1px] active:shadow-[inset_0_6px_10px_rgba(0,0,0,0.45),0_2px_6px_rgba(0,0,0,0.2)] transition-all duration-200 ease-in-out"
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
        </div>
      </div>
    </div>
  );
}