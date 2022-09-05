import type { AppProps } from 'next/app'

import '../styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="max-w-xl mx-auto py-12 divide-y md:max-w-4xl">
      <Component {...pageProps} />
    </div>
  )
}
