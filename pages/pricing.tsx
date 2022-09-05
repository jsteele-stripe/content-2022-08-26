import type { NextPage } from 'next'

import Script from 'next/script'

import * as React from 'react'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'stripe-pricing-table': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >
    }
  }
}

export default function Pricing({}: NextPage) {
  return (
    <React.Fragment>
      <Script src="https://js.stripe.com/v3/pricing-table.js" />
      <stripe-pricing-table
        pricing-table-id="prctbl_1Lb3VZJdtANbrb1IHoGDnvd6"
        publishable-key={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}
      />
    </React.Fragment>
  )
}
