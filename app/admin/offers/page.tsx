"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getAllOffersAdmin,
  createOffer,
  updateOffer,
  deleteOffer,
} from "@/lib/offers.service";
import { logoutAdmin, checkAdminSession } from "@/lib/actions/authActions";
import { IOffer } from "@/types/offer";
import OfferFormModal from "@/components/OfferFormModal";
import ChangePasswordModal from "@/components/ChangePasswordModal";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";

export default function AdminOffersPage() {
  const router = useRouter();
  const [offers, setOffers] = useState<IOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<IOffer | null>(null);

  const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchOffers = async () => {
    setLoading(true);
    const data = await getAllOffersAdmin();
    setOffers(data);
    setLoading(false);
  };

  useEffect(() => {
    checkAdminSession().then((isLoggedIn) => {
      if (!isLoggedIn) {
        router.push("/admin/login");
      } else {
        fetchOffers();
      }
    });
  }, [router]);

  const handleLogout = async () => {
    await logoutAdmin();
    router.push("/admin/login");
  };

  const handleOpenAdd = () => {
    setEditingOffer(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (offer: IOffer) => {
    setEditingOffer(offer);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (id?: string) => {
    if (id) setSelectedDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (!selectedDeleteId) return;
    setIsDeleting(true);
    await deleteOffer(selectedDeleteId);
    await fetchOffers();
    setIsDeleting(false);
    setSelectedDeleteId(null);
  };

  const handleSubmitForm = async (data: Omit<IOffer, "id">) => {
    if (editingOffer && editingOffer.id) {
      await updateOffer(editingOffer.id, data);
    } else {
      await createOffer(data);
    }
    fetchOffers();
  };

  const handleToggleActive = async (offer: IOffer) => {
    if (!offer.id) return;
    await updateOffer(offer.id, { isActive: !offer.isActive });
    fetchOffers();
  };

  return (
    <div dir="rtl" className="max-w-6xl mx-auto py-6 px-4 space-y-6 font-sans">
      {/* الهيدر المتناسق */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div>
          <h1 className="text-2xl font-extrabold text-amber-400">لوحة إدارة العروض</h1>
          <p className="text-xs text-slate-400 mt-1">إضافة، تعديل وحذف عروض وباقات واحة أوسان</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleOpenAdd}
            className="rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition shadow cursor-pointer"
          >
            + إضافة عرض جديد
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

      {/* جدول العروض */}
      {loading ? (
        <div className="py-12 text-center text-slate-400 animate-pulse">جاري تحميل البيانات...</div>
      ) : offers.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-slate-800 rounded-2xl bg-slate-900/50">
          <p className="text-white font-medium text-sm sm:text-base mb-4">
            لا توجد عروض مسجلة في النظام.
          </p>
          <button
            onClick={handleOpenAdd}
            className="rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 cursor-pointer"
          >
            أضف أول عرض الآن
          </button>
        </div>
      ) : (
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
                        <span className="block text-[10px] text-slate-400 font-normal">{offer.tagline}</span>
                      )}
                    </td>
                    <td className="p-4 text-slate-500">
                      {offer.originalPrice ? `${offer.originalPrice} ${currencySymbol}` : "-"}
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
                        onClick={() => handleToggleActive(offer)}
                        className={`px-2.5 py-1 rounded-full text-xs font-bold transition ${
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
                        onClick={() => handleOpenEdit(offer)}
                        className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-bold text-amber-400 hover:bg-slate-700 transition cursor-pointer"
                      >
                        تعديل
                      </button>
                      <button
                        onClick={() => offer.id && handleOpenDelete(offer.id)}
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

      {/* المودالات المتطابقة */}
      <OfferFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmitForm}
        initialData={editingOffer}
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