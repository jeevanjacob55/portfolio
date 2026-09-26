import type { VercelRequest, VercelResponse } from "@vercel/node";
import nodemailer from "nodemailer";

const required = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "CONTACT_EMAIL"] as const;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (required.some((key) => !process.env[key])) {
    return res.status(503).json({ error: "Contact form is not configured" });
  }

  const { name, email, message } = req.body ?? {};
  if (
    typeof name !== "string" || name.trim().length < 1 || name.length > 120 ||
    typeof email !== "string" || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    typeof message !== "string" || message.trim().length < 1 || message.length > 5000
  ) {
    return res.status(400).json({ error: "Please provide a valid name, email, and message." });
  }

  try {
    const port = Number(process.env.SMTP_PORT);
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
      return res.status(503).json({ error: "SMTP is not configured correctly" });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    await transporter.sendMail({
      from: `Portfolio contact <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL,
      replyTo: { name: name.trim(), address: email.trim() },
      subject: `Portfolio message from ${name.trim()}`,
      text: `From: ${name.trim()} <${email.trim()}>\n\n${message.trim()}`,
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Contact form email delivery failed", error);
    return res.status(502).json({ error: "Message could not be delivered" });
  }
}
