"use client"

import * as React from "react"
import { Loader2, MoreVertical, Pencil, X } from "lucide-react"
import { DeleteLinkDialog } from "@/components/DeleteLinkDialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { IconName, LinkItem } from "@/lib/dummy-data"
import { validateLinkForm } from "@/lib/schemas"
import { cn } from "@/lib/utils"

function renderLinkIcon(icon: IconName) {
  switch (icon) {
    case "github":
      return (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
          <path d="M9 18c-4.51 2-5-2-7-2" />
        </svg>
      )
    case "folder":
      return (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="18" height="18" x="3" y="3" rx="4" />
          <path d="M3 9h18" />
          <path d="M9 21V9" />
        </svg>
      )
    case "book":
      return (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
        </svg>
      )
    case "mail":
      return (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="20" height="16" x="2" y="4" rx="3" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      )
    case "globe":
      return (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
          <path d="M2 12h20" />
        </svg>
      )
  }
}

export interface LinkCardProps {
  item: LinkItem
  onUpdateLink?: (
    id: string,
    updates: { title: string; url: string }
  ) => Promise<void> | void
  onDeleteLink?: (id: string) => Promise<void> | void
  className?: string
}

export function LinkCard({
  item,
  onUpdateLink,
  onDeleteLink,
  className,
}: LinkCardProps) {
  const [isEditing, setIsEditing] = React.useState(false)
  const [showActions, setShowActions] = React.useState(false)
  const [editTitle, setEditTitle] = React.useState(item.title)
  const [editUrl, setEditUrl] = React.useState(item.url)
  const [titleError, setTitleError] = React.useState("")
  const [urlError, setUrlError] = React.useState("")
  const [saveError, setSaveError] = React.useState("")
  const [isSaving, setIsSaving] = React.useState(false)
  const cardRef = React.useRef<HTMLDivElement>(null)

  const isExternal = item.url.startsWith("http")

  // 카드 바깥 영역을 클릭/터치하면 펼쳐진 액션 버튼을 자동으로 숨김
  React.useEffect(() => {
    if (!showActions) return

    const handlePointerDownOutside = (e: PointerEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setShowActions(false)
      }
    }

    document.addEventListener("pointerdown", handlePointerDownOutside)
    return () => {
      document.removeEventListener("pointerdown", handlePointerDownOutside)
    }
  }, [showActions])

  const handleStartEdit = () => {
    setEditTitle(item.title)
    setEditUrl(item.url)
    setTitleError("")
    setUrlError("")
    setSaveError("")
    setShowActions(false)
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setEditTitle(item.title)
    setEditUrl(item.url)
    setTitleError("")
    setUrlError("")
    setSaveError("")
    setIsEditing(false)
  }

  const handleSaveEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const validation = validateLinkForm({ title: editTitle, url: editUrl })
    setTitleError(validation.titleError)
    setUrlError(validation.urlError)

    if (!validation.success) {
      return
    }

    try {
      setIsSaving(true)
      setSaveError("")
      await onUpdateLink?.(item.id, {
        title: editTitle.trim(),
        url: editUrl.trim(),
      })
      setIsEditing(false)
    } catch (err) {
      setSaveError(
        err instanceof Error
          ? `수정에 실패했어요: ${err.message}`
          : "링크를 수정하는 중 문제가 발생했어요."
      )
    } finally {
      setIsSaving(false)
    }
  }

  if (isEditing) {
    return (
      <div
        data-slot="link-card-item"
        className={cn(
          "flex w-full flex-col gap-3 bg-[var(--tds-grey-50)]/70 px-6 py-4",
          className
        )}
      >
        <form onSubmit={handleSaveEdit} noValidate className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label
              htmlFor={`edit-title-${item.id}`}
              className="text-[12px] font-semibold text-[var(--tds-grey-700)]"
            >
              제목
            </label>
            <Input
              id={`edit-title-${item.id}`}
              value={editTitle}
              disabled={isSaving}
              placeholder="링크 제목을 입력해 주세요"
              aria-invalid={Boolean(titleError)}
              className={cn(
                "h-[40px] bg-[var(--tds-white)] text-[14px]",
                titleError &&
                  "border-[var(--tds-red-500)] focus:border-[var(--tds-red-500)] focus:ring-[var(--tds-red-500)]/20"
              )}
              onChange={(e) => {
                setEditTitle(e.target.value)
                if (titleError) setTitleError("")
              }}
            />
            {titleError ? (
              <p className="text-[12px] font-medium text-[var(--tds-red-500)]">
                {titleError}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor={`edit-url-${item.id}`}
              className="text-[12px] font-semibold text-[var(--tds-grey-700)]"
            >
              URL 주소
            </label>
            <Input
              id={`edit-url-${item.id}`}
              value={editUrl}
              disabled={isSaving}
              placeholder="https://example.com"
              aria-invalid={Boolean(urlError)}
              className={cn(
                "h-[40px] bg-[var(--tds-white)] text-[14px]",
                urlError &&
                  "border-[var(--tds-red-500)] focus:border-[var(--tds-red-500)] focus:ring-[var(--tds-red-500)]/20"
              )}
              onChange={(e) => {
                setEditUrl(e.target.value)
                if (urlError) setUrlError("")
              }}
            />
            {urlError ? (
              <p className="text-[12px] font-medium text-[var(--tds-red-500)]">
                {urlError}
              </p>
            ) : null}
          </div>

          {saveError ? (
            <p className="text-[12px] font-medium text-[var(--tds-red-500)]">
              {saveError}
            </p>
          ) : null}

          <div className="flex items-center justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="tdsGhost"
              size="sm"
              disabled={isSaving}
              onClick={handleCancelEdit}
              className="h-[34px] rounded-[10px] bg-[var(--tds-grey-200)]/70 px-3.5 text-[13px] font-semibold text-[var(--tds-grey-700)]"
            >
              취소
            </Button>
            <Button
              type="submit"
              variant="tdsPrimary"
              size="sm"
              disabled={isSaving}
              className="h-[34px] gap-1.5 rounded-[10px] px-4 text-[13px] font-semibold"
            >
              {isSaving ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  저장 중...
                </>
              ) : (
                "저장"
              )}
            </Button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div
      ref={cardRef}
      data-slot="link-card-item"
      className={cn(
        "group relative flex min-h-[72px] w-full items-center justify-between overflow-hidden px-6 py-[14px] transition-colors duration-150 hover:bg-[var(--tds-grey-50)]",
        showActions && "bg-[var(--tds-grey-50)]",
        className
      )}
    >
      {/* 좌측 링크 본문 영역: 클릭 시 기존처럼 URL로 이동 */}
      <a
        href={item.url}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className="flex min-w-0 flex-1 items-center justify-between pr-1"
      >
        <div className="flex min-w-0 items-center gap-[14px]">
          {/* 44px 아바타 (radius-l: 14px) */}
          <div className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-[14px] bg-[var(--tds-grey-100)] text-[var(--tds-grey-800)] transition-colors duration-200 group-hover:bg-[var(--tds-blue-50)] group-hover:text-[var(--tds-blue-500)]">
            {renderLinkIcon(item.icon)}
          </div>

          {/* 타이틀 / 서브 스택 */}
          <div className="flex min-w-0 flex-col text-left">
            <span className="truncate text-[17px] font-semibold leading-[1.45] tracking-[-0.01em] text-[var(--tds-grey-900)]">
              {item.title}
            </span>
            <span className="truncate text-[13px] font-normal leading-[1.5] text-[var(--tds-grey-600)]">
              {item.subtitle}
            </span>
          </div>
        </div>

        {/* 우측 메타/화살표 슬롯 */}
        <div className="ml-3 flex shrink-0 items-center gap-1.5">
          <span
            className={cn(
              "tabular-nums text-[14px] font-bold",
              item.isHighlight
                ? "text-[var(--tds-blue-500)]"
                : "text-[var(--tds-grey-700)]"
            )}
          >
            {item.meta}
          </span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[var(--tds-grey-400)] transition-transform duration-200 group-hover:translate-x-0.5"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </div>
      </a>

      {/* 우측 액션 영역: 본문과 세로 막대기(border-l)로 칸을 나누고, 더보기(⋮) 버튼은 평상시에도 항상 노출 */}
      <div className="ml-2.5 flex shrink-0 items-center border-l border-[var(--tds-grey-200)] pl-2.5">
        <div
          className={cn(
            "flex items-center gap-1 overflow-hidden transition-all duration-200 ease-out",
            showActions
              ? "mr-1 max-w-[80px] translate-x-0 opacity-100 pointer-events-auto"
              : "max-w-0 translate-x-2 opacity-0 pointer-events-none"
          )}
        >
          <Button
            type="button"
            variant="tdsIcon"
            size="icon"
            aria-label={`${item.title} 수정`}
            onClick={(e) => {
              e.stopPropagation()
              handleStartEdit()
            }}
            className="size-8 rounded-[10px] text-[var(--tds-grey-600)] hover:bg-[var(--tds-blue-50)] hover:text-[var(--tds-blue-500)]"
          >
            <Pencil className="size-4" />
          </Button>

          <DeleteLinkDialog
            linkTitle={item.title}
            onConfirmDelete={async () => {
              await onDeleteLink?.(item.id)
              setShowActions(false)
            }}
          />
        </div>

        {/* 평상시에도 항상 보이는 더보기(⋮) 버튼 */}
        <Button
          type="button"
          variant="tdsIcon"
          size="icon"
          aria-expanded={showActions}
          aria-label={
            showActions ? "관리 메뉴 닫기" : `${item.title} 관리 메뉴 열기`
          }
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setShowActions((prev) => !prev)
          }}
          className={cn(
            "size-8 rounded-[10px] text-[var(--tds-grey-500)] transition-colors hover:bg-[var(--tds-grey-100)] hover:text-[var(--tds-grey-800)]",
            showActions && "bg-[var(--tds-grey-100)] text-[var(--tds-grey-900)]"
          )}
        >
          {showActions ? (
            <X className="size-4" />
          ) : (
            <MoreVertical className="size-4" />
          )}
        </Button>
      </div>
    </div>
  )
}
