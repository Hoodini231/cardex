import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import './globals.css'

import { ThemeProviderWrapper } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Pokémon Card Collection",
  description: "Browse and collect Pokémon cards",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProviderWrapper>
          {children}
        </ThemeProviderWrapper>
      </body>
    </html>
  )
}

