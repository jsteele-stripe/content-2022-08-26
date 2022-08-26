import type { GetStaticProps, NextPage } from 'next'
import React from 'react'
import Stripe from 'stripe'

type NextPageWithProducts<P = {}, IP = P> = NextPage<P, IP> & {
  products: [Stripe.Product]
}

export async function getStaticProps({}: GetStaticProps) {
  const products = await (
    await fetch('http://localhost:3000/api/stripe/products/list')
  ).json()

  return {
    props: {
      products: products.data
    }
  }
}

export default function Index({ products }: NextPageWithProducts) {
  const [customerEmail, setCustomerEmail] =
    React.useState<string>('4242@stripe.com')

  const priceCheckout = async ({ price }: { price: string }) => {
    try {
      const checkoutSession: Stripe.Checkout.Session = await (
        await fetch('/api/stripe/checkout/sessions/create', {
          method: 'POST',
          headers: new Headers({
            'Content-Type': 'application/json'
          }),
          body: JSON.stringify({
            cancel_url: window.location.href,
            ...(customerEmail && { customer_email: customerEmail }),
            price,
            success_url: window.location.href
          })
        })
      ).json()

      window.location.assign(checkoutSession.url)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <React.Fragment>
      <input
        value={customerEmail}
        onChange={(e) => setCustomerEmail(e.target.value)}
        type="email"
      />
      {products.map((product) => {
        const price: string = (product.default_price as Stripe.Price).id

        return <button onClick={() => priceCheckout({ price })}>Buy</button>
      })}
    </React.Fragment>
  )
}
