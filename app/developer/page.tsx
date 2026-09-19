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

  // إغلاق نافذة التكبير عند الضغط على Esc
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
    <div dir="rtl" className="min-h-screen bg-[#070d0a] text-slate-100 py-8 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center relative font-sans overflow-hidden selection:bg-[#00ff3b] selection:text-black">
      
      {/* توهجات زمردية خلفية خفيفة ولطيفة */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#00ff3b]/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-emerald-600/10 rounded-full blur-[110px] pointer-events-none" />

      {/* إشعار النسخ (Toast) بأسلوب زجاجي راقٍ */}
      <div
        className={`fixed bottom-6 z-50 bg-slate-900/90 text-white text-xs font-bold px-5 py-2.5 rounded-2xl shadow-[0_10px_30px_rgba(0,255,59,0.2)] flex items-center gap-2.5 border border-[#00ff3b]/40 backdrop-blur-xl transition-all duration-300 ease-out ${
          copied ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <span className="flex h-2.5 w-2.5 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff3b] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00ff3b]"></span>
        </span>
        <span>تم نسخ رقم الهاتف بنجاح!</span>
      </div>

      {/* الحاوية الرئيسية (الكارت الزجاجي اللطيف) */}
      <div className="w-full max-w-3xl bg-slate-950/80 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] border border-white/10 relative z-10">
        
        {/* خط مضيء علوي */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#00ff3b]/50 to-transparent rounded-t-3xl" />

        {/* زر العودة */}
        <div className="w-full flex justify-end mb-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-[#00ff3b]/10 border border-white/10 hover:border-[#00ff3b]/30 text-[#00ff3b] font-bold text-xs transition-all duration-200 cursor-pointer active:scale-95"
          >
            <span className="transition-transform duration-200 group-hover:-translate-x-1">←</span> الرجوع للمنتجات
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          
          {/* القسم الأيمن: هوية المطور (بحجم ألطف وأصغر) */}
          <div className="flex flex-col items-center text-center space-y-3">
            
            {/* الصورة الشخصية */}
            <div 
              onClick={() => setIsZoomed(true)}
              className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden border-2 border-[#00ff3b]/80 p-1 bg-slate-950 shadow-[0_0_20px_rgba(0,255,59,0.2)] cursor-pointer group transition-all duration-300 hover:scale-105"
            >
              <div className="relative w-full h-full rounded-full overflow-hidden">
                <Image
                  src="/developer_last_one1.jpg"
                  alt="المهندس عبدالله المعافا"
                  fill
                  sizes="(max-width: 640px) 128px, 144px"
                  className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                  priority
                />
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[1px]">
                  <span className="text-white text-[10px] font-bold bg-black/60 px-2.5 py-1 rounded-full border border-white/20">
                    🔍 تكبير
                  </span>
                </div>
              </div>
            </div>

            {/* الاسم والعنوان */}
            <div className="pt-1 space-y-0.5">
              <h1 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-emerald-100 to-[#00ff3b] tracking-tight">
                المهندس/ عبدالله المعافا
              </h1>
              <p className="text-emerald-400 font-bold text-xs tracking-wide">
                مهندس ومطور النظام والواجهات
              </p>
            </div>

            <p className="text-slate-300 text-xs leading-relaxed max-w-xs font-medium border-t border-b border-white/5 py-2 my-1">
              موقع عرض المنتجات والمعلومات المتوفرة لدى شركة واحة أوسان
            </p>

            {/* شارات الحالة والإصدار */}
            <div className="flex items-center gap-2">
              <div className="bg-emerald-950/60 border border-[#00ff3b]/30 text-[#00ff3b] text-[10px] font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00ff3b] animate-ping" />
                متاح للتعاون
              </div>
              <div className="bg-slate-900 border border-slate-800 text-slate-400 text-[10px] font-bold px-2.5 py-1 rounded-full">
                الإصدار 1.0.0
              </div>
            </div>

            {/* معلومات التواصل والنسخ */}
            <div className="text-xs text-slate-400 space-y-1.5 pt-1 flex flex-col items-center font-medium w-full">
              <div className="flex items-center gap-2 bg-white/[0.03] px-3 py-1.5 rounded-xl border border-white/5">
                <span>الهاتف:</span>
                <a href={`tel:${phoneNumber}`} className="text-emerald-400 font-bold hover:underline dir-ltr">
                  +967 {phoneNumber}
                </a>
                <button
                  type="button"
                  onClick={handleCopyPhone}
                  title="نسخ الرقم"
                  className="mr-1 p-1 rounded-md hover:bg-white/10 text-slate-400 hover:text-[#00ff3b] transition active:scale-95 cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                  </svg>
                </button>
              </div>
              <p className="text-[10px] text-slate-500">جميع الحقوق محفوظة © المهندس عبدالله المعافا 2026</p>
            </div>

            {/* زر الواتساب */}
            <a
              href="https://wa.me/967783939817"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#006d19] via-[#008a20] to-[#00ff3b] text-slate-950 font-black text-xs rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(0,109,25,0.4)] hover:shadow-[0_0_25px_rgba(0,255,59,0.7)] active:scale-95 overflow-hidden cursor-pointer"
            >
              <svg className="w-4 h-4 fill-slate-950 transition-transform duration-300 group-hover:-translate-x-0.5" viewBox="0 0 24 24">
                <path d="M12.031 0c-6.627 0-12 5.373-12 12 0 2.159.57 4.26 1.652 6.12l-1.683 6.148 6.291-1.65c1.782.972 3.801 1.482 5.74 1.482 6.627 0 12-5.373 12-12s-5.373-12-12-12zm0 22c-1.817 0-3.593-.485-5.148-1.403l-.369-.219-3.827 1.004 1.023-3.731-.241-.383c-1.012-1.611-1.547-3.483-1.547-5.388 0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10zm5.483-7.466c-.301-.151-1.777-.877-2.053-.977-.276-.1-.477-.151-.678.151-.201.301-.778.977-.954 1.178-.176.201-.351.226-.652.075-1.782-.892-2.955-1.593-4.137-3.621-.314-.541.314-.502.898-1.67.075-.151.038-.276-.019-.377-.057-.101-.678-1.633-.929-2.235-.245-.587-.495-.507-.678-.517-.176-.008-.377-.01-.578-.01s-.527.075-.803.377c-.276.301-1.054 1.03-1.054 2.512s1.079 2.913 1.23 3.114c.151.201 2.122 3.24 5.141 4.544 2.152.929 2.981.931 4.037.777.627-.091 1.777-.728 2.028-1.431.251-.703.251-1.306.176-1.431-.075-.126-.276-.201-.577-.352z"/>
              </svg>
              <span>مراسلة مباشرة عبر الواتساب</span>
            </a>
          </div>

          {/* القسم الأيسر: نموذج التواصل التفاعلي المبسط */}
          <div className="space-y-4 bg-white/[0.02] p-5 sm:p-6 rounded-2xl border border-white/5 relative">
            <div className="text-center md:text-right space-y-0.5">
              <h2 className="text-xl font-black text-[#00ff3b] tracking-wide">دعنا نتواصل</h2>
              <p className="text-xs text-slate-400 font-medium">أرسل رسالتك مباشرة وسأقوم بالرد عليك قريباً</p>
            </div>

            <form onSubmit={handleEmailSubmit} className="space-y-3">
              <div>
                <input
                  type="text"
                  required
                  placeholder="الاسم"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-900/90 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#00ff3b] focus:ring-1 focus:ring-[#00ff3b] transition duration-200 shadow-inner font-medium"
                />
              </div>

              <div>
                <input
                  type="email"
                  required
                  placeholder="البريد الإلكتروني"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-900/90 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#00ff3b] focus:ring-1 focus:ring-[#00ff3b] transition duration-200 shadow-inner font-medium"
                />
              </div>

              <div>
                <textarea
                  required
                  rows={3}
                  placeholder="اكتب رسالتك أو استفسارك هنا..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-slate-900/90 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#00ff3b] focus:ring-1 focus:ring-[#00ff3b] transition duration-200 resize-none shadow-inner font-medium"
                />
              </div>

              {statusMessage && (
                <div
                  className={`p-2.5 rounded-xl text-xs font-bold text-center transition-all duration-300 ${
                    statusMessage.isError
                      ? "bg-red-950/80 text-red-300 border border-red-800/80"
                      : "bg-emerald-950/80 text-[#00ff3b] border border-[#006d19]"
                  }`}
                >
                  {statusMessage.text}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-gradient-to-r from-[#006d19] to-[#008a20] hover:from-[#00ff3b] hover:to-[#00c82a] hover:text-slate-950 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 text-white font-black text-xs rounded-xl transition duration-300 shadow-md hover:shadow-[0_0_20px_rgba(0,255,59,0.4)] cursor-pointer active:scale-95 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>جاري الإرسال...</span>
                  </>
                ) : (
                  <span>إرسال الرسالة</span>
                )}
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* Lightbox - النافذة المنبثقة لتكبير الصورة */}
      {isZoomed && (
        <div
          onClick={() => setIsZoomed(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 transition-all duration-300"
        >
          <button
            onClick={() => setIsZoomed(false)}
            className="absolute top-5 left-5 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-red-600 transition duration-200 border border-white/20 shadow-xl cursor-pointer"
            title="إغلاق"
          >
            ✕
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[85vh] max-w-[90vw] overflow-hidden rounded-2xl shadow-[0_0_40px_rgba(0,255,59,0.25)] border border-[#00ff3b]/40"
          >
            <img
              src="/developer_last_one1.jpg"
              alt="المهندس عبدالله المعافا"
              className="max-h-[80vh] max-w-[90vw] object-contain rounded-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}