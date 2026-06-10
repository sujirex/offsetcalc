import { OffsetData } from "./types"

// Sample: 40m Patrol Craft — realistic hull form
// Stations 0 (AP) to 10 (FP), 11 stations
// Waterlines: 0.0, 0.5, 1.0, 1.5, 2.0, 2.5 m above baseline
// Half-breadths in metres from centreline
// Cb ≈ 0.55, Beam = 7.2m, LBP = 40m, Draft = 2.0m

export const SAMPLE_PATROL_CRAFT: OffsetData = {
  vessel: {
    name: "Patrol Craft 40",
    lbp: 40,
    beam: 7.2,
    depth: 3.4,
    draft: 2.0,
    stationCount: 11,
  },
  stations: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  waterlines: [0.0, 0.5, 1.0, 1.5, 2.0, 2.5],
  // [station 0..10][waterline 0..5]
  halfBreadths: [
    // Stn 0 — AP (stern)
    [0.40, 1.20, 1.80, 2.20, 2.50, 2.65],
    // Stn 1
    [0.80, 1.90, 2.60, 3.00, 3.25, 3.40],
    // Stn 2
    [1.30, 2.50, 3.10, 3.45, 3.55, 3.60],
    // Stn 3
    [1.70, 2.95, 3.45, 3.55, 3.60, 3.60],
    // Stn 4
    [1.95, 3.20, 3.55, 3.60, 3.60, 3.60],
    // Stn 5 — Midship
    [2.10, 3.35, 3.58, 3.60, 3.60, 3.60],
    // Stn 6
    [2.05, 3.30, 3.55, 3.58, 3.60, 3.60],
    // Stn 7
    [1.80, 3.05, 3.40, 3.50, 3.55, 3.58],
    // Stn 8
    [1.35, 2.60, 3.05, 3.25, 3.38, 3.45],
    // Stn 9
    [0.65, 1.70, 2.25, 2.60, 2.80, 2.95],
    // Stn 10 — FP (bow)
    [0.05, 0.35, 0.70, 1.05, 1.35, 1.60],
  ],
}

// Sample: Indian IWT River Barge — typical Ganga/Brahmaputra inland waterway vessel
// Flat-bottomed, near-rectangular, Cb ≈ 0.87
export const SAMPLE_IWT_BARGE: OffsetData = {
  vessel: {
    name: "IWT River Barge",
    lbp: 55,
    beam: 10.5,
    depth: 2.8,
    draft: 1.8,
    stationCount: 11,
  },
  stations: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  waterlines: [0.0, 0.4, 0.8, 1.2, 1.6, 2.0],
  // Flat-bottomed with raked bow and rounded stern — typical Indian river barge
  halfBreadths: [
    // Stn 0 — AP (stern, rounded)
    [1.50, 3.20, 4.40, 4.90, 5.10, 5.20],
    // Stn 1
    [3.50, 4.60, 5.00, 5.15, 5.20, 5.22],
    // Stn 2
    [4.60, 5.00, 5.15, 5.20, 5.22, 5.25],
    // Stn 3
    [5.00, 5.15, 5.20, 5.24, 5.25, 5.25],
    // Stn 4
    [5.15, 5.22, 5.24, 5.25, 5.25, 5.25],
    // Stn 5 — Midship (fully rectangular)
    [5.25, 5.25, 5.25, 5.25, 5.25, 5.25],
    // Stn 6
    [5.15, 5.22, 5.24, 5.25, 5.25, 5.25],
    // Stn 7
    [4.90, 5.10, 5.18, 5.22, 5.24, 5.25],
    // Stn 8
    [4.20, 4.80, 5.00, 5.10, 5.15, 5.18],
    // Stn 9
    [2.80, 3.80, 4.30, 4.65, 4.80, 4.90],
    // Stn 10 — FP (bow, raked)
    [0.30, 0.90, 1.80, 2.60, 3.20, 3.70],
  ],
}

// Sample: Simple Barge — uniform hull, easy for learning
export const SAMPLE_BARGE: OffsetData = {
  vessel: {
    name: "Box Barge 30",
    lbp: 30,
    beam: 8.0,
    depth: 2.5,
    draft: 1.5,
    stationCount: 11,
  },
  stations: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  waterlines: [0.0, 0.5, 1.0, 1.5, 2.0, 2.5],
  halfBreadths: [
    // Barge: nearly rectangular cross-section with rounded ends
    [1.00, 2.80, 3.60, 3.90, 3.95, 4.00],
    [2.50, 3.50, 3.85, 3.95, 3.98, 4.00],
    [3.50, 3.90, 3.95, 3.98, 4.00, 4.00],
    [3.90, 3.95, 3.98, 4.00, 4.00, 4.00],
    [3.98, 3.99, 4.00, 4.00, 4.00, 4.00],
    [4.00, 4.00, 4.00, 4.00, 4.00, 4.00],
    [3.98, 3.99, 4.00, 4.00, 4.00, 4.00],
    [3.90, 3.95, 3.98, 4.00, 4.00, 4.00],
    [3.50, 3.90, 3.95, 3.98, 4.00, 4.00],
    [2.50, 3.50, 3.85, 3.95, 3.98, 4.00],
    [1.00, 2.80, 3.60, 3.90, 3.95, 4.00],
  ],
}
