"use client"

import { useEffect, useRef, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Card } from "@/components/ui/card"
import { motion, useScroll, useTransform } from "framer-motion"

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  // Parallax transforms
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, 100])
  const storyOpacity = useTransform(scrollYProgress, [0.1, 0.3], [0, 1])
  const storyY = useTransform(scrollYProgress, [0.1, 0.3], [100, 0])
  const expertiseOpacity = useTransform(scrollYProgress, [0.3, 0.5], [0, 1])
  const expertiseY = useTransform(scrollYProgress, [0.3, 0.5], [100, 0])
  const valuesOpacity = useTransform(scrollYProgress, [0.5, 0.7], [0, 1])

  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const AnimatedCounter = ({ end, duration }: { end: number; duration: number }) => {
    const [count, setCount] = useState(0)
    const countRef = useRef<HTMLSpanElement>(null)

    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            let currentCount = 0
            const increment = end / (duration * 60)
            const interval = setInterval(() => {
              currentCount += increment
              if (currentCount >= end) {
                setCount(end)
                clearInterval(interval)
              } else {
                setCount(Math.floor(currentCount))
              }
            }, 16)
            return () => clearInterval(interval)
          }
        },
        { threshold: 0.5 },
      )

      if (countRef.current) observer.observe(countRef.current)
      return () => observer.disconnect()
    }, [end, duration])

    return <span ref={countRef}>{count}</span>
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-black relative overflow-hidden">
      <Navbar />

      <div className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Animated background orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl opacity-50 animate-pulse"></div>
        <div
          className="absolute bottom-40 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-30 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>

        <motion.div ref={heroRef} style={{ y: heroY }} className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <h1 className="text-6xl md:text-7xl font-bold mb-6 text-balance bg-gradient-to-r from-primary via-primary to-primary/60 bg-clip-text text-transparent">
                About Florix
              </h1>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-xl text-gray-300 max-w-3xl mx-auto text-balance"
            >
              We are Florix PC Station, building technology that empowers progress.
            </motion.p>
          </div>
        </motion.div>
      </div>

      {/* <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-3 gap-6 mb-20">
        {[
          { label: "Projects Completed", value: 600, icon: "⚡" },
          { label: "Happy Clients", value: 185, icon: "🤝" },
          { label: "Awards Won", value: 5, icon: "🏆" },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="group"
          >
            <Card className="p-8 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-md border border-primary/20 hover:border-primary/50 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-primary/20 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-5xl mb-4">{stat.icon}</div>
                <div className="text-4xl font-bold text-primary mb-2">
                  <AnimatedCounter end={stat.value} duration={2} />
                  {stat.value >= 100 ? "+" : ""}
                </div>
                <p className="text-gray-400">{stat.label}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div> */}

      <motion.div style={{ opacity: storyOpacity, y: storyY }} className="max-w-6xl mx-auto px-6 mb-20">
        <Card className="p-12 bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-md border border-primary/20 relative overflow-hidden group hover:border-primary/40 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Our Story
            </h2>
            <p className="text-lg text-gray-300 leading-relaxed mb-4">
              Florix PC Station was founded with a vision to bridge the gap between cutting-edge technology and
              businesses that need it most. Led by Rajveersan and our dedicated team, we've grown from a small startup
              to a trusted technology partner for 185+ clients worldwide.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              Our mission is simple: empower businesses through innovative technology solutions that drive real results.
              From web development to artificial intelligence, we're committed to turning imagination into digital
              impact.
            </p>
          </div>
        </Card>
      </motion.div>

      <motion.div style={{ opacity: expertiseOpacity, y: expertiseY }} className="max-w-6xl mx-auto px-6 mb-20">
        <Card className="p-12 bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-md border border-primary/20 relative overflow-hidden group hover:border-primary/40 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Our Roots & Expertise
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  title: "Technology Leaders",
                  desc: "With over 600+ completed projects, we've established ourselves as industry leaders in web development, IT infrastructure, and emerging technologies like artificial intelligence.",
                },
                {
                  title: "Client-Focused Approach",
                  desc: "Every project is a partnership. We work closely with our clients to understand their unique challenges and deliver solutions that exceed expectations.",
                },
                {
                  title: "Innovation First",
                  desc: "We stay ahead of technological trends, constantly learning and adapting to provide our clients with the most advanced solutions available.",
                },
                {
                  title: "Award-Winning Service",
                  desc: "Our commitment to excellence has earned us 5 prestigious industry awards and the trust of clients across the globe.",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="p-6 rounded-lg bg-background/50 border border-primary/10 hover:border-primary/30 transition-all duration-300 group/item cursor-pointer"
                >
                  <h3 className="text-xl font-bold text-primary mb-3 group-hover/item:text-primary/80 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div style={{ opacity: valuesOpacity }} className="max-w-6xl mx-auto px-6 mb-20">
        <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Our Values
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              emoji: "🎯",
              title: "Mission-Driven",
              desc: "Every decision is guided by our mission to empower progress through technology",
            },
            {
              emoji: "🤝",
              title: "Collaborative",
              desc: "We believe the best solutions emerge from close collaboration and open communication",
            },
            {
              emoji: "⚡",
              title: "Results-Focused",
              desc: "We measure our success by the tangible results we deliver for our clients",
            },
          ].map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="group"
            >
              <Card className="p-8 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-md border border-primary/20 hover:border-primary/50 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-primary/20 h-full relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="text-6xl mb-4 inline-block"
                  >
                    {value.emoji}
                  </motion.div>
                  <h3 className="text-2xl font-bold text-primary mb-3 group-hover:text-primary/80 transition-colors">
                    {value.title}
                  </h3>
                  <p className="text-gray-300">{value.desc}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto text-center text-gray-500">
          <p>© 2025 Florix. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
