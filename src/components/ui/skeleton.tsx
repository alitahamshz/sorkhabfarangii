import type { ComponentProps, ReactNode } from "react"

import { cn } from "@/lib/utils"

type SkeletonVariant = "rectangle" | "circle" | "text"
type SkeletonAnimation = "pulse" | "shimmer" | "none"

type SkeletonProps = ComponentProps<"div"> & {
  animation?: SkeletonAnimation
  variant?: SkeletonVariant
}

function Skeleton({
  animation = "pulse",
  className,
  variant = "rectangle",
  ...props
}: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      data-slot="skeleton"
      className={cn(
        "bg-muted",
        variant === "rectangle" && "rounded-md",
        variant === "circle" && "aspect-square rounded-full",
        variant === "text" && "h-4 rounded",
        animation === "pulse" && "animate-pulse",
        animation === "shimmer" && "skeleton-shimmer",
        className
      )}
      {...props}
    />
  )
}

type SkeletonGroupProps = Omit<ComponentProps<"div">, "children"> & {
  count?: number
  itemClassName?: string
  renderItem?: (index: number) => ReactNode
}

function SkeletonGroup({
  className,
  count = 1,
  itemClassName,
  renderItem,
  ...props
}: SkeletonGroupProps) {
  const safeCount = Math.max(0, Math.floor(count))

  return (
    <div
      aria-busy="true"
      aria-label="در حال بارگذاری"
      className={className}
      data-slot="skeleton-group"
      role="status"
      {...props}
    >
      {Array.from({ length: safeCount }, (_, index) => (
        <div className={itemClassName} data-slot="skeleton-group-item" key={index}>
          {renderItem ? renderItem(index) : <Skeleton className="h-20 w-full" />}
        </div>
      ))}
      <span className="sr-only">در حال بارگذاری...</span>
    </div>
  )
}

export { Skeleton, SkeletonGroup }
export type { SkeletonAnimation, SkeletonGroupProps, SkeletonProps, SkeletonVariant }
