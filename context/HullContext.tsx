"use client"
import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { OffsetData } from "../lib/types"
import { SAMPLE_PATROL_CRAFT } from "../lib/sampleData"

interface HullContextType {
  data: OffsetData
  setData: (d: OffsetData) => void
}

const HullContext = createContext<HullContextType>({
  data: SAMPLE_PATROL_CRAFT,
  setData: () => {},
})

export function HullProvider({ children }: { children: ReactNode }) {
  const [data, setDataState] = useState<OffsetData>(SAMPLE_PATROL_CRAFT)
  const [loaded, setLoaded] = useState(false)

  // Restore from localStorage on first mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("offsetcalc-hull")
      if (saved) {
        const parsed = JSON.parse(saved) as OffsetData
        // Basic validation before restoring
        if (parsed?.vessel && parsed?.stations?.length && parsed?.halfBreadths?.length) {
          setDataState(parsed)
        }
      }
    } catch { /* ignore corrupt data */ }
    setLoaded(true)
  }, [])

  // Persist every change
  useEffect(() => {
    if (!loaded) return
    try { localStorage.setItem("offsetcalc-hull", JSON.stringify(data)) } catch { /* quota */ }
  }, [data, loaded])

  function setData(d: OffsetData) { setDataState(d) }

  return (
    <HullContext.Provider value={{ data, setData }}>
      {children}
    </HullContext.Provider>
  )
}

export function useHull() {
  return useContext(HullContext)
}
