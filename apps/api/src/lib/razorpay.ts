import type { Env } from '../index'

const RAZORPAY_API = 'https://api.razorpay.com/v1'

interface CreateOrderParams {
  amount: number  // in paise
  currency?: string
  receipt?: string
  notes?: Record<string, string>
}

interface RazorpayOrder {
  id: string
  entity: string
  amount: number
  currency: string
  receipt: string
  status: string
  created_at: number
}

export async function createOrder(
  env: Env,
  params: CreateOrderParams,
): Promise<RazorpayOrder> {
  const auth = btoa(`${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`)

  const response = await fetch(`${RAZORPAY_API}/orders`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: params.amount,
      currency: params.currency || 'INR',
      receipt: params.receipt || `rcpt_${Date.now()}`,
      notes: params.notes || {},
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Razorpay order creation failed: ${errorText}`)
  }

  return response.json() as Promise<RazorpayOrder>
}

export async function verifyWebhookSignature(
  rawBody: string,
  signature: string,
  secret: string,
): Promise<boolean> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )

  const signatureBuffer = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(rawBody),
  )

  const computedSignature = Array.from(new Uint8Array(signatureBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')

  return computedSignature === signature
}
