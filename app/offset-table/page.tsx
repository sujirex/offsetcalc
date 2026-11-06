"use client"
import { Suspense, useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useHull } from "../../context/HullContext"
import { SAMPLE_PATROL_CRAFT, SAMPLE_BARGE, SAMPLE_IWT_BARGE } from "../../lib/sampleData"
import { OffsetData } from "../../lib/types"
import { Upload, Download, Plus, Trash2, RefreshCw, Info } from "lucide-react"
import Papa from "papaparse"

function OffsetTableInner() {
  const { data, setData } = useHull()
  const searchParams = useSearchParams()
  const fileRef = useRef<HTMLInputElement>(null)
  const [msg, setMsg] = useState("")

  // Load sample on query param
  useEffect(() => {
    const sample = searchParams.get("sample")
    if (sample === "barge") setData(SAMPLE_BARGE)
    else if (sample === "patrol") setData(SAMPLE_PATROL_CRAFT)
  }, [searchParams, setData])

  function flash(m: string) { setMsg(m); setTimeout(() => setMsg(""), 3000) }

  /* ── Vessel dimension changes ── */
  function updateVessel(key: keyof typeof data.vessel, value: string | number) {
    setData({ ...data, vessel: { ...data.vessel, [key]: typeof value === "string" ? value : Number(value) } })
  }

  /* ── Cell edit ── */
  function setCellValue(si: number, wi: number, val: string) {
    const hb = data.halfBreadths.map(row => [...row])
    hb[si][wi] = parseFloat(val) || 0
    setData({ ...data, halfBreadths: hb })
  }

  /* ── Add / remove station ── */
  function addStation() {
    const newSt = data.stations[data.stations.length - 1] + 1
    const newRow = new Array(data.waterlines.length).fill(0)
    setData({
      ...data,
      stations: [...data.stations, newSt],
      halfBreadths: [...data.halfBreadths, newRow],
    })
  }
  function removeStation(si: number) {
    if (data.stations.length <= 2) return
    setData({
      ...data,
      stations: data.stations.filter((_, i) => i !== si),
      halfBreadths: data.halfBreadths.filter((_, i) => i !== si),
    })
  }

  /* ── Add / remove waterline ── */
  function addWaterline() {
    const lastWl = data.waterlines[data.waterlines.length - 1]
    const step = data.waterlines.length > 1 ? data.waterlines[1] - data.waterlines[0] : 0.5
    const newWl = parseFloat((lastWl + step).toFixed(2))
    setData({
      ...data,
      waterlines: [...data.waterlines, newWl],
      halfBreadths: data.halfBreadths.map(row => [...row, 0]),
    })
  }
  function removeWaterline(wi: number) {
    if (data.waterlines.length <= 2) return
    setData({
      ...data,
      waterlines: data.waterlines.filter((_, i) => i !== wi),
      halfBreadths: data.halfBreadths.map(row => row.filter((_, i) => i !== wi)),
    })
  }

  /* ── CSV Export ── */
  function exportCSV() {
    const header = ["Station", ...data.waterlines.map(wl => `WL_${wl}m`)]
    const rows = data.stations.map((st, si) => [st, ...data.halfBreadths[si]])
    const csv = [header, ...rows].map(r => r.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a"); a.href = url
    a.download = `${data.vessel.name.replace(/\s+/g, "_")}_offsets.csv`
    a.click(); URL.revokeObjectURL(url)
    flash("CSV exported ✓")
  }

  /* ── CSV Import ── */
  function importCSV(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return
    if (file.size > 5 * 1024 * 1024) { flash("File too large — max 5 MB"); return }
    Papa.parse(file, {
      complete: (result) => {
        const rows = result.data as string[][]
        if (rows.length < 2) { flash("Invalid CSV"); return }
        const header = rows[0]
        // Parse waterlines from header (skip first "Station" column)
        const wls = header.slice(1).map(h => parseFloat(h.replace(/[^\d.]/g, ""))).filter(v => !isNaN(v))
        const stations: number[] = []
        const halfBreadths: number[][] = []
        for (let i = 1; i < rows.length; i++) {
          const row = rows[i]
          if (!row[0] && row[0] !== "0") continue
          stations.push(parseFloat(row[0]))
          halfBreadths.push(wls.map((_, wi) => parseFloat(row[wi + 1]) || 0))
        }
        if (stations.length < 2) { flash("Need at least 2 stations"); return }
        setData({ ...data, stations, waterlines: wls, halfBreadths })
        flash(`Imported ${stations.length} stations × ${wls.length} waterlines ✓`)
      },
      error: () => flash("Failed to parse CSV"),
    })
    e.target.value = ""
  }

  const maxHalfBeam = data.vessel.beam / 2

  return (
    <div className="page-content">
      <div className="section-header" style={{ marginBottom: 20 }}>
        <div>
          <h1>Offset Table</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 13, marginTop: 2 }}>
            Half-breadths (metres) from centreline — Station rows × Waterline columns
          </p>
        </div>
        <div className="actions">
          <button className="btn btn-secondary" onClick={() => setData(SAMPLE_PATROL_CRAFT)}>
            <RefreshCw size={14} /> Patrol Craft
          </button>
          <button className="btn btn-secondary" onClick={() => setData(SAMPLE_BARGE)}>
            <RefreshCw size={14} /> Barge
          </button>
          <button className="btn btn-secondary" onClick={() => setData(SAMPLE_IWT_BARGE)}>
            <RefreshCw size={14} /> IWT Barge 🇮🇳
          </button>
          <button className="btn btn-secondary" onClick={() => fileRef.current?.click()}>
            <Upload size={14} /> Import CSV
          </button>
          <button className="btn btn-primary" onClick={exportCSV}>
            <Download size={14} /> Export CSV
          </button>
          <input ref={fileRef} type="file" accept=".csv" style={{ display: "none" }} onChange={importCSV} />
        </div>
      </div>

      {msg && (
        <div style={{ background: "color-mix(in srgb, var(--signal) 12%, transparent)", border: "1px solid color-mix(in srgb, var(--signal) 30%, transparent)", borderRadius: "var(--radius-sm)", padding: "8px 14px", marginBottom: 14, color: "var(--cyan)", fontSize: 13 }}>
          {msg}
        </div>
      )}

      {/* Vessel dimensions */}
      <div className="card" style={{ marginBottom: 18 }}>
        <div style={{ fontWeight: 600, marginBottom: 14, fontSize: 14 }}>Vessel Dimensions</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14 }}>
          {[
            { key: "name",  label: "Vessel Name",   type: "text",   unit: "" },
            { key: "lbp",   label: "LBP",           type: "number", unit: "m" },
            { key: "beam",  label: "Moulded Beam",  type: "number", unit: "m" },
            { key: "depth", label: "Moulded Depth", type: "number", unit: "m" },
            { key: "draft", label: "Design Draft",  type: "number", unit: "m" },
          ].map(({ key, label, type, unit }) => (
            <div key={key}>
              <label style={{ display: "block", fontSize: 11, color: "var(--text-muted)", marginBottom: 4, textTransform: "uppercase", letterSpacing: ".06em" }}>
                {label}{unit ? ` (${unit})` : ""}
              </label>
              <input
                className="input"
                type={type}
                value={data.vessel[key as keyof typeof data.vessel]}
                onChange={e => updateVessel(key as keyof typeof data.vessel, type === "number" ? e.target.value : e.target.value)}
                step="0.01"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Offset grid */}
      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: "14px 16px 10px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border)" }}>
          <div style={{ fontWeight: 600, fontSize: 14 }}>
            Half-Breadth Offsets
            <span style={{ marginLeft: 8, color: "var(--text-muted)", fontSize: 12, fontWeight: 400 }}>
              {data.stations.length} stations × {data.waterlines.length} waterlines
            </span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-ghost" onClick={addStation} style={{ fontSize: 12, padding: "5px 10px" }}>
              <Plus size={13} /> Station
            </button>
            <button className="btn btn-ghost" onClick={addWaterline} style={{ fontSize: 12, padding: "5px 10px" }}>
              <Plus size={13} /> Waterline
            </button>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ background: "var(--navy)" }}>
                <th style={{ padding: "8px 12px", textAlign: "left", color: "var(--text-muted)", fontWeight: 500, borderBottom: "1px solid var(--border)", minWidth: 70 }}>Station</th>
                {data.waterlines.map((wl, wi) => (
                  <th key={wi} style={{ padding: "8px 10px", textAlign: "center", color: "var(--cyan)", fontWeight: 600, borderBottom: "1px solid var(--border)", minWidth: 80, borderLeft: "1px solid var(--border)" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                      WL {wl}m
                      {data.waterlines.length > 2 && (
                        <button onClick={() => removeWaterline(wi)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 0, lineHeight: 1, opacity: 0.6 }}>×</button>
                      )}
                    </div>
                  </th>
                ))}
                <th style={{ padding: "8px 10px", color: "var(--text-muted)", borderBottom: "1px solid var(--border)", borderLeft: "1px solid var(--border)", minWidth: 36 }}></th>
              </tr>
            </thead>
            <tbody>
              {data.stations.map((st, si) => (
                <tr key={si} style={{ borderBottom: "1px solid color-mix(in srgb, var(--signal) 6%, transparent)" }}>
                  <td style={{ padding: "6px 12px", color: "var(--cyan)", fontWeight: 600, background: "var(--navy)", fontFamily: "var(--mono)" }}>
                    {si === 0 ? `${st} (AP)` : si === data.stations.length - 1 ? `${st} (FP)` : si === Math.floor(data.stations.length / 2) ? `${st} (Mid)` : st}
                  </td>
                  {data.halfBreadths[si]?.map((hb, wi) => {
                    const pct = maxHalfBeam > 0 ? (hb / maxHalfBeam) * 100 : 0
                    const isOverBeam = hb > maxHalfBeam + 0.01
                    return (
                      <td key={wi} style={{ padding: "4px 6px", borderLeft: "1px solid color-mix(in srgb, var(--signal) 6%, transparent)" }}>
                        <input
                          type="number"
                          value={hb}
                          onChange={e => setCellValue(si, wi, e.target.value)}
                          step="0.01"
                          min="0"
                          style={{
                            width: "100%", textAlign: "center",
                            background: isOverBeam ? "color-mix(in srgb, var(--t-danger) 10%, transparent)" : `color-mix(in srgb, var(--signal) ${pct * 0.2}%, transparent)`,
                            border: `1px solid ${isOverBeam ? "color-mix(in srgb, var(--t-danger) 40%, transparent)" : "transparent"}`,
                            borderRadius: 4, padding: "4px 6px",
                            color: "var(--text-primary)", fontSize: 12,
                            fontFamily: "var(--mono)",
                            outline: "none",
                          }}
                          onFocus={e => e.target.style.borderColor = "var(--cyan)"}
                          onBlur={e => e.target.style.borderColor = isOverBeam ? "color-mix(in srgb, var(--t-danger) 40%, transparent)" : "transparent"}
                        />
                      </td>
                    )
                  })}
                  <td style={{ padding: "4px 6px", borderLeft: "1px solid color-mix(in srgb, var(--signal) 6%, transparent)", textAlign: "center" }}>
                    {data.stations.length > 2 && (
                      <button onClick={() => removeStation(si)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 2 }}>
                        <Trash2 size={12} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ padding: "10px 16px", borderTop: "1px solid var(--border)", display: "flex", gap: 16, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text-muted)" }}>
            <Info size={12} />
            All values are half-breadths (metres from centreline). Max half-beam = {(data.vessel.beam / 2).toFixed(2)}m.
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text-muted)" }}>
            <span style={{ display: "inline-block", width: 14, height: 14, background: "color-mix(in srgb, var(--t-danger) 20%, transparent)", border: "1px solid color-mix(in srgb, var(--t-danger) 40%, transparent)", borderRadius: 2 }} />
            Red = exceeds half-beam
          </div>
        </div>
      </div>

      {/* Navigation hint */}
      <div style={{ marginTop: 20, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <a href="/lines-plan" className="btn btn-secondary" style={{ fontSize: 13 }}>→ View Lines Plan</a>
        <a href="/hull-3d"    className="btn btn-secondary" style={{ fontSize: 13 }}>→ 3D Hull View</a>
        <a href="/hydrostatics" className="btn btn-secondary" style={{ fontSize: 13 }}>→ Hydrostatics</a>
      </div>
    </div>
  )
}

export default function OffsetTablePage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, color: "var(--text-muted)" }}>Loading…</div>}>
      <OffsetTableInner />
    </Suspense>
  )
}
