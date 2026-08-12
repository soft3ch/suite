"use client"

import * as React from "react"
import { ArrowRightIcon, CalendarIcon, CheckCircle2Icon, ClockIcon, FileTextIcon, PlusIcon, ZapIcon } from "lucide-react"

import type { Pedido } from "@/lib/suite-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type InicioViewProps = {
  pedidos: Pedido[]
  onNewPedido: () => void
  onNavigate: (navKey: any) => void
  onOpenProject: (id: string) => void
}

const STATUS_BADGE_STYLE: Record<string, { label: string; bg: string }> = {
  terminado: { label: "TERMINADO", bg: "bg-slate-200 text-slate-800 font-bold" },
  en_curso: { label: "EN CURSO", bg: "bg-blue-100 text-blue-800 font-bold" },
  pendiente: { label: "PENDIENTE", bg: "bg-amber-100 text-amber-800 font-bold" },
  esperando_material: { label: "ESPERANDO MATERIAL", bg: "bg-slate-200 text-slate-700 font-semibold" },
  nuevo: { label: "NUEVO", bg: "bg-emerald-100 text-emerald-800 font-bold" },
}

export function InicioView({ pedidos, onNewPedido, onNavigate, onOpenProject }: InicioViewProps) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8 space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Inicio</h1>
        <p className="text-sm text-slate-500 font-medium mt-1">Tu empresa en una sola pantalla</p>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border border-slate-200 shadow-sm bg-white">
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              PEDIDOS NUEVOS
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4 px-4">
            <div className="text-3xl font-extrabold font-mono text-slate-900">3</div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm bg-white">
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              TRABAJOS PENDIENTES
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4 px-4">
            <div className="text-3xl font-extrabold font-mono text-slate-900">8</div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm bg-white">
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              PRESUPUESTOS
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4 px-4">
            <div className="text-3xl font-extrabold font-mono text-slate-900">2</div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm bg-white">
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              PARA FACTURAR
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4 px-4">
            <div className="text-3xl font-extrabold font-mono text-slate-900">1</div>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): TRABAJOS DE HOY */}
        <Card className="lg:col-span-2 border border-slate-200 shadow-sm bg-white">
          <CardHeader className="py-4 border-b border-slate-100">
            <CardTitle className="text-base font-bold tracking-tight text-slate-900 uppercase">
              TRABAJOS DE HOY
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 divide-y divide-slate-100">
            {pedidos.map((p) => {
              const st = STATUS_BADGE_STYLE[p.status] || STATUS_BADGE_STYLE["nuevo"]
              return (
                <div key={p.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div>
                    <div className="font-bold text-sm text-slate-900">{p.client}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{p.description}</div>
                  </div>
                  <span className={`text-[10px] px-3 py-1 rounded-full ${st.bg}`}>
                    {st.label}
                  </span>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Right Column (1 col): CONTINUAR DONDE QUEDASTE & ACCIONES RÁPIDAS */}
        <div className="space-y-6">
          <Card className="border border-slate-200 shadow-sm bg-white">
            <CardHeader className="py-4 border-b border-slate-100">
              <CardTitle className="text-sm font-bold tracking-tight text-slate-900 uppercase">
                CONTINUAR DONDE QUEDASTE
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div>
                <div className="font-bold text-sm text-slate-900">Navar</div>
                <div className="text-xs text-slate-500">Resumen de mantenimiento</div>
              </div>
              <div className="border-t pt-2">
                <div className="font-bold text-sm text-slate-900">Isomed</div>
                <div className="text-xs text-slate-500">Presupuesto tablero</div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 shadow-sm bg-white">
            <CardHeader className="py-4 border-b border-slate-100">
              <CardTitle className="text-sm font-bold tracking-tight text-slate-900 uppercase">
                ACCIONES RÁPIDAS
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2.5">
              <Button
                onClick={onNewPedido}
                className="w-full justify-start bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5"
              >
                + NUEVO PEDIDO
              </Button>
              <Button
                onClick={() => onNavigate("presupuestos")}
                className="w-full justify-start bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5"
              >
                + NUEVO PRESUPUESTO
              </Button>
              <Button
                onClick={() => onNavigate("agenda")}
                className="w-full justify-start bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5"
              >
                REGISTRAR TRABAJO
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
