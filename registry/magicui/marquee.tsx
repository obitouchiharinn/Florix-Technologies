"use client"

import React from "react"
import { cn } from "@/lib/utils"

type MarqueeProps = React.HTMLAttributes<HTMLDivElement> & {
  pauseOnHover?: boolean
  reverse?: boolean
  vertical?: boolean
  className?: string
}

export function Marquee({
  children,
  pauseOnHover,
  reverse,
  vertical,
  className,
  ...rest
}: MarqueeProps) {
  return (
    <div
      {...rest}
      className={cn(
        "marquee overflow-hidden",
        className
      )}
    >
      <div
        className={cn(
          "marquee-track",
          vertical ? "vertical" : "horizontal",
          reverse ? "reverse" : "",
          pauseOnHover ? "pause-on-hover" : ""
        )}
        style={{ animationDuration: "var(--duration, 10s)" }}
      >
        <div className="marquee-group flex gap-4">{children}</div>
        <div aria-hidden className="marquee-group flex gap-4">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Marquee
