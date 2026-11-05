"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight, BarChart3, MousePointerClick } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { LinkItem } from "@/lib/dummy-data"
import { cn } from "@/lib/utils"

export interface ClickStatsSectionProps {
  links: LinkItem[]
}

export function ClickStatsSection({ links }: ClickStatsSectionProps) {
  // 모든 링크의 클릭수 합계
  const totalClicks = React.useMemo(
    () => links.reduce((sum, item) => sum + (item.clickCount ?? 0), 0),
    [links]
  )

  // 클릭수 많은 순(내림차순)으로 정렬
  const sortedLinks = React.useMemo(
    () =>
      [...links].sort(
        (a, b) => (b.clickCount ?? 0) - (a.clickCount ?? 0)
      ),
    [links]
  )

  return (
    <Card suppressHydrationWarning className="pt-6 pb-5">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <CardTitle>클릭 통계</CardTitle>
          <Badge variant="role" className="h-[20px] px-2 text-[11px]">
            실시간 집계
          </Badge>
        </div>
        <CardDescription>
          <Link
            href="/stats"
            className="inline-flex items-center gap-1 font-semibold text-[var(--tds-blue-500)] transition-opacity hover:opacity-80"
          >
            차트로 상세 보기
            <ArrowRight className="size-3.5" />
          </Link>
        </CardDescription>
      </CardHeader>

      <CardContent className="px-6">
        {/* 총 클릭수 요약 박스 (DESIGN.md: grey-50 바탕, h1 28px Bold, blue-500 강조) */}
        <div className="flex items-center justify-between rounded-[16px] border border-[var(--tds-grey-200)] bg-[var(--tds-grey-50)] px-5 py-4">
          <div className="flex flex-col gap-0.5 text-left">
            <span className="text-[13px] font-medium leading-[1.5] text-[var(--tds-grey-600)]">
              모든 링크의 클릭수 합계
            </span>
            <p className="tabular-nums text-[28px] font-bold leading-[1.3] tracking-[-0.02em] text-[var(--tds-grey-900)]">
              총{" "}
              <span className="text-[var(--tds-blue-500)]">
                {totalClicks.toLocaleString("ko-KR")}
              </span>{" "}
              클릭
            </p>
          </div>

          <div className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-[14px] bg-[var(--tds-blue-50)] text-[var(--tds-blue-500)]">
            <MousePointerClick className="size-5" />
          </div>
        </div>

        {/* 링크별 클릭수 리스트 (클릭수 많은 순 정렬) */}
        <div className="mt-4 flex flex-col">
          <div className="mb-1.5 flex items-center justify-between px-1">
            <span className="text-[13px] font-semibold leading-[1.25] text-[var(--tds-grey-600)]">
              링크별 클릭수
            </span>
            <span className="text-[12px] font-medium leading-[1.4] text-[var(--tds-grey-500)]">
              클릭 많은 순
            </span>
          </div>

          {sortedLinks.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-1.5 rounded-[14px] border border-dashed border-[var(--tds-grey-200)] py-8 text-center">
              <BarChart3 className="size-5 text-[var(--tds-grey-400)]" />
              <p className="text-[13px] text-[var(--tds-grey-500)]">
                아직 집계할 링크가 없어요
              </p>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-[var(--tds-grey-200)]/60 rounded-[16px] border border-[var(--tds-grey-200)] bg-[var(--tds-white)]">
              {sortedLinks.map((item, index) => {
                const clicks = item.clickCount ?? 0
                const isTopClicked = index === 0 && clicks > 0

                return (
                  <div
                    key={item.id}
                    className="flex min-h-[52px] items-center justify-between gap-3 px-4 py-3"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      {/* 순위 배지 */}
                      <span
                        className={cn(
                          "tabular-nums flex size-6 shrink-0 items-center justify-center rounded-[8px] text-[12px] font-bold",
                          isTopClicked
                            ? "bg-[var(--tds-blue-50)] text-[var(--tds-blue-500)]"
                            : "bg-[var(--tds-grey-100)] text-[var(--tds-grey-600)]"
                        )}
                      >
                        {index + 1}
                      </span>

                      {/* 링크 제목 */}
                      <span className="truncate text-[15px] font-semibold leading-[1.45] tracking-[-0.005em] text-[var(--tds-grey-900)]">
                        {item.title}
                      </span>
                    </div>

                    {/* 우측 클릭수 표시 */}
                    <span
                      className={cn(
                        "tabular-nums shrink-0 text-[15px] font-bold",
                        clicks > 0
                          ? "text-[var(--tds-blue-500)]"
                          : "text-[var(--tds-grey-500)]"
                      )}
                    >
                      {clicks.toLocaleString("ko-KR")}회
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
