"use client";

import { useEffect, useState } from "react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // 1. التحكم في ظهور الزر
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      // 2. حساب نسبة التمرير في الصفحة
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      if (docHeight > 0) {
        const progress = (scrollTop / docHeight) * 100;
        setScrollProgress(Math.min(progress, 100)); // التأكد من عدم تجاوز النسبة 100%
      } else {
        setScrollProgress(0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    
    // استدعاء الدالة فوراً لضبط الحالة المبدئية عند التحميل
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // 3. حسابات مسار الدائرة (SVG Circle Math)
  const radius = 20; // نصف قطر الدائرة
  const circumference = 2 * Math.PI * radius; // محيط الدائرة
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="الرجوع لأعلى الصفحة"
      className={`fixed bottom-5 left-5 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#574c26]/90 text-amber-300 backdrop-blur-md shadow-lg transition-all duration-300 hover:bg-amber-500 hover:text-slate-950 hover:scale-110 active:scale-95 group ${
        isVisible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      {/* مؤشر التمرير الدائري حول الزر */}
      <svg
        className="absolute inset-0 h-full w-full -rotate-90 transform"
        viewBox="0 0 48 48"
      >
        {/* الدائرة الخلفية (المسار الباهت) */}
        <circle
          cx="24"
          cy="24"
          r={radius}
          stroke="currentColor"
          strokeWidth="2.5"
          fill="none"
          className="opacity-20"
        />
        {/* دائرة نسبة التمرير الممتلئة */}
        <circle
          cx="24"
          cy="24"
          r={radius}
          stroke="currentColor"
          strokeWidth="2.5"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-150 ease-out group-hover:stroke-slate-950"
        />
      </svg>

      {/* أيقونة سهم متجه للأعلى */}
      <svg
        className="relative z-10 h-5 w-5 stroke-current transition-colors duration-300 group-hover:stroke-slate-950"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="2.5"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.5 15.75l7.5-7.5 7.5 7.5"
        />
      </svg>
    </button>
  );
}