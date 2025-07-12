import React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Fuel Expense Tracker",
  description: "Track your travel fuel costs with a beautiful glassmorphic interface",
  generator: "v0.dev",
  themeColor: "#0f172a",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/Untitled-192.png" />
        <meta name="theme-color" content="#0f172a" />
        <link rel="apple-touch-icon" href="/Untitled-192.png" />
      </head>
      <body className={`${inter.className} min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0e7490]`}>
        <div className="min-h-screen backdrop-blur-sm">{children}</div>
      </body>
    </html>
  )
}
