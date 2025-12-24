"use client"

import { motion } from "framer-motion"

export function IconCloudDemo() {
  const slugs = [
    "typescript",
    "javascript",
    "dart",
    "java",
    "react",
    "flutter",
    "android",
    "html5",
    "css3",
    "nodedotjs",
    "express",
    "nextdotjs",
    "prisma",
    "amazonaws",
    "postgresql",
    "firebase",
    "nginx",
    "vercel",
    "testinglibrary",
    "jest",
    "cypress",
    "docker",
    "git",
    "jira",
    "github",
    "gitlab",
    "visualstudiocode",
    "androidstudio",
    "sonarqube",
    "figma",
  ]

  const images = slugs.map((slug) => `https://cdn.simpleicons.org/${slug}/${slug}`)

  return (
    <div className="relative w-full h-96 flex items-center justify-center overflow-hidden bg-gradient-to-b from-white to-gray-50 rounded-3xl perspective">
      <style>{`
        .icon-cloud-container {
          perspective: 1200px;
          transform-style: preserve-3d;
        }
        .icon-cloud-globe {
          transform-style: preserve-3d;
        }
      `}</style>

      <motion.div
        className="icon-cloud-container relative w-72 h-72"
        animate={{
          rotationX: [0, 360],
          rotationY: [0, 360],
        }}
        transition={{
          rotationX: { duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
          rotationY: { duration: 30, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
        }}
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {images.map((image, index) => {
          // Distribute icons on multiple layers for 3D effect
          const layer = Math.floor(index / 10) // 3 layers
          const positionInLayer = index % 10

          // Spherical coordinates
          const theta = (positionInLayer / 10) * Math.PI * 2 // around the circle
          const phi = (layer / 3) * Math.PI * 0.8 + Math.PI * 0.1 // vertical spread

          const radius = 140
          const x = Math.sin(phi) * Math.cos(theta) * radius
          const y = Math.cos(phi) * radius - 50
          const z = Math.sin(phi) * Math.sin(theta) * radius

          return (
            <motion.div
              key={index}
              className="icon-cloud-globe absolute w-12 h-12 rounded-full bg-white border-2 border-gray-200 shadow-lg flex items-center justify-center hover:border-primary hover:shadow-xl transition-all duration-300"
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                transform: `translate(-50%, -50%) translateZ(${z}px)`,
                transformStyle: "preserve-3d",
              }}
              whileHover={{ scale: 1.2, zIndex: 10 }}
            >
              <img
                src={image || "/placeholder.svg"}
                alt={`icon-${index}`}
                className="w-6 h-6 object-contain"
                onError={(e) => {
                  ;(e.currentTarget as HTMLImageElement).style.display = "none"
                }}
              />
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
