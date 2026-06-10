"use client"
import { useEffect, useRef } from "react"
import { useHull } from "../../context/HullContext"
import { RotateCcw, Info } from "lucide-react"

function Hull3DCanvas() {
  const canvasRef = useRef<HTMLDivElement>(null)
  const { data } = useHull()

  useEffect(() => {
    if (!canvasRef.current) return
    let animId: number
    let renderer: any, scene: any, camera: any, controls: any
    let THREE: any

    async function init() {
      THREE = await import("three")
      let OrbitControls: any = null
      try {
        const mod = await import(/* webpackIgnore: true */ "three/addons/controls/OrbitControls.js")
        OrbitControls = mod.OrbitControls
      } catch {
        try {
          const mod2 = await import("three/examples/jsm/controls/OrbitControls.js" as any)
          OrbitControls = mod2.OrbitControls
        } catch { /* will use auto-rotate fallback */ }
      }

      const container = canvasRef.current!
      const W = container.clientWidth || 600
      const H = container.clientHeight || 440

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setSize(W, H)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setClearColor(0x06101f, 1)
      container.appendChild(renderer.domElement)

      scene = new THREE.Scene()
      scene.fog = new THREE.FogExp2(0x06101f, 0.018)

      camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 1000)
      camera.position.set(data.vessel.lbp * 0.8, data.vessel.beam * 1.5, data.vessel.lbp * 0.6)
      camera.lookAt(data.vessel.lbp / 2, 0, 0)

      // Orbit controls (manual fallback if import fails)
      let orbitControls: any = null
      if (OrbitControls) {
        orbitControls = new OrbitControls(camera, renderer.domElement)
        orbitControls.enableDamping = true
        orbitControls.dampingFactor = 0.05
        orbitControls.target.set(data.vessel.lbp / 2, data.vessel.draft / 2, 0)
        orbitControls.update()
      }

      // ── Build hull wireframe ──
      const { stations, waterlines, halfBreadths, vessel } = data
      const lbp = vessel.lbp
      const n = stations.length - 1
      const stationSpacing = lbp / n

      const matStation = new THREE.LineBasicMaterial({ color: 0x00b4dc, transparent: true, opacity: 0.85 })
      const matWL      = new THREE.LineBasicMaterial({ color: 0x00d4aa, transparent: true, opacity: 0.60 })
      const matMirror  = new THREE.LineBasicMaterial({ color: 0x667db6, transparent: true, opacity: 0.55 })

      // Station curves (cross-sections)
      stations.forEach((_, si) => {
        const x = si * stationSpacing
        const geomPort = new THREE.BufferGeometry()
        const geomStbd = new THREE.BufferGeometry()
        const vertsPort: number[] = []
        const vertsStbd: number[] = []

        waterlines.forEach((wl, wi) => {
          const hb = halfBreadths[si]?.[wi] ?? 0
          vertsPort.push(x, wl, -hb)   // port (negative Z)
          vertsStbd.push(x, wl,  hb)   // starboard (positive Z)
        })
        // Close at keel
        vertsPort.push(x, 0, 0)
        vertsStbd.push(x, 0, 0)

        geomPort.setAttribute("position", new THREE.Float32BufferAttribute(vertsPort, 3))
        geomStbd.setAttribute("position", new THREE.Float32BufferAttribute(vertsStbd, 3))
        scene.add(new THREE.Line(geomPort, matStation))
        scene.add(new THREE.Line(geomStbd, matStation))

        // Connect port-keel-stbd at baseline
        const keelGeom = new THREE.BufferGeometry()
        keelGeom.setAttribute("position", new THREE.Float32BufferAttribute([
          x, 0, -(halfBreadths[si]?.[0] ?? 0),
          x, 0, 0,
          x, 0,  (halfBreadths[si]?.[0] ?? 0),
        ], 3))
        scene.add(new THREE.Line(keelGeom, matMirror))
      })

      // Waterline curves (longitudinal)
      waterlines.forEach((wl, wi) => {
        const geomPort = new THREE.BufferGeometry()
        const geomStbd = new THREE.BufferGeometry()
        const vertsPort: number[] = []
        const vertsStbd: number[] = []

        stations.forEach((_, si) => {
          const x = si * stationSpacing
          const hb = halfBreadths[si]?.[wi] ?? 0
          vertsPort.push(x, wl, -hb)
          vertsStbd.push(x, wl,  hb)
        })

        geomPort.setAttribute("position", new THREE.Float32BufferAttribute(vertsPort, 3))
        geomStbd.setAttribute("position", new THREE.Float32BufferAttribute(vertsStbd, 3))
        scene.add(new THREE.Line(geomPort, matWL))
        scene.add(new THREE.Line(geomStbd, matWL))
      })

      // Keel line
      const keelGeom = new THREE.BufferGeometry()
      const keelVerts: number[] = []
      stations.forEach((_, si) => keelVerts.push(si * stationSpacing, 0, 0))
      keelGeom.setAttribute("position", new THREE.Float32BufferAttribute(keelVerts, 3))
      scene.add(new THREE.Line(keelGeom, new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.5, transparent: true })))

      // Grid helper
      const grid = new THREE.GridHelper(lbp * 1.5, 20, 0x0c1a30, 0x0c1a30)
      grid.position.set(lbp / 2, -0.05, 0)
      scene.add(grid)

      // Ambient + directional light (for future surface rendering)
      scene.add(new THREE.AmbientLight(0x203050, 1))

      // Resize observer
      const ro = new ResizeObserver(() => {
        const cw = container.clientWidth
        const ch = container.clientHeight
        renderer.setSize(cw, ch)
        camera.aspect = cw / ch
        camera.updateProjectionMatrix()
      })
      ro.observe(container)

      function animate() {
        animId = requestAnimationFrame(animate)
        if (orbitControls) orbitControls.update()
        else {
          // simple auto-rotate fallback
          camera.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.003)
          camera.lookAt(lbp / 2, 0, 0)
        }
        renderer.render(scene, camera)
      }
      animate()

      return () => {
        ro.disconnect()
        cancelAnimationFrame(animId)
        renderer.dispose()
        if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement)
      }
    }

    const cleanup = init()
    return () => { cleanup.then(fn => fn?.()) }
  }, [data])

  return <div ref={canvasRef} style={{ width: "100%", height: 480, borderRadius: "var(--radius-sm)", overflow: "hidden" }} />
}

