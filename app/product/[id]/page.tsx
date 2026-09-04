"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getProductById } from "@/lib/firestore.service";
import { IProduct } from "@/types/product";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();

  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);

  useEffect(() => {
    async function fetchProduct() {
      if (!resolvedParams.id) return;
      try {
        const data = await getProductById(resolvedParams.id);
        setProduct(data);
      } catch (err) {
        console.error("خطأ في جلب تفاصيل المنتج:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [resolvedParams.id]);

  // إغلاق نافذة التكبير عند الضغط على زر Esc
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

  if (!product) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-bold text-slate-300">المنتج غير موجود أو تم حذفه.</h2>
        <button
          onClick={() => router.push("/")}
          className="mt-4 rounded-lg bg-amber-500 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-amber-400 transition"
        >
          العودة للرئيسية
        </button>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [];
  const currencySymbol = product.currency || "ر.ي";
  const firstImageUrl = images.length > 0 ? images[0] : "";

  // نص الواتساب بالتنسيق المطلق تماماً
  const whatsappMessage = 
    `السلام عليكم، أرغب في طلب المنتج التالي:\n` +
    `📌 الاسم: ${product.name}\n` +
    `💰 السعر: ${product.newPrice} ${currencySymbol}\n\n` +
    (firstImageUrl ? `${firstImageUrl}` : "");

  return (
    <div className="max-w-4xl mx-auto py-6">
      <button onClick={() => router.back()} className="mb-6 flex items-center gap-2 text-sm font-semibold text-amber-400 hover:text-amber-300 transition cursor-pointer"> <span>←</span> <span>الرجوع للمنتجات</span> </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        {/* قسم معرض الصور */}
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
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-slate-900/80 text-amber-400 text-xs px-3 py-1.5 rounded-full border border-amber-500/30 backdrop-blur-sm">
                    🔍 اضغط للتكبير
                  </span>
                </div>
              </>
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center bg-slate-950 p-6">
                <div className="relative h-20 w-20 opacity-40">
                  <Image 
                    src="/logo.png" 
                    alt="واحة أوسان" 
                    fill 
                    sizes="80px"
                    className="object-contain" 
                  />
                </div>
                <span className="mt-2 text-xs text-slate-500">لا توجد صورة معروضة</span>
              </div>
            )}
          </div>

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
                    alt={`صورة ${idx + 1}`} 
                    fill 
                    sizes="64px"
                    className="object-cover" 
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* تفاصيل المنتج */}
        <div className="flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <span className="inline-block rounded-md bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-400 border border-amber-500/20">
              </span>
              <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-amber-300">
                {product.name}
              </h1>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>

            <div className="border-t border-slate-800 pt-4 space-y-2">
              {/* السعر الحالي */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">السعر الحالي:</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-extrabold text-amber-400">
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

              {/* الكمية المتوفرة */}
              <div className="flex items-center justify-between pt-1 text-xs text-slate-400">
                <span>الكمية المتوفرة:</span>
                <span className={`font-bold ${product.quantity > 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {product.quantity > 0 ? `${product.quantity} عبوة` : "نفذت الكمية"}
                </span>
              </div>
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
              <span>طلب المنتج عبر الواتساب</span>
            </a>
          </div>
        </div>
      </div>

      {/* Lightbox - النافذة المنبثقة للتكبير بالحجم الكامل */}
      {isZoomed && images.length > 0 && (
        <div
          onClick={() => setIsZoomed(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 transition-all"
        >
          {/* زر الإغلاق X في الأعلى على اليسار */}
          <button
            onClick={() => setIsZoomed(false)}
            className="absolute top-5 left-5 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-slate-800/80 text-white hover:bg-red-600 transition border border-slate-700 shadow-lg"
            title="إغلاق"
          >
            ✕
          </button>

          {/* حاوية الصورة الحافظة لأبعادها الكاملة */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-xl shadow-2xl border border-slate-800"
          >
            <img
              src={images[selectedImageIndex]}
              alt={product.name}
              className="max-h-[85vh] max-w-[90vw] object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}