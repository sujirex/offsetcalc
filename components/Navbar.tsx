"use client"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Anchor, Table2, Layers, Box, Calculator, BookOpen, Menu, X, Sun, Moon } from "lucide-react"
import { useTheme } from "../context/ThemeContext"

const LINKS = [
  { href: "/offset-table", label: "Offset Table",  icon: Table2 },
  { href: "/lines-plan",   label: "Lines Plan",     icon: Layers },
  { href: "/hull-3d",      label: "3D Hull",        icon: Box },
  { href: "/hydrostatics", label: "Hydrostatics",   icon: Calculator },
  { href: "/learn",        label: "Learn",          icon: BookOpen },
]

export function Navbar() {
  const path = usePathname()
  const [open, setOpen] = useState(false)
  const { theme, toggle } = useTheme()

  return (
    <nav style={{
      height: "var(--nav-h)",
      background: "rgba(25,10,5,0.97)",
      borderBottom: "1px solid rgba(135,0,0,0.4)",
      backdropFilter: "blur(16px)",
      position: "sticky", top: 0, zIndex: 50,
      display: "flex", alignItems: "center",
    }}>
      <div style={{
        maxWidth: 1200, width: "100%", margin: "0 auto",
        padding: "0 20px", display: "flex", alignItems: "center", gap: 8,
      }}>

        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10, flexShrink: 0, marginRight: 16 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: "linear-gradient(135deg, #870000, #190a05)",
            border: "1px solid rgba(135,0,0,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Anchor size={16} color="#eeeaf6" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#f5e6e0", lineHeight: 1.1, fontFamily: "Arial, sans-serif" }}>OffsetCalc</div>
            <div style={{ fontSize: "0.6rem", color: "#e05555", letterSpacing: "0.1em", lineHeight: 1, fontFamily: "Arial, sans-serif" }}>HULL DESIGN TOOL</div>
          </div>
        </Link>

        {/* Desktop nav links */}
        <div className="nav-desktop" style={{ display: "flex", gap: 2, flex: 1 }}>
          {LINKS.map(({ href, label, icon: Icon }) => {
            const active = path === href || path.startsWith(href + "/")
            return (
              <Link key={href} href={href} style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "6px 12px", borderRadius: "var(--radius-sm)",
                textDecoration: "none",
                fontSize: 12,
                fontWeight: 500,
                fontFamily: "Arial, Helvetica, sans-serif",
                color: active ? "#f5e6e0" : "#c4918a",
                background: active ? "rgba(135,0,0,0.15)" : "transparent",
                borderBottom: active ? "2px solid #870000" : "2px solid transparent",
                transition: "all .12s",
              }}>
                <Icon size={13} />
                {label}
              </Link>
            )
          })}
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggle}
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          style={{
            background: "none", border: "1px solid var(--border)",
            borderRadius: "var(--radius-sm)", padding: "6px 8px",
            cursor: "pointer", color: "var(--text-secondary)",
            display: "flex", alignItems: "center",
            transition: "border-color .15s",
            flexShrink: 0,
          }}
        >
          {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        {/* Built by — desktop only */}
        <div className="nav-built" style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0, marginLeft: 8 }}>
          <span style={{ fontSize: 11, color: "rgba(196,145,138,0.5)", fontFamily: "Arial, sans-serif" }}>Built by</span>
          <span style={{
            fontSize: 12, fontWeight: 600,
            fontFamily: "Arial, sans-serif",
            background: "linear-gradient(to right, #e05555, #f5e6e0)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>Suji Kumar</span>
        </div>

        {/* Mobile hamburger */}
        <button
          className="nav-mob-btn"
          onClick={() => setOpen(o => !o)}
          style={{
            display: "none", marginLeft: "auto",
            background: "none", border: "1px solid rgba(146,141,171,0.3)",
            borderRadius: "var(--radius-sm)", padding: "6px 10px",
            cursor: "pointer", color: "#eeeaf6",
          }}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div style={{
          position: "absolute", top: "var(--nav-h)", left: 0, right: 0,
          background: "rgba(31,28,44,0.99)",
          borderBottom: "1px solid rgba(146,141,171,0.22)",
          padding: "8px 16px 16px", zIndex: 49,
        }}>
          {LINKS.map(({ href, label, icon: Icon }) => {
            const active = path === href
            return (
              <Link key={href} href={href} onClick={() => setOpen(false)} style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "10px 12px", borderRadius: "var(--radius-sm)", marginBottom: 4,
                textDecoration: "none", fontSize: 13, fontWeight: 500,
                fontFamily: "Arial, Helvetica, sans-serif",
                color: active ? "#f5e6e0" : "#c4918a",
                background: active ? "rgba(135,0,0,0.12)" : "transparent",
              }}>
                <Icon size={15} /> {label}
              </Link>
            )
          })}
          <div style={{ borderTop: "1px solid rgba(146,141,171,0.15)", marginTop: 8, paddingTop: 10, fontSize: 11, color: "rgba(146,141,171,0.5)", fontFamily: "Arial, sans-serif", textAlign: "center" }}>
            Built by <span style={{ color: "#928DAB", fontWeight: 600 }}>Suji Kumar</span>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 700px) {
          .nav-desktop { display: none !important; }
          .nav-built   { display: none !important; }
          .nav-mob-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  )
}