export default function Hull3DPage() {
  const { data } = useHull()

  return (
    <div className="page-content">
      <div className="section-header" style={{ marginBottom: 16 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700 }}>3D Hull View</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 13, marginTop: 2 }}>
            {data.vessel.name} — wireframe from offset data
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <span className="badge badge-info">Drag to rotate</span>
          <span className="badge badge-info">Scroll to zoom</span>
        </div>
      </div>

      <div className="card" style={{ padding: 8 }}>
        <Hull3DCanvas />
      </div>

      {/* Legend */}
      <div className="card" style={{ marginTop: 14, display: "flex", gap: 20, flexWrap: "wrap" }}>
        {[
          { color: "#00b4dc", label: "Station curves (cross-sections)" },
          { color: "#00d4aa", label: "Waterlines (longitudinal)" },
          { color: "#ffffff", label: "Keel line" },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
            <div style={{ width: 28, height: 2, background: color, borderRadius: 1 }} />
            <span style={{ color: "var(--text-secondary)" }}>{label}</span>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: 12, background: "rgba(0,180,220,.05)" }}>
        <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
          <Info size={14} color="var(--cyan)" style={{ flexShrink: 0, marginTop: 2 }} />
          <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6 }}>
            The 3D view is a wireframe rendered from your offset half-breadths — each station (blue) and
            waterline (teal) curve is plotted in 3D space and mirrored about the centreline plane.
            Update offsets in the <a href="/offset-table" style={{ color: "var(--cyan)" }}>Offset Table</a> and
            return here to see the updated hull form.
          </p>
        </div>
      </div>
    </div>
  )
}
