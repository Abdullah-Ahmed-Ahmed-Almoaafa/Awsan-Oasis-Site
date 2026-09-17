"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/20 bg-white/10 text-slate-900 backdrop-blur-md shadow-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
        <Link href="/" className="flex items-center gap-3 font-bold text-xl sm:text-2xl text-amber-300 hover:text-amber-200 transition">
          <div className="relative h-9 w-9 overflow-hidden rounded-lg">
            <Image
              src="/logo.png"
              alt="شعار واحة أوسان"
              fill
              sizes="36px"
              className="object-contain"
              priority
            />
          </div>
          <span>واحة أوسان</span>
        </Link>

        <div className="flex items-center gap-6">
          {/* روابط الشاشات الكبيرة */}
          <nav className="hidden md:flex items-center gap-6 font-semibold text-sm text-slate-900">
            <Link href="/" className="hover:text-amber-600 transition">
              الرئيسية
            </Link>
            <Link href="/#products" className="hover:text-amber-600 transition">
              المنتجات
            </Link>
            <Link href="/developer" className="hover:text-amber-600 transition">
              المطور
            </Link>
          </nav>

          {/* زر القائمة للشاشات الصغيرة مع أنيميشن التباعد والدوران للخطوط */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden relative flex h-10 w-10 flex-col items-center justify-center rounded-md text-slate-900 hover:bg-white/20 transition cursor-pointer"
            aria-label="Toggle Menu"
          >
            <div className="flex h-5 w-6 flex-col justify-between">
              <span
                className={`h-0.5 w-full bg-slate-900 rounded-full transition-all duration-300 ease-in-out origin-right ${
                  isMenuOpen ? "-rotate-45 -translate-x-0.5" : ""
                }`}
              />
              <span
                className={`h-0.5 w-full bg-slate-900 rounded-full transition-all duration-300 ease-in-out ${
                  isMenuOpen ? "opacity-0 scale-0" : "opacity-100"
                }`}
              />
              <span
                className={`h-0.5 w-full bg-slate-900 rounded-full transition-all duration-300 ease-in-out origin-right ${
                  isMenuOpen ? "rotate-45 -translate-x-0.5" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* قائمة الموبايل بإنيميشن متناسق جداً في الفتح والإغلاق */}
      <div
        className={`grid md:hidden transition-all duration-300 ease-in-out border-t border-white/20 bg-white/80 backdrop-blur-md px-4 text-slate-900 ${
          isMenuOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <nav className="py-3 space-y-2">
            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 text-sm font-semibold hover:text-amber-600 transition"
            >
              الرئيسية
            </Link>
            <Link
              href="/#products"
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 text-sm font-semibold hover:text-amber-600 transition"
            >
              المنتجات
            </Link>
            <Link
              href="/developer"
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 text-sm font-semibold hover:text-amber-600 transition"
            >
              المطور
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}