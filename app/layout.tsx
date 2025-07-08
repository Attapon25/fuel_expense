import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Fuel Expense Tracker",
  description: "Track your travel fuel costs with a beautiful glassmorphic interface",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0e7490]`}>

        <div className="min-h-screen backdrop-blur-sm">{children}</div>
      </body>
    </html>
  )
}
