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
      
      {/* أيقونة العدسة SVG في اليمين */}
      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-colors">
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </span>

      {/* زر الحذف X في اليسار */}
      {searchTerm && (
        <button
          type="button"
          onClick={() => setSearchTerm("")}
          className="absolute left-3 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-slate-700 text-xs text-slate-300 hover:bg-slate-600 hover:text-white transition"
          aria-label="مسح البحث"
        >
          ✕
        </button>
      )}
    </div>
  );
}