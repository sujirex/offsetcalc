"use client"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Table2, Layers, Box, Calculator, BookOpen, Menu, X, Sun, Moon } from "lucide-react"
import { useTheme } from "../context/ThemeContext"

const LINKS = [
  { href: "/offset-table", label: "Offset Table",  icon: Table2 },
  { href: "/lines-plan",   label: "Lines Plan",     icon: Layers },
  { href: "/hull-3d",      label: "3D Hull",        icon: Box },
  { href: "/hydrostatics", label: "Hydrostatics",   icon: Calculator },
  { href: "/learn",        label: "Learn",          icon: BookOpen },
]

export function Navbar() {
  const path = usePathname() || "/"
  const [open, setOpen] = useState(false)
  const { theme, toggle } = useTheme()
  const isActive = (href: string) => path === href || path === href + "/" || path.startsWith(href + "/")

  return (
    <div className="nav-wrap">
      <nav className="nav" aria-label="Main">
        <Link href="/" className="nav-brand" onClick={() => setOpen(false)}>
          <img src="/ss-emblem.svg" alt="SS emblem" width={36} height={36} />
          <span>
            <b>OffsetCalc</b>
            <small>Hull design tool</small>
          </span>
        </Link>

        <div className="nav-links">
          {LINKS.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className={`nav-link${isActive(href) ? " active" : ""}`} aria-current={isActive(href) ? "page" : undefined}>
              <Icon size={14} />
              {label}
            </Link>
          ))}
        </div>

        <button
          type="button"
          className="icon-btn"
          onClick={toggle}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          style={{ marginLeft: "auto" }}
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <button
          type="button"
          className="icon-btn nav-mob-btn"
          onClick={() => setOpen(o => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          style={{ marginLeft: 0 }}
        >
          {open ? <X size={17} /> : <Menu size={17} />}
        </button>
      </nav>

      {open && (
        <div className="nav-menu">
          {LINKS.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} onClick={() => setOpen(false)} className={`nav-link${isActive(href) ? " active" : ""}`}>
              <Icon size={16} /> {label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
