"use client"
import { createContext, useContext, useState, useEffect, ReactNode } from "react"

type Theme = "dark" | "light"
interface ThemeContextType { theme: Theme; toggle: () => void }

const ThemeContext = createContext<ThemeContextType>({ theme: "dark", toggle: () => {} })

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark")

  useEffect(() => {
    const saved = (localStorage.getItem("offsetcalc-theme") as Theme) ?? "dark"
    setTheme(saved)
    document.documentElement.setAttribute("data-theme", saved)
  }, [])

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark"
    setTheme(next)
    localStorage.setItem("offsetcalc-theme", next)
    document.documentElement.setAttribute("data-theme", next)
  }

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
