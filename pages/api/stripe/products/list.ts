import type { NextApiRequest, NextApiResponse } from 'next'
import type { Stripe } from 'stripe'

import stripe from '@/lib/stripe'

export default async function (
  req: NextApiRequest,
  res: NextApiResponse<Stripe.ApiList<Stripe.Product> | { message: any }>
) {
  try {
    const products: Stripe.ApiList<Stripe.Product> = await stripe.products.list(
      { active: true, expand: ['data.default_price'] }
    )

    res.status(200).json(products)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}
