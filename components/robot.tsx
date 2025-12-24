"use client"

import React, { useEffect, useRef, useState } from "react"

type Vec2 = { x: number; y: number }

export default function Robot() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mvRef = useRef<any>(null)
  const [awoken, setAwoken] = useState(false)
  const [mounted, setMounted] = useState(false)
  const posRef = useRef<Vec2>({ x: 0, y: 0 })
  const targetRef = useRef<Vec2>({ x: 0, y: 0 })
  const speedRef = useRef(0.15)
  const lastScroll = useRef<{ y: number; t: number }>({ y: 0, t: Date.now() })
  const triggeredRef = useRef(false)

  // Load model-viewer webcomponent if needed
  useEffect(() => {
    if (typeof window === "undefined") return
    if (!(window as any).customElements?.get("model-viewer")) {
      const script = document.createElement("script")
      script.type = "module"
      script.src = "https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"
      script.async = true
      document.head.appendChild(script)
    }
    setMounted(true)
  }, [])

  // initial placement on navbar (top-right)
  useEffect(() => {
    const setInitial = () => {
      // prefer an on-page navbar anchor if present so robot appears next to the logo
      const anchor = document.getElementById("robot-anchor")
      if (anchor) {
        const rect = anchor.getBoundingClientRect()
        // center robot over the anchor so it visually sits inside the navbar
        const cx = rect.left + rect.width / 2
        const x = Math.max(8, cx - 36)
        const y = rect.top + (rect.height - 72) / 2
        posRef.current = { x, y }
        targetRef.current = { ...posRef.current }
        if (containerRef.current) containerRef.current.style.transform = `translate(${x}px, ${y}px)`
        return
      }

      const w = window.innerWidth
      posRef.current = { x: w - 96, y: 16 }
      targetRef.current = { ...posRef.current }
      if (containerRef.current) {
        containerRef.current.style.transform = `translate(${posRef.current.x}px, ${posRef.current.y}px)`
      }
    }
    setInitial()
    window.addEventListener("resize", setInitial)
    return () => window.removeEventListener("resize", setInitial)
  }, [])

  // one-time scroll trigger > 40px to wake and jump
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      const now = Date.now()
      const dy = y - lastScroll.current.y
      const dt = Math.max(1, now - lastScroll.current.t)
      const speed = Math.abs(dy) / dt
      lastScroll.current = { y, t: now }

      if (!triggeredRef.current && y > 40) {
        triggeredRef.current = true
        wakeAndJump()
      }

      // each scroll event: update target position to follow viewport
      updateTargetFollowing(y, speed, dy)
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  function updateTargetFollowing(scrollY: number, speed: number, dy: number) {
    // Determine preferred anchor zones: bottom-right, center-right, bottom-center
    const vw = window.innerWidth
    const vh = window.innerHeight
    // choose zone based on scroll position: near top -> center-right, lower -> bottom-right
    const zone = scrollY < vh * 0.5 ? "center-right" : "bottom-right"
    let tx = vw - 96
    let ty = zone === "bottom-right" ? vh - 140 : vh / 2 - 32

    // subtle offset to keep near view center
    tx -= Math.max(0, Math.min(120, scrollY / 10))

    targetRef.current = { x: tx, y: ty }

    // adjust speed depending on scroll delta magnitude
    if (Math.abs(dy) > 50) speedRef.current = 0.35
    else if (Math.abs(dy) > 10) speedRef.current = 0.2
    else speedRef.current = 0.12
  }

  function wakeAndJump() {
    const el = containerRef.current
    if (!el) return
    setAwoken(true)

    // stand up animation: rotate to upright and scale
    el.animate(
      [
        { transform: el.style.transform + " rotate(18deg) scale(0.9)", opacity: 0.95 },
        { transform: el.style.transform + " rotate(0deg) scale(1.05)", opacity: 1 },
      ],
      { duration: 600, easing: "cubic-bezier(.2,.9,.2,1)" }
    )

    // small delay then jump off
    setTimeout(() => {
      // compute landing inside viewport (center-right)
      const vw = window.innerWidth
      const vh = window.innerHeight
      const landing = { x: vw - 140, y: vh / 2 }

      // jump animation using rAF-driven translation for natural bounce
      const start = performance.now()
      const from = { ...posRef.current }
      const to = { ...landing }
      const dur = 700

      function step(t: number) {
        const p = Math.min(1, (t - start) / dur)
        // ease out and parabolic arc for y
        const ease = 1 - Math.pow(1 - p, 3)
        const arc = Math.sin(p * Math.PI) * 120
        posRef.current.x = from.x + (to.x - from.x) * ease
        posRef.current.y = from.y + (to.y - from.y) * ease - arc
        if (containerRef.current)
          containerRef.current.style.transform = `translate(${posRef.current.x}px, ${posRef.current.y}px)`
        if (p < 1) requestAnimationFrame(step)
        else {
          // bounce
          const bAnim = containerRef.current!.animate(
            [
              { transform: `translate(${to.x}px, ${to.y}px) translateY(-8px)` },
              { transform: `translate(${to.x}px, ${to.y}px) translateY(0px)` },
            ],
            { duration: 300, easing: "cubic-bezier(.2,.9,.2,1)" }
          )
          bAnim.onfinish = () => {
            targetRef.current = { x: to.x, y: to.y }
          }
        }
      }

      requestAnimationFrame(step)
    }, 320)
  }

  // main follow loop
  useEffect(() => {
    let raf = 0
    function loop() {
      const cur = posRef.current
      const tar = targetRef.current
      // simple lerp
      cur.x += (tar.x - cur.x) * speedRef.current
      cur.y += (tar.y - cur.y) * speedRef.current
      if (containerRef.current) containerRef.current.style.transform = `translate(${cur.x}px, ${cur.y}px)`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  // Section-based reactions (query sections by id)
  useEffect(() => {
    const sections = ["hero", "stats", "vision", "services"]
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const id = entry.target.id
          // trigger playful actions depending on section
          if (id === "hero") {
            // dust shake
            const el = containerRef.current
            if (!el) return
            el.animate(
              [
                { transform: el.style.transform + " translateY(-4px)" },
                { transform: el.style.transform + " translateY(0px)" },
                { transform: el.style.transform + " translateY(-2px)" },
                { transform: el.style.transform + " translateY(0px)" },
              ],
              { duration: 700, easing: "ease-out" }
            )
          }

          if (id === "stats") {
            // small jump
            const el = containerRef.current
            if (!el) return
            el.animate(
              [
                { transform: el.style.transform + " translateY(-12px)" },
                { transform: el.style.transform + " translateY(0px)" },
              ],
              { duration: 500, easing: "cubic-bezier(.2,.9,.2,1)" }
            )
          }
          if (id === "services") {
            const el = containerRef.current
            if (!el) return
            el.animate(
              [
                { transform: el.style.transform + " rotate(0deg)" },
                { transform: el.style.transform + " rotate(360deg)" },
              ],
              { duration: 700, easing: "cubic-bezier(.2,.9,.2,1)" }
            )
          }
        })
      },
      { threshold: 0.6 }
    )

    sections.forEach((id) => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })

    return () => obs.disconnect()
  }, [])

  // hover handlers (inside component so they can access refs)
  const hoverTimeout = useRef<number | null>(null)

  const handleHoverStart = () => {
    const el = containerRef.current
    if (!el) return
    // small celebratory animation: raise / scale / wiggle
    el.animate(
      [
        { transform: el.style.transform + " translateY(0px) rotate(0deg) scale(1)" },
        { transform: el.style.transform + " translateY(-10px) rotate(-8deg) scale(1.06)" },
        { transform: el.style.transform + " translateY(-6px) rotate(8deg) scale(1.03)" },
        { transform: el.style.transform + " translateY(0px) rotate(0deg) scale(1)" },
      ],
      { duration: 900, easing: "cubic-bezier(.2,.9,.2,1)" }
    )

    // try to trigger any animations embedded in the GLB via model-viewer
    try {
      const mv: any = mvRef.current
      if (mv) {
        // if model-viewer exposes availableAnimations, play the first
        if (Array.isArray(mv.availableAnimations) && mv.availableAnimations.length > 0) {
          mv.animationName = mv.availableAnimations[0]
          if (typeof mv.play === "function") mv.play()
        } else if (typeof mv.play === "function") {
          // try a generic play call
          mv.play()
        }
      }
    } catch (e) {
      // no-op
    }
  }

  const handleHoverEnd = () => {
    // stop or pause animations if available
    try {
      const mv: any = mvRef.current
      if (mv && typeof mv.pause === "function") mv.pause()
    } catch (e) {}
    if (hoverTimeout.current) {
      window.clearTimeout(hoverTimeout.current)
      hoverTimeout.current = null
    }
  }

  return (
    <div
      ref={containerRef}
      aria-hidden
      style={{
        position: "fixed",
        width: 72,
        height: 72,
        zIndex: 9999,
        pointerEvents: "auto",
        transform: "translate(0px,0px)",
      }}
    >
      <style>{`
        .robot-wrap { width:72px; height:72px; display:block; }
        .robot-sleep { transform: rotate(150deg) scale(0.95); }
        .robot-breathe { animation: robotBreathe 2400ms ease-in-out infinite; }
        @keyframes robotBreathe { 0%{ transform: scale(0.98)} 50%{ transform: scale(1.02)} 100%{ transform: scale(0.98)} }
        .robot-shadow { position:absolute; left:6px; right:6px; bottom:2px; height:8px; border-radius:50%; background:rgba(0,0,0,0.18); filter:blur(6px); }
        .robot-overlay { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; }
        /* ensure the model is sized to fit */
        model-viewer { width:72px; height:72px; }
      `}</style>

      <div
        className={`robot-wrap ${awoken ? "" : "robot-sleep robot-breathe"}`}
        onMouseEnter={handleHoverStart}
        onMouseLeave={handleHoverEnd}
        onTouchStart={handleHoverStart}
        onTouchEnd={handleHoverEnd}
      >
        <div className="robot-overlay">
          {mounted ? (
            // @ts-ignore - model-viewer is a webcomponent
            <model-viewer
              ref={mvRef}
              src="/wall-e.glb"
              alt="Friendly robot"
              exposure="1"
              camera-controls={false}
              disable-zoom
              interaction-prompt="none"
              camera-orbit="0deg 75deg 1.3m"
              style={{ width: 72, height: 72, pointerEvents: "auto" }}
            />
          ) : null}
        </div>
        <div className="robot-shadow" />
      </div>
    </div>
  )
}



