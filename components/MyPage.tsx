"use client"

import * as React from "react"
import Image from "next/image"
import { Loader2, Pencil } from "lucide-react"
import type { User } from "firebase/auth"
import { AddLinkDialog } from "@/components/add-link-dialog"
import { ClickStatsSection } from "@/components/ClickStatsSection"
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
  ensureUserDocument,
  fetchFirestoreLinks,
  incrementClickCount,
  updateFirestoreLink,
  updateUserProfile,
} from "@/lib/links-service"
import type { NewLinkInput } from "@/lib/store"

const DEFAULT_LINK_IDS = new Set(DEFAULT_LINKS.map((item) => item.id))

export interface MyPageProps {
  user: User
}

export function MyPage({ user }: MyPageProps) {
  const [profile] = React.useState(DEFAULT_PROFILE)

  // 인라인 편집용 displayName / bio 상태 (낙관적 즉시 반영)
  const initialDisplayName = user.displayName || profile.name
  const [displayName, setDisplayName] = React.useState(initialDisplayName)
  const [bio, setBio] = React.useState(profile.bio)

  const [isEditingName, setIsEditingName] = React.useState(false)
  const [nameDraft, setNameDraft] = React.useState(initialDisplayName)
  const [isEditingBio, setIsEditingBio] = React.useState(false)
  const [bioDraft, setBioDraft] = React.useState(profile.bio)

  const nameInputRef = React.useRef<HTMLInputElement>(null)
  const bioInputRef = React.useRef<HTMLTextAreaElement>(null)

  const [defaultLinks, setDefaultLinks] =
    React.useState<LinkItem[]>(DEFAULT_LINKS)
  const [firestoreLinks, setFirestoreLinks] = React.useState<LinkItem[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    // 로그인한 사용자의 users/{userId} 프로필 문서와 users/{userId}/links 컬렉션을 최초 1회 조회
    let isMounted = true
    setIsLoading(true)

    Promise.all([
      ensureUserDocument(user).catch((err) => {
        console.error("Firestore 프로필 조회/초기화 오류:", err)
        return null
      }),
      fetchFirestoreLinks(user.uid).catch((err) => {
        console.error("Firestore 링크 조회 오류:", err)
        return [] as LinkItem[]
      }),
    ])
      .then(([loadedProfile, loadedLinks]) => {
        if (!isMounted) return

        const resolvedName =
          loadedProfile?.displayName?.trim() ||
          user.displayName ||
          profile.name
        const resolvedBio =
          loadedProfile?.bio !== undefined ? loadedProfile.bio : profile.bio

        setDisplayName(resolvedName)
        setNameDraft(resolvedName)
        setBio(resolvedBio)
        setBioDraft(resolvedBio)
        setFirestoreLinks(loadedLinks)
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [user.uid, user.displayName, profile.name, profile.bio])

  React.useEffect(() => {
    if (isEditingName) {
      nameInputRef.current?.focus()
      nameInputRef.current?.select()
    }
  }, [isEditingName])

  React.useEffect(() => {
    if (isEditingBio) {
      bioInputRef.current?.focus()
      const len = bioInputRef.current?.value.length ?? 0
      bioInputRef.current?.setSelectionRange(len, len)
    }
  }, [isEditingBio])

  const commitDisplayName = async () => {
    setIsEditingName(false)
    const nextName = nameDraft.trim()

    // 빈 문자열이거나 기존 값과 동일하면 서버 업데이트를 건너뛰고 원래 값 복구
    if (!nextName || nextName === displayName) {
      setNameDraft(displayName)
      return
    }

    const previousName = displayName
    // UI 반응성을 위해 로컬 상태에 즉시 반영 (Optimistic Update)
    setDisplayName(nextName)
    setNameDraft(nextName)

    try {
      await updateUserProfile(user.uid, { displayName: nextName })
    } catch (error) {
      console.error("프로필 이름 업데이트 오류:", error)
      setDisplayName(previousName)
      setNameDraft(previousName)
    }
  }

  const commitBio = async () => {
    setIsEditingBio(false)
    const nextBio = bioDraft.trim()

    // 빈 문자열이거나 기존 값과 동일하면 서버 업데이트를 건너뛰고 원래 값 복구
    if (!nextBio || nextBio === bio) {
      setBioDraft(bio)
      return
    }

    const previousBio = bio
    // UI 반응성을 위해 로컬 상태에 즉시 반영 (Optimistic Update)
    setBio(nextBio)
    setBioDraft(nextBio)

    try {
      await updateUserProfile(user.uid, { bio: nextBio })
    } catch (error) {
      console.error("프로필 소개글 업데이트 오류:", error)
      setBio(previousBio)
      setBioDraft(previousBio)
    }
  }

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
    await updateFirestoreLink(user.uid, id, updates)
    setFirestoreLinks((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, title: updates.title, url: updates.url }
          : item
      )
    )
    setDefaultLinks((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, title: updates.title, url: updates.url }
          : item
      )
    )
  }

  const handleDeleteLink = async (id: string) => {
    if (!DEFAULT_LINK_IDS.has(id)) {
      await deleteFirestoreLink(user.uid, id)
      setFirestoreLinks((prev) => prev.filter((item) => item.id !== id))
    } else {
      setDefaultLinks((prev) => prev.filter((item) => item.id !== id))
    }
  }

  const handleLinkClick = async (id: string) => {
    if (!user?.uid) {
      console.error("클릭 카운트 저장 실패: 로그인이 필요합니다.")
      return
    }

    setFirestoreLinks((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, clickCount: (item.clickCount ?? 0) + 1 }
          : item
      )
    )
    setDefaultLinks((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, clickCount: (item.clickCount ?? 0) + 1 }
          : item
      )
    )

    await incrementClickCount(user.uid, id)
  }

  const avatarUrl = user.photoURL || profile.avatarUrl

  // Firestore에 이미 저장된 기본 링크 ID는 중복 표시되지 않도록 필터링하고 최신 데이터를 우선 사용
  const existingFirestoreIds = new Set(firestoreLinks.map((item) => item.id))
  const remainingDefaultLinks = defaultLinks.filter(
    (item) => !existingFirestoreIds.has(item.id)
  )
  const allLinks = [...firestoreLinks, ...remainingDefaultLinks]
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

        {/* 이름(displayName): 클릭 시 인라인 편집, Enter 또는 포커스 아웃 시 저장 */}
        <div className="flex w-full max-w-[280px] flex-col items-center">
          {isEditingName ? (
            <input
              ref={nameInputRef}
              type="text"
              aria-label="표시 이름 수정"
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              onBlur={commitDisplayName}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  e.currentTarget.blur()
                } else if (e.key === "Escape") {
                  setNameDraft(displayName)
                  setIsEditingName(false)
                }
              }}
              className="w-full rounded-[10px] border border-[var(--tds-blue-500)] bg-[var(--tds-white)] px-3 py-1 text-center text-[24px] font-bold leading-[1.3] tracking-[-0.02em] text-[var(--tds-grey-900)] ring-2 ring-[var(--tds-blue-500)]/20 outline-none"
            />
          ) : (
            <button
              type="button"
              title="클릭하여 이름 수정"
              onClick={() => {
                setNameDraft(displayName)
                setIsEditingName(true)
              }}
              className="group inline-flex items-center gap-1.5 rounded-[10px] px-2.5 py-0.5 transition-colors hover:bg-[var(--tds-grey-100)]"
            >
              <h1 className="text-[24px] font-bold leading-[1.3] tracking-[-0.02em] text-[var(--tds-grey-900)]">
                {displayName}
              </h1>
              <Pencil className="size-3.5 text-[var(--tds-grey-400)] opacity-60 transition-opacity group-hover:text-[var(--tds-blue-500)] group-hover:opacity-100" />
            </button>
          )}
        </div>

        {/* 소개글(bio): 클릭 시 인라인 편집, Enter 또는 포커스 아웃 시 저장 */}
        <div className="mt-2.5 flex w-full max-w-[340px] flex-col items-center">
          {isEditingBio ? (
            <textarea
              ref={bioInputRef}
              rows={2}
              aria-label="소개글 수정"
              value={bioDraft}
              onChange={(e) => setBioDraft(e.target.value)}
              onBlur={commitBio}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  e.currentTarget.blur()
                } else if (e.key === "Escape") {
                  setBioDraft(bio)
                  setIsEditingBio(false)
                }
              }}
              className="w-full resize-none rounded-[12px] border border-[var(--tds-blue-500)] bg-[var(--tds-white)] px-3 py-2 text-center text-[15px] font-normal leading-[1.5] tracking-[-0.005em] text-[var(--tds-grey-800)] ring-2 ring-[var(--tds-blue-500)]/20 outline-none"
            />
          ) : (
            <button
              type="button"
              title="클릭하여 소개글 수정"
              onClick={() => {
                setBioDraft(bio)
                setIsEditingBio(true)
              }}
              className="group inline-flex items-center gap-1.5 rounded-[12px] px-3 py-1 transition-colors hover:bg-[var(--tds-grey-100)]"
            >
              <p className="whitespace-pre-line text-center text-[15px] font-normal leading-[1.5] tracking-[-0.005em] text-[var(--tds-grey-700)]">
                {bio}
              </p>
              <Pencil className="size-3.5 shrink-0 text-[var(--tds-grey-400)] opacity-60 transition-opacity group-hover:text-[var(--tds-blue-500)] group-hover:opacity-100" />
            </button>
          )}
        </div>

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
              onLinkClick={handleLinkClick}
              onUpdateLink={handleUpdateLink}
              onDeleteLink={handleDeleteLink}
            />
          ))}
        </CardContent>
      </Card>

      {/* 섹션 간 구분 여백 (모바일에서는 12px grey-100 바) */}
      <div className="h-3 w-full sm:hidden" />

      {/* 섹션 3: 클릭 통계 섹션 (총 클릭수 & 링크별 클릭수 내림차순 정렬) */}
      <ClickStatsSection links={enabledLinks} />

      {/* 섹션 간 구분 여백 (모바일에서는 12px grey-100 바) */}
      <div className="h-3 w-full sm:hidden" />

      {/* 섹션 4: Bottom-Info + 화면당 단 하나뿐인 Primary CTA */}
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
