"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { MapPin, Mail, Phone, Clock, Send } from "lucide-react"
import { Footer } from "@/components/footer"

export default function ContactPage() {
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

  return (
    <div className="min-h-screen bg-white">
      <section className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
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
                <div className="absolute inset-0 bg-white/40 backdrop-blur-md opacity-60" />

                <form onSubmit={handleFormSubmit} className="relative z-10 space-y-6" id="contact-form">
                  {statusMessage && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mb-2 flex justify-center">
                      <div
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${statusMessage.type === "success"
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
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} viewport={{ once: true }}>
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
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }} viewport={{ once: true }}>
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
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} viewport={{ once: true }}>
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
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.25 }} viewport={{ once: true }}>
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

                  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }} viewport={{ once: true }}>
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

                  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.35 }} viewport={{ once: true }}>
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

                <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-500" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-all duration-500" />
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
