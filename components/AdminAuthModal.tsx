// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { isAdminSetup, setupAdminPassword, loginAdmin, checkAdminSession } from "@/lib/actions/authActions";

// interface AdminAuthModalProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// export default function AdminAuthModal({ isOpen, onClose }: AdminAuthModalProps) {
//   const router = useRouter();
//   const [isConfigured, setIsConfigured] = useState<boolean | null>(null);
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (isOpen) {
//       setError("");
//       setPassword("");
//       setConfirmPassword("");
      
//       checkAdminSession().then((isLoggedIn) => {
//         if (isLoggedIn) {
//           onClose();
//           router.push("/admin");
//         } else {
//           isAdminSetup().then((setup) => setIsConfigured(setup));
//         }
//       });
//     }
//   }, [isOpen, onClose, router]);

//   if (!isOpen) return null;

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       if (!isConfigured) {
//         if (password !== confirmPassword) {
//           setError("كلمتا السر غير متطابقتين.");
//           setLoading(false);
//           return;
//         }
//         const res = await setupAdminPassword(password);
//         if (res.success) {
//           onClose();
//           router.push("/admin");
//         } else {
//           setError(res.error || "حدث خطأ.");
//         }
//       } else {
//         const res = await loginAdmin(password);
//         if (res.success) {
//           onClose();
//           router.push("/admin");
//         } else {
//           setError(res.error || "كلمة السر غير صحيحة.");
//         }
//       }
//     } catch {
//       setError("حدث خطأ في النظام.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
//       <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl">
//         <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
//           <h2 className="text-lg font-bold text-amber-400">
//             {isConfigured === false ? "تعيين كلمة سر المسؤول" : "الدخول لوحة التحكم"}
//           </h2>
//           <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
//         </div>

//         {isConfigured === null ? (
//           <div className="py-8 text-center text-slate-400">جاري التحقق من النظام...</div>
//         ) : (
//           <form onSubmit={handleSubmit} className="space-y-4">
//             {error && (
//               <div className="rounded-lg bg-red-950/80 border border-red-800 p-3 text-xs text-red-300">
//                 {error}
//               </div>
//             )}

//             <div>
//               <label className="block text-xs font-semibold text-slate-300 mb-1">
//                 {isConfigured === false ? "كلمة السر الجديدة" : "كلمة السر"}
//               </label>
//               <input
//                 type="password"
//                 required
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
//               />
//             </div>

//             {isConfigured === false && (
//               <div>
//                 <label className="block text-xs font-semibold text-slate-300 mb-1">
//                   تأكيد كلمة السر
//                 </label>
//                 <input
//                   type="password"
//                   required
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                   className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
//                 />
//               </div>
//             )}

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full rounded-xl bg-amber-500 py-2.5 text-sm font-bold text-slate-950 hover:bg-amber-400 transition disabled:opacity-50"
//             >
//               {loading ? "جاري المعالجة..." : isConfigured === false ? "حفظ وتعيين" : "دخول"}
//             </button>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// }