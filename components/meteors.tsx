"use client"

import type React from "react"

import { useEffect, useState } from "react"

interface MeteorsProps {
  number?: number
}

export const Meteors = ({ number = 80 }: MeteorsProps) => {
  const [meteorStyles, setMeteorStyles] = useState<Array<React.CSSProperties>>([])

  useEffect(() => {
    const styles = [...new Array(number)].map(() => ({
      // distribute across the parent container using percentages
      // allow slightly off-screen starts so they travel into view
      top: (Math.random() * 140 - 20).toFixed(2) + "%", // -20% .. 120%
      left: (Math.random() * 120 - 10).toFixed(2) + "%", // -10% .. 110%
      animationDelay: (Math.random() * 2).toFixed(2) + "s",
      // longer durations so meteors cross taller/longer sections
      animationDuration: (Math.random() * 10 + 6).toFixed(2) + "s",
    }))
    setMeteorStyles(styles)
  }, [number])

  return (
    <div className="absolute inset-0">
      {meteorStyles.map((style, idx) => (
        <span
          key={idx}
          className="pointer-events-none absolute h-0.5 w-0.5 rotate-[215deg] animate-meteor rounded-full bg-primary shadow-[0_0_0_1px_#ffffff10]"
          style={style}
        >
          <div className="pointer-events-none absolute top-1/2 -z-10 h-[1px] w-[120px] -translate-y-1/2 bg-gradient-to-r from-primary to-transparent" />
        </span>
      ))}
    </div>
  )
}
