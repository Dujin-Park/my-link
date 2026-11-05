"use client"

import * as React from "react"
import Image from "next/image"
import { ChevronDown, Loader2, LogOut } from "lucide-react"
import type { User } from "firebase/auth"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface AuthHeaderProps {
  user: User | null
  isAuthLoading: boolean
  isSigningIn: boolean
  onSignInWithGoogle: () => Promise<void> | void
  onSignOut: () => Promise<void> | void
}

function GoogleLogoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
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
  )
}

export function AuthHeader({
  user,
  isAuthLoading,
  isSigningIn,
  onSignInWithGoogle,
  onSignOut,
}: AuthHeaderProps) {
  const [menuOpen, setMenuOpen] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!menuOpen) return

    const handlePointerDownOutside = (e: PointerEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false)
      }
    }

    document.addEventListener("pointerdown", handlePointerDownOutside)
    return () => {
      document.removeEventListener("pointerdown", handlePointerDownOutside)
    }
  }, [menuOpen])

  const displayName = user?.displayName || user?.email?.split("@")[0] || "사용자"
  const photoURL = user?.photoURL || "/profile-avatar.svg"

  return (
    <header className="sticky top-0 z-20 flex h-[56px] w-full items-center justify-between border-b border-[var(--tds-grey-200)] bg-[var(--tds-white)]/90 px-6 backdrop-blur-md sm:rounded-t-[24px]">
      <span className="text-[18px] font-semibold tracking-[-0.01em] text-[var(--tds-grey-900)]">
        {user ? "내 프로필" : "마이링크"}
      </span>

      <div className="flex items-center gap-2">
        {isAuthLoading ? (
          <div className="flex h-[36px] w-[112px] animate-pulse items-center justify-center rounded-[999px] bg-[var(--tds-grey-100)]" />
        ) : user ? (
          <div ref={dropdownRef} className="relative">
            <button
              type="button"
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              onClick={() => setMenuOpen((prev) => !prev)}
              className={cn(
                "flex h-[38px] items-center gap-2 rounded-[999px] border border-[var(--tds-grey-200)] bg-[var(--tds-white)] py-1 pr-2.5 pl-1.5 text-[14px] font-semibold text-[var(--tds-grey-800)] transition-colors hover:bg-[var(--tds-grey-50)]",
                menuOpen && "bg-[var(--tds-grey-100)]"
              )}
            >
              <span className="relative h-[26px] w-[26px] shrink-0 overflow-hidden rounded-full border border-[var(--tds-grey-200)] bg-[var(--tds-blue-50)]">
                <Image
                  src={photoURL}
                  alt={`${displayName} 프로필 이미지`}
                  width={26}
                  height={26}
                  unoptimized
                  className="h-full w-full object-cover"
                />
              </span>
              <span className="max-w-[110px] truncate">{displayName}</span>
              <ChevronDown
                className={cn(
                  "size-4 text-[var(--tds-grey-500)] transition-transform duration-150",
                  menuOpen && "rotate-180"
                )}
              />
            </button>

            {menuOpen ? (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-[210px] origin-top-right rounded-[16px] border border-[var(--tds-grey-200)] bg-[var(--tds-white)] p-2 shadow-[0_12px_32px_oklch(0.155_0.060_261_/_0.12)]"
              >
                <div className="border-b border-[var(--tds-grey-100)] px-3 py-2">
                  <p className="truncate text-[14px] font-bold text-[var(--tds-grey-900)]">
                    {displayName}
                  </p>
                  {user.email ? (
                    <p className="truncate text-[12px] font-normal text-[var(--tds-grey-500)]">
                      {user.email}
                    </p>
                  ) : null}
                </div>

                <button
                  type="button"
                  role="menuitem"
                  onClick={async () => {
                    setMenuOpen(false)
                    await onSignOut()
                  }}
                  className="mt-1 flex w-full items-center gap-2 rounded-[10px] px-3 py-2 text-left text-[14px] font-semibold text-[var(--tds-red-500)] transition-colors hover:bg-[var(--tds-red-500)]/10"
                >
                  <LogOut className="size-4" />
                  로그아웃
                </button>
              </div>
            ) : null}
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            disabled={isSigningIn}
            onClick={onSignInWithGoogle}
            className="h-[36px] gap-2 rounded-[999px] border-[var(--tds-grey-200)] bg-[var(--tds-white)] px-3.5 text-[13px] font-semibold text-[var(--tds-grey-800)] hover:bg-[var(--tds-grey-50)]"
          >
            {isSigningIn ? (
              <Loader2 className="size-4 animate-spin text-[var(--tds-blue-500)]" />
            ) : (
              <GoogleLogoIcon />
            )}
            Google로 로그인
          </Button>
        )}
      </div>
    </header>
  )
}
