import React, { type PropsWithChildren } from 'react'
import type { Viewport, Metadata } from 'next'
import { Hanzo } from '@hanzo/ui'

// The Hanzo theme: every design token the components read. A real stylesheet
// the package ships, so nothing generates CSS at build time.
import '@hanzo/ui/theme.css'
// The atomic rules gui compiles its style props against. <Hanzo> imports this
// itself, but a bundler that will not follow a CSS import out of node_modules
// drops it silently — an unstyled page behind a green build.
import '@hanzo/ui/styles.css'
import './globals.css'

export const metadata: Metadata = {
  title: 'cdn - LUX',
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang='en' className='dark'>
      <body>
          {/* gui needs its config in context before anything mounts. */}
          <Hanzo theme="dark">{children}</Hanzo>
        </body>
    </html>
  )
}
