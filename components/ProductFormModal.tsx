"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { IProduct } from "@/types/product";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<IProduct, "id">) => Promise<void>;
  initialData?: IProduct | null;
}

export default function ProductFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: ProductFormModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [oldPrice, setOldPrice] = useState<number | "">(0);
  const [newPrice, setNewPrice] = useState<number | "">(0);
  const [quantity, setQuantity] = useState<number | "">(10);
  const [currency, setCurrency] = useState("ر.ي");
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setDescription(initialData.description || "");
      setOldPrice(initialData.oldPrice || 0);
      setNewPrice(initialData.newPrice || 0);
      setQuantity(initialData.quantity || 0);
      setCurrency(initialData.currency || "ر.ي");
      setImages(initialData.images || []);
    } else {
      setName("");
      setDescription("");
      setOldPrice(0);
      setNewPrice(0);
      setQuantity(10);
      setCurrency("ر.ي");
      setImages([]);
    }
    setUploadError("");
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  // دالة تصغير وضغط الصورة تلقائياً لضمان عدم تجاوز سعة Firestore (1MB)
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 800; // أقصى عرض كافٍ للشاشات والموبايل
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

          // تحويل الصورة لجودة 70% بصيغة JPEG للحصول على حجم صغير جداً
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
          resolve(compressedBase64);
        };
      };
    });
  };

  // معالجة اختيار ورفع الصور مع شرط ألا تتعدى 4 صور
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError("");
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // التحقق من أن إجمالي الصور لا يتجاوز 4 صور
    if (images.length + files.length > 4) {
      setUploadError("الحد الأقصى المسموح به هو 4 صور فقط للمنتج.");
      return;
    }

    const compressedPromises = Array.from(files).map((file) => compressImage(file));
    const newCompressedImages = await Promise.all(compressedPromises);

    setImages((prev) => [...prev, ...newCompressedImages]);
    e.target.value = ""; // إعادة ضبط حقل الاختيار
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setUploadError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit({
        name,
        description,
        oldPrice: Number(oldPrice) || 0,
        newPrice: Number(newPrice) || 0,
        quantity: Number(quantity) || 0,
        currency,
        images,
        createdAt: initialData?.createdAt || new Date(),
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl my-8">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <h2 className="text-lg font-bold text-amber-400">
            {initialData ? "تعديل المنتج" : "إضافة منتج جديد"}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">اسم المنتج</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">وصف المنتج</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
            />
          </div>

          {/* شبكة الأسعار والعملة والكمية */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">السعر السابق</label>
              <input
                type="number"
                value={oldPrice}
                onChange={(e) => setOldPrice(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">السعر الحالي</label>
              <input
                type="number"
                required
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">العملة</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-amber-400 font-bold focus:border-amber-500 focus:outline-none cursor-pointer"
              >
                <option value="ر.ي">يمني(ر.ي)</option>
                <option value="ر.س">سعودي(ر.س)</option>
                <option value="$">دولار ($)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">الكمية</label>
              <input
                type="number"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* قسم اختيار الصور من الجهاز */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-slate-300">
                صور المنتج (رفع من الجهاز)
              </label>

              {/* عداد الصور المضافة */}
              <span className="text-[11px] text-amber-400 font-semibold">
                {images.length} / 4 صور
              </span>
            </div>

            <input
              type="file"
              accept="image/*"
              multiple
              disabled={images.length >= 4}
              onChange={handleFileUpload}
              className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-500 file:text-slate-950 hover:file:bg-amber-400 cursor-pointer bg-slate-950 rounded-xl border border-slate-700 p-1 disabled:opacity-50 disabled:cursor-not-allowed"
            />

            {/* رسالة الخطأ في حال تجاوز 4 صور */}
            {uploadError && (
              <p className="text-red-400 text-xs mt-1 font-semibold">{uploadError}</p>
            )}

            {/* عرض معاينة الصور */}
            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-2 pt-3">
                {images.map((img, i) => (
                  <div key={i} className="relative h-16 w-full rounded-lg overflow-hidden border border-slate-700 group">
                    <Image src={img} alt="" fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(i)}
                      className="absolute top-1 right-1 rounded-full bg-red-600/80 p-1 text-white text-xs hover:bg-red-600"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-xl bg-amber-500 py-2.5 text-sm font-bold text-slate-950 hover:bg-amber-400 transition disabled:opacity-50"
            >
              {loading ? "جاري الحفظ..." : initialData ? "حفظ التعديلات" : "إضافة المنتج"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-300 hover:bg-slate-700"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}