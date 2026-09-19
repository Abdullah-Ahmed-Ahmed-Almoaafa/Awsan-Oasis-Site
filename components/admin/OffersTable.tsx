"use client";

import React from "react";
import { IOffer } from "@/types/offer";

interface OffersTableProps {
  offers: IOffer[];
  loading: boolean;
  onAddOffer: () => void;
  onEditOffer: (offer: IOffer) => void;
  onDeleteOffer: (id: string) => void;
  onToggleActive: (offer: IOffer) => void;
}

export default function OffersTable({
  offers,
  loading,
  onAddOffer,
  onEditOffer,
  onDeleteOffer,
  onToggleActive,
}: OffersTableProps) {
  if (loading) {
    return (
      <div className="py-12 text-center text-slate-400 animate-pulse">
        جاري تحميل العروض...
      </div>
    );
  }

  if (offers.length === 0) {
    return (
      <div className="text-center py-16 border border-dashed border-slate-800 rounded-2xl bg-slate-900/50">
        <p className="text-white font-medium text-sm sm:text-base mb-4">
          لا توجد عروض مسجلة في النظام.
        </p>
        <button
          onClick={onAddOffer}
          className="rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition cursor-pointer"
        >
          أضف أول عرض الآن
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
      <table className="w-full text-right text-sm">
        <thead className="bg-slate-950 text-slate-300 border-b border-slate-800 text-xs">
          <tr>
            <th className="p-4">عنوان العرض</th>
            <th className="p-4">السعر القديم</th>
            <th className="p-4">سعر العرض</th>
            <th className="p-4">الكمية</th>
            <th className="p-4">الوحدة</th>
            <th className="p-4">الحالة</th>
            <th className="p-4 text-center">الإجراءات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 text-slate-200">
          {offers.map((offer) => {
            const currencySymbol = offer.currency || "ر.ي";
            const unitLabel = offer.unit || "باقة";

            return (
              <tr key={offer.id} className="hover:bg-slate-800/50 transition">
                <td className="p-4 font-semibold text-amber-300">
                  {offer.title}
                  {offer.tagline && (
                    <span className="block text-[10px] text-slate-400 font-normal">
                      {offer.tagline}
                    </span>
                  )}
                </td>
                <td className="p-4 text-slate-500">
                  {offer.originalPrice
                    ? `${offer.originalPrice} ${currencySymbol}`
                    : "-"}
                </td>
                <td className="p-4 font-bold text-amber-400">
                  {offer.offerPrice} {currencySymbol}
                </td>
                <td className="p-4">
                  <span className="px-2 py-0.5 text-xs rounded-md font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800/50">
                    {offer.remainingQuantity ?? offer.quantity ?? "-"}
                  </span>
                </td>
                <td className="p-4 text-slate-300 font-medium">
                  <span className="bg-slate-800/80 px-2 py-1 rounded-md text-xs border border-slate-700">
                    {unitLabel}
                  </span>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => onToggleActive(offer)}
                    className={`px-2.5 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                      offer.isActive
                        ? "bg-emerald-950 text-emerald-400 border border-emerald-800/50"
                        : "bg-red-950 text-red-400 border border-red-800/50"
                    }`}
                  >
                    {offer.isActive ? "نشط" : "معطل"}
                  </button>
                </td>
                <td className="p-4 flex items-center justify-center gap-2">
                  <button
                    onClick={() => onEditOffer(offer)}
                    className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-bold text-amber-400 hover:bg-slate-700 transition cursor-pointer"
                  >
                    تعديل
                  </button>
                  <button
                    onClick={() => offer.id && onDeleteOffer(offer.id)}
                    className="rounded-lg bg-red-950 border border-red-800 px-3 py-1.5 text-xs font-bold text-red-300 hover:bg-red-900 transition cursor-pointer"
                  >
                    حذف
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}