"use client";

import { useState } from "react";
import Image from "next/image";

export default function InfoSideWidget() {
  const [isOpen, setIsOpen] = useState(false);

  const handleWidth = "w-[12px]";

  const handleScrollToFooter = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsOpen(false);

    const footerElement =
      document.getElementById("footer") ||
      document.querySelector("footer");

    if (footerElement) {
      footerElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  return (
    <aside
      dir="rtl"
      className={`fixed top-1/2 -translate-y-1/2 left-0 z-50 transition-transform duration-500 ease-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="relative flex items-stretch">
        {/* جسم البطاقة */}
        <div
          className="
            w-[82vw]
            sm:w-[320px]
            bg-white
            border
            border-slate-100
            shadow-[0_20px_50px_rgba(0,0,0,0.2)]
            p-5
            sm:p-6
            text-slate-800
            flex
            flex-col
            items-center
            text-center
            relative
            border-l-0
          "
        >
          {/* زر الإغلاق */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="
              absolute
              top-3
              left-3
              text-slate-400
              hover:text-slate-700
              text-xs
              p-1
              transition
            "
            title="إغلاق"
            aria-label="إغلاق البطاقة"
          >
            ✕
          </button>

          {/* Logo */}
          <div className="relative h-12 w-12 sm:h-14 sm:w-14 mb-3">
            <Image
              src="/logo.png"
              alt="واحة أوسان"
              fill
              sizes="(max-width: 640px) 48px, 56px"
              className="object-contain"
              priority
            />
          </div>

          {/* النص التوضيحي */}
          <p
            className="
              text-xs
              sm:text-sm
              text-slate-600
              font-medium
              leading-7
              tracking-[0.025em]
              mb-5
            "
          >
            <span className="block mb-2 font-bold text-slate-800">
              هل ترغب في معرفة المزيد عن أنواع العسل التي نقدمها؟
            </span>
            تجدون المزيد من الشروحات والفيديوهات والمعلومات والتفاصيل حول كل
            نوع من أنواع العسل عبر صفحاتنا الرسمية على منصات التواصل الاجتماعي،
            الموجودة في أسفل الصفحة.
          </p>

          {/* زر الانتقال إلى Footer */}
          <button
            type="button"
            onClick={handleScrollToFooter}
            className="
              flex
              items-center
              justify-center
              h-11
              w-11
              rounded-full
              bg-amber-500
              text-white
              border
              border-amber-600
              hover:bg-amber-600
              hover:scale-110
              animate-bounce
              transition-all
              duration-300
              shadow-md
              cursor-pointer
            "
            title="الانتقال إلى أسفل الصفحة"
            aria-label="الانتقال إلى منصات التواصل الاجتماعي"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 5.25l-7.5 7.5-7.5-7.5m15 6l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </button>
        </div>

        {/* المقبض الجانبي المحدث مع التعتيم الأوتوماتيكي المستمر */}
        <button
          type="button"
          onClick={() => setIsOpen((previous) => !previous)}
          className={`
            absolute
            left-full
            ${handleWidth}
            backdrop-blur-md
            flex
            items-center
            justify-center
            shadow-lg
            transition-all
            duration-500
            ease-in-out
            cursor-pointer
            border
            border-slate-700/50
            border-l-0
            ${
              isOpen
                ? "top-0 h-full rounded-r-xl bg-slate-900/40 hover:bg-slate-900/70"
                : "top-1/2 -translate-y-1/2 h-[30%] rounded-r-xl animate-pulse bg-slate-900/40 hover:bg-slate-900/80"
            }
          `}
          title={isOpen ? "إغلاق" : "عرض المزيد من الشروحات"}
          aria-label={isOpen ? "إغلاق البطاقة" : "فتح بطاقة المعلومات"}
          aria-expanded={isOpen}
        >
          <span
            className={`
              inline-block
              text-xs
              font-black
              text-amber-400
              drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]
              leading-none
              transition-transform
              duration-500
              ${isOpen ? "rotate-180" : "rotate-0"}
            `}
          >
            ❮
          </span>
        </button>
      </div>
    </aside>
  );
}