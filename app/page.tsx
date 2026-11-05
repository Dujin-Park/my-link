"use client"

import * as React from "react"
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth"
import { Loader2 } from "lucide-react"
import { AuthHeader } from "@/components/AuthHeader"
import { LandingPage } from "@/components/LandingPage"
import { MyPage } from "@/components/MyPage"
import { Card } from "@/components/ui/card"
import { auth, googleProvider } from "@/lib/firebase"

export default function Home() {
  const [user, setUser] = React.useState<User | null>(null)
  const [isAuthLoading, setIsAuthLoading] = React.useState(true)
  const [isSigningIn, setIsSigningIn] = React.useState(false)
  const [authError, setAuthError] = React.useState("")

  // onAuthStateChanged를 사용하여 새로고침 시에도 로그인 세션 유지
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setIsAuthLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const handleSignInWithGoogle = async () => {
    try {
      setIsSigningIn(true)
      setAuthError("")
      await signInWithPopup(auth, googleProvider)
    } catch (err) {
      console.error("Google 로그인 오류:", err)
      setAuthError(
        err instanceof Error
          ? `로그인에 실패했어요: ${err.message}`
          : "Google 로그인 중 문제가 발생했어요."
      )
    } finally {
      setIsSigningIn(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth)
    } catch (err) {
      console.error("로그아웃 오류:", err)
    }
  }

  return (
    <main
      suppressHydrationWarning
      className="flex min-h-screen w-full flex-col items-center bg-[var(--tds-grey-100)] px-0 py-0 sm:px-6 sm:py-10"
    >
      {/* TDS Mobile Shell 컨테이너 (Single-column mobile-first 정책) */}
      <div
        suppressHydrationWarning
        className="flex min-h-screen w-full max-w-[480px] flex-col bg-[var(--tds-grey-100)] sm:min-h-0 sm:gap-3"
      >
        {/* Top App Bar: 비로그인 시 'Google로 로그인' 버튼 / 로그인 시 프로필 이미지, 이름, 드롭다운 메뉴, 로그아웃 버튼 */}
        <AuthHeader
          user={user}
          isAuthLoading={isAuthLoading}
          isSigningIn={isSigningIn}
          onSignInWithGoogle={handleSignInWithGoogle}
          onSignOut={handleSignOut}
        />

        {/* 인증 상태 확인 중 로딩 스켈레톤 / 비로그인 시 LandingPage / 로그인 완료 시 MyPage */}
        {isAuthLoading ? (
          <Card className="flex min-h-[420px] flex-1 flex-col items-center justify-center gap-3 px-6 py-12 text-center">
            <Loader2 className="size-7 animate-spin text-[var(--tds-blue-500)]" />
            <p className="text-[14px] font-medium text-[var(--tds-grey-600)]">
              로그인 정보를 확인하고 있어요...
            </p>
          </Card>
        ) : user ? (
          <MyPage user={user} />
        ) : (
          <LandingPage
            isSigningIn={isSigningIn}
            authError={authError}
            onSignInWithGoogle={handleSignInWithGoogle}
          />
        )}
      </div>
    </main>
  )
}
