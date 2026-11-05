"use client"

import * as React from "react"
import Image from "next/image"
import { Link2, Loader2, ShieldCheck, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DEFAULT_LINKS, DEFAULT_PROFILE } from "@/lib/dummy-data"

export interface LandingPageProps {
  isSigningIn: boolean
  authError?: string
  onSignInWithGoogle: () => Promise<void> | void
}

function GoogleWhiteBadgeIcon() {
  return (
    <span className="flex size-6 items-center justify-center rounded-full bg-white">
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

export function LandingPage({
  isSigningIn,
  authError,
  onSignInWithGoogle,
}: LandingPageProps) {
  return (
    <div className="flex flex-1 flex-col sm:gap-3">
      {/* 섹션 1: 랜딩 Hero 소개 카드 */}
      <Card className="items-center px-6 pt-9 pb-8 text-center">
        <Badge variant="role" className="mb-4">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--tds-blue-500)]" />
          나만의 멀티링크 프로필
        </Badge>

        <div className="relative mb-5 h-[96px] w-[96px] overflow-hidden rounded-full border border-[var(--tds-grey-200)] bg-[var(--tds-blue-50)]">
          <Image
            src={DEFAULT_PROFILE.avatarUrl}
            alt="마이링크 프리뷰 아바타"
            width={96}
            height={96}
            className="h-full w-full object-cover"
            priority
          />
        </div>

        <h1 className="text-[24px] font-bold leading-[1.35] tracking-[-0.02em] text-[var(--tds-grey-900)]">
          흩어진 내 채널을
          <br />한 페이지에 깔끔하게 모아보세요
        </h1>

        <p className="mt-3 max-w-[320px] text-[15px] font-normal leading-[1.5] tracking-[-0.005em] text-[var(--tds-grey-700)]">
          GitHub, 포트폴리오, 블로그, 이메일 링크까지
          <br />
          로그인 한 번으로 나만의 링크 페이지를 관리해요.
        </p>

        {/* 핵심 기능 요약 리스트 */}
        <div className="mt-6 flex w-full flex-col gap-2.5 rounded-[16px] border border-[var(--tds-grey-200)] bg-[var(--tds-grey-50)] p-4 text-left">
          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-[var(--tds-blue-50)] text-[var(--tds-blue-500)]">
              <Link2 className="size-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-[14px] font-semibold text-[var(--tds-grey-900)]">
                간편한 링크 추가 · 수정 · 삭제
              </span>
              <span className="text-[12px] text-[var(--tds-grey-600)]">
                원하는 채널을 언제든 추가하고 바로 편집할 수 있어요
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-[var(--tds-blue-50)] text-[var(--tds-blue-500)]">
              <ShieldCheck className="size-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-[14px] font-semibold text-[var(--tds-grey-900)]">
                계정별 안전한 클라우드 저장
              </span>
              <span className="text-[12px] text-[var(--tds-grey-600)]">
                내 Google 계정에만 전용으로 링크가 안전하게 보관돼요
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-[var(--tds-blue-50)] text-[var(--tds-blue-500)]">
              <Sparkles className="size-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-[14px] font-semibold text-[var(--tds-grey-900)]">
                토스 스타일 모바일 프로필
              </span>
              <span className="text-[12px] text-[var(--tds-grey-600)]">
                누구에게나 보기 편한 깔끔한 카드 레이아웃을 제공해요
              </span>
            </div>
          </div>
        </div>
      </Card>

      <div className="h-3 w-full sm:hidden" />

      {/* 섹션 2: 데모 링크 프리뷰 */}
      <Card className="px-6 pt-5 pb-5">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[15px] font-semibold text-[var(--tds-grey-800)]">
            이렇게 보여요 (미리보기)
          </span>
          <span className="text-[12px] font-medium text-[var(--tds-blue-500)]">
            예시 화면
          </span>
        </div>

        <div className="flex flex-col divide-y divide-[var(--tds-grey-200)]/60 rounded-[16px] border border-[var(--tds-grey-200)] bg-[var(--tds-grey-50)]/60 px-4">
          {DEFAULT_LINKS.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between py-3"
            >
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-[14px] font-semibold text-[var(--tds-grey-900)]">
                  {item.title}
                </span>
                <span className="truncate text-[12px] text-[var(--tds-grey-600)]">
                  {item.subtitle}
                </span>
              </div>
              <span className="ml-2 shrink-0 text-[12px] font-bold text-[var(--tds-blue-500)]">
                {item.meta}
              </span>
            </div>
          ))}
        </div>
      </Card>

      <div className="h-3 w-full sm:hidden" />

      {/* 섹션 3: 하단 시작하기 Primary CTA */}
      <Card className="mt-auto items-center px-6 pt-5 pb-8 sm:py-6">
        <Badge variant="pillInfo" className="mb-3">
          3초 만에 내 링크 페이지를 시작해 보세요
        </Badge>

        {authError ? (
          <p className="mb-3 text-center text-[13px] font-medium text-[var(--tds-red-500)]">
            {authError}
          </p>
        ) : null}

        <Button
          type="button"
          variant="tdsPrimary"
          size="tdsXl"
          disabled={isSigningIn}
          onClick={onSignInWithGoogle}
          className="gap-2.5"
        >
          {isSigningIn ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              로그인 중...
            </>
          ) : (
            <>
              <GoogleWhiteBadgeIcon />
              Google로 시작하기
            </>
          )}
        </Button>
      </Card>
    </div>
  )
}
