import { Resend } from "resend";
import nodemailer from "nodemailer";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const smtpTransport =
  process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS
    ? nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: Number(process.env.SMTP_PORT || 587) === 465,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      })
    : null;

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  // Resend needs a real API key; fall back to the SMTP account (already configured
  // via SMTP_* in .env) so contact/reset emails still go out when RESEND_API_KEY is unset.
  if (resend) {
    const from = process.env.RESEND_FROM || "Optimais Labs <onboarding@resend.dev>";
    return resend.emails.send({ from, to, subject, html });
  }

  if (smtpTransport) {
    const from = process.env.SMTP_FROM || process.env.SMTP_USER!;
    return smtpTransport.sendMail({ from, to, subject, html });
  }

  throw new Error("No email transport configured: set RESEND_API_KEY or SMTP_HOST/SMTP_USER/SMTP_PASS.");
}
