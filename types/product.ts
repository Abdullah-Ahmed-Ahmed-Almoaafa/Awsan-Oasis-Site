import { Timestamp } from "firebase/firestore";

export interface IProduct {
  id?: string;
  name: string;
  description: string;
  oldPrice: number;
  newPrice: number;
  quantity: number;
  images: string[];
  currency?: string; // "ر.ي" | "ر.س" | "$"
  createdAt?: Timestamp | Date;
}