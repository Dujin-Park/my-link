import { getApp, getApps, initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  type UserCredential,
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

/**
 * 클라이언트 마운트(useEffect) 이후에 호출하여
 * Firebase Auth의 숨겨진 iframe(apis.google.com 및 __/auth/iframe)을 미리 로드해 둡니다.
 */
export function warmUpAuthResolver(): void {
  if (typeof window === "undefined") return
  try {
    const internalAuth = auth as unknown as {
      _popupRedirectResolver?: {
        _initialize?: (a: typeof auth) => Promise<unknown>
      }
    }
    internalAuth._popupRedirectResolver?._initialize?.(auth)?.catch(() => {})
  } catch {
    // 무시
  }
}

/**
 * Microsoft Edge / Safari 등에서 Firebase의 비동기 iframe 초기화 대기 시간 동안
 * 사용자 클릭 제스처(User Activation)가 만료되어 auth/popup-blocked 에러가 발생하는 문제를 방지하기 위해,
 * 클릭 이벤트 핸들러의 동기 스택(t=0ms)에서 팝업 창을 즉시 열고 Firebase의 window.open 호출에 연결합니다.
 */
export async function signInWithGoogle(): Promise<UserCredential> {
  if (typeof window === "undefined") {
    return await signInWithPopup(auth, googleProvider)
  }

  const width = 500
  const height = 600
  const top = Math.max((window.screen.availHeight - height) / 2, 0)
  const left = Math.max((window.screen.availWidth - width) / 2, 0)
  const popupFeatures = `width=${width},height=${height},top=${top},left=${left},location=yes,resizable=yes,statusbar=yes,toolbar=no,scrollbars=yes`

  const originalWindowOpen = window.open.bind(window)
  let preOpenedWindow: Window | null = null
  let consumedByFirebase = false

  // 클릭 즉시(await 이전) 동기적으로 팝업 창을 열어 Edge의 팝업 차단기를 통과
  try {
    preOpenedWindow = originalWindowOpen("about:blank", "", popupFeatures)
  } catch {
    preOpenedWindow = null
  }

  if (preOpenedWindow) {
    window.open = ((
      url?: string | URL,
      target?: string,
      features?: string
    ): Window | null => {
      window.open = originalWindowOpen
      if (preOpenedWindow && !preOpenedWindow.closed) {
        consumedByFirebase = true
        try {
          if (target && target !== "_blank") {
            preOpenedWindow.name = target
          }
          if (url) {
            preOpenedWindow.location.href = String(url)
          }
          preOpenedWindow.focus()
        } catch {
          // 무시
        }
        return preOpenedWindow
      }
      return originalWindowOpen(url, target, features)
    }) as typeof window.open
  }

  try {
    return await signInWithPopup(auth, googleProvider)
  } finally {
    window.open = originalWindowOpen
    if (preOpenedWindow && !consumedByFirebase && !preOpenedWindow.closed) {
      try {
        preOpenedWindow.close()
      } catch {
        // 무시
      }
    }
  }
}
