export interface VesselDimensions {
  name: string
  lbp: number       // Length between perpendiculars (m)
  beam: number      // Moulded beam (m)
  depth: number     // Moulded depth (m)
  draft: number     // Design draft (m)
  stationCount: number  // number of stations (e.g. 11 = stations 0..10)
}

// halfBreadths[stationIndex][wlIndex] = half-breadth in metres from centreline
// waterlines[wlIndex] = height above baseline in metres
// stations[stationIndex] = station number (0 = AP, max = FP)
export interface OffsetData {
  vessel: VesselDimensions
  stations: number[]      // e.g. [0,1,2,...,10]
  waterlines: number[]    // e.g. [0, 0.5, 1.0, 1.5, 2.0, 2.5]
  halfBreadths: number[][] // [station][waterline]
}

export interface Hydrostatics {
  waterplaneArea: number      // m²
  displacedVolume: number     // m³
  displacement: number        // tonnes (salt water 1.025 t/m³)
  lcb: number                 // m from AP
  lcf: number                 // m from AP
  cb: number                  // Block coefficient
  cw: number                  // Waterplane coefficient
  cm: number                  // Midship section coefficient
  cp: number                  // Prismatic coefficient
  kb: number                  // Height of B above keel (m)
  bm: number                  // BM (m)
  km: number                  // KM (m)
  sectionAreas: number[]      // Sectional area at each station (m²)
}
