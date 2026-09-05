import { Timestamp } from "firebase/firestore";

export interface IProduct {
  id?: string;
  name: string;
  description: string;
  oldPrice: number;
  newPrice: number;
  quantity: number;
  unit?: string; // كيلو, دبة, لتر, علبة, برطمان, قارورة, إلخ.
  images: string[];
  currency?: string; // "ر.ي" | "ر.س" | "$"
  createdAt?: Timestamp | Date;
}