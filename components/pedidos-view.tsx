"use client"

import * as React from "react"

import type { Pedido, PedidoPriority } from "@/lib/suite-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type PedidosViewProps = {
  pedidos: Pedido[]
  onNewPedido: () => void
  onUpdatePedido: (pedido: Pedido) => void
  onDeletePedido: (id: string) => void
  onSavePedido?: (pedido: Pedido, target?: "trabajo" | "presupuesto") => void
}

const REQUIREMENT_OPTIONS: { key: Pedido["requirementType"]; label: string }[] = [
  { key: "presupuesto_nuevo", label: "PRESUPUESTO NUEVO" },
  { key: "modificacion_presupuesto", label: "MODIFICACIÓN DE PRESUPUESTO" },
  { key: "mantenimiento", label: "MANTENIMIENTO / SERVICIO" },
  { key: "proyecto_solar", label: "PROYECTO FOTOVOLTAICO" },
  { key: "automatizacion", label: "AUTOMATIZACIÓN / TABLERO" },
]

export function PedidosView({ pedidos, onSavePedido, onNewPedido }: PedidosViewProps) {
  const [client, setClient] = React.useState("")
  const [contact, setContact] = React.useState("")
  const [requirementType, setRequirementType] =
    React.useState<Pedido["requirementType"]>("mantenimiento")
  const [description, setDescription] = React.useState("")
  const [priority, setPriority] = React.useState<PedidoPriority>("normal")

  function buildPedido(): Pedido {
    return {
      id: `PD-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      client: client.trim() || "Cliente por definir",
      contact: contact.trim() || undefined,
      requirementType,
      description: description.trim() || "Sin descripción especificada.",
      priority,
      status: "nuevo",
      date: new Date().toLocaleDateString("es-ES"),
      nextAction:
        requirementType === "presupuesto_nuevo"
          ? "Enviar presupuesto"
          : requirementType === "mantenimiento"
          ? "Visita técnica"
          : "Definir próxima acción",
    }
  }

  function handleSave(target?: "trabajo" | "presupuesto") {
    const pedido = buildPedido()
    if (onSavePedido) {
      onSavePedido(pedido, target)
    }
    // Reset form
    setClient("")
    setContact("")
    setRequirementType("mantenimiento")
    setDescription("")
    setPriority("normal")
  }

  function handleCancel() {
    setClient("")
    setContact("")
    setRequirementType("mantenimiento")
    setDescription("")
    setPriority("normal")
  }

  return (
    <div className="min-h-[calc(100svh-3.5rem)] bg-slate-50 px-6 py-8 md:px-12">
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Nuevo Pedido
        </h1>
        <p className="text-sm text-slate-500 font-medium mt-1">
          Registrar el pedido en segundos y continuar con el trabajo
        </p>
      </div>

      {/* Two-column body */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl">
        {/* ── LEFT COLUMN ─────────────────────────────────────────── */}
        <div className="space-y-5">
          {/* Cliente */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              CLIENTE
            </p>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400 text-sm select-none">🔍</span>
              <Input
                value={client}
                onChange={(e) => setClient(e.target.value)}
                placeholder="Buscar cliente: ISOMAD..."
                className="pl-8 bg-white border-slate-200 font-semibold text-slate-900 focus:border-slate-400 focus:ring-0"
              />
            </div>
            <p className="text-sm text-slate-500">
              {contact ? `Contacto: ${contact}` : (
                <input
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="Contacto: Hugo / Miguel Angel"
                  className="w-full text-sm text-slate-500 bg-transparent outline-none placeholder:text-slate-400"
                />
              )}
            </p>
          </div>

          {/* ¿Qué necesita el cliente? */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-4">
              ¿QUÉ NECESITA EL CLIENTE?
            </p>
            <div className="space-y-2">
              {REQUIREMENT_OPTIONS.map((opt) => {
                const isActive = requirementType === opt.key
                return (
                  <label
                    key={opt.key}
                    onClick={() => setRequirementType(opt.key)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all select-none ${
                      isActive
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span
                      className={`inline-flex items-center justify-center size-4 rounded-full border-2 shrink-0 ${
                        isActive
                          ? "border-white bg-white"
                          : "border-slate-400 bg-white"
                      }`}
                    >
                      {isActive && (
                        <span className="size-2 rounded-full bg-slate-900 inline-block" />
                      )}
                    </span>
                    <span className="text-xs font-extrabold tracking-wide">
                      {opt.label}
                    </span>
                  </label>
                )
              })}
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN ────────────────────────────────────────── */}
        <div className="space-y-5">
          {/* Descripción */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              DESCRIPCIÓN DEL PEDIDO
            </p>
            <Textarea
              rows={10}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Cliente solicita mantenimiento correctivo en tablero secadero.

Posible cambio de contactores, revisión del controlador y protecciones."
              className="text-sm leading-relaxed text-slate-700 bg-slate-50 border-slate-200 resize-none focus:border-slate-400 focus:ring-0"
            />

            {/* Prioridad */}
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-3">
                PRIORIDAD
              </p>
              <div className="flex gap-2">
                {(["normal", "alta", "urgente"] as PedidoPriority[]).map((pr) => (
                  <button
                    key={pr}
                    type="button"
                    onClick={() => setPriority(pr)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all border-2 ${
                      priority === pr
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white text-slate-500 border-slate-200 hover:border-slate-400 hover:text-slate-700"
                    }`}
                  >
                    {pr}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── ACCIONES ──────────────────────────────────────────────── */}
      <div className="mt-6 max-w-5xl bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-4">
          ACCIONES
        </p>
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => handleSave()}
            className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs tracking-wide px-6 py-3 rounded-xl"
          >
            GUARDAR PEDIDO
          </Button>

          <Button
            onClick={() => handleSave("trabajo")}
            className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs tracking-wide px-6 py-3 rounded-xl"
          >
            GUARDAR Y CREAR TRABAJO
          </Button>

          <Button
            onClick={() => handleSave("presupuesto")}
            className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs tracking-wide px-6 py-3 rounded-xl"
          >
            GUARDAR Y CREAR PRESUPUESTO
          </Button>

          <Button
            type="button"
            onClick={handleCancel}
            variant="outline"
            className="font-extrabold text-xs tracking-wide px-6 py-3 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            CANCELAR
          </Button>
        </div>
      </div>
    </div>
  )
}
