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
          {/* روابط الشاشات الكبيرة (في اليسار) */}
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

          {/* زر القائمة للشاشات الصغيرة */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-slate-900 hover:bg-white/20 transition cursor-pointer"
            aria-label="Toggle Menu"
          >
            <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path fillRule="evenodd" clipRule="evenodd" d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z" />
              ) : (
                <path fillRule="evenodd" d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* قائمة الموبايل مع تأثير انزلاق وتلاشي سلس */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out border-t border-white/20 bg-white/80 backdrop-blur-md px-4 text-slate-900 ${
          isMenuOpen ? "max-h-52 opacity-100 py-3 space-y-2" : "max-h-0 opacity-0 py-0"
        }`}
      >
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
      </div>
    </header>
  );
}