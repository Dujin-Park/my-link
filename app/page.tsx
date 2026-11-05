"use client"

import * as React from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { LinkCardItem } from "@/components/link-card-item"
import { DEFAULT_LINKS, DEFAULT_PROFILE } from "@/lib/dummy-data"
import { useProfileStore } from "@/lib/store"

export default function Home() {
  const storeProfile = useProfileStore((state) => state.profile)
  const storeLinks = useProfileStore((state) => state.links)
  const resetToDefault = useProfileStore((state) => state.resetToDefault)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    if (!window.localStorage.getItem("mylink_profile_v1")) {
      resetToDefault()
    }
    setMounted(true)
  }, [resetToDefault])

  const profile = mounted ? storeProfile : DEFAULT_PROFILE
  const links = mounted ? storeLinks : DEFAULT_LINKS
  const enabledLinks = links.filter((link) => link.enabled)

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
        {/* Top App Bar (56pt 높이, 좌측 정렬 타이틀, 우측 아이콘 버튼 슬롯) */}
        <header className="sticky top-0 z-20 flex h-[56px] w-full items-center justify-between border-b border-[var(--tds-grey-200)] bg-[var(--tds-white)]/90 px-6 backdrop-blur-md sm:rounded-t-[24px]">
          <span className="text-[18px] font-semibold tracking-[-0.01em] text-[var(--tds-grey-900)]">
            내 프로필
          </span>
          <Button
            variant="tdsIcon"
            size="tdsIcon"
            aria-label="저장소 보기"
            nativeButton={false}
            render={
              <a
                href="https://github.com/Dujin-Park/my-link"
                target="_blank"
                rel="noopener noreferrer"
              />
            }
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
              <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
            </svg>
          </Button>
        </header>

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
              src={profile.avatarUrl}
              alt={`${profile.name} 프로필 일러스트`}
              width={104}
              height={104}
              className="h-full w-full object-cover"
              priority
            />
          </div>

          {/* 이름: TDS h2 */}
          <h1 className="text-[24px] font-bold leading-[1.3] tracking-[-0.02em] text-[var(--tds-grey-900)]">
            {profile.name}
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
                진행 프로젝트
              </span>
              <span className="tabular-nums mt-0.5 text-[15px] font-bold text-[var(--tds-blue-500)]">
                2개
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

        {/* 섹션 2: 멀티링크 리스트 (Card + LinkCardItem) */}
        <Card suppressHydrationWarning className="pt-6 pb-4">
          <CardHeader>
            <CardTitle>한번에 둘러보기</CardTitle>
            <CardDescription className="tabular-nums">
              채널 {enabledLinks.length}개
            </CardDescription>
          </CardHeader>

          <CardContent className="divide-y divide-[var(--tds-grey-200)]/60">
            {enabledLinks.map((item) => (
              <LinkCardItem key={item.id} item={item} />
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
    </main>
  )
}
