import Link from "next/link"
import { SearchX } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function NotFound() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-[var(--tds-grey-100)] px-0 py-0 sm:px-6 sm:py-10">
      <div className="flex min-h-screen w-full max-w-[480px] flex-col justify-center bg-[var(--tds-grey-100)] sm:min-h-0">
        <Card className="items-center px-6 py-12 text-center">
          <Badge variant="role" className="mb-4">
            404 Not Found
          </Badge>

          <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-[var(--tds-blue-50)] text-[var(--tds-blue-500)]">
            <SearchX className="size-8" />
          </div>

          <h1 className="text-[22px] font-bold leading-[1.35] tracking-[-0.015em] text-[var(--tds-grey-900)]">
            사용자를 찾을 수 없어요
          </h1>

          <p className="mt-2.5 max-w-[300px] text-[15px] font-normal leading-[1.5] text-[var(--tds-grey-600)]">
            입력하신 주소의 프로필이 존재하지 않거나
            <br />
            변경되었을 수 있어요.
          </p>

          <Button
            variant="tdsPrimary"
            size="tdsXl"
            nativeButton={false}
            render={<Link href="/" />}
            className="mt-7"
          >
            홈으로 돌아가기
          </Button>
        </Card>
      </div>
    </main>
  )
}
