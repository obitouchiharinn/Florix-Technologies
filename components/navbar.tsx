"use client"

import React, { useState, useEffect } from "react"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Helper for custom duration smooth scroll
const smoothScrollTo = (target: string | number, duration: number) => {
  let targetPosition = 0
  if (typeof target === 'number') {
    targetPosition = target
  } else {
    const element = document.getElementById(target)
    if (!element) return
    targetPosition = element.getBoundingClientRect().top + window.scrollY
  }
  const startPosition = window.scrollY
  const distance = targetPosition - startPosition
  let startTime: number | null = null

  function animation(currentTime: number) {
    if (startTime === null) startTime = currentTime
    const timeElapsed = currentTime - startTime

    // Ease-in-out cubic function
    const ease = (t: number, b: number, c: number, d: number) => {
      t /= d / 2
      if (t < 1) return (c / 2) * t * t * t + b
      t -= 2
      return (c / 2) * (t * t * t + 2) + b
    }

    const run = ease(timeElapsed, startPosition, distance, duration)
    window.scrollTo(0, run)

    if (timeElapsed < duration) {
      requestAnimationFrame(animation)
    } else {
      window.scrollTo(0, targetPosition)
    }
  }

  requestAnimationFrame(animation)
}

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [hide, setHide] = useState(false)
  const [transitionOverlay, setTransitionOverlay] = useState({
    isOpen: false,
    x: 0,
    y: 0,
    color: "#ffffff"
  })

  // Handle Navbar visibility on Home page
  useEffect(() => {
    if (pathname !== "/") {
      setHide(false)
      return
    }

    const handleScroll = () => {
      const servicesSection = document.getElementById("services-section")
      if (!servicesSection) return

      const rect = servicesSection.getBoundingClientRect()
      // Hide navbar when scrolling through services section
      const isInServicesSection = rect.top <= 100 && rect.bottom >= 100
      setHide(isInServicesSection)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [pathname])

  // Close mobile menu on path change
  useEffect(() => {
    setOpen(false)
  }, [pathname])



  const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Contact", href: "#contact" }, // Changed to scroll to contact section
  ]

  const handleLinkClick = async (e: React.MouseEvent<HTMLElement>, href: string) => {
    e.preventDefault()

    // 1. Handle in-page scroll for Contact when already on Home
    // We skip the page transition effect for simple scrolling, as requested context implies navigating "to" pages.
    // Unless user specifically wants animation for scrolling? Usually not.
    if (href === "#contact" && pathname === "/") {
      smoothScrollTo("contact", 2500)
      return
    }

    // 2. Handle Home Scroll (Super Smooth)
    if (href === "/" && pathname === "/") {
      smoothScrollTo(0, 2500)
      return
    }

    // Determine target path
    // If we are external and click "#contact", we go to the dedicated "/contact" page (or root with hash if preferred, but existing logic used /contact)
    let targetHref = href
    if (href === "#contact") {
      targetHref = "/contact"
      // If /contact page doesn't exist and it's just home, use "/" or "/#contact"
      // Assuming /contact exists based on file structure.
    }

    // Determine if we need to run the animation
    // Only animate if we are actually navigating to a new path
    if (pathname === targetHref) {
      return
    }

    // Determine color:
    // Black when going from Contact to Home, White for everything else
    let revealColor = "#ffffff"; // Default White

    if (targetHref === "/" && pathname === "/contact") {
      revealColor = "#000000"; // Black only for Contact -> Home
    }

    // Capture coordinates robustly for mobile and desktop
    const rect = e.currentTarget.getBoundingClientRect()
    let x = e.clientX
    let y = e.clientY

    // For mobile/touch events, clientX/Y might be 0, use element center
    if (!x || !y || x === 0 || y === 0) {
      x = rect.left + rect.width / 2
      y = rect.top + rect.height / 2
    }

    // Round coordinates to avoid sub-pixel floats causing invalid CSS keyframe names
    x = Math.round(x)
    y = Math.round(y)

    // Calculate the maximum distance to any corner for full coverage
    const maxDistance = Math.sqrt(
      Math.pow(Math.max(x, window.innerWidth - x), 2) +
      Math.pow(Math.max(y, window.innerHeight - y), 2)
    )
    const endRadius = maxDistance * 1.5 // 1.5x for smooth complete coverage

    // Check for View Transitions API support
    // @ts-ignore
    if (!document.startViewTransition) {
      // Fallback animation using CSS overlay for unsupported browsers
      setTransitionOverlay({ isOpen: true, x, y, color: revealColor })

      setTimeout(() => {
        router.push(targetHref)
        setTimeout(() => setTransitionOverlay(prev => ({ ...prev, isOpen: false })), 500)
      }, 2500)
      return
    }

    // View Transition API Logic (Supported browsers - desktop and modern mobile)
    // @ts-ignore
    const transition = document.startViewTransition(async () => {
      await router.push(targetHref)
    })

    // @ts-ignore
    await transition.ready

    const duration = 2500 // 2.5 seconds for slow, dramatic effect

    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: duration,
        easing: "cubic-bezier(0.4, 0.0, 0.2, 1)", // Material Design easing for smooth motion
        pseudoElement: "::view-transition-new(root)",
      }
    )
  }

  // Effect to close fallback overlay on route change if stuck
  useEffect(() => {
    setTransitionOverlay(prev => ({ ...prev, isOpen: false }))
  }, [pathname])

  return (
    <>
      {/* Fallback Transition Overlay */}
      {transitionOverlay.isOpen && (
        <>
          <div
            className="fixed inset-0 z-[9999] pointer-events-auto"
            style={{
              backgroundColor: transitionOverlay.color,
              clipPath: `circle(0px at ${transitionOverlay.x}px ${transitionOverlay.y}px)`,
              animation: `expand-circle-${transitionOverlay.x}-${transitionOverlay.y} 2.5s cubic-bezier(0.4, 0.0, 0.2, 1) forwards`
            }}
          />
          <style jsx global>{`
            @keyframes expand-circle-${transitionOverlay.x}-${transitionOverlay.y} {
              0% { 
                clip-path: circle(0px at ${transitionOverlay.x}px ${transitionOverlay.y}px);
                opacity: 1;
              }
              100% { 
                clip-path: circle(200% at ${transitionOverlay.x}px ${transitionOverlay.y}px);
                opacity: 1;
              }
            }
          `}</style>
        </>
      )}

      <nav
        className={cn(
          "fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-3xl px-4 transition-all duration-500",
          hide ? "opacity-0 -translate-y-full pointer-events-none" : "opacity-100 translate-y-0",
        )}
      >
        {/* Pill-shaped navbar with white background */}
        <div className="relative flex items-center justify-between gap-8 bg-white px-4 md:px-8 py-2 rounded-full shadow-lg border border-gray-200 h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold flex items-center gap-3 -ml-2 mt-2 md:-ml-5 md:mt-2 ">
            <img src="/Florix.png" alt="Florix Logo" className="h-34  w-auto" />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => handleLinkClick(e, item.href)}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary cursor-pointer",
                  pathname === item.href || (item.href === "#contact" && pathname === "/")
                    ? "text-primary"
                    : "text-foreground",
                )}
              >
                {item.name}
              </Link>
            ))}

            {/* Request Quote Button */}
            <Button
              size="sm"
              className="rounded-full bg-primary hover:bg-primary/90 text-white"
              onClick={(e) => handleLinkClick(e, "#contact")}
            >
              Request Quote
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              aria-label="Toggle menu"
              aria-expanded={open}
              className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:bg-gray-100"
              onClick={() => setOpen((o) => !o)}
            >
              {open ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu panel */}
        <div className="md:hidden">
          {open && (
            <div className="mt-2 flex flex-col items-center gap-2 bg-white px-4 py-3 rounded-xl shadow-lg border border-gray-200 w-[calc(100%-1rem)] max-w-xs mx-auto">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    handleLinkClick(e, item.href)
                    // Menu will close automatically when page changes
                  }}
                  className={cn(
                    "w-full text-center text-sm font-medium transition-colors hover:text-primary py-1",
                    pathname === item.href || (item.href === "#contact" && pathname === "/")
                      ? "text-primary"
                      : "text-foreground",
                  )}
                >
                  {item.name}
                </Link>
              ))}

              <Button
                size="sm"
                className="rounded-full bg-primary hover:bg-primary/90 text-white w-full mt-2"
                onClick={(e) => {
                  handleLinkClick(e, "#contact")
                  // No setOpen(false) needed as page will change
                }}
              >
                Request Quote
              </Button>
            </div>
          )}
        </div>
      </nav>
    </>
  )
}
