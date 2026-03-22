import type { Env } from '../index'

interface EmailParams {
  to: string
  subject: string
  html: string
  replyTo?: string
}

export async function sendEmail(env: Env, params: EmailParams): Promise<boolean> {
  const { to, subject, html, replyTo } = params

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: env.RESEND_FROM_EMAIL,
        to: [to],
        subject,
        html,
        reply_to: replyTo,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Resend API error:', errorText)
      return false
    }

    return true
  } catch (error) {
    console.error('Email send failed:', error)
    return false
  }
}

export function buildContactNotificationEmail(data: {
  name: string
  email: string
  phone?: string
  eventType?: string
  eventDate?: string
  guestCount?: string
  budget?: string
  message?: string
}): string {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1A1A2E; border-bottom: 2px solid #C9A84C; padding-bottom: 12px;">
        New Event Enquiry
      </h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px 0; font-weight: bold; color: #718096;">Name</td><td style="padding: 8px 0;">${data.name}</td></tr>
        <tr><td style="padding: 8px 0; font-weight: bold; color: #718096;">Email</td><td style="padding: 8px 0;"><a href="mailto:${data.email}">${data.email}</a></td></tr>
        ${data.phone ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #718096;">Phone</td><td style="padding: 8px 0;"><a href="tel:${data.phone}">${data.phone}</a></td></tr>` : ''}
        ${data.eventType ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #718096;">Event Type</td><td style="padding: 8px 0;">${data.eventType}</td></tr>` : ''}
        ${data.eventDate ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #718096;">Event Date</td><td style="padding: 8px 0;">${data.eventDate}</td></tr>` : ''}
        ${data.guestCount ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #718096;">Guest Count</td><td style="padding: 8px 0;">${data.guestCount}</td></tr>` : ''}
        ${data.budget ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #718096;">Budget</td><td style="padding: 8px 0;">${data.budget}</td></tr>` : ''}
      </table>
      ${data.message ? `<div style="margin-top: 16px; padding: 16px; background: #F8F9FA; border-radius: 8px;"><strong style="color: #718096;">Message:</strong><p style="margin: 8px 0 0;">${data.message}</p></div>` : ''}
    </div>
  `
}

export function buildPaymentConfirmationEmail(data: {
  name: string
  amount: number
  paymentId: string
}): string {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1A1A2E; border-bottom: 2px solid #48BB78; padding-bottom: 12px;">
        Payment Confirmation
      </h2>
      <p>Dear ${data.name},</p>
      <p>Your booking deposit of <strong>\u20B9${(data.amount / 100).toLocaleString('en-IN')}</strong> has been received successfully.</p>
      <p style="color: #718096; font-size: 14px;">Payment ID: ${data.paymentId}</p>
      <p>We will reach out to you shortly to discuss your event details.</p>
      <p>Thank you for choosing us!</p>
    </div>
  `
}
