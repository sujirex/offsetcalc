import type { Metadata } from "next"
import "./globals.css"
import { Navbar } from "../components/Navbar"
import { HullProvider } from "../context/HullContext"

export const metadata: Metadata = {
  title: "OffsetCalc — Hull Lines Plan & Offset Table",
  description: "Naval architecture tool for hull offset tables, lines plan visualisation, 3D hull view and hydrostatic calculations.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <HullProvider>
          <Navbar />
          <main style={{ minHeight: "calc(100vh - var(--nav-h))" }}>
            {children}
          </main>
        </HullProvider>
      </body>
    </html>
  )
}
