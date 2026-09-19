"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { IOffer, StockStatus } from "@/types/offer";

interface OfferFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<IOffer, "id">) => Promise<void>;
  initialData?: IOffer | null;
}

const PRESET_UNITS = ["عرض / عروض", "باقة", "مجموعة", "كيلو", "علبة", "كرتون"];

export default function OfferFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: OfferFormModalProps) {
  const [title, setTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [itemsText, setItemsText] = useState("");
  const [originalPrice, setOriginalPrice] = useState<number | "">(0);
  const [offerPrice, setOfferPrice] = useState<number | "">(0);
  const [stockStatus, setStockStatus] = useState<StockStatus>("LIMITED");
  const [remainingQuantity, setRemainingQuantity] = useState<number | "">("");
  const [unitSelect, setUnitSelect] = useState("عرض / عروض");
  const [customUnit, setCustomUnit] = useState("");
  const [currency, setCurrency] = useState("ر.ي");
  const [isActive, setIsActive] = useState(true);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setTagline(initialData.tagline || "");
      setDescription(initialData.description || "");
      setItemsText(initialData.items ? initialData.items.join("\n") : "");
      setOriginalPrice(initialData.originalPrice || 0);
      setOfferPrice(initialData.offerPrice || 0);
      setStockStatus(initialData.stockStatus || "LIMITED");
      setRemainingQuantity(
        initialData.remainingQuantity !== undefined ? initialData.remainingQuantity : ""
      );
      setCurrency(initialData.currency || "ر.ي");
      setIsActive(initialData.isActive ?? true);
      setImages(initialData.images || []);

      const currentUnit = initialData.unit || "عرض / عروض";
      if (PRESET_UNITS.includes(currentUnit)) {
        setUnitSelect(currentUnit);
        setCustomUnit("");
      } else {
        setUnitSelect("custom");
        setCustomUnit(currentUnit);
      }
    } else {
      setTitle("");
      setTagline("");
      setDescription("");
      setItemsText("");
      setOriginalPrice(0);
      setOfferPrice(0);
      setStockStatus("LIMITED");
      setRemainingQuantity("");
      setUnitSelect("عرض / عروض");
      setCustomUnit("");
      setCurrency("ر.ي");
      setIsActive(true);
      setImages([]);
    }
    setUploadError("");
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", 0.7));
        };
      };
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError("");
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > 4) {
      setUploadError("الحد الأقصى المسموح به هو 4 صور فقط للعرض.");
      return;
    }

    const compressedPromises = Array.from(files).map((file) => compressImage(file));
    const newCompressedImages = await Promise.all(compressedPromises);
    setImages((prev) => [...prev, ...newCompressedImages]);
    e.target.value = "";
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setUploadError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const finalUnit = unitSelect === "custom" ? customUnit.trim() || "عرض / عروض" : unitSelect;
    const itemsArray = itemsText
      .split("\n")
      .map((i) => i.trim())
      .filter((i) => i.length > 0);

    const offerPayload: any = {
      title,
      tagline,
      description,
      items: itemsArray,
      originalPrice: Number(originalPrice) || 0,
      offerPrice: Number(offerPrice) || 0,
      stockStatus,
      unit: finalUnit,
      currency,
      isActive,
      images,
      createdAt: initialData?.createdAt || new Date(),
    };

    if (stockStatus === "LIMITED" && remainingQuantity !== "" && remainingQuantity !== undefined) {
      offerPayload.remainingQuantity = Number(remainingQuantity);
    }

    try {
      await onSubmit(offerPayload);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 sm:p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-2xl flex flex-col max-h-[90vh]">
        {/* رأس النافذة */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3 shrink-0">
          <h2 className="text-base font-bold text-amber-400">
            {initialData ? "تعديل العرض" : "إضافة عرض جديد"}
          </h2>
          <button 
            type="button" 
            onClick={onClose} 
            className="text-slate-400 hover:text-white text-lg font-bold px-2"
          >
            ✕
          </button>
        </div>

        {/* جسم الاستمارة - يتلقى السكرول عند الكبر */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-y-auto space-y-3 pr-1 pl-1 custom-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">عنوان العرض</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">شارة العرض (Tagline)</label>
              <input
                type="text"
                placeholder="التوصيل مجاناً..."
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">وصف العرض</label>
            <textarea
              rows={2}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-white focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">محتويات العرض (سطر لكل عنصر)</label>
            <textarea
              rows={2}
              placeholder={"عسل سدر 1 كيلو\nمكسرات مجاناً"}
              value={itemsText}
              onChange={(e) => setItemsText(e.target.value)}
              className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-white focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">السعر السابق</label>
              <input
                type="number"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-xs text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">سعر العرض</label>
              <input
                type="number"
                required
                value={offerPrice}
                onChange={(e) => setOfferPrice(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-xs text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">العملة</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-amber-400 font-bold focus:border-amber-500 focus:outline-none cursor-pointer"
              >
                <option value="ر.ي">يمني (ر.ي)</option>
                <option value="ر.س">سعودي (ر.س)</option>
                <option value="$">دولار ($)</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">الوحدة</label>
              <select
                value={unitSelect}
                onChange={(e) => setUnitSelect(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-amber-400 font-bold focus:border-amber-500 focus:outline-none cursor-pointer"
              >
                {PRESET_UNITS.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
                <option value="custom">✍️ أخرى...</option>
              </select>
            </div>
          </div>

          {unitSelect === "custom" && (
            <div>
              <input
                type="text"
                required
                placeholder="الوحدة المخصصة..."
                value={customUnit}
                onChange={(e) => setCustomUnit(e.target.value)}
                className="w-full rounded-xl border border-amber-500/50 bg-slate-950 px-3 py-1.5 text-xs text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 border-t border-slate-800 pt-2.5">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">حالة التوفر</label>
              <select
                value={stockStatus}
                onChange={(e) => setStockStatus(e.target.value as StockStatus)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-amber-400 font-bold focus:border-amber-500 focus:outline-none cursor-pointer"
              >
                <option value="AVAILABLE">الكمية متوفرة</option>
                <option value="LIMITED">الكمية محدودة</option>
                <option value="PRE_ORDER">طلب مسبق</option>
                <option value="OUT_OF_STOCK">نفذت الكمية</option>
              </select>
            </div>

            {stockStatus === "LIMITED" && (
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">العدد المتبقي (اختياري)</label>
                <input
                  type="number"
                  placeholder="مثال: 5"
                  value={remainingQuantity}
                  onChange={(e) => setRemainingQuantity(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-[11px] font-semibold text-slate-300">صور العرض</label>
              <span className="text-[10px] text-amber-400 font-semibold">{images.length} / 4 صور</span>
            </div>
            <input
              type="file"
              accept="image/*"
              multiple
              disabled={images.length >= 4}
              onChange={handleFileUpload}
              className="w-full text-xs text-slate-400 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-[11px] file:font-semibold file:bg-amber-500 file:text-slate-950 cursor-pointer bg-slate-950 rounded-xl border border-slate-700 p-1"
            />
            {uploadError && <p className="text-red-400 text-xs mt-1 font-semibold">{uploadError}</p>}
            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-2 pt-2">
                {images.map((img, i) => (
                  <div key={i} className="relative h-14 w-full rounded-lg overflow-hidden border border-slate-700">
                    <Image src={img} alt="" fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(i)}
                      className="absolute top-1 right-1 rounded-full bg-red-600/80 p-0.5 px-1.5 text-white text-[10px]"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 pt-1 mb-2">
            <input
              type="checkbox"
              id="isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4 rounded accent-amber-500 cursor-pointer"
            />
            <label htmlFor="isActive" className="text-xs text-slate-300 cursor-pointer font-semibold">
              تفعيل العرض فور الحفظ
            </label>
          </div>

          {/* أزرار الإجراءات - مثبيتة دائماً في أسفل النافذة */}
          <div className="pt-3 border-t border-slate-800 flex gap-3 shrink-0 mt-auto">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-xl bg-amber-500 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? "جاري الحفظ..." : initialData ? "حفظ التعديلات" : "إضافة العرض"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 cursor-pointer"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}