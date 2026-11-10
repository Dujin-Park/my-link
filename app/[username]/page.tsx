"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  onAuthStateChanged,
  signOut,
  type User,
} from "firebase/auth"
import { Eye, Loader2, Pencil } from "lucide-react"
import { AuthHeader } from "@/components/AuthHeader"
import { LinkCard } from "@/components/LinkCard"
import { MyPage } from "@/components/MyPage"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DEFAULT_LINKS,
  DEFAULT_PROFILE,
  type LinkItem,
} from "@/lib/dummy-data"
import { auth, signInWithGoogle } from "@/lib/firebase"
import {
  ensureUserDocument,
  incrementClickCount,
  resolveUserByIdentifier,
  type UserProfileDoc,
} from "@/lib/links-service"

const DEFAULT_LINK_IDS = new Set(DEFAULT_LINKS.map((item) => item.id))

function PublicProfileFallback() {
  return (
    <Card className="flex min-h-[420px] flex-1 flex-col items-center justify-center gap-3 px-6 py-12 text-center">
      <Loader2 className="size-7 animate-spin text-[var(--tds-blue-500)]" />
      <p className="text-[14px] font-medium text-[var(--tds-grey-600)]">
        프로필과 링크 목록을 불러오고 있어요...
      </p>
    </Card>
  )
}

