"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// الخدمات
import {
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "@/lib/firestore.service";
import {
  getAllOffersAdmin,
  createOffer,
  updateOffer,
  deleteOffer,
} from "@/lib/offers.service";
import { logoutAdmin, checkAdminSession } from "@/lib/actions/authActions";

// الأنواع (Types)
import { IProduct } from "@/types/product";
import { IOffer } from "@/types/offer";

// المكونات المستخرجة
import ProductsTable from "@/components/admin/ProductsTable";
import OffersTable from "@/components/admin/OffersTable";

// المودالات
import ProductFormModal from "@/components/ProductFormModal";
import OfferFormModal from "@/components/OfferFormModal";
import ChangePasswordModal from "@/components/ChangePasswordModal";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import ConfirmLogoutModal from "@/components/ConfirmLogoutModal";

type TabType = "products" | "offers";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("products");

  // حالات المنتجات
  const [products, setProducts] = useState<IProduct[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);

  // حالات العروض
  const [offers, setOffers] = useState<IOffer[]>([]);
  const [offersLoading, setOffersLoading] = useState(true);
  const [isOfferFormOpen, setIsOfferFormOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<IOffer | null>(null);

  // حالات مودال التغيير والحذف والخروج
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [selectedDeleteTarget, setSelectedDeleteTarget] = useState<{
    id: string;
    type: "product" | "offer";
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // جلب المنتجات
  const fetchProductsData = async () => {
    setProductsLoading(true);
    const data = await getAllProducts();
    setProducts(data);
    setProductsLoading(false);
  };

  // جلب العروض
  const fetchOffersData = async () => {
    setOffersLoading(true);
    const data = await getAllOffersAdmin();
    setOffers(data);
    setOffersLoading(false);
  };

  // التحقق من الجلسة وجلب البيانات الأولية
  useEffect(() => {
    checkAdminSession().then((isLoggedIn) => {
      if (!isLoggedIn) {
        router.push("/admin/login");
      } else {
        fetchProductsData();
        fetchOffersData();
      }
    });
  }, [router]);

  // تنفيذ تسجيل الخروج بعد التأكيد
  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    await logoutAdmin();
    router.push("/admin/login");
  };

  // معالجة فتح نماذج الإضافة والتعديل
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setIsProductFormOpen(true);
  };

  const handleOpenEditProduct = (product: IProduct) => {
    setEditingProduct(product);
    setIsProductFormOpen(true);
  };

  const handleOpenAddOffer = () => {
    setEditingOffer(null);
    setIsOfferFormOpen(true);
  };

  const handleOpenEditOffer = (offer: IOffer) => {
    setEditingOffer(offer);
    setIsOfferFormOpen(true);
  };

  // حفظ المنتج
  const handleSubmitProductForm = async (data: Omit<IProduct, "id">) => {
    if (editingProduct && editingProduct.id) {
      await updateProduct(editingProduct.id, data);
    } else {
      await addProduct(data);
    }
    fetchProductsData();
  };

  // حفظ العرض
  const handleSubmitOfferForm = async (data: Omit<IOffer, "id">) => {
    if (editingOffer && editingOffer.id) {
      await updateOffer(editingOffer.id, data);
    } else {
      await createOffer(data);
    }
    fetchOffersData();
  };

  // تبديل حالة العرض (نشط/معطل)
  const handleToggleOfferActive = async (offer: IOffer) => {
    if (!offer.id) return;
    await updateOffer(offer.id, { isActive: !offer.isActive });
    fetchOffersData();
  };

  // تأكيد وتنفيذ الحذف
  const handleConfirmDelete = async () => {
    if (!selectedDeleteTarget) return;
    setIsDeleting(true);

    if (selectedDeleteTarget.type === "product") {
      const success = await deleteProduct(selectedDeleteTarget.id);
      if (success) await fetchProductsData();
    } else {
      await deleteOffer(selectedDeleteTarget.id);
      await fetchOffersData();
    }

    setIsDeleting(false);
    setSelectedDeleteTarget(null);
  };

  return (
    <div dir="rtl" className="max-w-6xl mx-auto py-6 px-4 space-y-6 font-sans">
      {/* الهيدر الرئيسي */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div>
          <h1 className="text-2xl font-extrabold text-amber-400">
            لوحة الإدارة الشاملة
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            إدارة كافة منتجات وعروض واحة أوسان بسهولة
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsPasswordModalOpen(true)}
            className="rounded-xl bg-slate-800 border border-slate-700 px-4 py-2.5 text-xs font-bold text-amber-400 hover:bg-slate-700 transition cursor-pointer"
          >
            🔑 تغيير كلمة السر
          </button>

          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="rounded-xl bg-red-950 border border-red-800 px-4 py-2.5 text-xs font-bold text-red-300 hover:bg-red-900 transition cursor-pointer"
          >
            تسجيل الخروج
          </button>
        </div>
      </div>

      {/* شريط التبويبات والأزرار العلوية */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 border-b border-slate-800 pb-4">
        {/* أزرار التبديل بين التبويبات */}
        <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab("products")}
            className={`flex-1 sm:flex-initial px-5 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === "products"
                ? "bg-amber-500 text-slate-950 shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            المنتجات ({products.length})
          </button>
          <button
            onClick={() => setActiveTab("offers")}
            className={`flex-1 sm:flex-initial px-5 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === "offers"
                ? "bg-amber-500 text-slate-950 shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            العروض ({offers.length})
          </button>
        </div>

        {/* زر الإضافة الديناميكي حسب التبويب النشط */}
        <div>
          {activeTab === "products" ? (
            <button
              onClick={handleOpenAddProduct}
              className="w-full sm:w-auto rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition shadow cursor-pointer"
            >
              + إضافة منتج جديد
            </button>
          ) : (
            <button
              onClick={handleOpenAddOffer}
              className="w-full sm:w-auto rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition shadow cursor-pointer"
            >
              + إضافة عرض جديد
            </button>
          )}
        </div>
      </div>

      {/* عرض الجدول المخصص حسب التبويب */}
      {activeTab === "products" ? (
        <ProductsTable
          products={products}
          loading={productsLoading}
          onAddProduct={handleOpenAddProduct}
          onEditProduct={handleOpenEditProduct}
          onDeleteProduct={(id) =>
            setSelectedDeleteTarget({ id, type: "product" })
          }
        />
      ) : (
        <OffersTable
          offers={offers}
          loading={offersLoading}
          onAddOffer={handleOpenAddOffer}
          onEditOffer={handleOpenEditOffer}
          onDeleteOffer={(id) => setSelectedDeleteTarget({ id, type: "offer" })}
          onToggleActive={handleToggleOfferActive}
        />
      )}

      {/* جميع المودالات */}
      <ProductFormModal
        isOpen={isProductFormOpen}
        onClose={() => setIsProductFormOpen(false)}
        onSubmit={handleSubmitProductForm}
        initialData={editingProduct}
      />

      <OfferFormModal
        isOpen={isOfferFormOpen}
        onClose={() => setIsOfferFormOpen(false)}
        onSubmit={handleSubmitOfferForm}
        initialData={editingOffer}
      />

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />

      <ConfirmDeleteModal
        isOpen={!!selectedDeleteTarget}
        onClose={() => setSelectedDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
      />

      <ConfirmLogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
        loading={isLoggingOut}
      />
    </div>
  );
}