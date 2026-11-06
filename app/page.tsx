"use client"
import Link from "next/link"
import { Table2, Layers, Box, Calculator, BookOpen, ArrowRight, CheckCircle } from "lucide-react"

const FEATURES = [
  { icon: Table2,     title: "Offset Table Editor",  desc: "Enter half-breadths at stations × waterlines. Import/export CSV. Built-in sample vessels to get started immediately." },
  { icon: Layers,     title: "Lines Plan",            desc: "Interactive SVG lines plan — Body Plan, Sheer Plan, and Half-Breadth Plan. Export to PDF for documentation." },
  { icon: Box,        title: "3D Hull View",          desc: "Three.js wireframe hull rendered from your offset data. Rotate, zoom and inspect the hull form from any angle." },
  { icon: Calculator, title: "Hydrostatics",          desc: "Simpson's Rule integration: displaced volume, LCB, LCF, Cb, Cw, Cm, Cp, KB, BM, KM. Bonjean curve chart." },
]

const QUICK = [
  { href: "/offset-table", label: "Enter Offset Table", icon: Table2,   primary: true },
  { href: "/lines-plan",   label: "View Lines Plan",    icon: Layers,   primary: false },
  { href: "/learn",        label: "Learn the Basics",   icon: BookOpen, primary: false },
]

export default function Home() {
  return (
    <div className="aurora-clip"><div className="page-content">
      {/* Hero */}
      <div className="aurora" style={{ textAlign: "center", padding: "40px 0 44px" }}>
        <img src="/ss-emblem.svg" alt="SS emblem" width={80} height={80}
          style={{ display: "block", margin: "0 auto 22px", borderRadius: 22, boxShadow: "0 18px 50px -18px var(--g3)" }} />
        <h1 style={{ fontSize: "clamp(36px, 7vw, 56px)", fontWeight: 650, letterSpacing: "-.045em", marginBottom: 14 }}>
          <span className="grad-text">OffsetCalc</span>
        </h1>
        <p style={{ fontSize: 16, color: "var(--text-secondary)", maxWidth: 560, margin: "0 auto 30px", lineHeight: 1.7 }}>
          Naval architecture tool for hull lines plans and offset tables.
          Enter your offsets, visualise the hull form, and calculate hydrostatics — all in the browser.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          {QUICK.map(({ href, label, icon: Icon, primary }) => (
            <Link key={href} href={href} className={`btn ${primary ? "btn-primary" : "btn-secondary"}`} style={{ fontSize: 14, padding: "11px 18px" }}>
              <Icon size={15} /> {label} {primary && <ArrowRight size={14} />}
            </Link>
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginBottom: 40 }}>
        {FEATURES.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="card">
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: "var(--inset)", border: "1px solid var(--border)",
              display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14,
            }}>
              <Icon size={18} color="var(--g3)" />
            </div>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>{title}</div>
            <div style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}>{desc}</div>
          </div>
        ))}
      </div>

      {/* What is an offset table */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 240 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 10 }}>What is an Offset Table?</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.7, marginBottom: 10 }}>
              An offset table is the numerical representation of a ship's hull form. It lists the
              <strong style={{ color: "var(--text-primary)" }}> half-breadth distances</strong> from the centreline
              to the hull surface at each <strong style={{ color: "var(--text-primary)" }}>station</strong> (cross-section) and
              <strong style={{ color: "var(--text-primary)" }}> waterline</strong> (horizontal plane).
            </p>
            <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.7 }}>
              From these numbers you can reconstruct the complete three-dimensional hull form —
              the body plan, sheer plan, and half-breadth plan — and calculate all hydrostatic properties.
            </p>
          </div>
          <div style={{ flex: 1, minWidth: 240 }}>
            <div style={{ background: "var(--navy)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: 14 }}>
              <div style={{ fontSize: 11, color: "var(--cyan)", letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 10 }}>
                Sample Offset Table (half-breadths in metres)
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: "JetBrains Mono, monospace" }}>
                <thead>
                  <tr>
                    <th style={{ padding: "4px 8px", color: "var(--text-muted)", textAlign: "left", borderBottom: "1px solid var(--border)" }}>Stn</th>
                    {["WL0", "WL0.5", "WL1.0", "WL1.5", "WL2.0"].map(wl => (
                      <th key={wl} style={{ padding: "4px 8px", color: "var(--text-muted)", textAlign: "right", borderBottom: "1px solid var(--border)" }}>{wl}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["0 (AP)", "0.40", "1.20", "1.80", "2.20", "2.50"],
                    ["5 (Mid)", "2.10", "3.35", "3.58", "3.60", "3.60"],
                    ["10 (FP)", "0.05", "0.35", "0.70", "1.05", "1.35"],
                  ].map(row => (
                    <tr key={row[0]}>
                      <td style={{ padding: "4px 8px", color: "var(--cyan)" }}>{row[0]}</td>
                      {row.slice(1).map((v, i) => (
                        <td key={i} style={{ padding: "4px 8px", color: "var(--text-primary)", textAlign: "right" }}>{v}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Sample vessels */}
      <div className="card">
        <div className="section-header">
          <div className="section-title">Sample Vessels</div>
          <span className="badge badge-info">Ready to use</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
          {[
            { name: "Patrol Craft 40", dims: "40m × 7.2m × 2.0m draft", cb: "Cb ≈ 0.55", href: "/offset-table?sample=patrol", badge: "Realistic hull" },
            { name: "Box Barge 30",    dims: "30m × 8.0m × 1.5m draft", cb: "Cb ≈ 0.95", href: "/offset-table?sample=barge",  badge: "Learning example" },
          ].map(v => (
            <Link key={v.name} href={v.href} className="card card-link" style={{
              background: "var(--inset)", boxShadow: "none", padding: "14px 16px", borderRadius: "var(--radius-sm)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontWeight: 600, fontSize: 13, color: "var(--text-primary)" }}>{v.name}</span>
                <span className="badge badge-success" style={{ fontSize: 10 }}>{v.badge}</span>
              </div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{v.dims}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{v.cb}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 10, color: "var(--cyan)", fontSize: 12 }}>
                Load this vessel <ArrowRight size={12} />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Feature list */}
      <div style={{ marginTop: 24, padding: "20px 0", borderTop: "1px solid var(--border)" }}>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center" }}>
          {[
            "Simpson's Rule integration", "CSV import & export",
            "PDF lines plan export", "Body / Sheer / Half-breadth plans",
            "Three.js 3D wireframe", "Mobile responsive",
          ].map(f => (
            <div key={f} style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-secondary)", fontSize: 13 }}>
              <CheckCircle size={14} color="var(--ok)" /> {f}
            </div>
          ))}
        </div>
      </div>
    </div></div>
  )
}
