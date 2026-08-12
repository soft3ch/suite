"use client"

import * as React from "react"
import { CheckIcon, PlusIcon, ShoppingCartIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function ProveedoresCotizacionesView() {
  const [selectedTab, setSelectedTab] = React.useState("fotovoltaico")
  const [selections, setSelections] = React.useState<Record<number, string>>({
    0: "Solar A",
    1: "Solar A",
    2: "Solar A",
    3: "Solar A",
  })

  const rows = [
    { name: "Panel bifacial 615 W", qty: 20, unit: "ud", cableATierra: 5880000, solarA: 5720000, solarB: 5940000 },
    { name: "Inversor on-grid 10 kW", qty: 1, unit: "ud", cableATierra: 2100000, solarA: 2060000, solarB: 2180000 },
    { name: "Cable solar 6 mm²", qty: 150, unit: "m", cableATierra: 240000, solarA: 225000, solarB: 250000 },
    { name: "MC4 par macho/hembra", qty: 10, unit: "par", cableATierra: 28000, solarA: 26500, solarB: 29000 },
  ]

  const totalBestCost = rows.reduce((acc, row, idx) => {
    const chosen = selections[idx] || "Solar A"
    const price = chosen === "Solar A" ? row.solarA : chosen === "Cable a Tierra" ? row.cableATierra : row.solarB
    return acc + price
  }, 0)

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8 space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Proveedores y Cotizaciones</h1>
        <p className="text-sm text-slate-500 font-medium mt-1">
          Convertí la lista de materiales en solicitudes, compará ofertas y llevá el mejor costo al presupuesto.
        </p>
      </div>

      {/* Info Card */}
      <Card className="border border-slate-200 bg-white">
        <CardContent className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400">PROYECTO</span>
            <div className="font-extrabold text-slate-900 text-sm">Proyecto Fotovoltaico — On-Grid 10 kW</div>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400">ESTADO</span>
            <span className="block text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
              COTIZANDO
            </span>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400">LISTAS</span>
            <div className="font-extrabold text-slate-900 text-sm">3 grupos</div>
          </div>
          <Button className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs">
            + NUEVA COTIZACIÓN
          </Button>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2 text-xs font-bold">
        {[
          { key: "fotovoltaico", label: "MATERIALES FOTOVOLTAICOS" },
          { key: "placa", label: "MATERIALES DE PLACA" },
          { key: "canalizacion", label: "CANALIZACIÓN" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSelectedTab(tab.key)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedTab === tab.key
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Comparison Table */}
      <Card className="border border-slate-200 bg-white overflow-hidden shadow-sm">
        <CardHeader className="py-4 border-b border-slate-100">
          <CardTitle className="text-base font-bold text-slate-900 uppercase">COMPARACIÓN DE COTIZACIONES</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 text-[11px] font-extrabold uppercase text-slate-500">
                <TableHead>MATERIAL</TableHead>
                <TableHead className="w-[80px]">CANT.</TableHead>
                <TableHead className="w-[140px] text-right">CABLE A TIERRA</TableHead>
                <TableHead className="w-[140px] text-right text-blue-700 font-black">SOLAR A</TableHead>
                <TableHead className="w-[140px] text-right">SOLAR B</TableHead>
                <TableHead className="w-[80px] text-center">ELEGIR</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r, idx) => (
                <TableRow key={idx} className="text-xs">
                  <TableCell className="font-bold text-slate-900">{r.name}</TableCell>
                  <TableCell className="font-mono">{r.qty} {r.unit}</TableCell>
                  <TableCell className="text-right font-mono">$ {r.cableATierra.toLocaleString("es-ES")}</TableCell>
                  <TableCell className="text-right font-mono font-bold text-blue-700 bg-blue-50/50">$ {r.solarA.toLocaleString("es-ES")}</TableCell>
                  <TableCell className="text-right font-mono">$ {r.solarB.toLocaleString("es-ES")}</TableCell>
                  <TableCell className="text-center">
                    <button
                      onClick={() => setSelections({ ...selections, [idx]: "Solar A" })}
                      className="size-7 rounded bg-slate-900 text-white font-bold text-xs inline-flex items-center justify-center"
                    >
                      A
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Footer Bar */}
      <div className="bg-slate-900 p-4 rounded-xl text-white flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase text-slate-400">PROVEEDORES ACTIVOS</span>
          <div className="text-xs font-semibold text-slate-200 mt-0.5">
            Cable a Tierra • Solar A • Solar B • NEA (instalación eléctrica)
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-[10px] font-bold uppercase text-slate-400">MEJOR COSTO DEL GRUPO</span>
            <div className="text-lg font-black font-mono text-emerald-400">$ {totalBestCost.toLocaleString("es-ES")}</div>
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs">
            INCORPORAR AL PRESUPUESTO →
          </Button>
        </div>
      </div>
    </div>
  )
}