function UserPublicProfileContent({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = React.use(params)

  const [currentUser, setCurrentUser] = React.useState<User | null>(null)
  const [isAuthLoading, setIsAuthLoading] = React.useState(true)
  const [isSigningIn, setIsSigningIn] = React.useState(false)

  const [profileDoc, setProfileDoc] = React.useState<UserProfileDoc | null>(
    null
  )
  const [links, setLinks] = React.useState<LinkItem[]>([])
  const [isPageLoading, setIsPageLoading] = React.useState(true)
  const [userNotFound, setUserNotFound] = React.useState(false)
  const [isEditMode, setIsEditMode] = React.useState(false)

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setCurrentUser(u)
      setIsAuthLoading(false)
      if (u) {
        ensureUserDocument(u).catch((err) => {
          console.error("로그인 사용자 문서 초기화 오류:", err)
        })
      }
    })
    return () => unsubscribe()
  }, [])

  React.useEffect(() => {
    let isMounted = true
    setIsPageLoading(true)
    setUserNotFound(false)

    resolveUserByIdentifier(username)
      .then((result) => {
        if (!isMounted) return
        if (!result) {
          setUserNotFound(true)
          return
        }
        setProfileDoc(result.profile)
        setLinks(result.links)
      })
      .catch((error) => {
        console.error("공개 프로필 조회 오류:", error)
        if (isMounted) {
          setUserNotFound(true)
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsPageLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [username, isEditMode])

  if (!isPageLoading && userNotFound) {
    notFound()
  }

  const handleSignInWithGoogle = async () => {
    const signInPromise = signInWithGoogle()
    setIsSigningIn(true)
    try {
      const credential = await signInPromise
      if (credential?.user) {
        setCurrentUser(credential.user)
      }
    } catch (err) {
      console.error("Google 로그인 오류:", err)
    } finally {
      setIsSigningIn(false)
    }
  }

  const handleSignOut = async () => {
    try {
      setIsEditMode(false)
      await signOut(auth)
    } catch (err) {
      console.error("로그아웃 오류:", err)
    }
  }

  const handleLinkClick = async (linkId: string) => {
    setLinks((prev) =>
      prev.map((item) =>
        item.id === linkId
          ? { ...item, clickCount: (item.clickCount ?? 0) + 1 }
          : item
      )
    )

    if (!profileDoc?.uid) {
      console.error(
        "클릭 카운트 저장 실패: 프로필 소유자 UID를 확인할 수 없습니다."
      )
      return
    }

    await incrementClickCount(profileDoc.uid, linkId)
  }

  const isOwner = Boolean(
    currentUser && profileDoc && currentUser.uid === profileDoc.uid
  )

  const displayName = profileDoc?.displayName || DEFAULT_PROFILE.name
  const bio =
    profileDoc?.bio !== undefined ? profileDoc.bio : DEFAULT_PROFILE.bio
  const avatarUrl = profileDoc?.avatarUrl || DEFAULT_PROFILE.avatarUrl
  const enabledLinks = links.filter((link) => link.enabled)

  const currentUserUsername =
    currentUser?.email?.split("@")[0] ||
    currentUser?.displayName ||
    currentUser?.uid ||
    ""

  return (
    <>
      {/* 상단 헤더: 다른 사람의 페이지에서 로그인해도 현재 페이지(/[username])에 그대로 머물며,
          본인 페이지일 때는 '내 페이지 편집(/)'으로, 타인 페이지일 때는 내 공개 페이지('/{username}')로 연결 */}
      <AuthHeader
        user={currentUser}
        isAuthLoading={isAuthLoading}
        isSigningIn={isSigningIn}
        title={isPageLoading ? "프로필" : `${displayName}의 프로필`}
        titleHref={`/${encodeURIComponent(username)}`}
        myPageHref={
          isOwner
            ? "/"
            : currentUser
              ? `/${encodeURIComponent(currentUserUsername)}`
              : "/"
        }
        myPageLabel={isOwner ? "내 페이지 편집" : "내 페이지"}
        onSignInWithGoogle={handleSignInWithGoogle}
        onSignOut={handleSignOut}
      />

      {/* 본인 프로필일 경우: 동적 라우팅 주소(/[username])에서도 바로 편집 모드를 켜고 끌 수 있는 컨트롤 바 제공 */}
      {!isPageLoading && isOwner && currentUser ? (
        <div className="flex items-center justify-between border-b border-[var(--tds-grey-200)] bg-[var(--tds-blue-50)]/70 px-6 py-2.5 sm:rounded-[18px] sm:border">
          <span className="text-[13px] font-semibold text-[var(--tds-blue-500)]">
            {isEditMode
              ? "현재 페이지에서 바로 프로필과 링크를 편집하고 있어요"
              : "방문자에게 보이는 내 공개 프로필 화면이에요"}
          </span>

          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              size="xs"
              onClick={() => setIsEditMode((prev) => !prev)}
              className="h-[30px] gap-1 rounded-[999px] bg-[var(--tds-blue-500)] px-3 text-[12px] font-semibold text-white hover:bg-[var(--tds-blue-600)]"
            >
              {isEditMode ? (
                <>
                  <Eye className="size-3.5" />
                  공개 화면 보기
                </>
              ) : (
                <>
                  <Pencil className="size-3.5" />
                  여기서 바로 편집
                </>
              )}
            </Button>
          </div>
        </div>
      ) : null}

      {isPageLoading ? (
        <PublicProfileFallback />
      ) : isOwner && isEditMode && currentUser ? (
        /* 동적 라우팅 주소(/[username])를 유지한 채로 바로 편집 가능한 MyPage 렌더링 */
        <MyPage user={currentUser} />
      ) : (
        <div className="flex flex-1 flex-col sm:gap-3">
          {/* 섹션 1: 읽기 전용 프로필 Hero 카드 */}
          <Card
            suppressHydrationWarning
            className="items-center px-6 pt-8 pb-7 text-center"
          >
            <Badge variant="role" className="mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--tds-blue-500)]" />
              {DEFAULT_PROFILE.badge}
            </Badge>

            <div className="relative mb-5 h-[104px] w-[104px] overflow-hidden rounded-full border border-[var(--tds-grey-200)] bg-[var(--tds-blue-50)]">
              <Image
                src={avatarUrl}
                alt={`${displayName} 프로필 이미지`}
                width={104}
                height={104}
                unoptimized
                className="h-full w-full object-cover"
                priority
              />
            </div>

            <h1 className="text-[24px] font-bold leading-[1.3] tracking-[-0.02em] text-[var(--tds-grey-900)]">
              {displayName}
            </h1>

            <p className="mt-2.5 max-w-[320px] whitespace-pre-line text-[15px] font-normal leading-[1.5] tracking-[-0.005em] text-[var(--tds-grey-700)]">
              {bio}
            </p>

            <div className="mt-6 grid w-full grid-cols-3 divide-x divide-[var(--tds-grey-200)] rounded-[16px] border border-[var(--tds-grey-200)] bg-[var(--tds-grey-50)] py-3.5">
              <div className="flex flex-col items-center">
                <span className="text-[12px] font-medium text-[var(--tds-grey-600)]">
                  주력 분야
                </span>
                <span className="mt-0.5 text-[15px] font-bold text-[var(--tds-grey-900)]">
                  웹 프론트엔드
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[12px] font-medium text-[var(--tds-grey-600)]">
                  등록된 채널
                </span>
                <span className="tabular-nums mt-0.5 text-[15px] font-bold text-[var(--tds-blue-500)]">
                  {enabledLinks.length}개
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[12px] font-medium text-[var(--tds-grey-600)]">
                  응답 속도
                </span>
                <span className="tabular-nums mt-0.5 text-[15px] font-bold text-[var(--tds-grey-900)]">
                  24시간 이내
                </span>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              {DEFAULT_PROFILE.chips.map((chip) => (
                <Badge
                  key={chip.name}
                  variant={chip.active ? "chipActive" : "chipInactive"}
                >
                  {chip.name}
                </Badge>
              ))}
            </div>
          </Card>

          <div className="h-3 w-full sm:hidden" />

          {/* 섹션 2: 읽기 전용 멀티링크 리스트 */}
          <Card suppressHydrationWarning className="pt-6 pb-4">
            <CardHeader>
              <CardTitle>한번에 둘러보기</CardTitle>
              <CardDescription className="tabular-nums">
                채널 {enabledLinks.length}개
              </CardDescription>
            </CardHeader>

            <CardContent className="divide-y divide-[var(--tds-grey-200)]/60">
              {enabledLinks.map((item) => (
                <LinkCard
                  key={item.id}
                  item={item}
                  readOnly
                  onLinkClick={handleLinkClick}
                />
              ))}
            </CardContent>
          </Card>

          {/* 섹션 3: 하단 CTA */}
          <Card
            suppressHydrationWarning
            className="mt-auto items-center px-6 pt-4 pb-8 sm:py-6"
          >
            <Badge variant="pillInfo" className="mb-3">
              새로운 프로젝트 제안을 열어두고 있어요
            </Badge>

            <Button
              variant="tdsPrimary"
              size="tdsXl"
              nativeButton={false}
              render={
                <a
                  href="https://github.com/Dujin-Park"
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
            >
              GitHub 구경하기
            </Button>

            {isOwner ? (
              <Button
                variant="tdsGhost"
                size="tdsMd"
                className="mt-2"
                nativeButton={false}
                render={<Link href="/" />}
              >
                마이페이지 편집 화면으로 이동하기
              </Button>
            ) : (
              <Button
                variant="tdsGhost"
                size="tdsMd"
                className="mt-2"
                nativeButton={false}
                render={
                  <a href="mailto:337679249+Dujin-Park@users.noreply.github.com" />
                }
              >
                가볍게 메시지 보내기
              </Button>
            )}
          </Card>
        </div>
      )}
    </>
  )
}

export default function UserPublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  return (
    <main
      suppressHydrationWarning
      className="flex min-h-screen w-full flex-col items-center bg-[var(--tds-grey-100)] px-0 py-0 sm:px-6 sm:py-10"
    >
      <div
        suppressHydrationWarning
        className="flex min-h-screen w-full max-w-[480px] flex-col bg-[var(--tds-grey-100)] sm:min-h-0 sm:gap-3"
      >
        <React.Suspense fallback={<PublicProfileFallback />}>
          <UserPublicProfileContent params={params} />
        </React.Suspense>
      </div>
    </main>
  )
}
