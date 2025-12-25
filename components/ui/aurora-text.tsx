"use client"

import React, { memo } from "react"

interface AuroraTextProps {
  children: React.ReactNode
  className?: string
  colors?: string[]
  speed?: number
}

export const AuroraText = memo(
  ({
    children,
    className = "",
    colors = [
  "#69d456ff",
  "#107033ff",
  "#18b618ff",
  "#8bc897ff",
],
    speed = 1,
  }: AuroraTextProps) => {
    return (
      <span className={`relative inline-block ${className}`}>
        <span className="sr-only">{children}</span>

        <span
        aria-hidden="true"
        className="animate-aurora inline-block bg-[length:300%_300%] bg-clip-text text-transparent leading-[1.15] pb-[0.08em]"
        style={{
          backgroundImage: `linear-gradient(135deg, ${colors.join(", ")})`,
          animationDuration: `${8 / speed}s`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {children}  
      </span>
      </span>
    )
  }
)

AuroraText.displayName = "AuroraText"