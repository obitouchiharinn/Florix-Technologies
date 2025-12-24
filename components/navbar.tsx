"use client"

import React, { useState } from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface NavbarProps {
  hide?: boolean
}

export function Navbar({ hide = false }: NavbarProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  

  const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Contact", href: "#contact" }, // Changed to scroll to contact section
  ]

  const handleContactClick = (e: React.MouseEvent, href: string) => {
    if (href === "#contact" && pathname === "/") {
      e.preventDefault()
      const contactSection = document.querySelector('[id="contact"]')
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth" })
      }
    }
  }

  return (
    <nav
      className={cn(
        "fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-3xl px-4 transition-all duration-500",
        hide ? "opacity-0 -translate-y-full pointer-events-none" : "opacity-100 translate-y-0",
      )}
    >
      {/* Pill-shaped navbar with white background */}
      <div className="relative flex items-center justify-between gap-8 bg-white px-4 md:px-8 py-4 rounded-full shadow-lg border border-gray-200">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold flex items-center gap-3">
          <span className="text-primary">FLORIX</span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => handleContactClick(e, item.href)}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary cursor-pointer",
                pathname === item.href || (item.href === "#contact" && pathname === "/")
                  ? "text-primary"
                  : "text-foreground",
              )}
            >
              {item.name}
            </a>
          ))}

          {/* Request Quote Button */}
          <Button size="sm" className="rounded-full bg-primary hover:bg-primary/90 text-white">
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
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  handleContactClick(e, item.href)
                  setOpen(false)
                }}
                className={cn(
                  "w-full text-center text-sm font-medium transition-colors hover:text-primary py-1",
                  pathname === item.href || (item.href === "#contact" && pathname === "/")
                    ? "text-primary"
                    : "text-foreground",
                )}
              >
                {item.name}
              </a>
            ))}

            <Button size="sm" className="rounded-full bg-primary hover:bg-primary/90 text-white w-full mt-2">
              Request Quote
            </Button>
          </div>
        )}
      </div>
    </nav>
  )
}
