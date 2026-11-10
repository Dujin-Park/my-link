"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  onAuthStateChanged,
  signOut,
  type User,
} from "firebase/auth"
import {
  ArrowLeft,
  BarChart3,
  ExternalLink,
  Loader2,
  MousePointerClick,
  TrendingUp,
} from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  XAxis,
  YAxis,
} from "recharts"
import { AuthHeader } from "@/components/AuthHeader"
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
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { DEFAULT_LINKS, type LinkItem } from "@/lib/dummy-data"
import { auth, signInWithGoogle } from "@/lib/firebase"
import { fetchFirestoreLinks } from "@/lib/links-service"
import { cn } from "@/lib/utils"

const chartConfig = {
  clicks: {
    label: "클릭수",
    color: "var(--tds-blue-500)",
  },
} satisfies ChartConfig

export default function StatsPage() {
  const router = useRouter()

  const [user, setUser] = React.useState<User | null>(null)
  const [isAuthLoading, setIsAuthLoading] = React.useState(true)
  const [isSigningIn, setIsSigningIn] = React.useState(false)

  const [firestoreLinks, setFirestoreLinks] = React.useState<LinkItem[]>([])
  const [isLinksLoading, setIsLinksLoading] = React.useState(true)

  // 1. 로그인 상태 확인 및 비로그인 시 "/" 로 즉시 리다이렉트
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setIsAuthLoading(false)

      if (!currentUser) {
        router.replace("/")
      }
    })

    return () => unsubscribe()
  }, [router])

  // 2. 로그인된 사용자의 링크 및 클릭수 데이터 조회
  React.useEffect(() => {
    if (!user?.uid) return

    let isMounted = true
    setIsLinksLoading(true)

    fetchFirestoreLinks(user.uid)
      .catch((err) => {
        console.error("통계 페이지 링크 조회 오류:", err)
        return [] as LinkItem[]
      })
      .then((loadedLinks) => {
        if (!isMounted) return
        setFirestoreLinks(loadedLinks)
      })
      .finally(() => {
        if (isMounted) {
          setIsLinksLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [user?.uid])

  const handleSignInWithGoogle = async () => {
    const signInPromise = signInWithGoogle()
    setIsSigningIn(true)
    try {
      await signInPromise
    } catch (err) {
      console.error("Google 로그인 오류:", err)
    } finally {
      setIsSigningIn(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      router.replace("/")
    } catch (err) {
      console.error("로그아웃 오류:", err)
    }
  }

  // Firestore에 저장된 링크와 기본 링크 병합 (중복 ID 제거)
  const allLinks = React.useMemo(() => {
    const existingIds = new Set(firestoreLinks.map((item) => item.id))
    const remainingDefaults = DEFAULT_LINKS.filter(
      (item) => !existingIds.has(item.id)
    )
    return [...firestoreLinks, ...remainingDefaults].filter(
      (item) => item.enabled
    )
  }, [firestoreLinks])

  // 총 클릭수 (모든 링크 합산)
  const totalClicks = React.useMemo(
    () => allLinks.reduce((sum, item) => sum + (item.clickCount ?? 0), 0),
    [allLinks]
  )

  // 클릭수 내림차순 정렬
  const sortedLinks = React.useMemo(
    () =>
      [...allLinks].sort(
        (a, b) => (b.clickCount ?? 0) - (a.clickCount ?? 0)
      ),
    [allLinks]
  )

  // shadcn Chart 컴포넌트용 데이터
  const chartData = React.useMemo(
    () =>
      sortedLinks.map((item, idx) => ({
        id: item.id,
        title: item.title,
        shortTitle:
          item.title.length > 10 ? `${item.title.slice(0, 10)}…` : item.title,
        clicks: item.clickCount ?? 0,
        isTop: idx === 0 && (item.clickCount ?? 0) > 0,
      })),
    [sortedLinks]
  )

  const topLink = sortedLinks[0] && (sortedLinks[0].clickCount ?? 0) > 0
    ? sortedLinks[0]
    : null

  return (
    <main
      suppressHydrationWarning
      className="flex min-h-screen w-full flex-col items-center bg-[var(--tds-grey-100)] px-0 py-0 sm:px-6 sm:py-10"
    >
      <div
        suppressHydrationWarning
        className="flex min-h-screen w-full max-w-[480px] flex-col bg-[var(--tds-grey-100)] sm:min-h-0 sm:gap-3"
      >
        <AuthHeader
          user={user}
          isAuthLoading={isAuthLoading}
          isSigningIn={isSigningIn}
          title="클릭 통계"
          titleHref="/stats"
          myPageHref="/"
          myPageLabel="내 페이지 편집"
          onSignInWithGoogle={handleSignInWithGoogle}
          onSignOut={handleSignOut}
        />

        {isAuthLoading || !user ? (
          <Card className="flex min-h-[420px] flex-1 flex-col items-center justify-center gap-3 px-6 py-12 text-center">
            <Loader2 className="size-7 animate-spin text-[var(--tds-blue-500)]" />
            <p className="text-[14px] font-medium text-[var(--tds-grey-600)]">
              {isAuthLoading
                ? "로그인 정보를 확인하고 있어요..."
                : "로그인 페이지로 이동하고 있어요..."}
            </p>
          </Card>
        ) : (
          <div className="flex flex-1 flex-col sm:gap-3">
            {/* 상단 네비게이션 바 */}
            <div className="flex items-center justify-between border-b border-[var(--tds-grey-200)] bg-[var(--tds-white)] px-5 py-3 sm:rounded-[18px] sm:border">
              <div className="flex items-center gap-2">
                <Badge variant="role" className="h-[22px] px-2.5 text-[11px]">
                  실시간 데이터
                </Badge>
                <span className="text-[13px] font-medium text-[var(--tds-grey-700)]">
                  내 링크 클릭 분석 리포트예요
                </span>
              </div>

              <Button
                variant="outline"
                size="sm"
                nativeButton={false}
                render={<Link href="/" />}
                className="h-[32px] shrink-0 gap-1 rounded-[999px] border-[var(--tds-grey-200)] bg-[var(--tds-white)] px-3 text-[12px] font-semibold whitespace-nowrap text-[var(--tds-grey-700)] hover:bg-[var(--tds-grey-50)]"
              >
                <ArrowLeft className="size-3.5" />
                마이페이지
              </Button>
            </div>

            <div className="h-3 w-full sm:hidden" />

            {/* 섹션 1: 총 클릭수 요약 카드 */}
            <Card suppressHydrationWarning className="pt-6 pb-6">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <CardTitle>총 클릭수 요약</CardTitle>
                  {isLinksLoading ? (
                    <span className="inline-flex items-center gap-1 rounded-[999px] bg-[var(--tds-blue-50)] px-2 py-0.5 text-[11px] font-semibold text-[var(--tds-blue-500)]">
                      <Loader2 className="size-3 animate-spin" />
                      집계 중
                    </span>
                  ) : null}
                </div>
                <CardDescription className="tabular-nums">
                  등록된 링크 {allLinks.length}개 기준
                </CardDescription>
              </CardHeader>

              <CardContent className="px-6">
                <div className="flex items-center justify-between rounded-[16px] border border-[var(--tds-grey-200)] bg-[var(--tds-grey-50)] px-5 py-5">
                  <div className="flex flex-col gap-1 text-left">
                    <span className="text-[13px] font-medium text-[var(--tds-grey-600)]">
                      모든 링크의 클릭수 합계
                    </span>
                    <p className="tabular-nums text-[32px] font-bold leading-[1.25] tracking-[-0.02em] text-[var(--tds-grey-900)]">
                      총{" "}
                      <span className="text-[var(--tds-blue-500)]">
                        {totalClicks.toLocaleString("ko-KR")}
                      </span>{" "}
                      클릭
                    </p>
                  </div>

                  <div className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-[16px] bg-[var(--tds-blue-50)] text-[var(--tds-blue-500)]">
                    <MousePointerClick className="size-6" />
                  </div>
                </div>

                {/* 보조 지표 그리드 */}
                <div className="mt-3 grid grid-cols-2 gap-2.5">
                  <div className="flex flex-col rounded-[14px] border border-[var(--tds-grey-200)] bg-[var(--tds-white)] px-4 py-3">
                    <span className="text-[12px] font-medium text-[var(--tds-grey-500)]">
                      활성 링크 수
                    </span>
                    <span className="tabular-nums mt-0.5 text-[16px] font-bold text-[var(--tds-grey-900)]">
                      {allLinks.length}개
                    </span>
                  </div>

                  <div className="flex flex-col rounded-[14px] border border-[var(--tds-grey-200)] bg-[var(--tds-white)] px-4 py-3">
                    <span className="text-[12px] font-medium text-[var(--tds-grey-500)]">
                      최다 클릭 링크
                    </span>
                    <span className="mt-0.5 truncate text-[15px] font-bold text-[var(--tds-blue-500)]">
                      {topLink ? topLink.title : "아직 클릭 없음"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="h-3 w-full sm:hidden" />

            {/* 섹션 2: shadcn Chart 컴포넌트를 활용한 링크별 클릭수 차트 */}
            <Card suppressHydrationWarning className="pt-6 pb-6">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <CardTitle>링크별 클릭 차트</CardTitle>
                  <Badge variant="chipActive" className="h-[20px] px-2 text-[11px]">
                    Bar Chart
                  </Badge>
                </div>
                <CardDescription>한눈에 비교하기</CardDescription>
              </CardHeader>

              <CardContent className="px-6">
                {chartData.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-2 rounded-[16px] border border-dashed border-[var(--tds-grey-200)] py-10 text-center">
                    <BarChart3 className="size-6 text-[var(--tds-grey-400)]" />
                    <p className="text-[14px] font-medium text-[var(--tds-grey-500)]">
                      차트로 표시할 링크가 없어요
                    </p>
                  </div>
                ) : (
                  <div className="mt-2 rounded-[16px] border border-[var(--tds-grey-200)] bg-[var(--tds-grey-50)]/60 p-4">
                    <ChartContainer
                      config={chartConfig}
                      className="min-h-[240px] w-full"
                    >
                      <BarChart
                        accessibilityLayer
                        data={chartData}
                        layout="vertical"
                        margin={{ top: 8, right: 38, left: 4, bottom: 8 }}
                      >
                        <CartesianGrid
                          horizontal={false}
                          strokeDasharray="3 3"
                          stroke="var(--tds-grey-200)"
                        />
                        <YAxis
                          dataKey="shortTitle"
                          type="category"
                          tickLine={false}
                          axisLine={false}
                          width={92}
                          tick={{
                            fill: "var(--tds-grey-700)",
                            fontSize: 12,
                            fontWeight: 600,
                          }}
                        />
                        <XAxis
                          dataKey="clicks"
                          type="number"
                          allowDecimals={false}
                          hide
                        />
                        <ChartTooltip
                          cursor={{ fill: "var(--tds-grey-100)" }}
                          content={
                            <ChartTooltipContent
                              labelKey="title"
                              nameKey="clicks"
                              indicator="dot"
                            />
                          }
                        />
                        <Bar
                          dataKey="clicks"
                          radius={[0, 8, 8, 0]}
                          barSize={24}
                        >
                          {chartData.map((entry) => (
                            <Cell
                              key={entry.id}
                              fill={
                                entry.isTop
                                  ? "var(--tds-blue-500)"
                                  : "var(--tds-blue-500)"
                              }
                              fillOpacity={
                                entry.clicks === 0
                                  ? 0.2
                                  : entry.isTop
                                    ? 1
                                    : 0.72
                              }
                            />
                          ))}
                          <LabelList
                            dataKey="clicks"
                            position="right"
                            offset={8}
                            formatter={(val: unknown) => `${val ?? 0}회`}
                            className="fill-[var(--tds-grey-800)] text-[12px] font-bold tabular-nums"
                          />
                        </Bar>
                      </BarChart>
                    </ChartContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="h-3 w-full sm:hidden" />

            {/* 섹션 3: 링크별 상세 순위 및 클릭 비중 */}
            <Card suppressHydrationWarning className="pt-6 pb-6">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <CardTitle>링크별 상세 순위</CardTitle>
                  <TrendingUp className="size-4 text-[var(--tds-blue-500)]" />
                </div>
                <CardDescription>클릭 많은 순</CardDescription>
              </CardHeader>

              <CardContent className="px-6">
                <div className="flex flex-col divide-y divide-[var(--tds-grey-200)]/60 rounded-[16px] border border-[var(--tds-grey-200)] bg-[var(--tds-white)]">
                  {sortedLinks.map((item, index) => {
                    const clicks = item.clickCount ?? 0
                    const sharePercent =
                      totalClicks > 0
                        ? Math.round((clicks / totalClicks) * 100)
                        : 0
                    const isTopClicked = index === 0 && clicks > 0

                    return (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-3 px-4 py-3.5"
                      >
                        <div className="flex min-w-0 items-center gap-3">
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

                          <div className="flex min-w-0 flex-col">
                            <div className="flex items-center gap-1.5">
                              <span className="truncate text-[15px] font-semibold text-[var(--tds-grey-900)]">
                                {item.title}
                              </span>
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`${item.title} 새 탭으로 열기`}
                                className="shrink-0 text-[var(--tds-grey-400)] transition-colors hover:text-[var(--tds-blue-500)]"
                              >
                                <ExternalLink className="size-3.5" />
                              </a>
                            </div>
                            <span className="truncate text-[12px] text-[var(--tds-grey-500)]">
                              {item.url}
                            </span>
                          </div>
                        </div>

                        <div className="flex shrink-0 flex-col items-end">
                          <span
                            className={cn(
                              "tabular-nums text-[15px] font-bold",
                              clicks > 0
                                ? "text-[var(--tds-blue-500)]"
                                : "text-[var(--tds-grey-500)]"
                            )}
                          >
                            {clicks.toLocaleString("ko-KR")}회
                          </span>
                          <span className="tabular-nums text-[11px] font-medium text-[var(--tds-grey-500)]">
                            비중 {sharePercent}%
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </main>
  )
}
