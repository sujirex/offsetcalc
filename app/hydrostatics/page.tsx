"use client"
import { useMemo } from "react"
import { useHull } from "../../context/HullContext"
import { calcHydrostatics } from "../../lib/hullMath"
import { Download, Info } from "lucide-react"

const W = 680
const H = 260
const PAD_L = 60
const PAD_R = 20
const PAD_T = 20
const PAD_B = 40

function BonjeansChart() {
  const { data } = useHull()
  const hydro = useMemo(() => calcHydrostatics(data), [data])
  const { sectionAreas } = hydro
  const { stations } = data

  const maxArea = Math.max(...sectionAreas, 0.01)
  const n = stations.length - 1
  const lbp = data.vessel.lbp

  const iW = W - PAD_L - PAD_R
  const iH = H - PAD_T - PAD_B

  const points = stations.map((_, si) => {
    const x = PAD_L + (si / n) * iW
    const y = H - PAD_B - (sectionAreas[si] / maxArea) * iH
    return `${x.toFixed(1)},${y.toFixed(1)}`
  })

  const areaPath = `M ${PAD_L},${H - PAD_B} L ${points.join(" L ")} L ${PAD_L + iW},${H - PAD_B} Z`

  // Y axis ticks
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(t => ({
    y: H - PAD_B - t * iH,
    val: (t * maxArea).toFixed(1),
  }))

  // X axis station labels
  const xTicks = stations.filter((_, i) => i % 2 === 0 || i === n)

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxWidth: W }}>
      {/* Y grid */}
      {yTicks.map(({ y, val }) => (
        <g key={val}>
          <line x1={PAD_L} y1={y} x2={W - PAD_R} y2={y} stroke="rgba(0,180,220,.12)" strokeWidth="0.6" />
          <text x={PAD_L - 6} y={y + 3} textAnchor="end" fontSize="9" fill="#445870">{val}</text>
        </g>
      ))}

      {/* Filled area */}
      <path d={areaPath} fill="rgba(0,180,220,.12)" />
      {/* Curve */}
      <polyline points={points.join(" ")} fill="none" stroke="#00b4dc" strokeWidth="2" />

      {/* Axes */}
      <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={H - PAD_B} stroke="rgba(0,180,220,.3)" strokeWidth="1" />
      <line x1={PAD_L} y1={H - PAD_B} x2={W - PAD_R} y2={H - PAD_B} stroke="rgba(0,180,220,.3)" strokeWidth="1" />

      {/* X station labels */}
      {stations.map((st, si) => {
        if (si % 2 !== 0 && si !== n) return null
        const x = PAD_L + (si / n) * iW
        return (
          <g key={si}>
            <line x1={x} y1={H - PAD_B} x2={x} y2={H - PAD_B + 4} stroke="rgba(0,180,220,.3)" strokeWidth="0.8" />
            <text x={x} y={H - PAD_B + 14} textAnchor="middle" fontSize="9" fill="#445870">{st}</text>
          </g>
        )
      })}

      {/* Labels */}
      <text x={PAD_L - 32} y={H / 2} textAnchor="middle" fontSize="9" fill="#7a9bbf" transform={`rotate(-90,${PAD_L - 32},${H / 2})`}>Sectional Area (m²)</text>
      <text x={W / 2} y={H - 4} textAnchor="middle" fontSize="9" fill="#7a9bbf">Station</text>
      <text x={W / 2} y={14} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#e4edf8">BONJEAN CURVES — Sectional Areas</text>
    </svg>
  )
}

