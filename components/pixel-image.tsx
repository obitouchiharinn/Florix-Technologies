"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

interface PixelImageProps {
  src: string
  customGrid?: { rows: number; cols: number }
  grayscaleAnimation?: boolean
  className?: string
}

export const PixelImage = ({
  src,
  customGrid = { rows: 8, cols: 12 },
  grayscaleAnimation = false,
  className = "",
}: PixelImageProps) => {
  const [pixels, setPixels] = useState<string[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { rows, cols } = customGrid

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = src

    img.onload = () => {
      canvas.width = cols
      canvas.height = rows
      ctx.drawImage(img, 0, 0, cols, rows)

      const imageData = ctx.getImageData(0, 0, cols, rows)
      const pixelColors: string[] = []

      for (let i = 0; i < imageData.data.length; i += 4) {
        const r = imageData.data[i]
        const g = imageData.data[i + 1]
        const b = imageData.data[i + 2]
        pixelColors.push(`rgb(${r}, ${g}, ${b})`)
      }

      setPixels(pixelColors)
    }
  }, [src, rows, cols])

  return (
    <div className={`relative ${className}`}>
      <canvas ref={canvasRef} className="hidden" />
      <div
        className="grid gap-1 w-full h-full"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
        }}
      >
        {pixels.map((color, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.5,
              delay: index * 0.01,
              ease: "easeOut",
            }}
            className="rounded-sm"
            style={{
              backgroundColor: grayscaleAnimation ? undefined : color,
              filter: grayscaleAnimation ? "grayscale(100%)" : undefined,
            }}
          />
        ))}
      </div>
    </div>
  )
}
