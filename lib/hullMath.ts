import { OffsetData, Hydrostatics } from "./types"

// Simpson's 1/3 rule integration over an array of evenly-spaced values
export function simpsons(values: number[], spacing: number): number {
  const n = values.length
  if (n < 2) return 0
  if (n === 2) return (spacing / 2) * (values[0] + values[1])
  // Ensure odd count for pure Simpson's; fall back to trapezoidal for last pair
  let sum = values[0] + values[n - 1]
  for (let i = 1; i < n - 1; i++) {
    sum += (i % 2 === 0 ? 2 : 4) * values[i]
  }
  return (spacing / 3) * sum
}

// Sectional area at a given station using Simpson's rule over waterlines
// halfBreadths: array of half-breadths at each waterline for this station
// waterlines: heights above baseline
export function sectionArea(halfBreadths: number[], waterlines: number[]): number {
  if (waterlines.length < 2) return 0
  const spacing = waterlines[1] - waterlines[0]
  // Area = 2 × ∫ y dz (multiply by 2 for both sides)
  return 2 * simpsons(halfBreadths, spacing)
}

// Waterplane area at a given waterline index
// halfBreadths: [station][waterline]
// stations: station positions in metres from AP
export function waterplaneArea(
  halfBreadths: number[][],
  stations: number[],
  wlIndex: number,
  lbp: number
): number {
  const yValues = halfBreadths.map(sb => sb[wlIndex] ?? 0)
  const stationSpacing = lbp / (stations.length - 1)
  return 2 * simpsons(yValues, stationSpacing)
}

// Displaced volume up to a given draft using all waterlines ≤ draft
export function displacedVolume(data: OffsetData): number {
  const { halfBreadths, stations, waterlines, vessel } = data
  const lbp = vessel.lbp
  const draft = vessel.draft
  const stationSpacing = lbp / (stations.length - 1)

  // For each station: integrate half-breadths over waterlines up to draft
  const sectionAreas = stations.map((_, si) => {
    const hb = halfBreadths[si]
    // Only include waterlines up to draft
    const wls = waterlines.filter(wl => wl <= draft + 0.001)
    const hbSlice = hb.slice(0, wls.length)
    const wlSpacing = wls.length > 1 ? wls[1] - wls[0] : draft
    return 2 * simpsons(hbSlice, wlSpacing)
  })

  return simpsons(sectionAreas, stationSpacing)
}

// LCB — longitudinal centre of buoyancy from AP
export function lcb(data: OffsetData): number {
  const { halfBreadths, stations, waterlines, vessel } = data
  const lbp = vessel.lbp
  const draft = vessel.draft
  const stationSpacing = lbp / (stations.length - 1)

  const sectionAreas = stations.map((_, si) => {
    const hb = halfBreadths[si]
    const wls = waterlines.filter(wl => wl <= draft + 0.001)
    const hbSlice = hb.slice(0, wls.length)
    const wlSpacing = wls.length > 1 ? wls[1] - wls[0] : draft
    return 2 * simpsons(hbSlice, wlSpacing)
  })

  // x positions from AP (station 0 = AP, station N = FP)
  const xPositions = stations.map(s => (s / (stations.length - 1)) * lbp)

  const momentValues = sectionAreas.map((a, i) => a * xPositions[i])
  const totalMoment = simpsons(momentValues, stationSpacing)
  const vol = simpsons(sectionAreas, stationSpacing)

  return vol > 0 ? totalMoment / vol : lbp / 2
}

// LCF — longitudinal centre of flotation from AP (at design draft waterline)
export function lcf(data: OffsetData): number {
  const { halfBreadths, stations, waterlines, vessel } = data
  const lbp = vessel.lbp
  const draft = vessel.draft
  const stationSpacing = lbp / (stations.length - 1)

  // Find waterline index closest to draft
  const wlIndex = waterlines.reduce((best, wl, i) =>
    Math.abs(wl - draft) < Math.abs(waterlines[best] - draft) ? i : best, 0)

  const yValues = halfBreadths.map(sb => sb[wlIndex] ?? 0)
  const xPositions = stations.map(s => (s / (stations.length - 1)) * lbp)

  const momentValues = yValues.map((y, i) => y * xPositions[i])
  const totalMoment = 2 * simpsons(momentValues, stationSpacing)
  const awp = 2 * simpsons(yValues, stationSpacing)

  return awp > 0 ? totalMoment / awp : lbp / 2
}

