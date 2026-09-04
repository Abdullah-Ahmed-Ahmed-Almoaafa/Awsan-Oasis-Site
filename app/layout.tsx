import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import MainLayout from "@/components/MainLayout";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "واحة أوسان للعسل",
  description: "متجر متكامل لعرض وإدارة منتجات العسل الطبيعي",
  icons: {
    icon: "/logo.png?v=2",
    shortcut: "/logo.png?v=2",
    apple: "/logo.png?v=2",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${cairo.className} bg-slate-950 text-slate-100 min-h-screen flex flex-col antialiased`}
      >
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
