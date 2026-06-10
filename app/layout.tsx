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
          <main style={{ minHeight: "calc(100vh - var(--nav-h) - 48px)" }}>
            {children}
          </main>
          <footer style={{
            height: 48,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderTop: "1px solid rgba(146,141,171,0.22)",
            background: "#210e07",
            gap: 16,
          }}>
            <span style={{
              fontSize: 12,
              fontFamily: "Arial, sans-serif",
              color: "var(--text-muted)",
              letterSpacing: "0.03em",
            }}>
              © {new Date().getFullYear()} OffsetCalc — Designed &amp; Built by{" "}
              <span style={{
                background: "linear-gradient(to right, #e05555, #f5e6e0)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontWeight: 600,
              }}>Suji Kumar</span>
            </span>
          </footer>
        </HullProvider>
      </body>
    </html>
  )
}
