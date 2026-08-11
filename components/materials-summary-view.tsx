"use client"

import * as React from "react"
import { PackageIcon, SearchIcon } from "lucide-react"

import type { Project } from "@/lib/suite-data"
import { AreaBadge } from "@/components/area-badge"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function MaterialsSummaryView({
  projects,
  onOpenProject,
}: {
  projects: Project[]
  onOpenProject: (id: string) => void
}) {
  const [search, setSearch] = React.useState("")

  // Aggregate components across all active projects
  const aggregatedMaterials = React.useMemo(() => {
    const map = new Map<
      string,
      {
        ref: string
        name: string
        unit: string
        totalQty: number
        avgUnitPrice: number
        usedInProjects: { id: string; title: string; client: string; qty: number; area: Project["area"] }[]
      }
    >()

    projects.forEach((p) => {
      p.materials.forEach((m) => {
        const key = m.ref.trim().toUpperCase() || m.name.trim().toLowerCase()
        const existing = map.get(key)
        if (existing) {
          existing.totalQty += m.qty || 0
          existing.usedInProjects.push({
            id: p.id,
            title: p.title,
            client: p.client,
            qty: m.qty || 0,
            area: p.area,
          })
        } else {
          map.set(key, {
            ref: m.ref,
            name: m.name,
            unit: m.unit,
            totalQty: m.qty || 0,
            avgUnitPrice: m.unitPrice || 0,
            usedInProjects: [
              {
                id: p.id,
                title: p.title,
                client: p.client,
                qty: m.qty || 0,
                area: p.area,
              },
            ],
          })
        }
      })
    })

    return Array.from(map.values())
  }, [projects])

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return aggregatedMaterials
    return aggregatedMaterials.filter(
      (m) =>
        m.ref.toLowerCase().includes(q) ||
        m.name.toLowerCase().includes(q) ||
        m.usedInProjects.some((p) => p.title.toLowerCase().includes(q) || p.client.toLowerCase().includes(q))
    )
  }, [aggregatedMaterials, search])

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8 md:py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <PackageIcon className="size-5 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">Maestro de Materiales y Equipos</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Catálogo consolidado de componentes utilizados en todos tus proyectos para consultar referencias y reutilizar especificaciones.
          </p>
        </div>

        <div className="w-full md:w-72">
          <Input
            placeholder="Buscar por referencia, nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Referencia</TableHead>
              <TableHead>Descripción del componente</TableHead>
              <TableHead className="w-[120px]">Precio Ref.</TableHead>
              <TableHead className="w-[120px]">Acumulado</TableHead>
              <TableHead className="w-[280px]">Proyectos que lo utilizan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((item, idx) => (
              <TableRow key={idx}>
                <TableCell className="font-mono text-xs font-semibold">{item.ref || "-"}</TableCell>
                <TableCell className="text-sm font-medium">{item.name}</TableCell>
                <TableCell className="text-xs font-mono">
                  {item.avgUnitPrice > 0 ? `${item.avgUnitPrice.toFixed(2)} $` : "-"}
                </TableCell>
                <TableCell className="text-xs">
                  <span className="font-bold text-primary">{item.totalQty}</span> {item.unit}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {item.usedInProjects.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => onOpenProject(p.id)}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[11px] bg-muted/50 hover:bg-primary/10 hover:border-primary transition-colors text-left"
                      >
                        <AreaBadge area={p.area} />
                        <span className="font-mono text-[10px] text-muted-foreground">{p.id}</span>
                      </button>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
