import React from 'react'
import { Box } from '@hanzo/ui'

export default function Page() {
  return (
    <Box className="grid place-items-center min-h-screen p-8">
      <Box tag="h1" className="text-4xl font-bold mb-4">
        LUX cdn
      </Box>
      <Box tag="p" className="text-lg text-muted-foreground mb-8">
        Coming soon
      </Box>
      <Box
        tag="a"
        href="https://lux.network"
        className="px-6 py-3 bg-foreground text-background rounded-lg transition"
      >
        Learn More
      </Box>
    </Box>
  )
}
