"use client"

import * as React from "react"
import { BarChart3Icon, DownloadIcon, TrendingUpIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ReportesIndicadoresView() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8 space-y-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Reportes e Indicadores</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Convertí la actividad de Electricidad Industrial en información para decidir mejor.
          </p>
        </div>
        <Button className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shrink-0">
          <DownloadIcon className="size-4 mr-1.5" /> EXPORTAR REPORTE
        </Button>
      </div>

      {/* Top 5 Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card className="border border-slate-200 bg-white">
          <CardHeader className="py-2.5 px-3">
            <CardTitle className="text-[10px] font-bold text-slate-500 uppercase">PEDIDOS RECIBIDOS</CardTitle>
          </CardHeader>
          <CardContent className="pb-3 px-3">
            <div className="text-2xl font-black font-mono text-slate-900">38</div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 bg-white">
          <CardHeader className="py-2.5 px-3">
            <CardTitle className="text-[10px] font-bold text-slate-500 uppercase">PRESUPUESTOS</CardTitle>
          </CardHeader>
          <CardContent className="pb-3 px-3">
            <div className="text-2xl font-black font-mono text-slate-900">22</div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 bg-white">
          <CardHeader className="py-2.5 px-3">
            <CardTitle className="text-[10px] font-bold text-slate-500 uppercase">TRABAJOS REALIZADOS</CardTitle>
          </CardHeader>
          <CardContent className="pb-3 px-3">
            <div className="text-2xl font-black font-mono text-slate-900">41</div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 bg-white">
          <CardHeader className="py-2.5 px-3">
            <CardTitle className="text-[10px] font-bold text-slate-500 uppercase">FACTURACIÓN</CardTitle>
          </CardHeader>
          <CardContent className="pb-3 px-3">
            <div className="text-xl font-black font-mono text-slate-900">$ 7.86M</div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 bg-white">
          <CardHeader className="py-2.5 px-3">
            <CardTitle className="text-[10px] font-bold text-slate-500 uppercase">REUTILIZADOS</CardTitle>
          </CardHeader>
          <CardContent className="pb-3 px-3">
            <div className="text-2xl font-black font-mono text-emerald-600">18</div>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Card: ACTIVIDAD POR TIPO DE TRABAJO */}
        <Card className="border border-slate-200 bg-white">
          <CardHeader className="py-4 border-b border-slate-100">
            <CardTitle className="text-sm font-bold text-slate-900 uppercase">ACTIVIDAD POR TIPO DE TRABAJO</CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4 text-xs font-medium">
            {[
              { label: "Mantenimiento", val: 18, pct: "75%" },
              { label: "Tableros", val: 9, pct: "40%" },
              { label: "Automatización", val: 6, pct: "30%" },
              { label: "Fotovoltaica", val: 5, pct: "25%" },
              { label: "Otros", val: 3, pct: "15%" },
            ].map((row) => (
              <div key={row.label} className="space-y-1">
                <div className="flex justify-between font-semibold">
                  <span>{row.label}</span>
                  <span className="font-mono">{row.val}</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-900 rounded-full" style={{ width: row.pct }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Right Card: INDICADORES CLAVE */}
        <Card className="border border-slate-200 bg-slate-900 text-white">
          <CardHeader className="py-4 border-b border-slate-800">
            <CardTitle className="text-sm font-bold text-white uppercase flex items-center gap-2">
              <TrendingUpIcon className="size-4 text-emerald-400" /> INDICADORES CLAVE
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-3 text-xs font-mono">
            <div className="flex justify-between items-center py-1 border-b border-slate-800">
              <span className="text-slate-300">Presupuesto → Trabajo:</span>
              <span className="text-lg font-black text-white">64 %</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-800">
              <span className="text-slate-300">Promedio por presupuesto:</span>
              <span className="text-lg font-black text-white">38 min</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-800">
              <span className="text-slate-300">Reutilización de soluciones:</span>
              <span className="text-lg font-black text-emerald-400">82 %</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-800">
              <span className="text-slate-300">Trabajos facturados:</span>
              <span className="text-lg font-black text-white">91 %</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-300">Horas ahorradas por mes:</span>
              <span className="text-lg font-black text-blue-400">41 h / mes</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
