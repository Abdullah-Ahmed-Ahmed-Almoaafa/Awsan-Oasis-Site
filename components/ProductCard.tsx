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
  const hasMultipleImages = product.images && product.images.length > 1;

  useEffect(() => {
    if (!hasMultipleImages) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [hasMultipleImages, product.images]);

  return (
    <div className="group flex flex-col h-full rounded-xl border border-slate-800 bg-slate-900 overflow-hidden shadow-lg hover:border-amber-500/50 transition duration-300">
      {/* 1. قسم الصورة */}
      <div className="relative h-48 w-full bg-slate-950 overflow-hidden flex-shrink-0">
        {product.images && product.images.length > 0 ? (
          <Image
            src={product.images[currentImageIndex]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-all duration-700 ease-in-out"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-slate-950 p-4">
            <div className="relative h-16 w-16 opacity-40">
              <Image 
                src="/logo.png" 
                alt="واحة أوسان" 
                fill 
                sizes="64px"
                className="object-contain" 
              />
            </div>
            <span className="mt-2 text-xs text-slate-500">لا توجد صورة</span>
          </div>
        )}

        {/* شارة نفذت الكمية */}
        {product.quantity <= 0 && (
          <div className="absolute top-2 right-2 z-10 rounded-md bg-red-600 px-2 py-1 text-xs font-bold text-white shadow">
            نفذت الكمية
          </div>
        )}

        {/* مؤشرات دوائر صغيرة (Dots) */}
        {hasMultipleImages && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10 bg-slate-950/60 backdrop-blur-sm px-2 py-1 rounded-full">
            {product.images.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentImageIndex ? "bg-amber-400 w-3" : "bg-slate-500/50 w-1.5"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* 2. قسم المحتوى السفلي */}
      <div className="p-3 flex flex-col justify-between flex-1 gap-2">
        <div>
          <h3 className="text-base font-bold text-amber-300 line-clamp-1">{product.name}</h3>
          <p className="mt-0.5 text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="pt-2 border-t border-slate-800/80 flex flex-col gap-1 mt-auto">
          {/* السعر الحالي */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">السعر الحالي:</span>
            <div className="flex items-baseline gap-1">
              <span className="text-base font-extrabold text-amber-400">
                {product.newPrice}
              </span>
              <span className="text-xs font-bold text-amber-400/80">
                {currencySymbol}
              </span>
            </div>
          </div>

          {/* السعر السابق */}
          {product.oldPrice && product.oldPrice > 0 ? (
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">السعر السابق:</span>
              <div className="text-xs text-slate-500 line-through">
                {product.oldPrice} {currencySymbol}
              </div>
            </div>
          ) : null}

          {/* زر التفاصيل */}
          <Link
            href={`/product/${product.id}`}
            className="mt-1 w-full text-center rounded-lg bg-slate-800 py-1.5 text-xs font-bold text-amber-400 hover:bg-amber-500 hover:text-slate-950 transition"
          >
            التفاصيل
          </Link>
        </div>
      </div>
    </div>
  );
}