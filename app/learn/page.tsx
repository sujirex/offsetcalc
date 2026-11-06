import { BookOpen, Table2, Layers, Calculator, Box, ChevronRight } from "lucide-react"
import Link from "next/link"

const sections = [
  {
    icon: BookOpen,
    title: "What is a Lines Plan?",
    content: `A lines plan (also called a lines drawing) is the fundamental document in naval architecture
    that defines the shape of a ship's hull. It consists of three orthogonal views:

    • Body Plan — Cross-sectional view looking fore and aft. Forward body on the right, aft body on the left.
    • Sheer Plan (Profile) — Side view showing the hull profile, waterlines, and buttock lines.
    • Half-Breadth Plan — View from above (plan view) showing the waterline curves.

    Together, these three views completely describe the three-dimensional hull form.
    Any point on the hull surface can be located by finding its position in all three views.`,
  },
  {
    icon: Table2,
    title: "What is an Offset Table?",
    content: `An offset table is the numerical representation of the lines plan. It records the
    half-breadth distances (the perpendicular distance from the centreline to the hull surface)
    at each combination of station and waterline.

    Stations are vertical cross-sections spaced at regular intervals along the ship's length.
    Station 0 is at the Aft Perpendicular (AP) and the highest station number is at the Forward
    Perpendicular (FP). A typical ship has 11 stations (0 to 10) or 21 stations (0 to 20).

    Waterlines are horizontal planes at regular heights above the baseline (keel).
    The design waterline (DWL) is the waterline at the ship's design draft.

    The offset at any cell = distance in metres from centreline to the hull surface, measured
    horizontally at that station and waterline.`,
  },
  {
    icon: Calculator,
    title: "How to Read an Offset Table",
    content: `To read an offset table:

    1. Find the row for the station you want (e.g. Station 5 = midship)
    2. Find the column for the waterline you want (e.g. WL 1.5m)
    3. The value at that intersection is the half-breadth in metres

    Example: If the offset at Station 5, WL 1.5m = 3.60m,
    then the hull surface is 3.60m from the centreline on each side at that height
    and cross-section. The full breadth at that point is 3.60 × 2 = 7.20m.

    Half-breadths increase from zero at the keel (for a ship with a rounded bottom)
    to a maximum near the design waterline (the widest point), then may decrease
    slightly above the waterline towards the deck edge.`,
  },
  {
    icon: Calculator,
    title: "Simpson's Rule for Hydrostatics",
    content: `Hydrostatic properties are calculated by numerically integrating the offset data
    using Simpson's 1/3 Rule:

    ∫ f(x) dx ≈ (h/3) × [f₀ + 4f₁ + 2f₂ + 4f₃ + ... + 4fₙ₋₁ + fₙ]

    where h is the spacing between intervals.

    Key properties calculated:
    • Waterplane Area (Aw) = 2 × ∫ y dx at design waterline
    • Sectional Area at each station = 2 × ∫ y dz over waterlines
    • Displaced Volume (∇) = ∫ A dx over stations
    • LCB = (∫ x·A dx) / ∇ from AP
    • KB = (∫ Aw·z dz) / ∇
    • BM = (2/3 × ∫ y³ dx) / ∇

    The coefficients (Cb, Cw, Cm, Cp) compare the hull's volume or area to
    the enclosing rectangular or prismatic box.`,
  },
  {
    icon: Layers,
    title: "Hull Form Coefficients",
    content: `The four form coefficients describe the "fullness" of the hull:

    Block Coefficient (Cb) = ∇ / (L × B × T)
    Ratio of displaced volume to the enclosing box. A full barge has Cb ≈ 0.95.
    A fast patrol craft has Cb ≈ 0.45–0.55. Most cargo ships: 0.65–0.80.

    Waterplane Coefficient (Cw) = Aw / (L × B)
    Fullness of the waterplane. Higher = more waterplane area = better stability.

    Midship Section Coefficient (Cm) = Am / (B × T)
    Fullness of the midship cross-section. Box barges have Cm ≈ 0.99.

    Prismatic Coefficient (Cp) = ∇ / (Am × L) = Cb / Cm
    Describes how the volume is distributed along the ship's length.
    Optimal Cp for a given speed-length ratio affects resistance.`,
  },
  {
    icon: Box,
    title: "How to Use OffsetCalc",
    content: `Step 1 — Enter your offset table:
    Go to Offset Table and fill in your vessel dimensions and half-breadths.
    Use one of the sample vessels to start, or import a CSV file.

    Step 2 — View the Lines Plan:
    Go to Lines Plan to see the Body Plan, Sheer Plan, and Half-Breadth Plan
    generated from your offsets. Use Print / Save PDF to export.

    Step 3 — Check the 3D Hull:
    Go to 3D Hull to see a wireframe of your hull form. Rotate and zoom to
    inspect the shape from any angle.

    Step 4 — Calculate Hydrostatics:
    Go to Hydrostatics to see displaced volume, LCB, LCF, form coefficients,
    and Bonjean curves. Export results as CSV.

    CSV format for import:
    Station,WL_0m,WL_0.5m,WL_1.0m,WL_1.5m,...
    0,0.40,1.20,1.80,2.20,...
    1,0.80,1.90,2.60,3.00,...`,
  },
]

export default function LearnPage() {
  return (
    <div className="page-content">
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Learn — Naval Architecture Basics</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 13 }}>
          Understanding lines plans, offset tables, and hydrostatic calculations.
        </p>
      </div>

      {/* Quick nav */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
        {sections.map(({ title, icon: Icon }) => (
          <a key={title} href={`#${title.replace(/\s+/g, "-").toLowerCase()}`} className="btn btn-secondary" style={{ fontSize: 12 }}>
            <Icon size={13} /> {title.split("?")[0].trim()}
          </a>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {sections.map(({ icon: Icon, title, content }) => (
          <div key={title} id={title.replace(/\s+/g, "-").toLowerCase()} className="card">
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8,
                background: "var(--cyan-dim)", border: "1px solid var(--border)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon size={16} color="var(--cyan)" />
              </div>
              <h2 style={{ fontSize: 15, fontWeight: 700 }}>{title}</h2>
            </div>
            <div style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.8, whiteSpace: "pre-line" }}>
              {content}
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="card" style={{ marginTop: 20, background: "var(--cyan-dim)", borderColor: "color-mix(in srgb, var(--signal) 30%, transparent)", textAlign: "center", padding: "28px 20px" }}>
        <h3 style={{ fontWeight: 700, marginBottom: 10 }}>Ready to try it?</h3>
        <p style={{ color: "var(--text-secondary)", fontSize: 13, marginBottom: 16 }}>
          Load a sample vessel and explore the lines plan and hydrostatics.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/offset-table?sample=patrol" className="btn btn-primary">
            Load Patrol Craft <ChevronRight size={14} />
          </Link>
          <Link href="/offset-table?sample=barge" className="btn btn-secondary">
            Load Box Barge
          </Link>
        </div>
      </div>
    </div>
  )
}
