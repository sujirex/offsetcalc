"use client"
import { useRef } from "react"
import { useHull } from "../../context/HullContext"
import { Printer, Info } from "lucide-react"

const PAD = 40
const W = 520
const H = 300

function scaleX(val: number, min: number, max: number, w: number) {
  return PAD + ((val - min) / (max - min)) * (w - PAD * 2)
}
function scaleY(val: number, min: number, max: number, h: number) {
  return h - PAD - ((val - min) / (max - min)) * (h - PAD * 2)
}

/* ══ Body Plan ══
   Forward stations (right half), aft stations (left half)
   X = half-breadth, Y = height above baseline */
function BodyPlan() {
  const { data } = useHull()
  const { halfBreadths, stations, waterlines, vessel } = data
  const maxHB = vessel.beam / 2
  const maxWL = Math.max(...waterlines)
  const midIdx = Math.floor(stations.length / 2)

  // Build paths for each station
  const stationPaths: { path: string; isFwd: boolean; st: number }[] = stations.map((st, si) => {
    const stIsFwd = si >= midIdx
    const points = waterlines.map((wl, wi) => {
      const hb = halfBreadths[si]?.[wi] ?? 0
      const x = stIsFwd
        ? scaleX(hb, 0, maxHB, W / 2) + W / 2   // right half (fwd)
        : scaleX(-hb, -maxHB, 0, W / 2)           // left half (aft, mirrored)
      const y = scaleY(wl, 0, vessel.depth, H)
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    const keel = `${(W / 2).toFixed(1)},${scaleY(0, 0, vessel.depth, H).toFixed(1)}`
    return {
      path: `M ${keel} L ${points.join(" L ")}`,
      isFwd: stIsFwd,
      st,
    }
  })

  // Waterline reference lines
  const wlLines = waterlines.map(wl => {
    const y = scaleY(wl, 0, vessel.depth, H)
    return { y, wl }
  })

  // Design draft line
  const draftY = scaleY(vessel.draft, 0, vessel.depth, H)
  const centreX = W / 2

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxWidth: W }}>
      {/* Grid: waterline horizontals */}
      {wlLines.map(({ y, wl }) => (
        <g key={wl}>
          <line x1={PAD} y1={y} x2={W - PAD} y2={y} stroke="rgba(0,180,220,.15)" strokeWidth="0.5" />
          <text x={PAD - 4} y={y + 3} textAnchor="end" fontSize="9" fill="#445870">{wl}m</text>
        </g>
      ))}

      {/* Design draft */}
      <line x1={PAD} y1={draftY} x2={W - PAD} y2={draftY} stroke="rgba(0,220,150,.4)" strokeWidth="1" strokeDasharray="4,3" />
      <text x={W - PAD + 2} y={draftY + 3} fontSize="8" fill="#00d4aa">DWL</text>

      {/* Centreline */}
      <line x1={centreX} y1={PAD / 2} x2={centreX} y2={H - PAD + 8} stroke="rgba(0,180,220,.3)" strokeWidth="0.8" strokeDasharray="6,3" />
      <text x={centreX} y={H - PAD + 18} textAnchor="middle" fontSize="9" fill="#445870">CL</text>

      {/* Baseline */}
      <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="rgba(0,180,220,.4)" strokeWidth="1" />
      <text x={PAD} y={H - PAD + 14} fontSize="8" fill="#445870">Base Line</text>

      {/* Station curves */}
      {stationPaths.map(({ path, isFwd, st }, i) => (
        <path
          key={i}
          d={path}
          fill="none"
          stroke={isFwd ? "#00b4dc" : "#667db6"}
          strokeWidth={st === stations[midIdx] ? 1.8 : 1.2}
          opacity={0.85}
        />
      ))}

      {/* Labels */}
      <text x={PAD + 4} y={PAD - 6} fontSize="9" fill="#667db6">← AFT BODY</text>
      <text x={W - PAD - 4} y={PAD - 6} fontSize="9" fill="#00b4dc" textAnchor="end">FWD BODY →</text>
      <text x={centreX} y={14} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#e4edf8">BODY PLAN</text>
    </svg>
  )
}

/* ══ Sheer Plan (Profile) ══
   X = length from AP, Y = height above baseline
   Shows waterlines as horizontal curves, baseline, deck */