export default function HydrostaticsPage() {
  const { data } = useHull()
  const hydro = useMemo(() => calcHydrostatics(data), [data])

  function fmt(v: number, dp = 2) { return isNaN(v) ? "—" : v.toFixed(dp) }

  const results = [
    { label: "Waterplane Area (Aw)",     value: fmt(hydro.waterplaneArea),   unit: "m²",   desc: "Area of the waterplane at design draft" },
    { label: "Displaced Volume (∇)",      value: fmt(hydro.displacedVolume),  unit: "m³",   desc: "Volume of hull below design waterline" },
    { label: "Displacement (Δ)",          value: fmt(hydro.displacement, 1),  unit: "t",    desc: "Mass of water displaced (salt water 1.025 t/m³)" },
    { label: "LCB from AP",               value: fmt(hydro.lcb),              unit: "m",    desc: "Longitudinal Centre of Buoyancy" },
    { label: "LCF from AP",               value: fmt(hydro.lcf),              unit: "m",    desc: "Longitudinal Centre of Flotation" },
    { label: "KB",                        value: fmt(hydro.kb),               unit: "m",    desc: "Height of Centre of Buoyancy above keel" },
    { label: "BM",                        value: fmt(hydro.bm),               unit: "m",    desc: "Metacentric radius" },
    { label: "KM",                        value: fmt(hydro.km),               unit: "m",    desc: "Height of Metacentre above keel" },
    { label: "Block Coeff (Cb)",          value: fmt(hydro.cb, 3),            unit: "",     desc: "∇ / (L × B × T)" },
    { label: "Waterplane Coeff (Cw)",     value: fmt(hydro.cw, 3),            unit: "",     desc: "Aw / (L × B)" },
    { label: "Midship Coeff (Cm)",        value: fmt(hydro.cm, 3),            unit: "",     desc: "Am / (B × T)" },
    { label: "Prismatic Coeff (Cp)",      value: fmt(hydro.cp, 3),            unit: "",     desc: "∇ / (Am × L)" },
  ]

  function exportCSV() {
    const rows = [
      ["Parameter", "Value", "Unit", "Description"],
      ...results.map(r => [r.label, r.value, r.unit, r.desc]),
      [],
      ["Station Areas"],
      ["Station", "Section Area (m²)"],
      ...data.stations.map((st, i) => [st, fmt(hydro.sectionAreas[i])]),
    ]
    const csv = rows.map(r => r.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a"); a.href = url
    a.download = `${data.vessel.name.replace(/\s+/g,"_")}_hydrostatics.csv`
    a.click(); URL.revokeObjectURL(url)
  }

  return (
    <div className="page-content">
      <div className="section-header" style={{ marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700 }}>Hydrostatics</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 13, marginTop: 2 }}>
            {data.vessel.name} — calculated by Simpson's Rule at T = {data.vessel.draft}m draft
          </p>
        </div>
        <button className="btn btn-primary" onClick={exportCSV}>
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* Results table */}
      <div className="card" style={{ marginBottom: 18, padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", fontWeight: 600, fontSize: 14 }}>
          Hydrostatic Results
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Parameter</th>
                <th style={{ textAlign: "right" }}>Value</th>
                <th>Unit</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 500, color: "var(--text-primary)" }}>{r.label}</td>
                  <td style={{ textAlign: "right", fontFamily: "JetBrains Mono, monospace", color: "var(--cyan)", fontWeight: 600 }}>{r.value}</td>
                  <td style={{ color: "var(--text-muted)" }}>{r.unit}</td>
                  <td style={{ color: "var(--text-secondary)", fontSize: 12 }}>{r.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* KM / KB / BM bar */}
      <div className="card" style={{ marginBottom: 18 }}>
        <div style={{ fontWeight: 600, marginBottom: 14, fontSize: 14 }}>Vertical Stability Stack</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, maxWidth: 400 }}>
          {[
            { label: "KM", val: hydro.km,  color: "#00b4dc",  desc: "Height of Metacentre" },
            { label: "BM", val: hydro.bm,  color: "#00d4aa",  desc: "Metacentric radius (offset)" },
            { label: "KB", val: hydro.kb,  color: "#667db6",  desc: "Height of Centre of Buoyancy" },
            { label: "K",  val: 0,         color: "#445870",  desc: "Keel (baseline)" },
          ].map(({ label, val, color, desc }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, textAlign: "right", fontFamily: "JetBrains Mono, monospace", fontSize: 12, color, fontWeight: 700 }}>{label}</div>
              <div style={{ flex: 1, height: 6, background: "var(--navy-raised)", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ width: `${Math.min((val / (hydro.km || 1)) * 100, 100)}%`, height: "100%", background: color, borderRadius: 3 }} />
              </div>
              <div style={{ width: 44, textAlign: "right", fontFamily: "JetBrains Mono, monospace", fontSize: 12, color: "var(--text-secondary)" }}>{val.toFixed(2)}m</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", minWidth: 160 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Coefficients */}
      <div className="stat-grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", marginBottom: 18 }}>
        {[
          { label: "Block Coeff Cb", value: fmt(hydro.cb, 3), good: hydro.cb > 0.4 && hydro.cb < 0.9, hint: "0.45–0.85 typical" },
          { label: "Waterplane Cw",  value: fmt(hydro.cw, 3), good: hydro.cw > 0.5 && hydro.cw < 1.0,  hint: "0.60–0.95 typical" },
          { label: "Midship Cm",     value: fmt(hydro.cm, 3), good: hydro.cm > 0.7 && hydro.cm < 1.0,  hint: "0.80–0.99 typical" },
          { label: "Prismatic Cp",   value: fmt(hydro.cp, 3), good: hydro.cp > 0.5 && hydro.cp < 0.85, hint: "0.55–0.80 typical" },
        ].map(({ label, value, hint }) => (
          <div key={label} className="stat-card">
            <div className="stat-label">{label}</div>
            <div className="stat-value" style={{ fontSize: 28 }}>{value}</div>
            <div className="stat-sub">{hint}</div>
          </div>
        ))}
      </div>

      {/* Bonjean chart */}
      <div className="card" style={{ marginBottom: 18 }}>
        <BonjeansChart />
      </div>

      {/* Station areas table */}
      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", fontWeight: 600, fontSize: 14 }}>
          Sectional Areas by Station
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Station</th>
                <th style={{ textAlign: "right" }}>Section Area (m²)</th>
                <th>Visual</th>
              </tr>
            </thead>
            <tbody>
              {data.stations.map((st, i) => {
                const area = hydro.sectionAreas[i]
                const maxA = Math.max(...hydro.sectionAreas)
                const pct = maxA > 0 ? (area / maxA) * 100 : 0
                return (
                  <tr key={i}>
                    <td style={{ fontFamily: "JetBrains Mono, monospace", color: "var(--cyan)", fontWeight: 600 }}>
                      {st === 0 ? `${st} (AP)` : st === data.stations[data.stations.length - 1] ? `${st} (FP)` : st}
                    </td>
                    <td style={{ textAlign: "right", fontFamily: "JetBrains Mono, monospace" }}>{fmt(area)}</td>
                    <td style={{ width: 200 }}>
                      <div style={{ height: 8, width: `${pct}%`, background: "linear-gradient(90deg,#0066aa,#00b4dc)", borderRadius: 2 }} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card" style={{ marginTop: 14, background: "rgba(0,180,220,.05)" }}>
        <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
          <Info size={14} color="var(--cyan)" style={{ flexShrink: 0, marginTop: 2 }} />
          <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6 }}>
            All calculations use <strong style={{ color: "var(--text-primary)" }}>Simpson's 1/3 Rule</strong> for numerical integration of the offset data.
            Salt water density = 1.025 t/m³. Results are approximate — accuracy depends on the number of stations and waterlines in your offset table.
          </p>
        </div>
      </div>
    </div>
  )
}
