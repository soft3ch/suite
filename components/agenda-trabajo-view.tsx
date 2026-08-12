"use client"

import * as React from "react"
import { CalendarIcon, FilterIcon, PlusIcon, SearchIcon } from "lucide-react"

import type { Pedido } from "@/lib/suite-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type AgendaTrabajoViewProps = {
  pedidos: Pedido[]
  onNewPedido: () => void
}

const STATUS_PILLS: Record<string, { label: string; bg: string }> = {
  terminado: { label: "TERMINADO", bg: "bg-slate-200 text-slate-800 font-bold" },
  en_curso: { label: "EN CURSO", bg: "bg-blue-100 text-blue-800 font-bold" },
  pendiente: { label: "PENDIENTE", bg: "bg-amber-100 text-amber-800 font-bold" },
  esperando_material: { label: "ESPERANDO MATERIAL", bg: "bg-slate-200 text-slate-700 font-semibold" },
}

export function AgendaTrabajoView({ pedidos, onNewPedido }: AgendaTrabajoViewProps) {
  const [filterState, setFilterState] = React.useState<string>("all")
  const [search, setSearch] = React.useState("")

  const filtered = React.useMemo(() => {
    return pedidos.filter((p) => {
      if (filterState === "pendientes" && p.status === "terminado") return false
      if (filterState === "terminados" && p.status !== "terminado") return false
      if (!search.trim()) return true
      const q = search.toLowerCase()
      return p.client.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    })
  }, [pedidos, filterState, search])

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8 space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Agenda de Trabajo</h1>
        <p className="text-sm text-slate-500 font-medium mt-1">Tu hoja de trabajo digital: pedidos, pendientes y tareas del día</p>
      </div>

      {/* Date Header Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900 px-2">
          <CalendarIcon className="size-4 text-blue-600" />
          <span>HOY • 11 DE AGOSTO</span>
        </div>
        <div className="w-full md:w-96 relative">
          <SearchIcon className="size-4 absolute left-3 top-2.5 text-slate-400" />
          <Input
            placeholder="Buscar cliente o trabajo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs bg-slate-50 border-slate-200"
          />
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border border-slate-200 bg-white">
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase">PENDIENTES</CardTitle>
          </CardHeader>
          <CardContent className="pb-3 px-4">
            <div className="text-3xl font-black font-mono text-slate-900">8</div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 bg-white">
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase">EN CURSO</CardTitle>
          </CardHeader>
          <CardContent className="pb-3 px-4">
            <div className="text-3xl font-black font-mono text-slate-900">3</div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 bg-white">
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase">ESPERANDO</CardTitle>
          </CardHeader>
          <CardContent className="pb-3 px-4">
            <div className="text-3xl font-black font-mono text-slate-900">2</div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 bg-white">
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase">TERMINADOS HOY</CardTitle>
          </CardHeader>
          <CardContent className="pb-3 px-4">
            <div className="text-3xl font-black font-mono text-slate-900">4</div>
          </CardContent>
        </Card>
      </div>

      {/* Table Section */}
      <Card className="border border-slate-200 bg-white overflow-hidden shadow-sm">
        <CardHeader className="py-4 border-b border-slate-100">
          <CardTitle className="text-base font-bold text-slate-900 uppercase">TRABAJOS / PEDIDOS</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 text-[11px] font-extrabold uppercase text-slate-500">
                <TableHead className="w-[140px]">CLIENTE</TableHead>
                <TableHead>TRABAJO</TableHead>
                <TableHead className="w-[100px]">FECHA</TableHead>
                <TableHead className="w-[160px]">ESTADO</TableHead>
                <TableHead className="w-[180px]">PRÓXIMA ACCIÓN</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => {
                const st = STATUS_PILLS[item.status] || STATUS_PILLS["pendiente"]
                return (
                  <TableRow key={item.id} className="text-xs">
                    <TableCell className="font-bold text-slate-900">{item.client}</TableCell>
                    <TableCell className="font-medium text-slate-700">{item.description}</TableCell>
                    <TableCell className="font-mono text-slate-500">{item.date}</TableCell>
                    <TableCell>
                      <span className={`text-[10px] px-2.5 py-1 rounded-full ${st.bg}`}>
                        {st.label}
                      </span>
                    </TableCell>
                    <TableCell className="font-bold text-slate-900">{item.nextAction}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Action Footer */}
      <div className="bg-slate-900 p-4 rounded-xl flex flex-wrap gap-3 items-center justify-between text-white">
        <div className="flex gap-2">
          <Button onClick={onNewPedido} className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs">
            + NUEVO PEDIDO
          </Button>
          <Button onClick={() => setFilterState("pendientes")} variant="outline" className="text-xs text-white border-slate-700 bg-slate-800 hover:bg-slate-700 font-bold">
            FILTRAR PENDIENTES
          </Button>
          <Button onClick={() => setFilterState("terminados")} variant="outline" className="text-xs text-white border-slate-700 bg-slate-800 hover:bg-slate-700 font-bold">
            VER TERMINADOS
          </Button>
        </div>
      </div>
    </div>
  )
}
