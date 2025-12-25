"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { motion, useScroll } from "framer-motion"
import { AuroraText } from "@/components/ui/aurora-text"
import {
  Globe,
  Headphones,
  Lightbulb,
  BrainCircuit,
  Settings,
  Monitor,
  Network,
  Send,
  Target,
  Compass,
  MapPin,
  Mail,
  Phone,
  Clock,
} from "lucide-react"
import { Footer } from "@/components/footer"
import { Meteors } from "@/components/ui/meteors"
import Reviews from "@/components/reviews"

export default function Home() {
  const router = useRouter()
  const heroRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const servicesRef = useRef<HTMLDivElement>(null)

  const [hideNavbar, setHideNavbar] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    email: "",
    comment: "",
  })
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [statusMessage, setStatusMessage] = useState<null | { type: "success" | "error"; text: string }>(null)

  const { scrollYProgress } = useScroll({
    target: servicesRef,
    offset: ["start start", "end start"],
  })

  useEffect(() => {
    const handleScroll = () => {
      if (!servicesRef.current) return

      const rect = servicesRef.current.getBoundingClientRect()
      const isInServicesSection = rect.top <= 100 && rect.bottom >= 100

      setHideNavbar(isInServicesSection)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // If navigated to a hash (/#contact), scroll to that section on mount and when hash changes
  useEffect(() => {
    const scrollToHash = () => {
      try {
        const hash = window.location.hash
        if (!hash) return
        const id = hash.replace("#", "")
        const el = document.getElementById(id)
        if (el) {
          // account for fixed navbar height (approx 96px)
          const navbarOffset = 96
          const top = el.getBoundingClientRect().top + window.scrollY - navbarOffset
          window.scrollTo({ top, behavior: "smooth" })
        }
      } catch (e) {
        // ignore
      }
    }

    // Scroll on mount
    scrollToHash()
    // Scroll on hashchange
    window.addEventListener("hashchange", scrollToHash)
    return () => window.removeEventListener("hashchange", scrollToHash)
  }, [])

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSending) return
    setIsSending(true)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        console.error("Contact send failed", err)
        const message = err?.error || "Failed to send message. Please try again later."
        setStatusMessage({ type: "error", text: message })
        setTimeout(() => setStatusMessage(null), 5000)
        setIsSending(false)
        return
      }

      setFormSubmitted(true)
      setStatusMessage({ type: "success", text: "Message sent successfully. We will get back to you soon." })
      setTimeout(() => setStatusMessage(null), 4000)
      setFormData({ firstName: "", lastName: "", mobile: "", email: "", comment: "" })
      setTimeout(() => setFormSubmitted(false), 2500)
    } catch (error) {
      console.error("Contact error", error)
      setStatusMessage({ type: "error", text: "An error occurred while sending. Please try again." })
      setTimeout(() => setStatusMessage(null), 5000)
    } finally {
      setIsSending(false)
    }
  }

  const serviceRoutes: Record<string, string> = {
    "Web Development": "/services/web-development",
    "IT Support": "/services/it-support",
    "IT Consulting": "/services/it-consulting",
    "Artificial Intelligence": "/services/artificial-intelligence",
    "AMC Services": "/services/amc-services",
    "PC Building": "/services/pc-building",
    "Office Networking": "/services/office-networking",
  }

  const services = [
    {
      title: "Web Development",
      description:
        "Transform your digital presence with cutting-edge web applications. We build responsive, scalable websites using modern technologies like React, Next.js, and TypeScript. From e-commerce platforms to complex web apps, we deliver solutions that drive growth and engagement.",
      Icon: Globe,
      color: "from-green-500/20 to-emerald-500/20",
    },
    {
      title: "IT Support",
      description:
        "Keep your business running smoothly with our comprehensive IT support services. Our expert team provides 24/7 technical assistance, system monitoring, and rapid problem resolution. We ensure minimal downtime and maximum productivity for your organization.",
      Icon: Headphones,
      color: "from-green-500/20 to-teal-500/20",
    },
    {
      title: "IT Consulting",
      description:
        "Navigate the complex technology landscape with strategic guidance from our experienced consultants. We analyze your current infrastructure, identify optimization opportunities, and create roadmaps for digital transformation that align with your business objectives.",
      Icon: Lightbulb,
      color: "from-emerald-500/20 to-green-500/20",
    },
    {
      title: "Artificial Intelligence",
      description:
        "Harness the power of AI to automate processes and gain competitive advantages. We implement machine learning models, natural language processing, and intelligent automation solutions that learn from your data and adapt to your needs.",
      Icon: BrainCircuit,
      color: "from-teal-500/20 to-cyan-500/20",
    },
    {
      title: "AMC Services",
      description:
        "Ensure peak performance with our Annual Maintenance Contracts. We provide regular system health checks, proactive monitoring, priority support, and guaranteed response times. Keep your IT infrastructure running smoothly year-round with minimal disruptions.",
      Icon: Settings,
      color: "from-green-600/20 to-emerald-600/20",
    },
    {
      title: "PC Building",
      description:
        "Get custom-built computers tailored to your exact specifications. Whether for gaming, content creation, or business applications, we source quality components, ensure optimal performance, and provide comprehensive warranties and ongoing support.",
      Icon: Monitor,
      color: "from-emerald-600/20 to-teal-600/20",
    },
    {
      title: "Office Networking",
      description:
        "Build secure, reliable network infrastructure for your office environment. We design and implement enterprise-grade networks with robust security protocols, seamless connectivity, wireless solutions, and VPN access for remote teams.",
      Icon: Network,
      color: "from-teal-600/20 to-green-600/20",
    },
  ]

  const stats = [
    { value: "185+", label: "Worldwide Clients" },
    { value: "600+", label: "Projects Completed" },
    { value: "22M", label: "Profit Earning" },
    { value: "5", label: "Got Awards" },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Navbar hide={hideNavbar} />

      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="min-h-[70vh] md:min-h-screen flex items-center justify-center px-6 pt-28 md:pt-32 relative overflow-hidden"
      >
        {/* Meteors background - full-cover absolute so it sits behind content */}
        <div  className="relative flex w-full flex-col items-center justify-center overflow-hidden h-auto md:h-[500px]">
          <Meteors number={30} />
        

        <div className="max-w-6xl mx-auto text-center relative z-10 mt-4 md:mt-0">
          <div className="inline-flex items-center gap-2 mb-6 mt-4 px-4 py-2 bg-primary/10 rounded-full">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
            <span className="text-sm text-foreground">Trusted by 91+ people</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold mb-6 text-balance">
            <span className="text-foreground">Building technology that </span>
              <AuroraText className="font-bold">empowers progress</AuroraText>
          </h1>

          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto text-balance">
            {"Creating meaningful connections and turning big ideas into interactive digital experiences."}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-6">
            <Button size="lg" className="w-full sm:w-auto rounded-full bg-primary hover:bg-primary/90 text-white px-8 py-3">
              Get Started
            </Button>
            {/* <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full px-8 bg-transparent mt-2 sm:mt-0">
              View Our Work
            </Button> */}
          </div>


        </div>
        </div>
      </motion.section>

      {/* Hero Illustration (moved below hero) */}
      <div className="mt-12 px-6">
        <img
          src="/hero.jpg"
          alt="Futuristic Technology Illustration"
          className="w-full max-w-4xl mx-auto h-auto rounded-2xl shadow-2xl"
          loading="lazy"
        />
      </div>

      {/* Stats Section */}
      {/* <motion.section
        ref={statsRef}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="py-20 px-6 bg-gradient-to-b from-white to-primary/5"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-8 rounded-3xl bg-white border border-gray-100 hover:border-primary/50 transition-all duration-300 hover:shadow-xl"
              >
                <div className="text-5xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section> */}

      {/* Vision and Mission Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Vision Card */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card
                className="p-10 md:p-12 relative overflow-hidden group h-full
                bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl
                border-2 border-primary/20 hover:border-primary/60
                shadow-2xl hover:shadow-[0_0_60px_rgba(34,197,94,0.4)]
                transition-all duration-500 rounded-3xl"
              >
                {/* Glassmorphism effect */}
                <div className="absolute inset-0 bg-white/40 backdrop-blur-md opacity-60" />

                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <motion.div
                      className="p-4 rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-all duration-500"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <Compass className="w-8 h-8 text-primary group-hover:drop-shadow-[0_0_20px_rgba(34,197,94,0.9)] transition-all duration-500" />
                    </motion.div>
                    <h3 className="text-2xl md:text-3xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                      Our Vision
                    </h3>
                  </div>
                  <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                    To be the trusted One-Stop IT Ecosystem integrating high-performance hardware, support, and innovation to drive your success.
                  </p>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-500" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-all duration-500" />
              </Card>
            </motion.div>

            {/* Mission Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card
                className="p-10 md:p-12 relative overflow-hidden group h-full
                bg-gradient-to-br from-emerald-500/10 to-green-500/10 backdrop-blur-xl
                border-2 border-primary/20 hover:border-primary/60
                shadow-2xl hover:shadow-[0_0_60px_rgba(34,197,94,0.4)]
                transition-all duration-500 rounded-3xl"
              >
                {/* Glassmorphism effect */}
                <div className="absolute inset-0 bg-white/40 backdrop-blur-md opacity-60" />

                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <motion.div
                      className="p-4 rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-all duration-500"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <Target className="w-8 h-8 text-primary group-hover:drop-shadow-[0_0_20px_rgba(34,197,94,0.9)] transition-all duration-500" />
                    </motion.div>
                    <h3 className="text-2xl md:text-3xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                      Our Mission
                    </h3>
                  </div>
                  <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                    Build. Support. Grow. We deliver end-to-end IT solutions, spanning from the workstations powering your team to the digital platforms engaging your customers, ensuring your infrastructure is robust, resilient, and always ready for the future.
                  </p>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-500" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-all duration-500" />
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section ref={servicesRef} className="relative min-h-screen bg-white">
        <div className="sticky top-0 pt-16 pb-6 px-6 text-center bg-white z-20 border-b border-gray-100">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-3">
              <span className="text-foreground">Our </span>
              <span className="text-primary">Services</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {"Comprehensive IT solutions tailored to your business needs"}
            </p>
          </motion.div>
        </div>

        <div className="relative">
          {services.map((service, index) => {
            const targetScale = 1 - (services.length - index) * 0.05
            const Icon = service.Icon

            return (
              <motion.div
                key={index}
                className="sticky flex items-center justify-center px-6 py-4 md:py-6 min-h-[80vh]"
                style={{
                  top: `${80 + index * 25}px`,
                }}
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.2,
                  ease: "easeOut",
                }}
                viewport={{ once: false, margin: "-100px" }}
              >
                <motion.div
                  className="w-full max-w-7xl"
                  whileInView={{ scale: targetScale }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: false, amount: 0.5 }}
                >
                  <Card
                    className={`p-10 md:p-16 relative overflow-hidden group cursor-pointer
                    bg-gradient-to-br ${service.color} backdrop-blur-xl
                    border-2 border-primary/20 hover:border-primary/60
                    shadow-2xl hover:shadow-[0_0_60px_rgba(34,197,94,0.4)]
                    transition-all duration-500 rounded-3xl`}
                    onClick={() => {
                      const route = serviceRoutes[service.title]
                      if (route) {
                        router.push(route)
                      }
                    }}
                  >
                    {/* Neon glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Glassmorphism effect */}
                    <div className="absolute inset-0 bg-white/40 backdrop-blur-md opacity-60" />

                    {/* Content */}
                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10">
                      {/* Icon with glow */}
                      <motion.div
                        className="flex-shrink-0 p-6 md:p-8 rounded-3xl bg-primary/10 group-hover:bg-primary/20 transition-all duration-500"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Icon className="w-16 h-16 md:w-20 md:h-20 text-primary group-hover:drop-shadow-[0_0_20px_rgba(34,197,94,0.9)] transition-all duration-500" />
                      </motion.div>

                      {/* Text content */}
                      <div className="flex-1">
                        <h3 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 text-foreground group-hover:text-primary transition-colors duration-300">
                          {service.title}
                        </h3>
                        <p className="text-base md:text-xl text-muted-foreground leading-relaxed">
                          {service.description}
                        </p>
                      </div>
                    </div>

                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-500" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-all duration-500" />
                  </Card>
                </motion.div>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="py-32 px-6 bg-white" >
        <div className="max-w-7xl mx-auto">
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="py-12 px-6"
          >
            <div className="max-w-7xl mx-auto mt-12">
              <h2 className="text-5xl md:text-6xl font-bold mb-6 text-balance text-center">
                <span className="text-foreground">What our customers say</span>
              </h2>
              <p className="mt-3 text-sm text-muted-foreground text-center">Real feedback from customers who trust our work</p>
              <Reviews />
            </div>
          </motion.section>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-primary/10 rounded-full">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-primary"></span>
              <span className="text-sm font-semibold text-primary">Get In Touch</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-balance">
              <span className="text-foreground">Catch up with us, feel free</span>
              <br />
              <span className="text-primary">to knock</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12" id="contact">
            {/* Left Column: Map and Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex flex-col gap-8"
            >
              {/* Map Embed */}
              <div className="w-full h-96 rounded-3xl overflow-hidden shadow-2xl border-2 border-primary/20 hover:border-primary/40 transition-all duration-500">
                <iframe
                  src="https://www.google.com/maps?q=Florix%20PC%20Station%2C%20JP%20Nagar%2C%20Bengaluru&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Office Address */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <MapPin className="w-6 h-6 text-primary" />
                    Office Address
                  </h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    FLORIX PC STATION
                    <br />
                    634, 8th Main Rd
                    <br />
                    Jeewan Griha Colony, 2nd Phase
                    <br />
                    J. P. Nagar, Bengaluru
                    <br />
                    Karnataka 560078
                  </p>
                </div>

                {/* Contact Info */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-foreground">Contact Info</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="text-lg font-medium text-foreground">info@florixtechnologies.com</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="text-lg font-medium text-foreground">+91 9986639994</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-muted-foreground">Hours</p>
                        <p className="text-lg font-medium text-foreground">Mon-Fri 9AM-10PM IST</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card
                className="p-10 md:p-12 relative overflow-hidden group
                bg-gradient-to-br from-primary/5 to-emerald-500/5 backdrop-blur-xl
                border-2 border-primary/20 hover:border-primary/40
                shadow-2xl hover:shadow-[0_0_60px_rgba(34,197,94,0.3)]
                transition-all duration-500 rounded-3xl"
              >
                {/* Glassmorphism effect */}
                <div className="absolute inset-0 bg-white/40 backdrop-blur-md opacity-60" />

                {/* Content */}
                <form onSubmit={handleFormSubmit} className="relative z-10 space-y-6">
                  {statusMessage && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mb-2 flex justify-center">
                      <div
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
                          statusMessage.type === "success"
                            ? "bg-primary/10 text-primary"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        <span className={`relative flex h-3 w-3 ${statusMessage.type === "success" ? "" : "opacity-80"}`}>
                          {statusMessage.type === "success" ? (
                            <>
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                            </>
                          ) : (
                            <span className="inline-flex rounded-full h-3 w-3 bg-red-600" />
                          )}
                        </span>
                        <span className="text-sm font-semibold">{statusMessage.text}</span>
                      </div>
                    </motion.div>
                  )}
                  <div className="grid md:grid-cols-2 gap-4">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                      viewport={{ once: true }}
                    >
                      <label className="text-sm font-semibold text-foreground mb-2 block">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleFormChange}
                        placeholder="John"
                        className="w-full px-0 py-3 bg-transparent border-b-2 border-primary/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors duration-300"
                        required
                      />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.15 }}
                      viewport={{ once: true }}
                    >
                      <label className="text-sm font-semibold text-foreground mb-2 block">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleFormChange}
                        placeholder="Doe"
                        className="w-full px-0 py-3 bg-transparent border-b-2 border-primary/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors duration-300"
                        required
                      />
                    </motion.div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                      viewport={{ once: true }}
                    >
                      <label className="text-sm font-semibold text-foreground mb-2 block">Mobile Number</label>
                      <input
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleFormChange}
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-0 py-3 bg-transparent border-b-2 border-primary/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors duration-300"
                        required
                      />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.25 }}
                      viewport={{ once: true }}
                    >
                      <label className="text-sm font-semibold text-foreground mb-2 block">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleFormChange}
                        placeholder="john@example.com"
                        className="w-full px-0 py-3 bg-transparent border-b-2 border-primary/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors duration-300"
                        required
                      />
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    viewport={{ once: true }}
                  >
                    <label className="text-sm font-semibold text-foreground mb-2 block">Write Your Comment</label>
                    <textarea
                      name="comment"
                      value={formData.comment}
                      onChange={handleFormChange}
                      placeholder="Tell us about your project..."
                      rows={4}
                      className="w-full px-0 py-3 bg-transparent border-b-2 border-primary/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors duration-300 resize-none"
                      required
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.35 }}
                    viewport={{ once: true }}
                  >
                    <Button
                      type="submit"
                      disabled={isSending}
                      className="w-full rounded-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,197,94,0.4)]"
                    >
                      {isSending ? (
                        <span>Sending...</span>
                      ) : formSubmitted ? (
                        <span>Message Sent!</span>
                      ) : (
                        <>
                          <span>Send Message</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </motion.div>
                </form>

                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-500" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-all duration-500" />
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold mb-6 text-balance">
              <span className="text-foreground">Ready to transform your </span>
              <span className="text-primary">digital presence?</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-12">{"Let's build something amazing together"}</p>
            <Button
              size="lg"
              className="rounded-full bg-primary hover:bg-primary/90 text-white px-12"
              onClick={() =>
                window.open(
                  `https://wa.me/919986639994?text=${encodeURIComponent("I am interested in your services")}`,
                  "_blank",
                )
              }
            >
              Contact Us Today
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
