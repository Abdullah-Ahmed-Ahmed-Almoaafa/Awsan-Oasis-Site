"use client";

import React from "react";
import { IProduct } from "@/types/product";

interface ProductsTableProps {
  products: IProduct[];
  loading: boolean;
  onAddProduct: () => void;
  onEditProduct: (product: IProduct) => void;
  onDeleteProduct: (id: string) => void;
}

export default function ProductsTable({
  products,
  loading,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
}: ProductsTableProps) {
  if (loading) {
    return (
      <div className="py-12 text-center text-slate-400 animate-pulse">
        جاري تحميل المنتجات...
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16 border border-dashed border-slate-800 rounded-2xl bg-slate-900/50">
        <p className="text-white font-medium text-sm sm:text-base mb-4">
          لا توجد منتجات مسجلة في النظام.
        </p>
        <button
          onClick={onAddProduct}
          className="rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition cursor-pointer"
        >
          أضف أول منتج الآن
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
      <table className="w-full text-right text-sm">
        <thead className="bg-slate-950 text-slate-300 border-b border-slate-800 text-xs">
          <tr>
            <th className="p-4">اسم المنتج</th>
            <th className="p-4">السعر القديم</th>
            <th className="p-4">السعر الحالي</th>
            <th className="p-4">الكمية</th>
            <th className="p-4">الوحدة</th>
            <th className="p-4 text-center">الإجراءات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 text-slate-200">
          {products.map((product) => {
            const currencySymbol = product.currency || "ر.ي";
            const unitLabel = product.unit || "كيلو";

            return (
              <tr
                key={product.id || product.name}
                className="hover:bg-slate-800/50 transition"
              >
                <td className="p-4 font-semibold text-amber-300">
                  {product.name}
                </td>
                <td className="p-4 text-slate-500">
                  {product.oldPrice ? `${product.oldPrice} ${currencySymbol}` : "-"}
                </td>
                <td className="p-4 font-bold text-amber-400">
                  {product.newPrice} {currencySymbol}
                </td>
                <td className="p-4">
                  <span
                    className={`px-2 py-0.5 text-xs rounded-md font-semibold ${
                      product.quantity > 0
                        ? "bg-emerald-950 text-emerald-400 border border-emerald-800/50"
                        : "bg-red-950 text-red-400 border border-red-800/50"
                    }`}
                  >
                    {product.quantity}
                  </span>
                </td>
                <td className="p-4 text-slate-300 font-medium">
                  <span className="bg-slate-800/80 px-2 py-1 rounded-md text-xs border border-slate-700">
                    {unitLabel}
                  </span>
                </td>
                <td className="p-4 flex items-center justify-center gap-2">
                  <button
                    onClick={() => onEditProduct(product)}
                    className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-bold text-amber-400 hover:bg-slate-700 transition cursor-pointer"
                  >
                    تعديل
                  </button>
                  <button
                    onClick={() => product.id && onDeleteProduct(product.id)}
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