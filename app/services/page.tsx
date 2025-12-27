"use client"

import { useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Footer } from "@/components/footer"
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

  // Parallax mouse effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY
      }

      const elements = document.querySelectorAll(".parallax-element")
      elements.forEach((el) => {
        const element = el as HTMLElement
        const speed = Number.parseFloat(element.getAttribute("data-speed") || "0.05")
        const x = (window.innerWidth - e.pageX * speed) / 100
        const y = (window.innerHeight - e.pageY * speed) / 100
        element.style.transform = `translateX(${x}px) translateY(${y}px)`
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const services = [
    {
      title: "Web Development",
      description: "Custom web applications built with modern technologies like React, Next.js, and Node.js. We focus on performance, scalability, and user experience.",
      icon: <Globe className="w-8 h-8 md:w-10 md:h-10 text-primary" />,
      link: "/services/web-development",
      color: "from-green-500/20 to-emerald-500/20"
    },
    {
      title: "IT Support",
      description: "24/7 technical support, system maintenance, and troubleshooting. We ensure your business operations run smoothly without interruption.",
      icon: <Headphones className="w-8 h-8 md:w-10 md:h-10 text-primary" />,
      link: "/services/it-support",
      color: "from-green-500/20 to-teal-500/20"
    },
    {
      title: "IT Consulting",
      description: "Strategic technology planning and digital transformation advice. We help you leverage technology to achieve your business goals.",
      icon: <Lightbulb className="w-8 h-8 md:w-10 md:h-10 text-primary" />,
      link: "/services/it-consulting",
      color: "from-emerald-500/20 to-green-500/20"
    },
    {
      title: "Artificial Intelligence",
      description: "AI and Machine Learning integration services. Automate processes, gain insights from data, and implement intelligent solutions.",
      icon: <BrainCircuit className="w-8 h-8 md:w-10 md:h-10 text-primary" />,
      link: "/services/artificial-intelligence",
      color: "from-teal-500/20 to-cyan-500/20"
    },
    {
      title: "AMC Services",
      description: "Annual Maintenance Contracts for your hardware and software infrastructure. Regular checkups and priority support.",
      icon: <Settings className="w-8 h-8 md:w-10 md:h-10 text-primary" />,
      link: "/services/amc-services",
      color: "from-green-600/20 to-emerald-600/20"
    },
    {
      title: "PC Building",
      description: "Custom PC assembly for gaming, workstations, and office use. High-quality components and professional cable management.",
      icon: <Monitor className="w-8 h-8 md:w-10 md:h-10 text-primary" />,
      link: "/services/pc-building",
      color: "from-emerald-600/20 to-teal-600/20"
    },
    {
      title: "Office Networking",
      description: "Complete office network setup, structured cabling, Wi-Fi configuration, and security implementation.",
      icon: <Network className="w-8 h-8 md:w-10 md:h-10 text-primary" />,
      link: "/services/office-networking",
      color: "from-teal-600/20 to-green-600/20"
    }
  ]

  return (
    <div className="min-h-screen bg-white overflow-hidden" ref={containerRef}>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 min-h-[60vh] flex items-center justify-center overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10" ref={contentRef}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6 fade-in-section opacity-0 translate-y-20 transition-all duration-700 ease-out"
          >
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-primary/10 rounded-full">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
              <span className="text-sm font-medium text-primary">Our Expertise</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-foreground tracking-tight">
              Comprehensive <span className="text-primary relative inline-block">
                IT Solutions
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary/20" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
                </svg>
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Empowering your business with cutting-edge technology, from custom software to robust infrastructure.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-6 bg-gradient-to-b from-white to-gray-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group h-full"
              >
                <Card className={`h-full p-8 relative overflow-hidden bg-white border-primary/10 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 rounded-3xl group-hover:-translate-y-2`}>

                  {/* Gradient Background on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                  <div className="relative z-10 flex flex-col h-full">
                    <div className="mb-6 p-4 rounded-2xl bg-primary/5 w-fit group-hover:bg-primary/10 transition-colors duration-500 group-hover:scale-110 transform origin-left">
                      {service.icon}
                    </div>

                    <h3 className="text-2xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors duration-300">{service.title}</h3>

                    <p className="text-muted-foreground mb-8 flex-grow leading-relaxed">
                      {service.description}
                    </p>

                    <Link href={service.link} className="inline-flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all duration-300">
                      Learn more <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 bg-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-[100px]" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Transform Your Business?</h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Let's discuss how our technology solutions can drive growth and efficiency for your organization.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="rounded-full px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-white/20 transition-all" asChild>
              <Link href="/contact">Get in Touch</Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8 py-6 text-lg font-semibold bg-transparent border-white text-white hover:bg-white/10 transition-all" asChild>
              <Link href="/about">About Us</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
