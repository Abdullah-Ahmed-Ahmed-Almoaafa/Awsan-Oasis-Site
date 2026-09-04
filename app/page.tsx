"use client";

import { useEffect, useState } from "react";
import { getAllProducts } from "@/lib/firestore.service";
import { IProduct } from "@/types/product";
import ProductCard from "@/components/ProductCard";
import ProductSearch from "@/components/ProductSearch";
import InfoSideWidget from "@/components/InfoSideWidget"; // 1. استيراد المكون

export default function HomePage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getAllProducts();
        setProducts(data);
      } catch (err) {
        console.error("فشل جلب المنتجات:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section id="products" className="py-4 relative">
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-amber-400 mb-2">
          منتجات واحة أوسان
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          اختر من تشكيلتنا الفاخرة من العسل اليمني الطبيعي
        </p>
      </div>

      <ProductSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-72 rounded-xl bg-slate-900 animate-pulse border border-slate-800" />
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl bg-slate-900/50">
          <p className="text-white font-medium text-sm sm:text-base">
            {searchTerm ? "لا توجد نتائج تطابق بحثك." : "لا توجد منتجات معروضة حالياً."}
          </p>
        </div>
      )}

      {/* 2. إضافة المكون هنا */}
      <InfoSideWidget />
    </section>
  );
}