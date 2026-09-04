"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllProducts, addProduct, updateProduct, deleteProduct } from "@/lib/firestore.service";
import { logoutAdmin, checkAdminSession } from "@/lib/actions/authActions";
import { IProduct } from "@/types/product";
import ProductFormModal from "@/components/ProductFormModal";
import ChangePasswordModal from "@/components/ChangePasswordModal";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);

  // حالات نافذة تأكيد الحذف
  const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    const data = await getAllProducts();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    checkAdminSession().then((isLoggedIn) => {
      if (!isLoggedIn) {
        router.push("/admin/login");
      } else {
        fetchProducts();
      }
    });
  }, [router]);

  const handleLogout = async () => {
    await logoutAdmin();
    router.push("/admin/login");
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (product: IProduct) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  // فتح نافذة التأكيد وتخزين معرف المنتج المراد حذفه
  const handleOpenDelete = (id?: string) => {
    if (id) {
      setSelectedDeleteId(id);
    }
  };

  // تنفيذ عملية الحذف الفعلية من Firestore
  const handleConfirmDelete = async () => {
    if (!selectedDeleteId) return;
    setIsDeleting(true);
    const success = await deleteProduct(selectedDeleteId);
    if (success) {
      await fetchProducts();
    }
    setIsDeleting(false);
    setSelectedDeleteId(null);
  };

  const handleSubmitForm = async (data: Omit<IProduct, "id">) => {
    if (editingProduct && editingProduct.id) {
      await updateProduct(editingProduct.id, data);
    } else {
      await addProduct(data);
    }
    fetchProducts();
  };

  return (
    <div dir="rtl" className="max-w-6xl mx-auto py-6 px-4 space-y-6 font-sans">
      {/* الهيدر الخاص بالـ Dashboard */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div>
          <h1 className="text-2xl font-extrabold text-amber-400">لوحة إدارة المنتجات</h1>
          <p className="text-xs text-slate-400 mt-1">إضافة، تعديل وحذف منتجات واحة أوسان</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleOpenAdd}
            className="rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition shadow cursor-pointer"
          >
            + إضافة منتج جديد
          </button>

          <button
            onClick={() => setIsPasswordModalOpen(true)}
            className="rounded-xl bg-slate-800 border border-slate-700 px-4 py-2.5 text-xs font-bold text-amber-400 hover:bg-slate-700 transition cursor-pointer"
          >
            🔑 تغيير كلمة السر
          </button>

          <button
            onClick={handleLogout}
            className="rounded-xl bg-red-950 border border-red-800 px-4 py-2.5 text-xs font-bold text-red-300 hover:bg-red-900 transition cursor-pointer"
          >
            تسجيل الخروج
          </button>
        </div>
      </div>

      {/* جدول المنتجات */}
      {loading ? (
        <div className="py-12 text-center text-slate-400 animate-pulse">جاري تحميل البيانات...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-slate-800 rounded-2xl bg-slate-900/50">
          <p className="text-white font-medium text-sm sm:text-base mb-4">
            لا توجد منتجات مسجلة في النظام.
          </p>
          <button
            onClick={handleOpenAdd}
            className="rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 cursor-pointer"
          >
            أضف أول منتج الآن
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
          <table className="w-full text-right text-sm">
            <thead className="bg-slate-950 text-slate-300 border-b border-slate-800 text-xs">
              <tr>
                <th className="p-4">اسم المنتج</th>
                <th className="p-4">السعر القديم</th>
                <th className="p-4">السعر الحالي</th>
                <th className="p-4">الكمية</th>
                <th className="p-4 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {products.map((product) => {
                const currencySymbol = product.currency || "ر.ي";
                return (
                  <tr key={product.id || product.name} className="hover:bg-slate-800/50 transition">
                    <td className="p-4 font-semibold text-amber-300">{product.name}</td>
                    <td className="p-4 text-slate-500">
                      {product.oldPrice ? `${product.oldPrice} ${currencySymbol}` : "-"}
                    </td>
                    <td className="p-4 font-bold text-amber-400">
                      {product.newPrice} {currencySymbol}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 text-xs rounded-md ${product.quantity > 0 ? "bg-emerald-950 text-emerald-400" : "bg-red-950 text-red-400"}`}>
                        {product.quantity}
                      </span>
                    </td>
                    <td className="p-4 flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleOpenEdit(product)}
                        className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-bold text-amber-400 hover:bg-slate-700 transition cursor-pointer"
                      >
                        تعديل
                      </button>
                      <button
                        onClick={() => product.id && handleOpenDelete(product.id)}
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
      )}

      {/* المودالات */}
      <ProductFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmitForm}
        initialData={editingProduct}
      />

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />

      <ConfirmDeleteModal
        isOpen={!!selectedDeleteId}
        onClose={() => setSelectedDeleteId(null)}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
      />
    </div>
  );
}