// Midship section area (station closest to midship)
export function midshipArea(data: OffsetData): number {
  const { halfBreadths, stations, waterlines, vessel } = data
  const draft = vessel.draft
  const midIdx = Math.floor(stations.length / 2)
  const hb = halfBreadths[midIdx]
  const wls = waterlines.filter(wl => wl <= draft + 0.001)
  const hbSlice = hb.slice(0, wls.length)
  const wlSpacing = wls.length > 1 ? wls[1] - wls[0] : draft
  return 2 * simpsons(hbSlice, wlSpacing)
}

// KB — height of centre of buoyancy above keel
export function kb(data: OffsetData): number {
  const { halfBreadths, stations, waterlines, vessel } = data
  const lbp = vessel.lbp
  const draft = vessel.draft
  const stationSpacing = lbp / (stations.length - 1)

  // For each waterline, compute waterplane area × waterline height
  const wls = waterlines.filter(wl => wl <= draft + 0.001)

  const wpAreas = wls.map((_, wi) => {
    const yVals = halfBreadths.map(sb => sb[wi] ?? 0)
    return 2 * simpsons(yVals, stationSpacing)
  })

  const wlSpacing = wls.length > 1 ? wls[1] - wls[0] : draft
  const momentValues = wpAreas.map((a, i) => a * wls[i])
  const totalMoment = simpsons(momentValues, wlSpacing)
  const vol = simpsons(wpAreas, wlSpacing)

  return vol > 0 ? totalMoment / vol : draft / 2
}

// BM — metacentric radius
export function bm(data: OffsetData): number {
  const { halfBreadths, stations, waterlines, vessel } = data
  const lbp = vessel.lbp
  const draft = vessel.draft
  const stationSpacing = lbp / (stations.length - 1)

  // Find waterline index closest to draft
  const wlIndex = waterlines.reduce((best, wl, i) =>
    Math.abs(wl - draft) < Math.abs(waterlines[best] - draft) ? i : best, 0)

  // Second moment of waterplane area about centreline (I_L)
  // I = 2/3 × ∫ y³ dx
  const y3Values = halfBreadths.map(sb => Math.pow(sb[wlIndex] ?? 0, 3))
  const il = (2 / 3) * simpsons(y3Values, stationSpacing)

  const vol = displacedVolume(data)
  return vol > 0 ? il / vol : 0
}

// Main hydrostatics calculator
export function calcHydrostatics(data: OffsetData): Hydrostatics {
  const { halfBreadths, stations, waterlines, vessel } = data
  const lbp = vessel.lbp
  const beam = vessel.beam
  const draft = vessel.draft
  const stationSpacing = lbp / (stations.length - 1)

  // Find design waterline index
  const dwlIndex = waterlines.reduce((best, wl, i) =>
    Math.abs(wl - draft) < Math.abs(waterlines[best] - draft) ? i : best, 0)

  const awp = waterplaneArea(halfBreadths, stations, dwlIndex, lbp)
  const vol = displacedVolume(data)
  const displacement = vol * 1.025

  const am = midshipArea(data)
  const kbVal = kb(data)
  const bmVal = bm(data)

  const sectionAreas = stations.map((_, si) => {
    const hb = halfBreadths[si]
    const wls = waterlines.filter(wl => wl <= draft + 0.001)
    const hbSlice = hb.slice(0, wls.length)
    const wlSpacing = wls.length > 1 ? wls[1] - wls[0] : draft
    return 2 * simpsons(hbSlice, wlSpacing)
  })

  const cb = (lbp * beam * draft) > 0 ? vol / (lbp * beam * draft) : 0
  const cw = (lbp * beam) > 0 ? awp / (lbp * beam) : 0
  const cm = (beam * draft) > 0 ? am / (beam * draft) : 0
  const cp = (am * lbp) > 0 ? vol / (am * lbp) : 0

  return {
    waterplaneArea: awp,
    displacedVolume: vol,
    displacement,
    lcb: lcb(data),
    lcf: lcf(data),
    cb,
    cw,
    cm,
    cp,
    kb: kbVal,
    bm: bmVal,
    km: kbVal + bmVal,
    sectionAreas,
  }
}
