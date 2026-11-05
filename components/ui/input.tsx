import * as React from "react"
import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-[46px] w-full rounded-[12px] border border-[var(--tds-grey-200)] bg-[var(--tds-grey-50)] px-3.5 py-2 text-[15px] font-normal text-[var(--tds-grey-900)] placeholder:text-[var(--tds-grey-400)] transition-colors outline-none focus:border-[var(--tds-blue-500)] focus:bg-[var(--tds-white)] focus:ring-2 focus:ring-[var(--tds-blue-500)]/20 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
