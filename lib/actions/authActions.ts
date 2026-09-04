"use server";

import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { db } from "@/lib/firebase.config";
import { doc, getDoc, setDoc } from "firebase/firestore";

const ADMIN_CONFIG_DOC = "adminConfig";
const CONFIG_COLLECTION = "system";
const COOKIE_NAME = "admin_session";

export async function isAdminSetup(): Promise<boolean> {
  try {
    const docRef = doc(db, CONFIG_COLLECTION, ADMIN_CONFIG_DOC);
    const docSnap = await getDoc(docRef);

    return docSnap.exists() && !!docSnap.data()?.passwordHash;
  } catch (error) {
    console.error("Error checking admin setup:", error);
    return false;
  }
}

export async function setupAdminPassword(
  password: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const isAlreadySetup = await isAdminSetup();

    if (isAlreadySetup) {
      return {
        success: false,
        error: "تم تعيين كلمة السر سابقاً.",
      };
    }

    if (!password || password.length < 6) {
      return {
        success: false,
        error: "كلمة السر يجب أن تكون 6 أحرف/أرقام على الأقل.",
      };
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const docRef = doc(db, CONFIG_COLLECTION, ADMIN_CONFIG_DOC);

    await setDoc(docRef, {
      passwordHash,
      updatedAt: new Date(),
    });

    const cookieStore = await cookies();

    cookieStore.set(COOKIE_NAME, "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // يوم واحد
      path: "/",
    });

    return { success: true };
  } catch (error) {
    console.error("Error setting up admin password:", error);

    return {
      success: false,
      error: "حدث خطأ أثناء حفظ كلمة السر.",
    };
  }
}

export async function loginAdmin(
  password: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const docRef = doc(db, CONFIG_COLLECTION, ADMIN_CONFIG_DOC);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return {
        success: false,
        error: "لم يتم تعيين كلمة السر بعد.",
      };
    }

    const { passwordHash } = docSnap.data();

    const isValid = await bcrypt.compare(password, passwordHash);

    if (!isValid) {
      return {
        success: false,
        error: "كلمة السر غير صحيحة.",
      };
    }

    const cookieStore = await cookies();

    cookieStore.set(COOKIE_NAME, "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // يوم واحد
      path: "/",
    });

    return { success: true };
  } catch (error) {
    console.error("Error logging in admin:", error);

    return {
      success: false,
      error: "حدث خطأ أثناء تسجيل الدخول.",
    };
  }
}

export async function checkAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();

  return cookieStore.get(COOKIE_NAME)?.value === "true";
}

export async function logoutAdmin(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.delete(COOKIE_NAME);
}

// تغيير كلمة سر المسؤول
export async function changeAdminPassword(
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const docRef = doc(db, CONFIG_COLLECTION, ADMIN_CONFIG_DOC);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return {
        success: false,
        error: "حساب المسؤول غير مهيأ.",
      };
    }

    const { passwordHash } = docSnap.data();

    const isValid = await bcrypt.compare(
      currentPassword,
      passwordHash
    );

    if (!isValid) {
      return {
        success: false,
        error: "كلمة السر الحالية غير صحيحة.",
      };
    }

    if (!newPassword || newPassword.length < 6) {
      return {
        success: false,
        error:
          "كلمة السر الجديدة يجب أن تكون 6 أحرف/أرقام على الأقل.",
      };
    }

    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(newPassword, salt);

    await setDoc(
      docRef,
      {
        passwordHash: newPasswordHash,
        updatedAt: new Date(),
      },
      {
        merge: true,
      }
    );

    return { success: true };
  } catch (error) {
    console.error("Error changing password:", error);

    return {
      success: false,
      error: "حدث خطأ أثناء تغيير كلمة السر.",
    };
  }
}