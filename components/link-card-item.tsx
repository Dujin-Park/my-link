import * as React from "react"
import type { IconName, LinkItem } from "@/lib/dummy-data"
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

export interface LinkCardItemProps extends React.ComponentProps<"a"> {
  item: LinkItem
}

export function LinkCardItem({
  item,
  className,
  ...props
}: LinkCardItemProps) {
  const isExternal = item.url.startsWith("http")

  return (
    <a
      data-slot="link-card-item"
      href={item.url}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className={cn(
        "group relative flex min-h-[72px] w-full items-center justify-between px-6 py-[14px] transition-colors duration-150 hover:bg-[var(--tds-grey-50)] active:bg-[var(--tds-grey-200)]/50",
        className
      )}
      {...props}
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
      <div className="ml-3 flex shrink-0 items-center gap-2">
        <span
          className={cn(
            "tabular-nums text-[15px] font-bold",
            item.isHighlight
              ? "text-[var(--tds-blue-500)]"
              : "text-[var(--tds-grey-700)]"
          )}
        >
          {item.meta}
        </span>
        <svg
          width="18"
          height="18"
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
  )
}
