import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  deleteField,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase.config"; // تأكد من مسار ملف الفايربيس لديك
import { IOffer } from "@/types/offer";

const OFFERS_COLLECTION = "offers";

// جلب جميع العروض للعموم (النشطة فقط ومجهزة بترتيب الأحدث أولاً)
export async function getActiveOffers(): Promise<IOffer[]> {
  const q = query(
    collection(db, OFFERS_COLLECTION),
    where("isActive", "==", true),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as IOffer)
  );
}

// جلب جميع العروض للوحة التحكم Admin (ترتيب الأحدث أولاً)
export async function getAllOffersAdmin(): Promise<IOffer[]> {
  const q = query(
    collection(db, OFFERS_COLLECTION),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as IOffer)
  );
}

// جلب عرض محدد بحسب الـ ID
export async function getOfferById(id: string): Promise<IOffer | null> {
  const docRef = doc(db, OFFERS_COLLECTION, id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() } as IOffer;
}

// إضافة عرض جديد (تجاهل القيم undefined تلقائياً)
export async function createOffer(offerData: Omit<IOffer, "id">): Promise<string> {
  const cleanData: Record<string, any> = { ...offerData };

  // إزالة أي حقل بقيمة undefined
  Object.keys(cleanData).forEach((key) => {
    if (cleanData[key] === undefined) {
      delete cleanData[key];
    }
  });

  const docRef = await addDoc(collection(db, OFFERS_COLLECTION), {
    ...cleanData,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

// تعديل عرض (مع التعامل السليم مع حذف remainingQuantity إذا أصبحت الحالة ليست LIMITED)
export async function updateOffer(id: string, offerData: Partial<IOffer>): Promise<void> {
  const docRef = doc(db, OFFERS_COLLECTION, id);
  const updatePayload: Record<string, any> = { ...offerData };

  // إذا كانت الحالة غير LIMITED، نقوم بحذف حقل remainingQuantity من المستند في Firestore
  if (offerData.stockStatus && offerData.stockStatus !== "LIMITED") {
    updatePayload.remainingQuantity = deleteField();
  }

  // إزالة أي قيم undefined غير معالجة
  Object.keys(updatePayload).forEach((key) => {
    if (updatePayload[key] === undefined) {
      delete updatePayload[key];
    }
  });

  await updateDoc(docRef, updatePayload);
}

// حذف عرض
export async function deleteOffer(id: string): Promise<void> {
  const docRef = doc(db, OFFERS_COLLECTION, id);
  await deleteDoc(docRef);
}