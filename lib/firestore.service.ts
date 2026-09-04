import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase.config";
import { IProduct } from "@/types/product";

const PRODUCTS_COLLECTION = "products";

// جلب جميع المنتجات
export async function getAllProducts(): Promise<IProduct[]> {
  try {
    const q = query(
      collection(db, PRODUCTS_COLLECTION),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as IProduct[];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

// جلب منتج بواسطة المعرف
export async function getProductById(
  id: string
): Promise<IProduct | null> {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as IProduct;
    }

    return null;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return null;
  }
}

// إضافة منتج جديد
export async function addProduct(
  product: Omit<IProduct, "id">
): Promise<string | null> {
  try {
    const docRef = await addDoc(
      collection(db, PRODUCTS_COLLECTION),
      {
        ...product,
        createdAt: new Date(),
      }
    );

    return docRef.id;
  } catch (error) {
    console.error("Error adding product:", error);
    return null;
  }
}

// تعديل منتج حالي
export async function updateProduct(
  id: string,
  product: Partial<IProduct>
): Promise<boolean> {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);

    await updateDoc(docRef, product);

    return true;
  } catch (error) {
    console.error("Error updating product:", error);
    return false;
  }
}

// حذف منتج
export async function deleteProduct(id: string): Promise<boolean> {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);

    await deleteDoc(docRef);

    return true;
  } catch (error) {
    console.error("Error deleting product:", error);
    return false;
  }
}