"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useEffect } from "react";

export default function DeveloperPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);

  // إغلاق نافذة التكبير عند الضغط على زر Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsZoomed(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleEmailSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "978bfb8d-f1df-4526-bce2-968252f7c372",
          name: formData.name,
          email: formData.email,
          message: formData.message,
          subject: `رسالة جديدة من موقع واحة أوسان - ${formData.name}`,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setStatusMessage({ text: "تم إرسال رسالتك بنجاح! شكراً للتواصل.", isError: false });
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatusMessage({ text: "حدث خطأ أثناء الإرسال، يرجى المحاولة لاحقاً.", isError: true });
      }
    } catch (error) {
      setStatusMessage({ text: "تعذر الاتصال بالخادم، تحقق من الاتصال بالإنترنت.", isError: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#dccac0]/40 text-slate-800 py-10 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center relative font-sans">
      
      {/* الحاوية الرئيسية */}
      <div className="w-full max-w-4xl bg-[#e6dad1]/80 backdrop-blur-sm rounded-3xl p-6 sm:p-12 shadow-xl border border-amber-900/10 animate-fade-in-up relative">
        
        {/* زر العودة للرئيسية */}
        <div className="w-full flex justify-end mb-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#966432] hover:text-[#7a4e24] font-bold text-sm transition-colors duration-200 cursor-pointer"
          >
            ← الرجوع للمنتجات
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          
          {/* القسم الأيمن: معلومات المطور */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div 
              onClick={() => setIsZoomed(true)}
              className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-slate-900 shadow-lg cursor-zoom-in group"
            >
              <Image
                src="/developer_last_one1.jpg"
                alt="المهندس عبدالله المعافا"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                priority
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-xs bg-black/60 px-2 py-1 rounded-full">🔍</span>
              </div>
            </div>

            <div className="pt-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#855323]">المهندس/ عبدالله المعافا</h1>
              <p className="text-slate-500 text-xs sm:text-sm font-semibold mt-0.5">مهندس ومطور النظام</p>
            </div>

            <hr className="w-3/4 border-slate-300 my-2" />

            <p className="text-slate-700 text-xs sm:text-sm leading-relaxed max-w-xs font-medium">
              موقع عرض المنتجات ومعلوماتها المتوفرة لدى شركة واحة أوسان
            </p>

            <div className="bg-white/80 text-slate-900 border border-slate-200 text-xs font-bold px-4 py-1 rounded-full shadow-sm">
              الاصدار: 1.0.0
            </div>

            <div className="text-xs text-slate-400 space-y-0.5 pt-1">
              <p>جميع الحقوق محفوظة © المهندس عبدالله المعافا 2026</p>
              <p className="dir-ltr">
                هاتف: <a href="tel:783939817" className="hover:underline text-slate-500">783939817</a>
              </p>
            </div>

            <a
              href="https://wa.me/967783939817"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center justify-center px-6 py-2 bg-[#004d25] hover:bg-[#00381b] text-white text-xs font-bold rounded-full transition-all duration-300 shadow-md transform hover:scale-105"
            >
              واتساب الأعمال
            </a>
          </div>

          {/* القسم الأيسر: نموذج التواصل */}
          <div className="space-y-4">
            <div className="text-center md:text-right">
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#855323]">لنكمل معاً</h2>
              <p className="text-xs text-slate-500 mt-1 font-medium">متاح للتدريب، العمل الحر، أو التعاون</p>
            </div>

            <form onSubmit={handleEmailSubmit} className="space-y-3">
              <div>
                <input
                  type="text"
                  required
                  placeholder="الاسم"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white border border-amber-900/20 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#966432] focus:ring-1 focus:ring-[#966432] transition shadow-sm"
                />
              </div>

              <div>
                <input
                  type="email"
                  required
                  placeholder="البريد الالكتروني"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white border border-amber-900/20 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#966432] focus:ring-1 focus:ring-[#966432] transition shadow-sm"
                />
              </div>

              <div>
                <textarea
                  required
                  rows={4}
                  placeholder="الرسالة"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-white border border-amber-900/20 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#966432] focus:ring-1 focus:ring-[#966432] transition resize-none shadow-sm"
                />
              </div>

              {statusMessage && (
                <div
                  className={`p-3 rounded-xl text-xs font-bold text-center transition-all ${
                    statusMessage.isError
                      ? "bg-red-100 text-red-700 border border-red-200"
                      : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                  }`}
                >
                  {statusMessage.text}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-[#966432] hover:bg-[#805328] disabled:bg-slate-400 text-white font-bold text-xs sm:text-sm rounded-xl transition duration-300 shadow-md cursor-pointer"
              >
                {isSubmitting ? "جاري الإرسال..." : "ارسال"}
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* Lightbox - النافذة المنبثقة لتكبير صورة المطور بالحجم الكامل */}
      {isZoomed && (
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
              src="/developer_last_one1.jpg"
              alt="المهندس عبدالله المعافا"
              className="max-h-[85vh] max-w-[90vw] object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}