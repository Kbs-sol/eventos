import { Hono } from 'hono'
import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'
import type { Env } from '../index'
import config from '@eventos/config'
import { createOrder, verifyWebhookSignature } from '../lib/razorpay'
import { sendEmail, buildPaymentConfirmationEmail } from '../lib/resend'

export const razorpayRoutes = new Hono<{ Bindings: Env }>()

// POST /create-order — create a Razorpay order
const createOrderSchema = z.object({
  enquiryId: z.string().uuid(),
})

razorpayRoutes.post('/create-order', async (c) => {
  if (!config.features.razorpay.enabled) {
    return c.json({ error: 'Payments are not enabled' }, 400)
  }

  const body = await c.req.json()
  const parsed = createOrderSchema.safeParse(body)
  if (!parsed.success) return c.json({ error: 'Validation failed', details: parsed.error.flatten() }, 400)

  try {
    const amount = config.features.razorpay.depositAmount * 100 // Convert to paise

    const order = await createOrder(c.env, {
      amount,
      currency: 'INR',
      receipt: `enq_${parsed.data.enquiryId.slice(0, 8)}`,
      notes: {
        enquiry_id: parsed.data.enquiryId,
        type: config.features.razorpay.depositLabel,
      },
    })

    // Create booking record
    const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY)
    await supabase
      .from('bookings')
      .insert({
        enquiry_id: parsed.data.enquiryId,
        razorpay_order_id: order.id,
        amount_paise: amount,
        status: 'pending',
      })

    return c.json({
      orderId: order.id,
      amount,
      currency: 'INR',
      keyId: c.env.RAZORPAY_KEY_ID,
    })
  } catch (error) {
    console.error('Razorpay order creation failed:', error)
    return c.json({ error: 'Failed to create payment order' }, 500)
  }
})

// POST /webhook — handle Razorpay webhooks
razorpayRoutes.post('/webhook', async (c) => {
  const rawBody = await c.req.text()
  const signature = c.req.header('x-razorpay-signature') || ''

  const isValid = await verifyWebhookSignature(
    rawBody,
    signature,
    c.env.RAZORPAY_WEBHOOK_SECRET,
  )

  if (!isValid) {
    return c.json({ error: 'Invalid signature' }, 400)
  }

  const event = JSON.parse(rawBody) as {
    event: string
    payload: {
      payment: {
        entity: {
          id: string
          order_id: string
          amount: number
          notes?: { enquiry_id?: string }
        }
      }
    }
  }

  if (event.event === 'payment.captured') {
    const payment = event.payload.payment.entity
    const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY)

    // Update booking status
    const { data: booking } = await supabase
      .from('bookings')
      .update({
        razorpay_payment_id: payment.id,
        status: 'paid',
      })
      .eq('razorpay_order_id', payment.order_id)
      .select()
      .single()

    // Get enquiry for email
    if (booking?.enquiry_id) {
      const { data: enquiry } = await supabase
        .from('contact_enquiries')
        .select('name, email')
        .eq('id', booking.enquiry_id)
        .single()

      if (enquiry) {
        // Send confirmation to client
        sendEmail(c.env, {
          to: enquiry.email,
          subject: 'Payment Confirmation - Booking Deposit',
          html: buildPaymentConfirmationEmail({
            name: enquiry.name,
            amount: payment.amount,
            paymentId: payment.id,
          }),
        }).catch((err) => console.error('Payment email failed:', err))

        // Notify admin
        sendEmail(c.env, {
          to: c.env.CONTACT_EMAIL,
          subject: `Payment Received from ${enquiry.name}`,
          html: `<p>Payment of \u20B9${(payment.amount / 100).toLocaleString('en-IN')} received.</p><p>Payment ID: ${payment.id}</p>`,
        }).catch((err) => console.error('Admin notification failed:', err))
      }
    }
  }

  return c.json({ received: true })
})
