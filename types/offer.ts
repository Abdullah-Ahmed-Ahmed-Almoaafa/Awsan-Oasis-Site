import { Timestamp } from "firebase/firestore";

export type StockStatus = "AVAILABLE" | "LIMITED" | "PRE_ORDER" | "OUT_OF_STOCK";

export interface IOffer {
  id?: string;
  title: string;
  tagline?: string;
  description: string;
  items?: string[];
  images: string[];
  originalPrice: number;
  offerPrice: number;
  quantity?: number;
  unit?: string;
  currency?: string;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  createdAt?: Date | Timestamp | string;
  
  // الحقول الجديدة لـ حالة المخزون والكمية المتبقية
  stockStatus: StockStatus;
  remainingQuantity?: number; // يُستخدم بشكل أساسي عندما تكون الحالة LIMITED
}