"use client"

import * as React from "react"
import { PlusIcon, SearchIcon, UserIcon } from "lucide-react"

import type { Pedido } from "@/lib/suite-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

// ── Types ──────────────────────────────────────────────────────────────────

type ActivityItem = {
  date: string
  type: "Trabajo" | "Resumen" | "Factura" | "Presupuesto" | "Pedido"
  description: string
  status: string
}

type Cliente = {
  id: string
  name: string
  contact: string
  lastContact: string
  saldo: number
  stats: {
    pedidosAbiertos: number
    presupuestosEnviados: number
    trabajosRealizados: number
    resumenesEmitidos: number
    facturasPendientes: number
    proyectosFotovoltaicos: number
  }
  activity: ActivityItem[]
}

type ClientesViewProps = {
  onNewPedido: () => void
  onNavigate: (key: any) => void
}

// ── Mock data ───────────────────────────────────────────────────────────────

const MOCK_CLIENTS: Cliente[] = [
  {
    id: "CLI-001",
    name: "NAVAR",
    contact: "Hugo / Miguel Angel",
    lastContact: "11/08/2026",
    saldo: 293000,
    stats: {
      pedidosAbiertos: 3,
      presupuestosEnviados: 4,
      trabajosRealizados: 18,
      resumenesEmitidos: 7,
      facturasPendientes: 1,
      proyectosFotovoltaicos: 2,
    },
    activity: [
      { date: "11/08/26", type: "Trabajo", description: "Mantenimiento correctivo", status: "En curso" },
      { date: "05/08/26", type: "Resumen", description: "Trabajos preventivos/correctivos", status: "Generado" },
      { date: "05/08/26", type: "Factura", description: "Resumen 293.000", status: "Emitida" },
      { date: "02/08/26", type: "Presupuesto", description: "Tablero corrector", status: "Enviado" },
      { date: "29/07/26", type: "Pedido", description: "Falla iluminación perimetral", status: "Cerrado" },
    ],
  },
  {
    id: "CLI-002",
    name: "ISOMAD",
    contact: "Ing. Barros",
    lastContact: "10/08/2026",
    saldo: 145000,
    stats: {
      pedidosAbiertos: 1,
      presupuestosEnviados: 2,
      trabajosRealizados: 9,
      resumenesEmitidos: 3,
      facturasPendientes: 2,
      proyectosFotovoltaicos: 0,
    },
    activity: [
      { date: "10/08/26", type: "Pedido", description: "Mantenimiento tablero secadero", status: "Pendiente" },
      { date: "01/08/26", type: "Presupuesto", description: "Tablero automatismo secadero", status: "Enviado" },
      { date: "20/07/26", type: "Trabajo", description: "Cambio de contactores línea 2", status: "Terminado" },
    ],
  },
  {
    id: "CLI-003",
    name: "ROCA SUR",
    contact: "Lic. Romero",
    lastContact: "08/08/2026",
    saldo: 0,
    stats: {
      pedidosAbiertos: 1,
      presupuestosEnviados: 1,
      trabajosRealizados: 2,
      resumenesEmitidos: 1,
      facturasPendientes: 0,
      proyectosFotovoltaicos: 1,
    },
    activity: [
      { date: "08/08/26", type: "Pedido", description: "Sistema fotovoltaico on-grid 10 kW", status: "Nuevo" },
      { date: "01/08/26", type: "Presupuesto", description: "Solar 10 kW depósito", status: "En revisión" },
    ],
  },
]

const TYPE_PILL: Record<ActivityItem["type"], string> = {
  Trabajo: "bg-blue-100 text-blue-800",
  Resumen: "bg-slate-100 text-slate-700",
  Factura: "bg-emerald-100 text-emerald-800",
  Presupuesto: "bg-amber-100 text-amber-800",
  Pedido: "bg-purple-100 text-purple-800",
}

const TABS = [
  "RESUMEN", "PEDIDOS", "TRABAJOS", "PRESUPUESTOS",
  "RESÚMENES", "FACTURAS", "MATERIALES", "DOCUMENTOS",
] as const
type Tab = typeof TABS[number]

// ── Component ───────────────────────────────────────────────────────────────

