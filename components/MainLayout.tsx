"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // صفحات لا يظهر فيها Header أو Footer أو ScrollToTop
  const isAdminRoute = pathname?.startsWith("/admin");
  const isDeveloperRoute = pathname?.startsWith("/developer");

  // الصفحات المستقلة عن التخطيط الرئيسي
  const isStandaloneRoute = isAdminRoute || isDeveloperRoute;

  return (
    <>
      {/* إظهار الهيدر فقط في الصفحات العادية */}
      {!isStandaloneRoute && <Header />}

      {/* 
        الصفحات العادية تحصل على تنسيق الحاوية،
        أما صفحات Admin و Developer فتأخذ المساحة كاملة.
      */}
      <main
        className={
          isStandaloneRoute
            ? "flex-1"
            : "flex-1 container mx-auto px-4 py-6"
        }
      >
        {children}
      </main>

      {/* إظهار الفوتر وزر العودة لأعلى فقط في الصفحات العادية */}
      {!isStandaloneRoute && (
        <>
          <Footer />
          <ScrollToTop />
        </>
      )}
    </>
  );
}
