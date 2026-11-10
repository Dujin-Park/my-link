"use client"

import * as React from "react"
import Image from "next/image"
import {
  ArrowRight,
  BarChart3,
  ExternalLink,
  Globe,
  Link2,
  Loader2,
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
    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white">
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

const KEYWORD_FEATURES = [
  {
    id: "links",
    keyword: "#링크관리",
    title: "간편한 편집",
    summary: "추가·수정·삭제를 한 화면에서 즉시",
    icon: Link2,
  },
  {
    id: "stats",
    keyword: "#클릭통계",
    title: "실시간 분석",
    summary: "총 클릭수와 인기 순위를 차트로 한눈에",
    icon: BarChart3,
  },
  {
    id: "url",
    keyword: "#개인URL",
    title: "나만의 주소",
    summary: "아이디 하나로 어디서나 깔끔하게 공유",
    icon: Globe,
  },
] as const

const PREVIEW_CLICKS = [128, 94, 67]

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
    <div className="flex flex-1 flex-col gap-4 sm:gap-6">
      {/* 1. 히어로 섹션: 핵심 키워드 + 타이틀 + 단일 CTA */}
      <Card className="items-center px-6 py-14 text-center sm:px-12 sm:py-20">
        <Badge variant="role" className="mb-5 px-3.5 py-1 text-[12px] font-bold">
          MYLINK · 멀티링크 프로필
        </Badge>

        <h1 className="text-[32px] font-bold leading-[1.22] tracking-[-0.025em] text-[var(--tds-grey-900)] sm:text-[48px]">
          내 모든 링크,{" "}
          <span className="text-[var(--tds-blue-500)]">하나로.</span>
        </h1>

        <p className="mt-3 text-[15px] font-medium text-[var(--tds-grey-600)] sm:text-[17px]">
          흩어진 채널을 가장 심플한 한 페이지로 연결해요
        </p>

        {authError ? (
          <p className="mt-4 rounded-[12px] bg-[var(--tds-red-500)]/10 px-4 py-2 text-[13px] font-medium text-[var(--tds-red-500)]">
            {authError}
          </p>
        ) : null}

        <div className="mt-8 w-full max-w-[260px]">
          <Button
            type="button"
            variant="tdsPrimary"
            size="tdsXl"
            disabled={isSigningIn}
            onClick={handlePrimaryAction}
            className="w-full gap-2.5"
          >
            {isSigningIn ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                로그인 중...
              </>
            ) : user ? (
              <>
                내 페이지 관리하기
                <ArrowRight className="size-4" />
              </>
            ) : (
              <>
                <GoogleWhiteBadgeIcon />
                Google로 시작하기
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* 2. 기능 소개: 키워드 중심 3개 카드 (링크 관리, 클릭 통계, 개인 URL) */}
      <section
        aria-label="핵심 기능"
        className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3"
      >
        {KEYWORD_FEATURES.map((item) => {
          const Icon = item.icon
          return (
            <Card
              key={item.id}
              className="flex flex-col items-start justify-between p-6 sm:p-7"
            >
              <div className="flex w-full items-center justify-between">
                <span className="text-[13px] font-bold text-[var(--tds-blue-500)]">
                  {item.keyword}
                </span>
                <div className="flex size-10 items-center justify-center rounded-[14px] bg-[var(--tds-blue-50)] text-[var(--tds-blue-500)]">
                  <Icon className="size-5" />
                </div>
              </div>

              <div className="mt-6 text-left">
                <h2 className="text-[20px] font-bold tracking-[-0.015em] text-[var(--tds-grey-900)]">
                  {item.title}
                </h2>
                <p className="mt-1 text-[14px] text-[var(--tds-grey-600)]">
                  {item.summary}
                </p>
              </div>
            </Card>
          )
        })}
      </section>

      {/* 3. 미리보기: 미니멀 화면 목업 + CTA 버튼 */}
      <Card className="items-center px-6 py-10 text-center sm:px-12 sm:py-14">
        <span className="text-[13px] font-bold text-[var(--tds-blue-500)]">
          #미리보기
        </span>
        <h2 className="mt-1 text-[22px] font-bold tracking-[-0.02em] text-[var(--tds-grey-900)] sm:text-[26px]">
          깔끔한 프로필, 한눈에 보는 클릭수
        </h2>

        {/* 심플 목업 프레임 */}
        <div className="mt-7 w-full max-w-[340px] rounded-[28px] border border-[var(--tds-grey-200)] bg-[var(--tds-grey-50)] p-4">
          <div className="flex items-center justify-between rounded-[12px] bg-[var(--tds-white)] px-3.5 py-2 text-[12px] border border-[var(--tds-grey-200)]/80">
            <span className="font-mono text-[var(--tds-grey-600)]">
              mylink.hy/<strong className="text-[var(--tds-blue-500)]">dujin</strong>
            </span>
            <span className="tabular-nums font-bold text-[var(--tds-blue-500)]">
              총 289 클릭
            </span>
          </div>

          <div className="mt-3 flex items-center gap-3 rounded-[16px] bg-[var(--tds-white)] p-3.5 text-left border border-[var(--tds-grey-200)]/80">
            <div className="relative size-12 shrink-0 overflow-hidden rounded-full bg-[var(--tds-blue-50)]">
              <Image
                src={DEFAULT_PROFILE.avatarUrl}
                alt="예시 아바타"
                width={48}
                height={48}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="truncate text-[15px] font-bold text-[var(--tds-grey-900)]">
                {DEFAULT_PROFILE.name}
              </p>
              <p className="truncate text-[12px] text-[var(--tds-grey-500)]">
                Frontend Developer
              </p>
            </div>
          </div>

          <div className="mt-2.5 flex flex-col gap-2">
            {DEFAULT_LINKS.slice(0, 3).map((item, idx) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-[14px] border border-[var(--tds-grey-200)]/80 bg-[var(--tds-white)] px-3.5 py-2.5"
              >
                <span className="truncate text-[13px] font-semibold text-[var(--tds-grey-900)]">
                  {item.title}
                </span>
                <span className="tabular-nums shrink-0 text-[12px] font-bold text-[var(--tds-blue-500)]">
                  {PREVIEW_CLICKS[idx]}회
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 미리보기 하단 CTA */}
        <div className="mt-7 w-full max-w-[260px]">
          <Button
            type="button"
            variant="tdsPrimary"
            size="tdsXl"
            disabled={isSigningIn}
            onClick={handlePrimaryAction}
            className="w-full gap-2"
          >
            {user ? "내 링크 편집하기" : "3초 만에 내 링크 만들기"}
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </Card>

      {/* 4. 푸터: 한양대학교 바이브 코딩, GitHub 링크 */}
      <footer className="flex flex-col items-center justify-between gap-2 rounded-[20px] border border-[var(--tds-grey-200)] bg-[var(--tds-white)] px-6 py-4 text-[13px] text-[var(--tds-grey-600)] sm:flex-row">
        <span className="font-semibold text-[var(--tds-grey-800)]">
          한양대학교 바이브 코딩 · MyLink
        </span>

        <a
          href="https://github.com/Dujin-Park/my-link"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-semibold text-[var(--tds-blue-500)] transition-opacity hover:opacity-80"
        >
          <span>GitHub</span>
          <ExternalLink className="size-3.5" />
        </a>
      </footer>
    </div>
  )
}
