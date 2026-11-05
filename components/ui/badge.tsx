import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-1.5 font-medium whitespace-nowrap transition-colors select-none",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--tds-blue-50)] text-[var(--tds-blue-500)]",
        secondary:
          "bg-[var(--tds-grey-100)] text-[var(--tds-grey-700)]",
        outline:
          "border border-[var(--tds-grey-200)] bg-[var(--tds-white)] text-[var(--tds-grey-700)]",
        chipActive:
          "h-[34px] rounded-[999px] bg-[var(--tds-blue-50)] px-3.5 text-[13px] font-semibold leading-[1.25] text-[var(--tds-blue-500)]",
        chipInactive:
          "h-[34px] rounded-[999px] border border-[var(--tds-grey-200)] bg-[var(--tds-white)] px-3.5 text-[13px] font-semibold leading-[1.25] text-[var(--tds-grey-700)]",
        role:
          "h-[22px] rounded-[6px] bg-[var(--tds-blue-50)] px-2.5 text-[12px] font-medium leading-[1.4] text-[var(--tds-blue-500)]",
        pillInfo:
          "rounded-[999px] bg-[var(--tds-blue-50)] px-3.5 py-1.5 text-[13px] font-semibold leading-[1.25] text-[var(--tds-blue-500)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
