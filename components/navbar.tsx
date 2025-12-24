"use client"

import React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface NavbarProps {
  hide?: boolean
}

export function Navbar({ hide = false }: NavbarProps) {
  const pathname = usePathname()
  

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
      <div className="flex items-center justify-between gap-8 bg-white px-8 py-4 rounded-full shadow-lg border border-gray-200">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold flex items-center gap-3">
          <span className="text-primary">FLORIX</span>

        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6">
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
      </div>
    </nav>
  )
}
