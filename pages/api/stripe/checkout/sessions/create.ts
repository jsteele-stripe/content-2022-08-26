import type { NextApiRequest, NextApiResponse } from 'next'
import type { Stripe } from 'stripe'

import stripe from '@/lib/stripe'

export default async function (
  req: NextApiRequest,
  res: NextApiResponse<Stripe.Checkout.Session | { message: any }>
) {
  try {
    const {
      cancel_url,
      customer_email,
      price,
      success_url
    }: {
      cancel_url: string
      customer_email?: string
      price: string
      success_url: string
    } = req.body

    const params: Stripe.Checkout.SessionCreateParams = {
      cancel_url,
      ...(customer_email && { customer_email }),
      line_items: [
        {
          adjustable_quantity: { enabled: true, minimum: 1 },
          price,
          quantity: 1
        }
      ],
      mode: 'payment',
      success_url
    }

    const checkoutSession: Stripe.Checkout.Session =
      await stripe.checkout.sessions.create(params)

    res.status(201).json(checkoutSession)
  } catch (error) {
    console.log(error)

    res.status(400).json({ message: error.message })
  }
}
