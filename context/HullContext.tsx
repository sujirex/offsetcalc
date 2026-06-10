"use client"
import { createContext, useContext, useState, ReactNode } from "react"
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
  const [data, setData] = useState<OffsetData>(SAMPLE_PATROL_CRAFT)
  return (
    <HullContext.Provider value={{ data, setData }}>
      {children}
    </HullContext.Provider>
  )
}

export function useHull() {
  return useContext(HullContext)
}
