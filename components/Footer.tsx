import Link from "next/link";

export default function Footer() {
  return (
    <footer id="footer" className="w-full bg-slate-900 text-slate-300 border-t border-slate-800 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-800 pb-6">
          <div className="text-center md:text-right">
            <h3 className="text-xl font-bold text-amber-400">واحة أوسان للعسل</h3>
            <p className="text-xs text-slate-400 mt-1">
              أجود أنواع العسل اليمني الطبيعي والمضمون
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            <a
              href="https://wa.me/967777376160"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 hover:bg-emerald-900 transition"
            >
              واتساب الأعمال
            </a>
            <a
              href="https://www.facebook.com/share/1D5yxoVxkd/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 transition"
            >
              فيسبوك
            </a>
            <a
              href="https://www.instagram.com/samehra2024?utm_source=qr&igsi=NTRyNHkwajJoNnJu"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 transition"
            >
              إنستقرام
            </a>
            <a
              href="https://x.com/AboSheebsameh"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 transition"
            >
              X (تويتر)
            </a>
          </div>
        </div>

        {/* منطقة الحقوق القابلة للنقر بالكامل للتحويل لصفحة المطور */}
        <div className="pt-4 text-center text-xs text-slate-400 space-y-1">
          <Link
            href="/developer"
            className="inline-block group p-2 rounded-xl hover:bg-slate-800/50 transition-all duration-300 cursor-pointer"
            title="معلومات المطور والتواصل"
          >
            <p className="group-hover:text-amber-400 transition-colors font-medium">
              جميع الحقوق محفوظة © المهندس عبدالله المعافا 2026
            </p>
            <p className="font-mono text-amber-400/80 group-hover:text-amber-300 transition-colors mt-0.5 dir-ltr">
              هاتف: 783939817
            </p>
          </Link>
        </div>
      </div>
    </footer>
  );
}