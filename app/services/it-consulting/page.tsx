"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useEffect, useRef } from "react"
import { Lightbulb, TrendingUp, Users, Target, Zap, Shield } from "lucide-react"

export default function ITConsultingPage() {
  const containerRef = useRef<HTMLDivElement>(null)

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

  const features = [
    {
      icon: Target,
      title: "Strategic Planning",
      description: "Develop comprehensive technology roadmaps aligned with your business goals",
    },
    {
      icon: TrendingUp,
      title: "Digital Transformation",
      description: "Guide your organization through modernization and digital evolution",
    },
    {
      icon: Lightbulb,
      title: "Innovation Strategy",
      description: "Identify opportunities to leverage emerging technologies",
    },
    {
      icon: Shield,
      title: "Security Assessment",
      description: "Comprehensive security audits and compliance recommendations",
    },
    {
      icon: Users,
      title: "Team Development",
      description: "Build and strengthen your internal IT capabilities",
    },
    {
      icon: Zap,
      title: "Process Optimization",
      description: "Streamline operations and improve efficiency through technology",
    },
  ]

  return (
    <div className="min-h-screen bg-white" ref={containerRef}>
      <Navbar />

      {/* Hero Section */}
      <section className="min-h-screen flex items-center pt-32 px-6 relative z-10">
        <div className="max-w-6xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-sm text-foreground">IT Consulting Services</span>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold text-balance">
              <span className="text-foreground">Navigate Your Technology </span>
              <span className="text-primary">Journey</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl">
              Expert guidance to transform your technology infrastructure, optimize operations, and unlock new business
              opportunities.
            </p>

            <div className="flex gap-4 pt-6">
              <Button size="lg" className="rounded-full bg-primary hover:bg-primary/90 text-white">
                Schedule Consultation
              </Button>
              <Button
                size="lg"
                className="rounded-full"
                onClick={() =>
                  window.open("https://wa.me/919986639994?text=I%20am%20interested%20in%20IT%20Consulting%20services")
                }
              >
                Contact Us Today
              </Button>
            </div>

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-12 rounded-3xl overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 h-96"
            >
              <div className="w-full h-full bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center">
                <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}>
                  <Lightbulb className="w-48 h-48 text-primary/20" />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-white to-gray-50 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-4">Our Consulting Expertise</h2>
            <p className="text-xl text-muted-foreground">Strategic guidance for long-term technology success</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="p-8 rounded-2xl bg-white border border-gray-100 hover:border-primary/50 hover:shadow-xl transition-all duration-300 group"
                >
                  <motion.div
                    className="p-4 rounded-xl bg-primary/10 inline-block group-hover:bg-primary/20 transition-colors mb-4"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Icon className="w-6 h-6 text-primary" />
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6 p-12 rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20"
          >
            <h2 className="text-4xl font-bold">Ready for Technology Transformation?</h2>
            <p className="text-lg text-muted-foreground">
              Let's discuss how we can guide your organization towards digital success.
            </p>
            <Button
              size="lg"
              className="rounded-full bg-primary hover:bg-primary/90 text-white px-8"
              onClick={() =>
                window.open("https://wa.me/919986639994?text=I%20am%20interested%20in%20IT%20Consulting%20services")
              }
            >
              Start Your Consultation
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" data-scroll="0.2" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" data-scroll="0.15" />
        <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl" data-scroll="0.3" />
      </div>
    </div>
  )
}
