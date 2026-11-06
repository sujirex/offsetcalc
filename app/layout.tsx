import type { Metadata, Viewport } from "next"
import localFont from "next/font/local"
import "./globals.css"
import { Navbar } from "../components/Navbar"
import { HullProvider } from "../context/HullContext"
import { ThemeProvider } from "../context/ThemeContext"

const geist = localFont({ src: "./fonts/Geist.woff2", variable: "--font-geist", weight: "100 900", display: "swap" })
const geistMono = localFont({ src: "./fonts/GeistMono.woff2", variable: "--font-geist-mono", weight: "100 900", display: "swap" })

export const metadata: Metadata = {
  title: "OffsetCalc — Hull Lines Plan & Offset Table",
  description: "Naval architecture tool for hull offset tables, lines plan visualisation, 3D hull view and hydrostatic calculations.",
  authors: [{ name: "Suji Kumar C", url: "https://sujikumar.com" }],
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FBFBFD" },
    { media: "(prefers-color-scheme: dark)", color: "#07080D" },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        {/* Saved choice wins, otherwise the device setting. Runs before first paint (no flash). */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){
            var t = null;
            try { t = localStorage.getItem('offsetcalc-theme'); } catch (e) {}
            if (t !== 'light' && t !== 'dark') t = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', t);
          })();
        `}} />
      </head>
      <body>
        <ThemeProvider>
          <HullProvider>
            <Navbar />
            <main style={{ flex: 1 }}>
              {children}
            </main>
            <footer className="site-footer">
              <a className="credit" href="https://sujikumar.com/" rel="author" title="Built by Suji Kumar C — Digital Maritime Engineer">
                <img src="/ss-emblem.svg" alt="" width={20} height={20} />
                <span>© {new Date().getFullYear()} OffsetCalc · Built by <b>Suji Kumar C</b> · sujikumar.com</span>
              </a>
            </footer>
          </HullProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