export function ClientesView({ onNewPedido, onNavigate }: ClientesViewProps) {
  const [search, setSearch] = React.useState("")
  const [selectedId, setSelectedId] = React.useState(MOCK_CLIENTS[0].id)
  const [activeTab, setActiveTab] = React.useState<Tab>("RESUMEN")

  const filtered = MOCK_CLIENTS.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  )

  const client = MOCK_CLIENTS.find((c) => c.id === selectedId) ?? MOCK_CLIENTS[0]

  return (
    <div className="flex flex-col h-[calc(100svh-3.5rem)]">
      {/* ── Page Header ───────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between gap-4 no-print shrink-0">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Cliente</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Toda la historia del cliente en un solo lugar.
          </p>
        </div>
        <Button
          onClick={onNewPedido}
          className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shrink-0"
        >
          <PlusIcon className="size-4 mr-1.5" />
          NUEVO PEDIDO
        </Button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* ── LEFT: Client list ─────────────────────────────────── */}
        <div className="w-52 shrink-0 border-r border-slate-200 bg-white flex flex-col overflow-hidden">
          <div className="p-3 border-b border-slate-100">
            <div className="relative">
              <SearchIcon className="size-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <Input
                placeholder="Buscar cliente..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-8 text-xs bg-slate-50 border-slate-200"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filtered.map((c) => (
              <button
                key={c.id}
                onClick={() => { setSelectedId(c.id); setActiveTab("RESUMEN") }}
                className={`w-full text-left px-4 py-3 transition-colors hover:bg-slate-50 ${
                  selectedId === c.id
                    ? "bg-slate-100 border-l-4 border-l-slate-900"
                    : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="size-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-[11px] font-black shrink-0">
                    {c.name[0]}
                  </div>
                  <div>
                    <div className="font-extrabold text-xs text-slate-900">{c.name}</div>
                    <div className="text-[10px] text-slate-400 font-medium">{c.contact}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
          <div className="p-3 border-t border-slate-100">
            <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] py-1.5">
              <PlusIcon className="size-3.5 mr-1" /> NUEVO CLIENTE
            </Button>
          </div>
        </div>

        {/* ── RIGHT: Detail ─────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto bg-slate-50">
          <div className="px-6 py-6 space-y-5 max-w-5xl">

            {/* ── Client header card ──────────────────────────── */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-6 py-5">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                    CLIENTE
                  </p>
                  <p className="text-xl font-extrabold text-slate-900">{client.name}</p>
                  <p className="text-xs text-slate-500 font-medium">
                    Contacto: {client.contact}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                    ÚLTIMO CONTACTO
                  </p>
                  <p className="text-base font-bold text-slate-900">{client.lastContact}</p>
                </div>
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                    SALDO
                  </p>
                  <p className="text-xl font-extrabold text-slate-900 font-mono">
                    $ {client.saldo.toLocaleString("es-ES")}
                  </p>
                </div>
                <div className="flex justify-end">
                  <Button
                    onClick={onNewPedido}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-5"
                  >
                    + NUEVO PEDIDO
                  </Button>
                </div>
              </div>
            </div>

            {/* ── Tabs ────────────────────────────────────────── */}
            <div className="flex gap-1 flex-wrap border-b border-slate-200 pb-0">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2.5 text-[11px] font-extrabold tracking-wide transition-all border-b-2 -mb-px ${
                    activeTab === tab
                      ? "border-slate-900 text-slate-900"
                      : "border-transparent text-slate-400 hover:text-slate-700"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* ── Tab: RESUMEN ────────────────────────────────── */}
            {activeTab === "RESUMEN" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Última actividad */}
                <Card className="border border-slate-200 bg-white shadow-sm">
                  <CardHeader className="py-4 border-b border-slate-100 px-5">
                    <CardTitle className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                      ÚLTIMA ACTIVIDAD
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 divide-y divide-slate-100">
                    {client.activity.map((item, idx) => (
                      <div key={idx} className="px-5 py-3.5 flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <span className="text-[10px] font-mono text-slate-400 w-16 shrink-0 pt-0.5">
                            {item.date}
                          </span>
                          <div>
                            <span
                              className={`inline-block text-[10px] font-extrabold px-2 py-0.5 rounded-full mb-1 ${TYPE_PILL[item.type]}`}
                            >
                              {item.type}
                            </span>
                            <p className="text-xs font-semibold text-slate-900">
                              {item.description}
                            </p>
                            <p className="text-[10px] font-bold text-slate-500">
                              {item.status}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Información rápida */}
                <div className="space-y-4">
                  <Card className="border border-slate-200 bg-white shadow-sm">
                    <CardHeader className="py-4 border-b border-slate-100 px-5">
                      <CardTitle className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                        INFORMACIÓN RÁPIDA
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 divide-y divide-slate-100">
                      {[
                        { label: "Pedidos abiertos", val: client.stats.pedidosAbiertos },
                        { label: "Presupuestos enviados", val: client.stats.presupuestosEnviados },
                        { label: "Trabajos realizados", val: client.stats.trabajosRealizados },
                        { label: "Resúmenes emitidos", val: client.stats.resumenesEmitidos },
                        { label: "Facturas pendientes", val: client.stats.facturasPendientes },
                        { label: "Proyectos fotovoltaicos", val: client.stats.proyectosFotovoltaicos },
                      ].map((row) => (
                        <div key={row.label} className="px-5 py-3 flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-600">{row.label}</span>
                          <span className="text-base font-extrabold text-slate-900 font-mono">
                            {row.val}
                          </span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Acciones */}
                  <Card className="border border-slate-200 bg-white shadow-sm">
                    <CardHeader className="py-3 border-b border-slate-100 px-5">
                      <CardTitle className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                        ACCIONES
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 space-y-2">
                      {[
                        { label: "VER ÚLTIMO PRESUPUESTO", onClick: () => onNavigate("presupuestos") },
                        { label: "VER ÚLTIMO RESUMEN", onClick: () => onNavigate("resumenes") },
                        { label: "VER CUENTA CORRIENTE", onClick: () => onNavigate("cuentas") },
                      ].map((btn) => (
                        <button
                          key={btn.label}
                          onClick={btn.onClick}
                          className="w-full text-left px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-[11px] font-extrabold text-slate-700 rounded-lg transition-colors tracking-wide"
                        >
                          {btn.label}
                        </button>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* ── Other tabs (placeholder) ────────────────────── */}
            {activeTab !== "RESUMEN" && (
              <Card className="border border-slate-200 bg-white shadow-sm">
                <CardContent className="p-10 text-center text-slate-400">
                  <p className="text-sm font-bold">
                    Sección <span className="text-slate-700">{activeTab}</span> de{" "}
                    <span className="text-slate-700">{client.name}</span> — en construcción.
                  </p>
                </CardContent>
              </Card>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
