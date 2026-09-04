"use client";

interface ProductSearchProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export default function ProductSearch({ searchTerm, setSearchTerm }: ProductSearchProps) {
  return (
    <div className="relative w-full max-w-md mx-auto mb-8">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="ابحث عن نوع عسل..."
        className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 pl-10 pr-10 text-sm text-slate-100 placeholder-slate-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 shadow-inner"
      />
      {/* أيقونة العدسة في اليمين */}
      <span className="absolute right-3 top-3.5 text-slate-400 text-sm pointer-events-none">
        🔍
      </span>

      {/* زر الحذف X في اليسار لتمكين المسح الفوري */}
      {searchTerm && (
        <button
          type="button"
          onClick={() => setSearchTerm("")}
          className="absolute left-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-slate-700 text-xs text-slate-200 hover:bg-slate-600 hover:text-white transition"
          aria-label="مسح البحث"
        >
          ✕
        </button>
      )}
    </div>
  );
}