function SheerPlan() {
  const { data } = useHull()
  const { halfBreadths, stations, waterlines, vessel } = data
  const n = stations.length - 1
  const stationSpacing = vessel.lbp / n

  // For sheer plan: waterlines appear as horizontal lines (they are horizontal by definition)
  // Buttock lines would show curvature — approximate from half-breadths
  // Show station verticals + waterline horizontals + outer profile

  const wlLines = waterlines.map(wl => {
    const y = scaleY(wl, 0, vessel.depth, H)
    return { y, wl }
  })

  // Station verticals
  const stationLines = stations.map((_, si) => {
    const x = scaleX(si * stationSpacing, 0, vessel.lbp, W)
    return x
  })

  const draftY = scaleY(vessel.draft, 0, vessel.depth, H)

  // Outer profile (deck edge): use max half-breadth at each station as proxy
  // In a real lines plan this would be the sheer strake
  // Here we just show deck height = vessel.depth
  const deckY = scaleY(vessel.depth, 0, vessel.depth, H)
  const baseY = scaleY(0, 0, vessel.depth, H)

  // AP and FP verticals
  const apX = stationLines[0]
  const fpX = stationLines[stationLines.length - 1]

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxWidth: W }}>
      {/* Waterline horizontals */}
      {wlLines.map(({ y, wl }) => (
        <g key={wl}>
          <line x1={apX} y1={y} x2={fpX} y2={y} stroke="rgba(0,180,220,.25)" strokeWidth="0.8" />
          <text x={apX - 4} y={y + 3} textAnchor="end" fontSize="9" fill="#445870">{wl}m</text>
        </g>
      ))}

      {/* Design draft */}
      <line x1={apX} y1={draftY} x2={fpX} y2={draftY} stroke="rgba(0,220,150,.5)" strokeWidth="1.2" strokeDasharray="5,3" />
      <text x={fpX + 3} y={draftY + 3} fontSize="8" fill="#00d4aa">DWL</text>

      {/* Station verticals */}
      {stationLines.map((x, si) => (
        <g key={si}>
          <line x1={x} y1={deckY - 4} x2={x} y2={baseY + 4} stroke="rgba(0,180,220,.18)" strokeWidth="0.6" />
          <text x={x} y={baseY + 14} textAnchor="middle" fontSize="8" fill="#445870">{stations[si]}</text>
        </g>
      ))}

      {/* Hull profile: baseline + deckline + AP + FP */}
      <line x1={apX} y1={baseY} x2={fpX} y2={baseY} stroke="#00b4dc" strokeWidth="1.5" />
      <line x1={apX} y1={deckY} x2={fpX} y2={deckY} stroke="#00b4dc" strokeWidth="1.5" />
      <line x1={apX} y1={deckY} x2={apX} y2={baseY} stroke="#00b4dc" strokeWidth="1.2" />
      <line x1={fpX} y1={deckY} x2={fpX} y2={baseY} stroke="#00b4dc" strokeWidth="1.2" />

      {/* Dimension labels */}
      <text x={apX} y={H - 8} fontSize="9" fill="#00b4dc" textAnchor="middle">AP</text>
      <text x={fpX} y={H - 8} fontSize="9" fill="#00b4dc" textAnchor="middle">FP</text>
      <text x={(apX + fpX) / 2} y={14} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#e4edf8">SHEER PLAN (PROFILE)</text>

      {/* LBP arrow */}
      <line x1={apX} y1={H - PAD / 2} x2={fpX} y2={H - PAD / 2} stroke="#445870" strokeWidth="0.8" markerEnd="url(#arr)" />
      <text x={(apX + fpX) / 2} y={H - PAD / 2 - 3} textAnchor="middle" fontSize="9" fill="#445870">LBP = {vessel.lbp}m</text>
    </svg>
  )
}

/* ══ Half-Breadth Plan (Plan View) ══
   X = length from AP, Y = half-breadth from CL
   Each waterline is a curve */
