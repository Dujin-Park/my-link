"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ExternalLink,
  Globe,
  Link2,
  Loader2,
  MousePointerClick,
  Sparkles,
} from "lucide-react"
import type { User } from "firebase/auth"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DEFAULT_LINKS, DEFAULT_PROFILE } from "@/lib/dummy-data"

export interface LandingPageProps {
  user?: User | null
  isSigningIn: boolean
  authError?: string
  onSignInWithGoogle: () => Promise<void> | void
  onOpenMyPage?: () => void
}

function GoogleWhiteBadgeIcon() {
  return (
    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white shadow-xs">
      <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="#4285F4"
          d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v2.98h3.86c2.26-2.09 3.56-5.17 3.56-8.8z"
        />
        <path
          fill="#34A853"
          d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-2.98c-1.08.72-2.45 1.16-4.07 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"
        />
        <path
          fill="#FBBC05"
          d="M5.28 14.31c-.24-.72-.38-1.49-.38-2.31s.14-1.59.38-2.31V6.6H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.4l3.99-3.09z"
        />
        <path
          fill="#EA4335"
          d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.6l3.99 3.09c.95-2.85 3.6-4.94 6.72-4.94z"
        />
      </svg>
    </span>
  )
}

function GitHubIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  )
}

const FEATURES = [
  {
    id: "link-management",
    badge: "링크 관리",
    title: "간편한 멀티링크 추가 · 편집",
    description:
      "GitHub, 포트폴리오, 기술 블로그, SNS까지 흩어진 링크를 한곳에 모으고 언제든 인라인으로 즉시 수정해요.",
    highlights: ["실시간 링크 추가 및 삭제", "이름·소개글 원클릭 인라인 편집"],
    icon: Link2,
  },
  {
    id: "click-stats",
    badge: "클릭 통계",
    title: "실시간 클릭 카운트와 차트 분석",
    description:
      "방문자가 어떤 링크에 가장 관심이 많은지 총 클릭수와 인기 순위 막대 차트로 한눈에 파악해요.",
    highlights: ["원자적(Atomic) 실시간 클릭 집계", "shadcn 차트 기반 상세 통계 리포트"],
    icon: BarChart3,
  },
  {
    id: "personal-url",
    badge: "개인 URL",
    title: "나만의 고유 프로필 주소 제공",
    description:
      "복잡한 주소 대신 아이디 기반의 깔끔한 개인 URL(/username)로 이력서와 SNS 프로필에 바로 공유해요.",
    highlights: ["아이디 기반 전용 URL 자동 생성", "공개 화면에서도 즉시 편집 모드 전환"],
    icon: Globe,
  },
] as const

const MOCKUP_PREVIEW_CLICKS = [128, 94, 67, 42]

