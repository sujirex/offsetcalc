"use client"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Anchor, Table2, Layers, Box, Calculator, BookOpen, Menu, X } from "lucide-react"

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

  return (
    <nav style={{
      height: "var(--nav-h)",
      background: "rgba(6,16,31,0.96)",
      borderBottom: "1px solid var(--border)",
      backdropFilter: "blur(16px)",
      position: "sticky", top: 0, zIndex: 50,
      display: "flex", alignItems: "center",
    }}>
      <div style={{ maxWidth: 1200, width: "100%", margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", gap: 8 }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10, flexShrink: 0, marginRight: 16 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: "linear-gradient(135deg,#0066aa,#00b4dc)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Anchor size={16} color="#fff" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)", lineHeight: 1.1 }}>OffsetCalc</div>
            <div style={{ fontSize: "0.6rem", color: "var(--cyan)", letterSpacing: "0.1em", lineHeight: 1 }}>HULL DESIGN TOOL</div>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="nav-desktop" style={{ display: "flex", gap: 2, flex: 1 }}>
          {LINKS.map(({ href, label, icon: Icon }) => {
            const active = path === href || path.startsWith(href + "/")
            return (
              <Link key={href} href={href} style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "6px 12px", borderRadius: "var(--radius-sm)",
                textDecoration: "none", fontSize: 13, fontWeight: 500,
                color: active ? "var(--cyan)" : "var(--text-secondary)",
                background: active ? "var(--cyan-dim)" : "transparent",
                transition: "all .12s",
              }}>
                <Icon size={14} />
                {label}
              </Link>
            )
          })}
        </div>

        {/* Mobile hamburger */}
        <button
          className="nav-mob-btn"
          onClick={() => setOpen(o => !o)}
          style={{
            display: "none", marginLeft: "auto",
            background: "none", border: "1px solid var(--border)",
            borderRadius: "var(--radius-sm)", padding: "6px 10px",
            cursor: "pointer", color: "var(--text-primary)",
          }}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div style={{
          position: "absolute", top: "var(--nav-h)", left: 0, right: 0,
          background: "rgba(6,16,31,0.98)", borderBottom: "1px solid var(--border)",
          padding: "8px 16px 12px", zIndex: 49,
        }}>
          {LINKS.map(({ href, label, icon: Icon }) => {
            const active = path === href
            return (
              <Link key={href} href={href} onClick={() => setOpen(false)} style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "10px 12px", borderRadius: "var(--radius-sm)", marginBottom: 4,
                textDecoration: "none", fontSize: 14, fontWeight: 500,
                color: active ? "var(--cyan)" : "var(--text-secondary)",
                background: active ? "var(--cyan-dim)" : "transparent",
              }}>
                <Icon size={16} /> {label}
              </Link>
            )
          })}
        </div>
      )}

      <style>{`
        @media (max-width: 700px) {
          .nav-desktop { display: none !important; }
          .nav-mob-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  )
}
