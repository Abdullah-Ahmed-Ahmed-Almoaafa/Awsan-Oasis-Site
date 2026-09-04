"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { isAdminSetup, loginAdmin, setupAdminPassword } from "@/lib/actions/authActions";

export default function AdminLoginPage() {
  const router = useRouter();
  const [isSetup, setIsSetup] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // فحص ما إذا كانت كلمة السر معينة في Firestore أم لا
    isAdminSetup().then((status) => {
      setIsSetup(status);
    });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await loginAdmin(password);

    if (res.success) {
      router.push("/admin");
    } else {
      setError(res.error || "خطأ أثناء تسجيل الدخول");
      setLoading(false);
    }
  };

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("كلمتا السر غير مطابقتين.");
      return;
    }

    setLoading(true);

    const res = await setupAdminPassword(password);

    if (res.success) {
      router.push("/admin");
    } else {
      setError(res.error || "خطأ أثناء تعيين كلمة السر");
      setLoading(false);
    }
  };

  if (isSetup === null) {
    return (
      <div dir="rtl" className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans text-slate-300">
        <div className="animate-pulse">جاري التحقق من إعدادات النظام...</div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans text-slate-100">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* الهيدر والشعار */}
        <div className="text-center space-y-3">
          <div className="relative mx-auto h-16 w-16 overflow-hidden rounded-2xl bg-amber-500/10 border border-amber-500/20 p-2">
            <Image
              src="/logo.png"
              alt="شعار واحة أوسان"
              fill
              sizes="64px"
              className="object-contain p-1"
              priority
            />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-amber-400">لوحة التحكم - واحة أوسان</h1>
            <p className="text-xs text-slate-400 mt-1">
              {isSetup ? "سجل دخولك للوصول إلى لوحة الإدارة" : "قم بتعيين كلمة سر للمسؤول لأول مرة"}
            </p>
          </div>
        </div>

        {/* رسالة الخطأ */}
        {error && (
          <div className="bg-red-950/80 border border-red-800 text-red-300 text-xs p-3 rounded-xl text-center font-medium">
            {error}
          </div>
        )}

        {/* النموذج */}
        {isSetup ? (
          /* نموذج تسجيل الدخول */
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">كلمة السر</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="أدخل كلمة السر"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 px-4 rounded-xl text-sm transition cursor-pointer disabled:opacity-50"
            >
              {loading ? "جاري الدخول..." : "تسجيل الدخول"}
            </button>
          </form>
        ) : (
          /* نموذج إعداد كلمة السر لأول مرة */
          <form onSubmit={handleSetup} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">كلمة السر الجديدة</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="6 أحرف/أرقام على الأقل"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">تأكيد كلمة السر</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="أعد كتابة كلمة السر"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 px-4 rounded-xl text-sm transition cursor-pointer disabled:opacity-50"
            >
              {loading ? "جاري الحفظ..." : "حفظ كلمة السر والدخول"}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}