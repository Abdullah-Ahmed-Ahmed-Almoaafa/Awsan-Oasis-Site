"use client";

interface ConfirmLogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export default function ConfirmLogoutModal({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
}: ConfirmLogoutModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-center space-y-4">
        {/* أيقونة خروج مميزة */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-950/80 border border-red-800/50 text-red-400 text-2xl">
          🚪
        </div>

        {/* النصوص */}
        <div>
          <h3 className="text-lg font-bold text-white mb-1">تأكيد تسجيل الخروج</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            هل أنت متأكد من رغبتك في تسجيل الخروج من لوحة التحكم؟
          </p>
        </div>

        {/* أزرار التحكم */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 rounded-xl bg-red-600 py-2.5 text-xs font-bold text-white hover:bg-red-500 transition shadow disabled:opacity-50 cursor-pointer"
          >
            {loading ? "جاري الخروج..." : "نعم، سجل الخروج"}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-xl bg-slate-800 border border-slate-700 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition cursor-pointer"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}