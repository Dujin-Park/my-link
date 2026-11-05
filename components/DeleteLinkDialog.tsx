"use client"

import * as React from "react"
import { Loader2, Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

export interface DeleteLinkDialogProps {
  linkTitle: string
  onConfirmDelete: () => Promise<void> | void
}

export function DeleteLinkDialog({
  linkTitle,
  onConfirmDelete,
}: DeleteLinkDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [deleteError, setDeleteError] = React.useState("")

  const handleOpenChange = (nextOpen: boolean) => {
    if (isDeleting) return
    setOpen(nextOpen)
    if (!nextOpen) {
      setDeleteError("")
    }
  }

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      setDeleteError("")
      await onConfirmDelete()
      setOpen(false)
    } catch (err) {
      setDeleteError(
        err instanceof Error
          ? `삭제에 실패했어요: ${err.message}`
          : "링크를 삭제하는 중 문제가 발생했어요."
      )
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger
        render={
          <Button
            type="button"
            variant="tdsIcon"
            size="icon"
            aria-label={`${linkTitle} 삭제`}
            onClick={(e) => e.stopPropagation()}
            className="size-8 rounded-[10px] text-[var(--tds-grey-500)] hover:bg-[var(--tds-red-500)]/10 hover:text-[var(--tds-red-500)]"
          />
        }
      >
        <Trash2 className="size-4" />
      </AlertDialogTrigger>

      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
        <AlertDialogHeader>
          <AlertDialogTitle>정말 삭제하시겠습니까?</AlertDialogTitle>
          <AlertDialogDescription>
            &apos;{linkTitle}&apos; 링크를 삭제합니다.
          </AlertDialogDescription>
          <p className="mt-0.5 text-[13px] font-medium text-[var(--tds-red-500)]">
            이 작업은 되돌릴 수 없습니다.
          </p>
        </AlertDialogHeader>

        {deleteError ? (
          <p className="text-[13px] font-medium text-[var(--tds-red-500)]">
            {deleteError}
          </p>
        ) : null}

        <AlertDialogFooter>
          <AlertDialogCancel
            render={
              <Button
                type="button"
                variant="tdsGhost"
                size="tdsMd"
                disabled={isDeleting}
                className="bg-[var(--tds-grey-100)] text-[var(--tds-grey-700)]"
              />
            }
          >
            취소
          </AlertDialogCancel>
          <Button
            type="button"
            size="tdsMd"
            disabled={isDeleting}
            onClick={handleDelete}
            className="gap-1.5 bg-[var(--tds-red-500)] px-5 font-bold text-white hover:bg-[var(--tds-red-500)]/90 active:scale-[0.99]"
          >
            {isDeleting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                삭제 중...
              </>
            ) : (
              "삭제하기"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
