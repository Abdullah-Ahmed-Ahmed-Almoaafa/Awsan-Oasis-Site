import { StockStatus } from "@/types/offer";

interface StockBadgeProps {
  status: StockStatus;
  remainingQuantity?: number;
  unit?: string; // إضافة خاصية الوحدة
}

export default function StockBadge({ status, remainingQuantity, unit }: StockBadgeProps) {
  // تحديد اسم الوحدة مع وجود قيمة افتراضية "عرض" في حال كانت فارغة
  const unitLabel = unit || "عرض";

  switch (status) {
    case "LIMITED":
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 text-[11px] font-bold text-amber-400">
          <span></span>
          <span>
            {remainingQuantity && remainingQuantity > 0 
              ? `متبقي ${remainingQuantity} ${unitLabel} فقط` 
              : "الكمية محدودة"}
          </span>
        </span>
      );
    case "AVAILABLE":
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[11px] font-bold text-emerald-400">
          <span></span>
          <span>الكمية متوفرة</span>
        </span>
      );
    case "PRE_ORDER":
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-blue-500/10 border border-blue-500/30 px-2 py-0.5 text-[11px] font-bold text-blue-400">
          <span></span>
          <span>طلب مسبق</span>
        </span>
      );
    case "OUT_OF_STOCK":
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-red-500/10 border border-red-500/30 px-2 py-0.5 text-[11px] font-bold text-red-400">
          <span></span>
          <span>نفذت الكمية</span>
        </span>
      );
    default:
      return null;
  }
}