function HalfBreadthPlan() {
  const { data } = useHull()
  const { halfBreadths, stations, waterlines, vessel } = data
  const n = stations.length - 1
  const stationSpacing = vessel.lbp / n
  const maxHB = vessel.beam / 2

  const wlColors = ["#00b4dc", "#00c8dc", "#00d4aa", "#22c55e", "#f59e0b", "#ef4444"]

  // Waterline curves: for each WL, draw a polyline of (stationX, halfBreadthY)
  const wlPaths = waterlines.map((wl, wi) => {
    const points = stations.map((_, si) => {
      const x = scaleX(si * stationSpacing, 0, vessel.lbp, W)
      const hb = halfBreadths[si]?.[wi] ?? 0
      const y = scaleY(hb, 0, maxHB, H)
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    return { path: `M ${points.join(" L ")}`, wl, color: wlColors[wi % wlColors.length] }
  })

  const apX = scaleX(0, 0, vessel.lbp, W)
  const fpX = scaleX(vessel.lbp, 0, vessel.lbp, W)
  const clY = scaleY(0, 0, maxHB, H)  // centreline at bottom
  const maxY = scaleY(maxHB, 0, maxHB, H)

  // Station verticals
  const stationLines = stations.map((_, si) => scaleX(si * stationSpacing, 0, vessel.lbp, W))

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxWidth: W }}>
      {/* Station grid */}
      {stationLines.map((x, si) => (
        <g key={si}>
          <line x1={x} y1={PAD / 2} x2={x} y2={clY} stroke="rgba(0,180,220,.15)" strokeWidth="0.5" />
          <text x={x} y={clY + 12} textAnchor="middle" fontSize="8" fill="#445870">{stations[si]}</text>
        </g>
      ))}

      {/* Centreline */}
      <line x1={apX} y1={clY} x2={fpX} y2={clY} stroke="rgba(0,180,220,.35)" strokeWidth="0.8" strokeDasharray="5,3" />
      <text x={apX - 4} y={clY + 3} textAnchor="end" fontSize="9" fill="#445870">CL</text>

      {/* Max beam line */}
      <line x1={apX} y1={maxY} x2={fpX} y2={maxY} stroke="rgba(102,125,182,.2)" strokeWidth="0.5" strokeDasharray="3,3" />
      <text x={apX - 4} y={maxY + 3} textAnchor="end" fontSize="9" fill="#445870">{maxHB}m</text>

      {/* Waterline curves */}
      {wlPaths.map(({ path, wl, color }, i) => (
        <g key={i}>
          <path d={path} fill="none" stroke={color} strokeWidth="1.4" opacity="0.85" />
          <text x={fpX + 4} y={scaleY(halfBreadths[halfBreadths.length - 1]?.[i] ?? 0, 0, maxHB, H) + 3} fontSize="8" fill={color}>{wl}m</text>
        </g>
      ))}

      {/* AP / FP */}
      <line x1={apX} y1={PAD / 2} x2={apX} y2={clY} stroke="#00b4dc" strokeWidth="1.2" />
      <line x1={fpX} y1={PAD / 2} x2={fpX} y2={clY} stroke="#00b4dc" strokeWidth="1.2" />
      <text x={apX} y={H - 8} textAnchor="middle" fontSize="9" fill="#00b4dc">AP</text>
      <text x={fpX} y={H - 8} textAnchor="middle" fontSize="9" fill="#00b4dc">FP</text>

      <text x={(apX + fpX) / 2} y={14} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#e4edf8">HALF-BREADTH PLAN</text>
    </svg>
  )
}

export default function LinesPlanPage() {
  const { data } = useHull()
  const printRef = useRef<HTMLDivElement>(null)

  function handlePrint() {
    window.print()
  }

  return (
    <div className="page-content">
      <div className="section-header" style={{ marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700 }}>Lines Plan</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 13, marginTop: 2 }}>
            {data.vessel.name} — LBP {data.vessel.lbp}m × B {data.vessel.beam}m × T {data.vessel.draft}m
          </p>
        </div>
        <button className="btn btn-primary" onClick={handlePrint}>
          <Printer size={14} /> Print / Save PDF
        </button>
      </div>

      <div ref={printRef} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Body Plan */}
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>Body Plan</div>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
              <span style={{ color: "#00b4dc" }}>───</span> Forward &nbsp;
              <span style={{ color: "#667db6" }}>───</span> Aft
            </span>
          </div>
          <BodyPlan />
        </div>

        {/* Sheer Plan */}
        <div className="card">
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12 }}>Sheer Plan (Profile)</div>
          <SheerPlan />
        </div>

        {/* Half-Breadth Plan */}
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>Half-Breadth Plan</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {data.waterlines.map((wl, i) => {
                const colors = ["#00b4dc","#00c8dc","#00d4aa","#22c55e","#f59e0b","#ef4444"]
                return (
                  <span key={wl} style={{ fontSize: 11, color: colors[i % colors.length] }}>─ WL {wl}m</span>
                )
              })}
            </div>
          </div>
          <HalfBreadthPlan />
        </div>
      </div>

      {/* Info */}
      <div className="card" style={{ marginTop: 16, background: "rgba(0,180,220,.05)" }}>
        <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
          <Info size={14} color="var(--cyan)" style={{ flexShrink: 0, marginTop: 2 }} />
          <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6 }}>
            <strong style={{ color: "var(--text-primary)" }}>Body Plan:</strong> Cross-sections at each station. Forward body on right, aft body on left.
            &nbsp;<strong style={{ color: "var(--text-primary)" }}>Sheer Plan:</strong> Side profile showing waterlines and station positions.
            &nbsp;<strong style={{ color: "var(--text-primary)" }}>Half-Breadth Plan:</strong> Plan view from above — each coloured curve is a waterline.
            Edit offsets in the <a href="/offset-table" style={{ color: "var(--cyan)" }}>Offset Table</a> to update these views.
          </p>
        </div>
      </div>

      <style>{`
        @media print {
          body { background: white !important; color: black !important; }
          nav, .btn, a.btn { display: none !important; }
          .card { border: 1px solid #ccc !important; break-inside: avoid; }
          svg text { fill: #333 !important; }
          svg line { stroke: #999 !important; }
          svg path { stroke: #333 !important; }
        }
      `}</style>
    </div>
  )
}
