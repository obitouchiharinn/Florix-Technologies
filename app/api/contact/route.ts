import { NextResponse } from "next/server"
import sgMail from "@sendgrid/mail"

type ContactBody = {
  firstName: string
  lastName: string
  mobile: string
  email: string
  comment: string
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactBody

    if (!body || !body.email || !body.firstName || !body.lastName || !body.comment) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const key = process.env.SENDGRID_API_KEY
    if (!key) {
      return NextResponse.json({ error: "SENDGRID_API_KEY not configured" }, { status: 500 })
    }

    sgMail.setApiKey(key)

    const to = process.env.CONTACT_TO || "Info@florixtechnologies.com"
    const from = process.env.CONTACT_FROM || to

    const subject = `Website contact from ${body.firstName} ${body.lastName}`
    const text = `New contact request:\n\nName: ${body.firstName} ${body.lastName}\nEmail: ${body.email}\nMobile: ${body.mobile}\n\nMessage:\n${body.comment}`
    const html = `<h2>New contact request</h2>
      <p><strong>Name:</strong> ${body.firstName} ${body.lastName}</p>
      <p><strong>Email:</strong> ${body.email}</p>
      <p><strong>Mobile:</strong> ${body.mobile}</p>
      <h3>Message</h3>
      <p>${body.comment.replace(/\n/g, "<br />")}</p>`

    const msg = {
      to,
      from,
      subject,
      text,
      html,
    }

    await sgMail.send(msg)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Contact API error", err)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}
