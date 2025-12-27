"use client"

import React, { useState, useEffect } from "react"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface NavbarProps {
  hide?: boolean
}

export function Navbar({ hide = false }: NavbarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [transitionOverlay, setTransitionOverlay] = useState({
    isOpen: false,
    x: 0,
    y: 0,
    color: "#ffffff"
  })


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
      const contactSection = document.querySelector('[id="contact"]')
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth" })
      }
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
    // 1. If going from Contact page to Home -> Black
    // 2. If going to Home or Contact (default) -> White
    // 3. Else (going to Services etc) -> Green
    let revealColor = "#00ff88"; // Default Green

    if (targetHref === "/") {
      if (pathname === "/contact") {
        revealColor = "#000000"; // Black
      } else {
        revealColor = "#ffffff"; // White
      }
    } else if (targetHref === "/contact") {
      revealColor = "#ffffff";
    }

    // @ts-ignore
    if (!document.startViewTransition) {
      // Fallback for browsers without View Transition API (Safari < 18, etc.)
      // Trigger manual overlay animation
      setTransitionOverlay({ isOpen: true, x: e.clientX, y: e.clientY, color: revealColor })

      // Wait for animation expansion before pushing route
      setTimeout(() => {
        router.push(targetHref)
        // Keep overlay until new page loads? 
        // We'll rely on pathname change effect to close it or timeout
        setTimeout(() => setTransitionOverlay(prev => ({ ...prev, isOpen: false })), 500)
      }, 800)
      return
    }

    // View Transition API Logic
    const x = e.clientX
    const y = e.clientY

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    )

    // @ts-ignore
    const transition = document.startViewTransition(async () => {
      await router.push(targetHref)
    })

    // @ts-ignore
    await transition.ready

    const isMobile = window.innerWidth < 768
    const duration = isMobile ? 2500 : 1500 // Slower as requested

    // Animate the new view (the expanding circle)
    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: duration,
        easing: "ease-in-out",
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
        <div
          className="fixed inset-0 z-[100] pointer-events-none"
          style={{
            '--x': `${transitionOverlay.x}px`,
            '--y': `${transitionOverlay.y}px`,
            backgroundColor: transitionOverlay.color,
            animation: "expand-overlay 1s ease-in-out forwards"
          } as React.CSSProperties} // Type assertion for custom CSS properties
        />
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
                    if (pathname === item.href) {
                      setOpen(false)
                      return
                    }
                    handleLinkClick(e, item.href)
                    // Don't close menu here to allow transition to capture open state
                    // New page will load with default closed state
                  }}
                  className={cn( // Corrected usage
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
      <style jsx global>{`
      @keyframes expand-overlay {
        0% { clip-path: circle(0px at var(--x) var(--y)); }
        100% { clip-path: circle(150% at var(--x) var(--y)); }
      }
    `}</style>
    </>
  )
}
