import * as React from "react"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        tdsPrimary:
          "bg-[var(--tds-blue-500)] text-white font-bold tracking-[-0.005em] leading-[1.25] transition-transform duration-150 active:scale-[0.99] active:bg-[var(--tds-blue-600)]",
        tdsGhost:
          "text-[var(--tds-grey-600)] font-semibold tracking-[-0.005em] leading-[1.25] transition-colors duration-150 hover:bg-[var(--tds-grey-100)] hover:text-[var(--tds-grey-900)]",
        tdsIcon:
          "rounded-full text-[var(--tds-grey-700)] transition-colors duration-200 hover:bg-[var(--tds-grey-100)]",
        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-muted hover:text-foreground",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-8 gap-1.5 px-2.5",
        xs: "h-6 gap-1 rounded-md px-2 text-xs",
        sm: "h-7 gap-1 rounded-md px-2.5 text-[0.8rem]",
        lg: "h-9 gap-1.5 px-2.5",
        tdsXl: "h-[56px] w-full rounded-[16px] px-5 text-[17px]",
        tdsMd: "h-[40px] rounded-[12px] px-4 text-[15px]",
        tdsIcon: "h-[40px] w-[40px] rounded-full",
        icon: "size-8",
        "icon-xs": "size-6 rounded-md",
        "icon-sm": "size-7 rounded-md",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
