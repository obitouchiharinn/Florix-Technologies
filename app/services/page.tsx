"use client"

import { useEffect, useRef } from "react"
import { Navbar } from "@/components/navbar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"
import { Globe, Headphones, Lightbulb, BrainCircuit, Settings, Monitor, Network, ArrowRight } from "lucide-react"

export default function ServicesPage() {
  const contentRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })

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

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const scrollY = window.scrollY
        const elements = containerRef.current.querySelectorAll("[data-scroll]")
        elements.forEach((el: Element) => {
          const element = el as HTMLElement
          const speed = element.getAttribute("data-scroll") || "0.5"
          element.style.transform = `translateY(${scrollY * Number.parseFloat(speed)}px)`
        })
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const services = [
    {
      title: "Web Development",
      description:
        "Build modern, responsive websites and web applications with cutting-edge technologies. From simple landing pages to complex e-commerce platforms, we create digital experiences that engage and convert.",
      icon: Globe,
      href: "/services/web-development",
      features: ["Responsive Design", "Progressive Web Apps", "E-commerce Solutions", "CMS Integration"],
      color: "from-blue-500/20 to-cyan-500/20",
    },
    {
      title: "IT Support",
      description:
        "Comprehensive IT support solutions to keep your business running smoothly. Our team provides 24/7 technical assistance, troubleshooting, and maintenance services.",
      icon: Headphones,
      href: "/services/it-support",
      features: ["24/7 Support", "Remote Assistance", "System Monitoring", "Hardware Troubleshooting"],
      color: "from-green-500/20 to-emerald-500/20",
    },
    {
      title: "IT Consulting",
      description:
        "Expert guidance to transform your technology infrastructure and optimize your digital operations. We help you make informed decisions about technology investments.",
      icon: Lightbulb,
      href: "/services/it-consulting",
      features: ["Strategic Planning", "Technology Audits", "Digital Transformation", "Process Optimization"],
      color: "from-yellow-500/20 to-orange-500/20",
    },
    {
      title: "Artificial Intelligence",
      description:
        "Leverage the power of AI to automate processes, gain insights, and create intelligent systems that learn and adapt to your business needs.",
      icon: BrainCircuit,
      href: "/services/artificial-intelligence",
      features: ["Machine Learning", "Natural Language Processing", "Computer Vision", "Predictive Analytics"],
      color: "from-purple-500/20 to-pink-500/20",
    },
    {
      title: "AMC Services",
      description:
        "Annual Maintenance Contracts that ensure your IT infrastructure operates at peak performance year-round with regular maintenance and priority support.",
      icon: Settings,
      href: "/services/amc-services",
      features: ["Regular Maintenance", "Priority Support", "Performance Optimization", "System Updates"],
      color: "from-red-500/20 to-orange-500/20",
    },
    {
      title: "PC Building",
      description:
        "Custom-built computers tailored to your exact specifications, whether for gaming, content creation, or business applications.",
      icon: Monitor,
      href: "/services/pc-building",
      features: ["Custom Configurations", "Quality Components", "Performance Testing", "Warranty Support"],
      color: "from-indigo-500/20 to-blue-500/20",
    },
    {
      title: "Office Networking",
      description:
        "Design, implementation, and maintenance of secure and reliable network infrastructure for offices of all sizes.",
      icon: Network,
      href: "/services/office-networking",
      features: ["Network Design", "Security Implementation", "Wireless Solutions", "VPN Setup"],
      color: "from-cyan-500/20 to-teal-500/20",
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div ref={containerRef} className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div
          className="absolute top-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"
          data-scroll="0.2"
        />
        <div
          className="absolute bottom-20 left-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"
          data-scroll="0.15"
        />
        <div
          className="absolute top-1/2 left-1/4 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"
          data-scroll="0.3"
        />

        <div ref={contentRef} className="max-w-7xl mx-auto relative z-10">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20 fade-in-section opacity-0 translate-y-20 transition-all duration-1000"
          >
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-primary/10 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-sm text-white font-semibold">Our Services</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold mb-6 text-balance">
              <span className="text-white">Comprehensive IT </span>
              <span className="text-primary">Solutions</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto text-balance">
              {"Innovative services designed to drive your business forward"}
            </p>
          </motion.div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            {services.map((service, index) => {
              const Icon = service.icon
              return (
                <Link key={index} href={service.href} className="group">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="fade-in-section opacity-0 translate-y-20 h-full"
                  >
                    <Card
                      className={`p-10 bg-gradient-to-br from-gray-900 to-gray-800 
                      border-2 border-primary/30 hover:border-primary/70 
                      transition-all duration-500 group-hover:shadow-[0_0_60px_rgba(34,197,94,0.3)]
                      group-hover:scale-105 cursor-pointer rounded-3xl h-full flex flex-col
                      hover:bg-gradient-to-br hover:from-gray-800 hover:to-gray-700`}
                    >
                      {/* Content */}
                      <div className="relative z-10 flex-1">
                        <motion.div
                          className="p-4 rounded-2xl bg-primary/10 inline-block group-hover:bg-primary/20 transition-all duration-300 mb-6"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                          <Icon className="w-8 h-8 text-primary group-hover:drop-shadow-[0_0_20px_rgba(34,197,94,0.9)] transition-all duration-300" />
                        </motion.div>
                        <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-primary transition-colors duration-300">
                          {service.title}
                        </h3>
                        <p className="text-gray-400 leading-relaxed mb-6">{service.description}</p>
                        <div className="space-y-2">
                          {service.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm text-gray-400">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* CTA Button */}
                      <div className="relative z-10 mt-8 flex items-center justify-between pt-6 border-t border-primary/10 group-hover:border-primary/30 transition-colors">
                        <span className="font-semibold text-primary">Learn More</span>
                        <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-2 transition-transform" />
                      </div>
                    </Card>
                  </motion.div>
                </Link>
              )
            })}
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card className="p-12 bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-primary/30 text-center fade-in-section opacity-0 translate-y-20 transition-all duration-1000 rounded-3xl">
              <h2 className="text-4xl font-bold mb-4 text-white">{"Ready to get started?"}</h2>
              <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                {"Let's discuss how our services can help transform your business"}
              </p>
              <Button
                size="lg"
                className="rounded-full bg-primary hover:bg-primary/90 text-white px-12"
                onClick={() =>
                  window.open("https://wa.me/919986639994?text=I%20am%20interested%20in%20your%20services")
                }
              >
                Request a Consultation
              </Button>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-800 bg-black">
        <div className="max-w-7xl mx-auto text-center text-gray-500">
          <p>© 2025 Florix. All rights reserved. | Transforming businesses through innovative technology</p>
        </div>
      </footer>
    </div>
  )
}
