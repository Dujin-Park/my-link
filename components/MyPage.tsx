"use client"

import * as React from "react"
import Image from "next/image"
import { Loader2 } from "lucide-react"
import type { User } from "firebase/auth"
import { AddLinkDialog } from "@/components/add-link-dialog"
import { LinkCard } from "@/components/LinkCard"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DEFAULT_LINKS, DEFAULT_PROFILE, type LinkItem } from "@/lib/dummy-data"
import {
  createFirestoreLink,
  deleteFirestoreLink,
  fetchFirestoreLinks,
  updateFirestoreLink,
} from "@/lib/links-service"
import type { NewLinkInput } from "@/lib/store"

const DEFAULT_LINK_IDS = new Set(DEFAULT_LINKS.map((item) => item.id))

export interface MyPageProps {
  user: User
}

export function MyPage({ user }: MyPageProps) {
  const [profile] = React.useState(DEFAULT_PROFILE)
  const [defaultLinks, setDefaultLinks] =
    React.useState<LinkItem[]>(DEFAULT_LINKS)
  const [firestoreLinks, setFirestoreLinks] = React.useState<LinkItem[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    // 로그인한 사용자의 users/{userId}/links 컬렉션을 최초 1회 조회 (createdAt 최신순 정렬)
    let isMounted = true
    setIsLoading(true)

    fetchFirestoreLinks(user.uid)
      .then((loadedLinks) => {
        if (isMounted) {
          setFirestoreLinks(loadedLinks)
        }
      })
      .catch((error) => {
        console.error("Firestore 링크 조회 오류:", error)
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [user.uid])

  const handleAddLink = async (input: NewLinkInput) => {
    setIsLoading(true)
    try {
      // Firestore users/{userId}/links에 저장 후 반환된 새 링크를 최상단(최신순)에 즉시 동기화
      const createdLink = await createFirestoreLink(user.uid, input)
      setFirestoreLinks((prev) => [createdLink, ...prev])
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateLink = async (
    id: string,
    updates: { title: string; url: string }
  ) => {
    if (!DEFAULT_LINK_IDS.has(id)) {
      await updateFirestoreLink(user.uid, id, updates)
      setFirestoreLinks((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, title: updates.title, url: updates.url }
            : item
        )
      )
    } else {
      setDefaultLinks((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, title: updates.title, url: updates.url }
            : item
        )
      )
    }
  }

  const handleDeleteLink = async (id: string) => {
    if (!DEFAULT_LINK_IDS.has(id)) {
      await deleteFirestoreLink(user.uid, id)
      setFirestoreLinks((prev) => prev.filter((item) => item.id !== id))
    } else {
      setDefaultLinks((prev) => prev.filter((item) => item.id !== id))
    }
  }

  const displayName = user.displayName || profile.name
  const avatarUrl = user.photoURL || profile.avatarUrl

  // 새로 추가된 Firestore 링크(createdAt 최신순)를 상단에 배치하고 기본 링크와 함께 표시
  const allLinks = [...firestoreLinks, ...defaultLinks]
  const enabledLinks = allLinks.filter((link) => link.enabled)

  return (
    <div className="flex flex-1 flex-col sm:gap-3">
      {/* 섹션 1: 프로필 Hero 카드 */}
      <Card
        suppressHydrationWarning
        className="items-center px-6 pt-8 pb-7 text-center"
      >
        {/* 직무 Badge */}
        <Badge variant="role" className="mb-4">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--tds-blue-500)]" />
          {profile.badge}
        </Badge>

        {/* Asset (아바타) */}
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

        {/* 이름: TDS h2 */}
        <h1 className="text-[24px] font-bold leading-[1.3] tracking-[-0.02em] text-[var(--tds-grey-900)]">
          {displayName}
        </h1>

        {/* 소개글: TDS body-2 + 해요체 보이스 */}
        <p className="mt-2.5 max-w-[320px] whitespace-pre-line text-[15px] font-normal leading-[1.5] tracking-[-0.005em] text-[var(--tds-grey-700)]">
          {profile.bio}
        </p>

        {/* 요약 지표 (Tabular figures 적용) */}
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

        {/* 기술 스택 Chip 리스트 */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {profile.chips.map((chip) => (
            <Badge
              key={chip.name}
              variant={chip.active ? "chipActive" : "chipInactive"}
            >
              {chip.name}
            </Badge>
          ))}
        </div>
      </Card>

      {/* 섹션 간 구분 여백 (모바일에서는 12px grey-100 바) */}
      <div className="h-3 w-full sm:hidden" />

      {/* 새로운 링크 추가하기 버튼 영역 (프로필 바로 아래, 목록 위) */}
      <div className="px-6 py-3 sm:px-0 sm:py-0">
        <AddLinkDialog onAddLink={handleAddLink} />
      </div>

      {/* 섹션 2: 멀티링크 리스트 (Card + LinkCard) */}
      <Card suppressHydrationWarning className="pt-6 pb-4">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle>한번에 둘러보기</CardTitle>
            {isLoading ? (
              <span className="inline-flex items-center gap-1.5 rounded-[999px] bg-[var(--tds-blue-50)] px-2.5 py-0.5 text-[12px] font-semibold text-[var(--tds-blue-500)]">
                <Loader2 className="size-3 animate-spin" />
                불러오는 중...
              </span>
            ) : null}
          </div>
          <CardDescription className="tabular-nums">
            채널 {enabledLinks.length}개
          </CardDescription>
        </CardHeader>

        <CardContent className="divide-y divide-[var(--tds-grey-200)]/60">
          {isLoading && firestoreLinks.length === 0 ? (
            <div className="flex min-h-[72px] w-full animate-pulse items-center justify-between px-6 py-[14px]">
              <div className="flex items-center gap-[14px]">
                <div className="h-[44px] w-[44px] rounded-[14px] bg-[var(--tds-grey-100)]" />
                <div className="flex flex-col gap-2">
                  <div className="h-4 w-32 rounded-md bg-[var(--tds-grey-100)]" />
                  <div className="h-3 w-48 rounded-md bg-[var(--tds-grey-100)]" />
                </div>
              </div>
              <div className="h-4 w-10 rounded-md bg-[var(--tds-grey-100)]" />
            </div>
          ) : null}
          {enabledLinks.map((item) => (
            <LinkCard
              key={item.id}
              item={item}
              onUpdateLink={handleUpdateLink}
              onDeleteLink={handleDeleteLink}
            />
          ))}
        </CardContent>
      </Card>

      {/* 섹션 3: Bottom-Info + 화면당 단 하나뿐인 Primary CTA */}
      <Card
        suppressHydrationWarning
        className="mt-auto items-center px-6 pt-4 pb-8 sm:py-6"
      >
        <Badge variant="pillInfo" className="mb-3">
          새로운 프로젝트 제안을 열어두고 있어요
        </Badge>

        {/* 유일한 Primary CTA 버튼 */}
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

        {/* 보조 액션: Secondary/Ghost 버튼 */}
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
      </Card>
    </div>
  )
}
