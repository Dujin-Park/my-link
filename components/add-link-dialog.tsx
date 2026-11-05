"use client"

import * as React from "react"
import { Loader2 } from "lucide-react"
import type { IconName } from "@/lib/dummy-data"
import { validateLinkForm } from "@/lib/schemas"
import type { NewLinkInput } from "@/lib/store"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const ICON_OPTIONS: { value: IconName; label: string }[] = [
  { value: "globe", label: "웹사이트" },
  { value: "github", label: "GitHub" },
  { value: "folder", label: "프로젝트" },
  { value: "book", label: "블로그" },
  { value: "mail", label: "이메일" },
]

export interface AddLinkDialogProps {
  onAddLink: (newLink: NewLinkInput) => Promise<void> | void
}

export function AddLinkDialog({ onAddLink }: AddLinkDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [title, setTitle] = React.useState("")
  const [subtitle, setSubtitle] = React.useState("")
  const [url, setUrl] = React.useState("")
  const [meta, setMeta] = React.useState("")
  const [icon, setIcon] = React.useState<IconName>("globe")
  const [isHighlight, setIsHighlight] = React.useState(false)
  const [titleError, setTitleError] = React.useState("")
  const [urlError, setUrlError] = React.useState("")
  const [submitError, setSubmitError] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const resetForm = () => {
    setTitle("")
    setSubtitle("")
    setUrl("")
    setMeta("")
    setIcon("globe")
    setIsHighlight(false)
    setTitleError("")
    setUrlError("")
    setSubmitError("")
    setIsSubmitting(false)
  }

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen)
    if (!nextOpen) {
      resetForm()
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const validation = validateLinkForm({ title, url })
    setTitleError(validation.titleError)
    setUrlError(validation.urlError)

    if (!validation.success) {
      return
    }

    try {
      setIsSubmitting(true)
      setSubmitError("")

      await onAddLink({
        title: title.trim(),
        subtitle: subtitle.trim() || "클릭하면 해당 채널로 이동해요",
        url: url.trim(),
        meta: meta.trim() || "링크",
        icon,
        isHighlight,
      })

      setOpen(false)
      resetForm()
    } catch (err) {
      setIsSubmitting(false)
      setSubmitError(
        err instanceof Error
          ? `저장에 실패했어요: ${err.message}`
          : "링크를 저장하는 중 문제가 발생했어요."
      )
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button
            type="button"
            variant="tdsPrimary"
            size="tdsXl"
            className="gap-2 shadow-[0_4px_12px_oklch(0.620_0.191_258_/_0.22)] hover:bg-[var(--tds-blue-600)]"
          />
        }
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-5"
        >
          <path d="M5 12h14" />
          <path d="M12 5v14" />
        </svg>
        새로운 링크 추가하기
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 링크 추가하기</DialogTitle>
          <DialogDescription>
            프로필 목록에 보여줄 새로운 채널 정보를 입력해 주세요.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="link-title"
              className="text-[13px] font-semibold text-[var(--tds-grey-700)]"
            >
              제목 <span className="text-[var(--tds-blue-500)]">*</span>
            </label>
            <Input
              id="link-title"
              placeholder="예: 기술 블로그, 포트폴리오"
              aria-invalid={Boolean(titleError)}
              className={cn(
                titleError &&
                  "border-[var(--tds-red-500)] focus:border-[var(--tds-red-500)] focus:ring-[var(--tds-red-500)]/20"
              )}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                if (titleError) setTitleError("")
              }}
            />
            {titleError ? (
              <p className="text-[13px] font-medium text-[var(--tds-red-500)]">
                {titleError}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="link-url"
              className="text-[13px] font-semibold text-[var(--tds-grey-700)]"
            >
              이동할 주소 (URL){" "}
              <span className="text-[var(--tds-blue-500)]">*</span>
            </label>
            <Input
              id="link-url"
              placeholder="https://example.com"
              aria-invalid={Boolean(urlError)}
              className={cn(
                urlError &&
                  "border-[var(--tds-red-500)] focus:border-[var(--tds-red-500)] focus:ring-[var(--tds-red-500)]/20"
              )}
              value={url}
              onChange={(e) => {
                setUrl(e.target.value)
                if (urlError) setUrlError("")
              }}
            />
            {urlError ? (
              <p className="text-[13px] font-medium text-[var(--tds-red-500)]">
                {urlError}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="link-subtitle"
              className="text-[13px] font-semibold text-[var(--tds-grey-700)]"
            >
              한 줄 설명
            </label>
            <Input
              id="link-subtitle"
              placeholder="예: 직접 작성한 기술 아티클을 모았어요"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="link-meta"
                className="text-[13px] font-semibold text-[var(--tds-grey-700)]"
              >
                우측 배지 텍스트
              </label>
              <Input
                id="link-meta"
                placeholder="예: 블로그, 신규"
                value={meta}
                onChange={(e) => setMeta(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-[13px] font-semibold text-[var(--tds-grey-700)]">
                강조 표시
              </span>
              <button
                type="button"
                onClick={() => setIsHighlight((prev) => !prev)}
                className={cn(
                  "flex h-[46px] items-center justify-between rounded-[12px] border px-3.5 text-[14px] font-semibold transition-colors",
                  isHighlight
                    ? "border-[var(--tds-blue-500)] bg-[var(--tds-blue-50)] text-[var(--tds-blue-500)]"
                    : "border-[var(--tds-grey-200)] bg-[var(--tds-grey-50)] text-[var(--tds-grey-700)]"
                )}
              >
                <span>파란색 강조</span>
                <span className="text-[12px]">
                  {isHighlight ? "켜짐" : "꺼짐"}
                </span>
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-[13px] font-semibold text-[var(--tds-grey-700)]">
              아이콘 선택
            </span>
            <div className="flex flex-wrap gap-1.5">
              {ICON_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setIcon(option.value)}
                  className={cn(
                    "h-[34px] rounded-[999px] px-3.5 text-[13px] font-semibold transition-colors",
                    icon === option.value
                      ? "bg-[var(--tds-blue-50)] text-[var(--tds-blue-500)]"
                      : "border border-[var(--tds-grey-200)] bg-[var(--tds-white)] text-[var(--tds-grey-700)] hover:bg-[var(--tds-grey-50)]"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {submitError ? (
            <p className="text-[13px] font-medium text-[var(--tds-red-500)]">
              {submitError}
            </p>
          ) : null}

          <DialogFooter className="mt-1 gap-2">
            <DialogClose
              render={
                <Button
                  type="button"
                  variant="tdsGhost"
                  size="tdsMd"
                  disabled={isSubmitting}
                  className="bg-[var(--tds-grey-100)] text-[var(--tds-grey-700)]"
                />
              }
            >
              닫기
            </DialogClose>
            <Button
              type="submit"
              variant="tdsPrimary"
              size="tdsMd"
              disabled={isSubmitting}
              className="gap-2 px-5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  저장 중...
                </>
              ) : (
                "추가하기"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
