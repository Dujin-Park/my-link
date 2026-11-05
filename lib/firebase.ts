import { getApp, getApps, initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import {
  GoogleAuthProvider,
   browserPopupRedirectResolver,
  getAuth,
  getRedirectResult,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Firestore, Auth 인스턴스 및 GoogleAuthProvider 내보내기
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({
  prompt: "select_account",
})

/**
 * Google 로그인 헬퍼:
 * 1) 브라우저의 사용자 클릭 제스처 컨텍스트를 잃지 않도록 signInWithPopup을 즉시 호출합니다.
 * 2) 브라우저 팝업 차단(auth/popup-blocked) 발생 시 자동으로 signInWithRedirect로 폴백합니다.
 */
export async function signInWithGoogle(): Promise<void> {
  try {
    await signInWithPopup(auth, googleProvider, browserPopupRedirectResolver)
  } catch (err: unknown) {
    const code =
      typeof err === "object" && err !== null && "code" in err
        ? String((err as { code?: unknown }).code)
        : ""

    // 팝업이 차단된 경우(모바일 인앱 브라우저, 사파리, 브라우저 팝업 차단 설정 등) 리다이렉트 로그인으로 자동 전환
    if (code === "auth/popup-blocked") {
      await signInWithRedirect(
        auth,
        googleProvider,
        browserPopupRedirectResolver
      )
      return
    }

    // 사용자가 팝업을 직접 닫았거나 중복 클릭한 경우는 에러로 표시하지 않음
    if (
      code === "auth/popup-closed-by-user" ||
      code === "auth/cancelled-popup-request"
    ) {
      return
    }

    throw err
  }
}

/**
 * 리다이렉트 로그인 복귀 시 결과 처리 헬퍼
 */
export async function resolveGoogleRedirectResult(): Promise<void> {
  try {
    await getRedirectResult(auth, browserPopupRedirectResolver)
  } catch (err) {
    console.error("Google 리다이렉트 로그인 처리 오류:", err)
  }
}

