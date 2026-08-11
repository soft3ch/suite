"use client"

import * as React from "react"
import { CalculatorIcon, CheckCircle2Icon, ClockIcon, DollarSignIcon, FileTextIcon, SendIcon } from "lucide-react"

import { calculateProjectBudget, type Project, type ProjectStatus } from "@/lib/suite-data"
import { AreaBadge } from "@/components/area-badge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const STATUS_CONFIG: Record<ProjectStatus, { label: string; variant: "outline" | "secondary" | "default"; icon: any }> = {
  borrador: { label: "Borrador", variant: "outline", icon: ClockIcon },
  presupuestado: { label: "Presupuestado", variant: "secondary", icon: SendIcon },
  en_ejecucion: { label: "En Ejecución", variant: "default", icon: CalculatorIcon },
  finalizado: { label: "Finalizado", variant: "default", icon: CheckCircle2Icon },
}

export function BudgetSummaryView({
  projects,
  onOpenProject,
}: {
  projects: Project[]
  onOpenProject: (id: string) => void
}) {
  const calculatedProjects = React.useMemo(() => {
    return projects.map((p) => {
      const budget = calculateProjectBudget(p)
      return { project: p, budget }
    })
  }, [projects])

  const totals = React.useMemo(() => {
    return calculatedProjects.reduce(
      (acc, item) => {
        acc.totalMaterialCost += item.budget.materialsSubtotal
        acc.totalLaborCost += item.budget.laborSubtotal
        acc.totalGrossNet += item.budget.netTotal
        acc.totalGrandTotal += item.budget.grandTotal
        return acc
      },
      { totalMaterialCost: 0, totalLaborCost: 0, totalGrossNet: 0, totalGrandTotal: 0 }
    )
  }, [calculatedProjects])

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8 md:py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CalculatorIcon className="size-5 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">Centro de Presupuestos y Valoraciones</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Herramienta rápida de cálculo económico basada en los materiales y horas asignadas a cada solución.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-card">
          <CardHeader className="py-3">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase">
              Materiales Totales
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="text-xl font-bold font-mono">
              {totals.totalMaterialCost.toLocaleString("es-ES", { minimumFractionDigits: 2 })} $
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader className="py-3">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase">
              Mano de Obra
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="text-xl font-bold font-mono">
              {totals.totalLaborCost.toLocaleString("es-ES", { minimumFractionDigits: 2 })} $
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader className="py-3">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase">
              Base Imponible
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="text-xl font-bold font-mono text-primary">
              {totals.totalGrossNet.toLocaleString("es-ES", { minimumFractionDigits: 2 })} $
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader className="py-3">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase">
              Total con IVA (21%)
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="text-xl font-bold font-mono">
              {totals.totalGrandTotal.toLocaleString("es-ES", { minimumFractionDigits: 2 })} $
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="overflow-hidden rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Código</TableHead>
              <TableHead>Trabajo / Proyecto</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead className="w-[120px]">Estado</TableHead>
              <TableHead className="w-[130px] text-right">Materiales</TableHead>
              <TableHead className="w-[130px] text-right">M. Obra</TableHead>
              <TableHead className="w-[140px] text-right">Total Presupuesto</TableHead>
              <TableHead className="w-[80px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {calculatedProjects.map(({ project, budget }) => {
              const statusCfg = STATUS_CONFIG[project.status || "borrador"]
              const StatusIcon = statusCfg.icon

              return (
                <TableRow key={project.id}>
                  <TableCell className="font-mono text-xs font-semibold">
                    <div className="flex flex-col gap-1">
                      <AreaBadge area={project.area} />
                      <span>{project.id}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-sm">
                    {project.title}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{project.client}</TableCell>
                  <TableCell>
                    <Badge variant={statusCfg.variant} className="text-[10px]">
                      <StatusIcon className="size-3 mr-1" />
                      {statusCfg.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs">
                    {budget.materialsSubtotal.toFixed(2)} $
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs">
                    {budget.laborSubtotal.toFixed(2)} $
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm font-bold text-primary">
                    {budget.grandTotal.toFixed(2)} $
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => onOpenProject(project.id)}>
                      Ver
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
