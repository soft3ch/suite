"use client"

import * as React from "react"
import { SunMediumIcon, ZapIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function FotovoltaicaView() {
  const [filterType, setFilterType] = React.useState("on_grid")
  const [selectedConfig, setSelectedConfig] = React.useState("On-Grid 10 kW")

  const configs = [
    {
      id: "SOL-OG-10",
      title: "On-Grid 10 kW",
      type: "on_grid",
      reuseRate: "94 %",
      panels: "20 × 615 W",
      powerDc: "12,30 kWp",
      inverter: "1 inversor 10 kW trifásico",
      strings: "2 strings (2 × 10 paneles)",
    },
    {
      id: "SOL-OG-20",
      title: "On-Grid 20 kW",
      type: "on_grid",
      reuseRate: "88 %",
      panels: "32 × 625 W",
      powerDc: "20,00 kWp",
      inverter: "1 inversor 20 kW trifásico",
      strings: "2 strings",
    },
    {
      id: "SOL-OF-6",
      title: "Off-Grid 6 kW",
      type: "off_grid",
      reuseRate: "91 %",
      panels: "12 × 585 W",
      powerDc: "7,02 kWp",
      inverter: "SPF 6000 + 2 bancos 48V",
      strings: "2 strings",
    },
    {
      id: "SOL-OF-3",
      title: "Off-Grid 3 kW",
      type: "off_grid",
      reuseRate: "86 %",
      panels: "6 × 550 W",
      powerDc: "3,30 kWp",
      inverter: "Must 3.2 kW",
      strings: "3 strings",
    },
  ]

  const activeSol = configs.find((c) => c.title === selectedConfig) || configs[0]

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8 space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Biblioteca y Configurador Fotovoltaico</h1>
        <p className="text-sm text-slate-500 font-medium mt-1">
          Configuraciones reutilizables para acelerar proyectos solares repetitivos.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 text-xs font-bold">
        {[
          { key: "all", label: "TODOS" },
          { key: "on_grid", label: "ON-GRID" },
          { key: "off_grid", label: "OFF-GRID" },
          { key: "hibrido", label: "HÍBRIDO" },
          { key: "techo", label: "TECHO" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilterType(f.key)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filterType === f.key
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Grid of Solar Config Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {configs.map((item) => (
          <Card
            key={item.id}
            className={`border transition-all bg-white cursor-pointer ${
              selectedConfig === item.title ? "border-slate-900 ring-2 ring-slate-900/10 shadow-md" : "border-slate-200 shadow-sm hover:border-slate-400"
            }`}
            onClick={() => setSelectedConfig(item.title)}
          >
            <CardHeader className="py-4 px-5 flex flex-row items-center justify-between border-b border-slate-100">
              <div className="flex items-center gap-2">
                <SunMediumIcon className="size-5 text-amber-500" />
                <CardTitle className="text-base font-extrabold text-slate-900">{item.title}</CardTitle>
              </div>
              <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">
                {item.reuseRate} reutilización
              </span>
            </CardHeader>
            <CardContent className="p-5 space-y-2 text-xs text-slate-600 font-medium">
              <div>• Paneles: {item.panels}</div>
              <div>• Inversor: {item.inverter}</div>
              <div>• Configuración: {item.strings}</div>

              <div className="pt-3">
                <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedConfig(item.title)
                  }}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
                >
                  USAR CONFIGURACIÓN
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detail Preview Card */}
      <Card className="border border-slate-200 bg-white">
        <CardHeader className="py-4 border-b border-slate-100">
          <CardTitle className="text-sm font-extrabold text-slate-900 uppercase">
            CONFIGURACIÓN SELECCIONADA — {activeSol.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-xs font-mono">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase font-sans">Paneles</span>
              <div className="font-bold text-slate-900 mt-1">{activeSol.panels}</div>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase font-sans">Potencia DC</span>
              <div className="font-bold text-slate-900 mt-1">{activeSol.powerDc}</div>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase font-sans">Inversor</span>
              <div className="font-bold text-slate-900 mt-1">10 kW trifásico</div>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase font-sans">Strings</span>
              <div className="font-bold text-slate-900 mt-1">2 × 10 paneles</div>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase font-sans">Canalización</span>
              <div className="font-bold text-slate-900 mt-1">Variable según obra</div>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase font-sans">Estructura</span>
              <div className="font-bold text-slate-900 mt-1">Según superficie</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Footer */}
      <div className="bg-slate-900 p-4 rounded-xl flex flex-wrap gap-2 items-center justify-between text-white">
        <div className="flex flex-wrap gap-2">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs">
            NUEVA CONFIGURACIÓN
          </Button>
          <Button variant="outline" className="text-xs text-white border-slate-700 bg-slate-800 hover:bg-slate-700 font-bold">
            DUPLICAR
          </Button>
          <Button variant="outline" className="text-xs text-white border-slate-700 bg-slate-800 hover:bg-slate-700 font-bold">
            EDITAR
          </Button>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs">
          CREAR PROYECTO →
        </Button>
      </div>
    </div>
  )
}
