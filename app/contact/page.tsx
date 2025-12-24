"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function ContactPage() {
  const contentRef = useRef<HTMLDivElement>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0")
            entry.target.classList.remove("opacity-0", "translate-y-20")
          }
        })
      },
      { threshold: 0.1 },
    )

    if (contentRef.current) {
      const children = contentRef.current.querySelectorAll(".fade-in-section")
      children.forEach((child) => observer.observe(child))
    }

    return () => observer.disconnect()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Form submitted:", formData)
    // Handle form submission
  }

  const contactInfo = [
    {
      icon: "📧",
      title: "Email Us",
      info: "hello@florix.com",
      description: "Send us an email anytime",
    },
    {
      icon: "📞",
      title: "Call Us",
      info: "+1 (555) 123-4567",
      description: "Mon-Fri from 9am to 6pm",
    },
    {
      icon: "📍",
      title: "Visit Us",
      info: "123 Tech Street, Digital City",
      description: "Come say hello at our office",
    },
  ]

  return (
    <div className="min-h-screen dark bg-background">
      <Navbar />

      <div className="pt-32 pb-20 px-6">
        <div ref={contentRef} className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-20 fade-in-section opacity-0 translate-y-20 transition-all duration-1000">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 text-balance">
              <span className="text-primary">Get in </span>
              <span className="text-white">Touch</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto text-balance">
              {"Have a project in mind? We'd love to hear from you."}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 mb-20">
            {/* Contact Form */}
            <Card className="p-10 bg-card/50 backdrop-blur border-border fade-in-section opacity-0 translate-y-20 transition-all duration-1000">
              <h2 className="text-3xl font-bold mb-8 text-primary">Send us a message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Your Name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-background border-border text-white placeholder:text-gray-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-background border-border text-white placeholder:text-gray-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="bg-background border-border text-white placeholder:text-gray-500"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    Your Message
                  </label>
                  <Textarea
                    id="message"
                    rows={6}
                    placeholder="Tell us about your project..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="bg-background border-border text-white placeholder:text-gray-500 resize-none"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full rounded-full bg-primary hover:bg-primary/90 text-white"
                >
                  Send Message
                </Button>
              </form>
            </Card>

            {/* Contact Info */}
            <div className="space-y-6">
              {contactInfo.map((item, index) => (
                <Card
                  key={index}
                  className="p-8 bg-card/50 backdrop-blur border-border hover:border-primary transition-all duration-300 fade-in-section opacity-0 translate-y-20"
                  style={{ transitionDelay: `${(index + 1) * 100}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-5xl">{item.icon}</div>
                    <div>
                      <h3 className="text-2xl font-bold text-primary mb-2">{item.title}</h3>
                      <p className="text-xl text-white mb-1">{item.info}</p>
                      <p className="text-gray-400">{item.description}</p>
                    </div>
                  </div>
                </Card>
              ))}

              {/* Social Links */}
              <Card className="p-8 bg-card/50 backdrop-blur border-border fade-in-section opacity-0 translate-y-20 transition-all duration-1000">
                <h3 className="text-2xl font-bold text-primary mb-6">Follow Us</h3>
                <div className="flex gap-4">
                  <Button
                    size="icon"
                    variant="outline"
                    className="rounded-full border-border hover:border-primary hover:bg-primary/10 bg-transparent"
                  >
                    <span className="text-2xl">𝕏</span>
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="rounded-full border-border hover:border-primary hover:bg-primary/10 bg-transparent"
                  >
                    <span className="text-2xl">in</span>
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="rounded-full border-border hover:border-primary hover:bg-primary/10 bg-transparent"
                  >
                    <span className="text-2xl">f</span>
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="rounded-full border-border hover:border-primary hover:bg-primary/10 bg-transparent"
                  >
                    <span className="text-2xl">▶</span>
                  </Button>
                </div>
              </Card>
            </div>
          </div>

          {/* Map Placeholder */}
          <Card className="p-4 bg-card/50 backdrop-blur border-border fade-in-section opacity-0 translate-y-20 transition-all duration-1000">
            <div className="w-full h-96 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">🗺️</div>
                <p className="text-gray-400">Map integration placeholder</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto text-center text-gray-500">
          <p>© 2025 Florix. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