export function LandingPage({
  user,
  isSigningIn,
  authError,
  onSignInWithGoogle,
  onOpenMyPage,
}: LandingPageProps) {
  const handlePrimaryAction = async () => {
    if (user && onOpenMyPage) {
      onOpenMyPage()
      return
    }
    await onSignInWithGoogle()
  }

  return (
    <div className="flex flex-1 flex-col gap-5 sm:gap-8">
      {/* 1. 히어로 섹션 (Hero Section): 서비스 이름, 태그라인, CTA 버튼 */}
      <Card className="relative overflow-hidden px-6 pt-10 pb-10 text-center sm:px-12 sm:pt-16 sm:pb-14">
        {/* 은은한 상단 배경 포인트 */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-1/2 h-56 w-[480px] -translate-x-1/2 rounded-full bg-[var(--tds-blue-50)] opacity-70 blur-3xl"
        />

        <div className="relative z-10 mx-auto flex max-w-[680px] flex-col items-center">
          <Badge variant="role" className="mb-4 px-3.5 py-1 text-[13px]">
            <Sparkles className="size-3.5 text-[var(--tds-blue-500)]" />
            <span>마이링크 (MyLink) · 나만의 멀티링크 프로필</span>
          </Badge>

          <h1 className="text-[28px] font-bold leading-[1.28] tracking-[-0.02em] text-[var(--tds-grey-900)] sm:text-[42px] md:text-[48px]">
            흩어진 내 모든 채널을
            <br />
            <span className="text-[var(--tds-blue-500)]">마이링크</span> 하나로
            연결해요
          </h1>

          <p className="mt-4 max-w-[520px] text-[15px] font-normal leading-[1.6] tracking-[-0.005em] text-[var(--tds-grey-700)] sm:text-[17px]">
            포트폴리오, GitHub, 블로그, 연락처까지 한 페이지에 깔끔하게 담고,
            <br className="hidden sm:inline" /> 나만의 개인 URL 공유와 실시간 클릭
            통계까지 한 번에 시작해 보세요.
          </p>

          {authError ? (
            <p className="mt-4 rounded-[12px] bg-[var(--tds-red-500)]/10 px-4 py-2 text-center text-[13px] font-medium text-[var(--tds-red-500)]">
              {authError}
            </p>
          ) : null}

          <div className="mt-7 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
            <Button
              type="button"
              variant="tdsPrimary"
              size="tdsXl"
              disabled={isSigningIn}
              onClick={handlePrimaryAction}
              className="w-full gap-2.5 sm:w-auto sm:min-w-[240px] sm:px-8"
            >
              {isSigningIn ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  로그인 중...
                </>
              ) : user ? (
                <>
                  내 링크 페이지 관리하기
                  <ArrowRight className="size-5" />
                </>
              ) : (
                <>
                  <GoogleWhiteBadgeIcon />
                  Google로 무료로 시작하기
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="lg"
              nativeButton={false}
              render={<a href="#preview-section" />}
              className="h-[52px] w-full rounded-[16px] border-[var(--tds-grey-200)] bg-[var(--tds-white)] px-6 text-[15px] font-semibold text-[var(--tds-grey-800)] hover:bg-[var(--tds-grey-50)] sm:w-auto"
            >
              예시 화면 미리보기
            </Button>
          </div>

          {/* 히어로 하단 신뢰 요약 배지 */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] font-medium text-[var(--tds-grey-600)]">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-[var(--tds-blue-500)]" />
              무료 클라우드 저장
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-[var(--tds-blue-500)]" />
              실시간 클릭 분석 차트
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-[var(--tds-blue-500)]" />
              모바일 · 데스크톱 완벽 대응
            </span>
          </div>
        </div>
      </Card>

      {/* 2. 기능 소개 섹션 (Features Section): 3개 기능 카드 (링크 관리, 클릭 통계, 개인 URL) */}
      <section aria-labelledby="features-heading" className="flex flex-col gap-4">
        <div className="flex flex-col items-start justify-between gap-1 px-2 sm:flex-row sm:items-end">
          <div>
            <span className="text-[13px] font-bold text-[var(--tds-blue-500)]">
              핵심 기능 소개
            </span>
            <h2
              id="features-heading"
              className="mt-0.5 text-[22px] font-bold tracking-[-0.015em] text-[var(--tds-grey-900)] sm:text-[26px]"
            >
              필요한 기능만 가장 직관적으로 담았어요
            </h2>
          </div>
          <p className="text-[14px] text-[var(--tds-grey-600)]">
            링크 관리부터 클릭 통계, 개인 URL까지 한 번에 해결해요
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {FEATURES.map((feature) => {
            const IconComponent = feature.icon
            return (
              <Card
                key={feature.id}
                className="flex flex-col justify-between p-6 transition-transform duration-200 hover:-translate-y-0.5"
              >
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex size-12 items-center justify-center rounded-[16px] bg-[var(--tds-blue-50)] text-[var(--tds-blue-500)]">
                      <IconComponent className="size-6" />
                    </div>
                    <Badge variant="role" className="px-2.5 py-0.5 text-[12px]">
                      {feature.badge}
                    </Badge>
                  </div>

                  <h3 className="text-[18px] font-bold leading-[1.4] tracking-[-0.01em] text-[var(--tds-grey-900)]">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-[14px] leading-[1.55] text-[var(--tds-grey-700)]">
                    {feature.description}
                  </p>
                </div>

                <ul className="mt-5 flex flex-col gap-2 border-t border-[var(--tds-grey-100)] pt-4">
                  {feature.highlights.map((point) => (
                    <li
                      key={point}
                      className="flex items-center gap-2 text-[13px] font-medium text-[var(--tds-grey-700)]"
                    >
                      <span className="size-1.5 shrink-0 rounded-full bg-[var(--tds-blue-500)]" />
                      {point}
                    </li>
                  ))}
                </ul>
              </Card>
            )
          })}
        </div>
      </section>

      {/* 3. 미리보기 섹션 (Preview Section): 예시 화면 목업 + CTA 버튼 */}
      <section id="preview-section" className="scroll-mt-20">
        <Card className="overflow-hidden p-6 sm:p-10">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10">
            {/* 좌측 설명 및 CTA 영역 */}
            <div className="flex flex-col items-start text-left lg:col-span-6">
              <Badge variant="role" className="mb-3">
                실제 화면 미리보기
              </Badge>

              <h2 className="text-[24px] font-bold leading-[1.3] tracking-[-0.02em] text-[var(--tds-grey-900)] sm:text-[30px]">
                방문자에게는 깔끔한 프로필로,
                <br />
                나에게는 강력한 통계 대시보드로
              </h2>

              <p className="mt-3 text-[15px] leading-[1.6] text-[var(--tds-grey-700)]">
                토스 디자인 시스템(TDS) 기반의 절제된 카드 레이아웃으로 어떤
                기기에서 열어도 가독성이 뛰어나요. 링크를 클릭할 때마다 실시간으로
                클릭수가 집계되어 인사이트를 제공해요.
              </p>

              {/* 미리보기 포인트 요약 */}
              <div className="mt-6 grid w-full grid-cols-2 gap-3">
                <div className="rounded-[16px] border border-[var(--tds-grey-200)] bg-[var(--tds-grey-50)] p-4">
                  <div className="flex items-center gap-2 text-[13px] font-semibold text-[var(--tds-grey-600)]">
                    <MousePointerClick className="size-4 text-[var(--tds-blue-500)]" />
                    예시 누적 클릭
                  </div>
                  <p className="tabular-nums mt-1 text-[22px] font-bold text-[var(--tds-grey-900)]">
                    총 <span className="text-[var(--tds-blue-500)]">331</span> 클릭
                  </p>
                </div>

                <div className="rounded-[16px] border border-[var(--tds-grey-200)] bg-[var(--tds-grey-50)] p-4">
                  <div className="flex items-center gap-2 text-[13px] font-semibold text-[var(--tds-grey-600)]">
                    <Globe className="size-4 text-[var(--tds-blue-500)]" />
                    전용 프로필 주소
                  </div>
                  <p className="mt-1 truncate text-[16px] font-bold text-[var(--tds-grey-900)]">
                    mylink.app/<span className="text-[var(--tds-blue-500)]">dujin</span>
                  </p>
                </div>
              </div>

              {/* 미리보기 섹션 CTA 버튼 */}
              <div className="mt-7 flex w-full flex-col gap-2.5 sm:flex-row">
                <Button
                  type="button"
                  variant="tdsPrimary"
                  size="tdsXl"
                  disabled={isSigningIn}
                  onClick={handlePrimaryAction}
                  className="w-full gap-2 sm:w-auto sm:px-8"
                >
                  {isSigningIn ? (
                    <>
                      <Loader2 className="size-5 animate-spin" />
                      로그인 중...
                    </>
                  ) : user ? (
                    <>
                      지금 내 페이지 편집하기
                      <ArrowRight className="size-4" />
                    </>
                  ) : (
                    <>
                      <GoogleWhiteBadgeIcon />
                      3초 만에 내 페이지 만들기
                    </>
                  )}
                </Button>

                {user ? (
                  <Button
                    variant="outline"
                    size="lg"
                    nativeButton={false}
                    render={<Link href="/stats" />}
                    className="h-[52px] w-full gap-1.5 rounded-[16px] border-[var(--tds-grey-200)] px-5 text-[14px] font-semibold text-[var(--tds-grey-800)] sm:w-auto"
                  >
                    <BarChart3 className="size-4 text-[var(--tds-blue-500)]" />
                    내 클릭 통계 보러가기
                  </Button>
                ) : null}
              </div>
            </div>

            {/* 우측 스마트폰 목업(Mockup) 영역 */}
            <div className="flex justify-center lg:col-span-6">
              <div className="w-full max-w-[360px] rounded-[32px] border-[6px] border-[var(--tds-grey-900)]/90 bg-[var(--tds-grey-100)] p-3.5 shadow-[0_20px_50px_oklch(0.155_0.060_261_/_0.14)]">
                {/* 스마트폰 상단 노치 바 */}
                <div className="mx-auto mb-3 h-1.5 w-20 rounded-full bg-[var(--tds-grey-300)]" />

                {/* 목업 내부 주소창 */}
                <div className="mb-3 flex items-center justify-between rounded-[12px] border border-[var(--tds-grey-200)] bg-[var(--tds-white)] px-3 py-1.5 text-[12px]">
                  <span className="font-mono font-medium text-[var(--tds-grey-600)]">
                    mylink.hy/<strong className="text-[var(--tds-blue-500)]">dujin</strong>
                  </span>
                  <Badge variant="chipActive" className="h-5 px-2 text-[10px]">
                    LIVE
                  </Badge>
                </div>

                {/* 목업 프로필 카드 */}
                <div className="flex flex-col items-center rounded-[20px] border border-[var(--tds-grey-200)] bg-[var(--tds-white)] px-4 pt-5 pb-4 text-center">
                  <div className="relative mb-2.5 size-16 overflow-hidden rounded-full border border-[var(--tds-grey-200)] bg-[var(--tds-blue-50)]">
                    <Image
                      src={DEFAULT_PROFILE.avatarUrl}
                      alt="예시 프로필 아바타"
                      width={64}
                      height={64}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <p className="text-[17px] font-bold text-[var(--tds-grey-900)]">
                    {DEFAULT_PROFILE.name}
                  </p>
                  <p className="mt-1 line-clamp-2 text-[12px] text-[var(--tds-grey-600)]">
                    {DEFAULT_PROFILE.bio}
                  </p>
                </div>

                {/* 목업 링크 리스트 */}
                <div className="mt-2.5 flex flex-col divide-y divide-[var(--tds-grey-200)]/60 rounded-[20px] border border-[var(--tds-grey-200)] bg-[var(--tds-white)] px-3.5 py-1">
                  {DEFAULT_LINKS.slice(0, 4).map((item, idx) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-2 py-2.5"
                    >
                      <div className="flex min-w-0 flex-col text-left">
                        <span className="truncate text-[13px] font-semibold text-[var(--tds-grey-900)]">
                          {item.title}
                        </span>
                        <span className="truncate text-[11px] text-[var(--tds-grey-500)]">
                          {item.subtitle}
                        </span>
                      </div>
                      <span className="tabular-nums shrink-0 rounded-[8px] bg-[var(--tds-blue-50)] px-2 py-0.5 text-[11px] font-bold text-[var(--tds-blue-500)]">
                        {MOCKUP_PREVIEW_CLICKS[idx]} 클릭
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* 4. 푸터 (Footer): 한양대학교 바이브 코딩, GitHub 링크 */}
      <footer className="mt-2 rounded-[24px] border border-[var(--tds-grey-200)] bg-[var(--tds-white)] px-6 py-6 sm:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex flex-col items-center gap-1 text-center sm:items-start sm:text-left">
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-bold text-[var(--tds-grey-900)]">
                마이링크 (MyLink)
              </span>
              <span className="text-[var(--tds-grey-300)]">|</span>
              <span className="text-[14px] font-semibold text-[var(--tds-blue-500)]">
                한양대학교 바이브 코딩
              </span>
            </div>
            <p className="text-[12px] text-[var(--tds-grey-500)]">
              © {new Date().getFullYear()} 한양대학교 바이브 코딩 · Personal Bio &
              Multi-Link Platform
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href="https://github.com/Dujin-Park/my-link"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-[38px] items-center gap-2 rounded-[999px] border border-[var(--tds-grey-200)] bg-[var(--tds-grey-50)] px-4 text-[13px] font-semibold text-[var(--tds-grey-800)] transition-colors hover:bg-[var(--tds-grey-100)]"
            >
              <GitHubIcon className="size-4" />
              <span>GitHub 저장소</span>
              <ExternalLink className="size-3.5 text-[var(--tds-grey-500)]" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
