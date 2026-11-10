"use client"

import * as React from "react"
import {
  onAuthStateChanged,
  signOut,
  type User,
} from "firebase/auth"
import { Home as HomeIcon, Loader2, UserCircle } from "lucide-react"
import { AuthHeader } from "@/components/AuthHeader"
import { LandingPage } from "@/components/LandingPage"
import { MyPage } from "@/components/MyPage"
import { Card } from "@/components/ui/card"
import { auth, signInWithGoogle, warmUpAuthResolver } from "@/lib/firebase"
import { cn } from "@/lib/utils"

export default function Home() {
  const [user, setUser] = React.useState<User | null>(null)
  const [isAuthLoading, setIsAuthLoading] = React.useState(true)
  const [isSigningIn, setIsSigningIn] = React.useState(false)
  const [authError, setAuthError] = React.useState("")
  // 로그인 완료 시 기본 화면은 항상 마이페이지(false)로 표시하며, 상단 '랜딩 홈' 탭 클릭 시에만 랜딩 미리보기(true)로 전환
  const [isPreviewingLanding, setIsPreviewingLanding] = React.useState(false)

  React.useEffect(() => {
    warmUpAuthResolver()

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setIsAuthLoading(false)
      if (currentUser) {
        setIsPreviewingLanding(false)
      }
    })

    return () => unsubscribe()
  }, [])

  const handleSignInWithGoogle = async () => {
    // 클릭 제스처(User Activation) 유지를 위해 어떤 React 상태 변경보다도 signInWithGoogle()을 가장 먼저 호출
    const signInPromise = signInWithGoogle()
    setAuthError("")
    setIsSigningIn(true)
    try {
      const credential = await signInPromise
      if (credential?.user) {
        setUser(credential.user)
        setIsPreviewingLanding(false)
      }
    } catch (err) {
      console.error("Google 로그인 오류:", err)
      setAuthError(
        err instanceof Error
          ? `로그인에 실패했어요: ${err.message} (브라우저의 팝업 차단을 해제해 주세요)`
          : "Google 로그인 중 문제가 발생했어요."
      )
    } finally {
      setIsSigningIn(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      setIsPreviewingLanding(false)
    } catch (err) {
      console.error("로그아웃 오류:", err)
    }
  }

  const isShowingLanding = !user || isPreviewingLanding

  return (
    <main
      suppressHydrationWarning
      className="flex min-h-screen w-full flex-col items-center bg-[var(--tds-grey-100)] px-0 py-0 sm:px-6 sm:py-8"
    >
      {/* 반응형 컨테이너: 랜딩 페이지일 때는 모바일~데스크톱(max-w-[1040px]) 반응형 확장, 마이페이지일 때는 모바일 셸(max-w-[480px]) */}
      <div
        suppressHydrationWarning
        className={cn(
          "flex min-h-screen w-full flex-col bg-[var(--tds-grey-100)] transition-all duration-200 sm:min-h-0 sm:gap-4",
          isShowingLanding ? "max-w-[1040px]" : "max-w-[480px]"
        )}
      >
        {/* Top App Bar */}
        <AuthHeader
          user={user}
          isAuthLoading={isAuthLoading}
          isSigningIn={isSigningIn}
          title={isShowingLanding ? "마이링크" : "내 프로필 관리"}
          titleHref="/"
          onSignInWithGoogle={handleSignInWithGoogle}
          onSignOut={handleSignOut}
        />

        {/* 로그인 상태에서 마이페이지 <-> 랜딩 페이지 전환 탭 바 */}
        {!isAuthLoading && user ? (
          <div className="flex items-center justify-between border-b border-[var(--tds-grey-200)] bg-[var(--tds-white)] px-4 py-2.5 sm:rounded-[18px] sm:border sm:px-5">
            <span className="text-[13px] font-medium text-[var(--tds-grey-600)]">
              {isShowingLanding
                ? "마이링크 서비스 소개 화면이에요"
                : "내 프로필과 멀티링크를 편집하고 있어요"}
            </span>

            <div className="flex items-center gap-1 rounded-[999px] bg-[var(--tds-grey-100)] p-1">
              <button
                type="button"
                onClick={() => setIsPreviewingLanding(false)}
                className={cn(
                  "inline-flex h-[28px] items-center gap-1 rounded-[999px] px-3 text-[12px] font-semibold transition-colors",
                  !isPreviewingLanding
                    ? "bg-[var(--tds-white)] text-[var(--tds-blue-500)] shadow-xs"
                    : "text-[var(--tds-grey-600)] hover:text-[var(--tds-grey-900)]"
                )}
              >
                <UserCircle className="size-3.5" />
                마이페이지 편집
              </button>
              <button
                type="button"
                onClick={() => setIsPreviewingLanding(true)}
                className={cn(
                  "inline-flex h-[28px] items-center gap-1 rounded-[999px] px-3 text-[12px] font-semibold transition-colors",
                  isPreviewingLanding
                    ? "bg-[var(--tds-white)] text-[var(--tds-blue-500)] shadow-xs"
                    : "text-[var(--tds-grey-600)] hover:text-[var(--tds-grey-900)]"
                )}
              >
                <HomeIcon className="size-3.5" />
                랜딩 홈
              </button>
            </div>
          </div>
        ) : null}

        {/* 인증 상태 확인 중 로딩 스켈레톤 / 랜딩 페이지 / 마이페이지 */}
        {isAuthLoading ? (
          <Card className="flex min-h-[420px] flex-1 flex-col items-center justify-center gap-3 px-6 py-12 text-center">
            <Loader2 className="size-7 animate-spin text-[var(--tds-blue-500)]" />
            <p className="text-[14px] font-medium text-[var(--tds-grey-600)]">
              페이지 정보를 불러오고 있어요...
            </p>
          </Card>
        ) : isShowingLanding ? (
          <LandingPage
            user={user}
            isSigningIn={isSigningIn}
            authError={authError}
            onSignInWithGoogle={handleSignInWithGoogle}
            onOpenMyPage={() => setIsPreviewingLanding(false)}
          />
        ) : (
          <MyPage user={user} />
        )}
      </div>
    </main>
  )
}
