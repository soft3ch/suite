"use client"

import * as React from "react"
import { CarIcon, FuelIcon, SaveIcon, TruckIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function CalculoViaticosView() {
  const [distanceKm, setDistanceKm] = React.useState(260)
  const [fuelLitersPer100Km, setFuelLitersPer100Km] = React.useState(10.5)
  const [fuelPricePerLiter, setFuelPricePerLiter] = React.useState(1450)
  const [foodCost, setFoodCost] = React.useState(35000)

  const totalFuelLiters = (distanceKm * fuelLitersPer100Km) / 100
  const fuelCost = totalFuelLiters * fuelPricePerLiter
  const vehicleMaintenanceCost = distanceKm * 77 // Wear, oil, tires amortization (~77 ARS/km)
  const grandTotal = fuelCost + vehicleMaintenanceCost + foodCost

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8 space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Cálculo de Viáticos y Costo de Vehículo</h1>
        <p className="text-sm text-slate-500 font-medium mt-1">
          El costo real del traslado se calcula con todos los componentes que vos querés recuperar.
        </p>
      </div>

      {/* Header Info */}
      <Card className="border border-slate-200 bg-white">
        <CardContent className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400">TRABAJO</span>
            <div className="font-extrabold text-slate-900 text-sm">NAVAR — Mantenimiento correctivo / Rincón</div>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400">DISTANCIA</span>
            <div className="font-extrabold text-slate-900 text-sm">{distanceKm} km ida y vuelta</div>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400">VEHÍCULO</span>
            <div className="font-extrabold text-slate-900 text-sm">Camioneta propia</div>
          </div>
          <Button className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs">
            GUARDAR CÁLCULO
          </Button>
        </CardContent>
      </Card>

      {/* Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Input Data */}
        <div className="space-y-6">
          <Card className="border border-slate-200 bg-white">
            <CardHeader className="py-4 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-900 uppercase">DATOS DEL VIAJE</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-[11px]">Origen</Label>
                  <Input value="Virasoro" readOnly className="mt-1 bg-slate-50 font-medium" />
                </div>
                <div>
                  <Label className="text-[11px]">Destino</Label>
                  <Input value="Rincón" readOnly className="mt-1 bg-slate-50 font-medium" />
                </div>
              </div>

              <div>
                <Label className="text-[11px]">Km Totales (ida + vuelta)</Label>
                <Input
                  type="number"
                  value={distanceKm}
                  onChange={(e) => setDistanceKm(Number(e.target.value))}
                  className="mt-1 font-mono font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-[11px]">Consumo (L / 100 km)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={fuelLitersPer100Km}
                    onChange={(e) => setFuelLitersPer100Km(Number(e.target.value))}
                    className="mt-1 font-mono"
                  />
                </div>
                <div>
                  <Label className="text-[11px]">Precio Combustible ($ / L)</Label>
                  <Input
                    type="number"
                    value={fuelPricePerLiter}
                    onChange={(e) => setFuelPricePerLiter(Number(e.target.value))}
                    className="mt-1 font-mono"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 bg-white">
            <CardHeader className="py-4 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-900 uppercase">GASTOS ADICIONALES</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-xs">
              <div>
                <Label className="text-[11px]">Comida y viáticos de personal ($)</Label>
                <Input
                  type="number"
                  value={foodCost}
                  onChange={(e) => setFoodCost(Number(e.target.value))}
                  className="mt-1 font-mono font-bold"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Calculated Breakdown */}
        <div className="space-y-6">
          <Card className="border border-slate-200 bg-white">
            <CardHeader className="py-4 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-900 uppercase">COSTOS DEL VEHÍCULO Y VIÁTICO</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table className="text-xs font-mono">
                <TableBody>
                  <TableRow>
                    <TableCell className="font-bold text-slate-900 font-sans">Combustible</TableCell>
                    <TableCell className="text-right font-bold">$ {fuelCost.toLocaleString("es-ES")}</TableCell>
                    <TableCell className="text-slate-400 text-[10px] text-right font-sans">Por km</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-sans">Service de aceite & filtros</TableCell>
                    <TableCell className="text-right">$ 3.120</TableCell>
                    <TableCell className="text-slate-400 text-[10px] text-right font-sans">Amortización por km</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-sans">Batería & Cubiertas</TableCell>
                    <TableCell className="text-right">$ 4.810</TableCell>
                    <TableCell className="text-slate-400 text-[10px] text-right font-sans">Amortización por km</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-sans">Seguro proporcional</TableCell>
                    <TableCell className="text-right">$ 4.300</TableCell>
                    <TableCell className="text-slate-400 text-[10px] text-right font-sans">Costo por viaje</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-sans">Desgaste general</TableCell>
                    <TableCell className="text-right">$ 6.240</TableCell>
                    <TableCell className="text-slate-400 text-[10px] text-right font-sans">Amortización por km</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-sans font-bold text-slate-900">Comida / Personal</TableCell>
                    <TableCell className="text-right font-bold">$ {foodCost.toLocaleString("es-ES")}</TableCell>
                    <TableCell className="text-slate-400 text-[10px] text-right font-sans">Personal</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Grand Total Card */}
          <div className="bg-slate-900 p-6 rounded-xl text-white space-y-2">
            <span className="text-xs font-bold uppercase text-slate-400">RESUMEN DEL VIÁTICO</span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black font-mono text-emerald-400">$ {grandTotal.toLocaleString("es-ES")}</span>
              <span className="text-xs text-slate-400 font-mono">$ {(grandTotal / distanceKm).toFixed(2)} / km</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="bg-slate-900 p-4 rounded-xl flex flex-wrap gap-3 items-center justify-between text-white">
        <div className="flex flex-wrap gap-2">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs">
            INCORPORAR AL PRESUPUESTO
          </Button>
          <Button variant="outline" className="text-xs text-white border-slate-700 bg-slate-800 hover:bg-slate-700 font-bold">
            INCORPORAR AL RESUMEN
          </Button>
        </div>
      </div>
    </div>
  )
}
