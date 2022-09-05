import type { GetStaticProps, NextPage } from 'next'

import * as React from 'react'
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
      <label className="block">
        <span className="text-gray-700">Customer email</span>
        <input
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
          type="email"
          className="mt-1 block w-full"
        />
      </label>
      <div className="mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
        <ul
          role="list"
          className="grid gap-x-4 gap-y-8 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 xl:gap-x-8"
        >
          {products.map((product) => {
            const price = product.default_price as Stripe.Price

            return price ? (
              <li key={product.id} className="relative">
                <div className="aspect-w-10 aspect-h-7 group block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
                  <img
                    src={product.images[0]}
                    className="pointer-events-none object-cover group-hover:opacity-75"
                  />
                </div>
                <p className="pointer-events-none mt-2 block truncate text-sm font-medium text-gray-900">
                  {product.name}
                </p>
                <p className="pointer-events-none block text-sm font-medium text-gray-500">
                  {new Intl.NumberFormat('en-GB', {
                    style: 'currency',
                    currency: price.currency,
                    maximumFractionDigits: 0,
                    minimumFractionDigits: 0
                  }).format(price.unit_amount / 100)}
                </p>
                <button onClick={() => priceCheckout({ price: price.id })}>
                  Buy now
                </button>
              </li>
            ) : null
          })}
        </ul>
      </div>
    </React.Fragment>
  )
}
