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
  const [copied, setCopied] = useState<boolean>(false);

  const phoneNumber = "783939817";

  // إغلاق نافذة التكبير عند الضغط على زر Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsZoomed(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // دالة نسخ الرقم للذاكرة الحافظة
  const handleCopyPhone = async () => {
    try {
      await navigator.clipboard.writeText(phoneNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("فشل نسخ الرقم", err);
    }
  };

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
      
      {/* إشعار نسخ رقم الهاتف (Toast) */}
      <div
        className={`fixed bottom-6 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-slate-700 transition-all duration-300 ${
          copied ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <span className="text-emerald-400">✓</span>
        <span>تم نسخ رقم الهاتف للذاكرة!</span>
      </div>

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

            <div className="text-xs text-slate-400 space-y-1 pt-1 flex flex-col items-center">
              <p>جميع الحقوق محفوظة © المهندس عبدالله المعافا 2026</p>
              
              <div className="flex items-center gap-2">
                <p className="dir-ltr">
                  هاتف: <a href={`tel:${phoneNumber}`} className="hover:underline text-slate-600 font-semibold">{phoneNumber}</a>
                </p>
                {/* زر نسخ الرقم */}
                <button
                  type="button"
                  onClick={handleCopyPhone}
                  title="نسخ الرقم"
                  className="p-1 rounded-md hover:bg-black/5 text-slate-500 hover:text-slate-800 transition active:scale-95 cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                  </svg>
                </button>
              </div>
            </div>

            <a
              href="https://wa.me/967783939817"
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-3 inline-flex items-center justify-center gap-2.5 px-6 py-2.5 bg-[#004d25] hover:bg-[#25D366] hover:text-slate-900 text-white text-xs font-bold rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1 active:translate-y-0 cursor-pointer animate-[pulseScale_2.5s_infinite_ease-in-out]"
            >
              <svg 
                className="w-4 h-4 fill-current transition-transform duration-300 group-hover:-translate-x-1" 
                viewBox="0 0 24 24"
              >
                <path d="M12.031 0c-6.627 0-12 5.373-12 12 0 2.159.57 4.26 1.652 6.12l-1.683 6.148 6.291-1.65c1.782.972 3.801 1.482 5.74 1.482 6.627 0 12-5.373 12-12s-5.373-12-12-12zm0 22c-1.817 0-3.593-.485-5.148-1.403l-.369-.219-3.827 1.004 1.023-3.731-.241-.383c-1.012-1.611-1.547-3.483-1.547-5.388 0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10zm5.483-7.466c-.301-.151-1.777-.877-2.053-.977-.276-.1-.477-.151-.678.151-.201.301-.778.977-.954 1.178-.176.201-.351.226-.652.075-1.782-.892-2.955-1.593-4.137-3.621-.314-.541.314-.502.898-1.67.075-.151.038-.276-.019-.377-.057-.101-.678-1.633-.929-2.235-.245-.587-.495-.507-.678-.517-.176-.008-.377-.01-.578-.01s-.527.075-.803.377c-.276.301-1.054 1.03-1.054 2.512s1.079 2.913 1.23 3.114c.151.201 2.122 3.24 5.141 4.544 2.152.929 2.981.931 4.037.777.627-.091 1.777-.728 2.028-1.431.251-.703.251-1.306.176-1.431-.075-.126-.276-.201-.577-.352z"/>
              </svg>

              <span>تواصل معي عبر الواتساب</span>
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