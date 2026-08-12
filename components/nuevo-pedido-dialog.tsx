"use client"

import * as React from "react"

import type { Pedido, PedidoPriority } from "@/lib/suite-data"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type NuevoPedidoDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSavePedido: (pedido: Pedido, createTarget?: "trabajo" | "presupuesto") => void
}

export function NuevoPedidoDialog({ open, onOpenChange, onSavePedido }: NuevoPedidoDialogProps) {
  const [client, setClient] = React.useState("")
  const [contact, setContact] = React.useState("")
  const [requirementType, setRequirementType] = React.useState<Pedido["requirementType"]>("mantenimiento")
  const [description, setDescription] = React.useState("")
  const [priority, setPriority] = React.useState<PedidoPriority>("normal")

  React.useEffect(() => {
    if (open) {
      setClient("ISOMAD")
      setContact("Hugo / Miguel Angel")
      setRequirementType("mantenimiento")
      setDescription("Cliente solicita mantenimiento correctivo en tablero secadero.\n\nPosible cambio de contactores, revisión del controlador y protecciones.")
      setPriority("normal")
    }
  }, [open])

  function handleSave(target?: "trabajo" | "presupuesto") {
    const newPedido: Pedido = {
      id: `PD-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      client: client.trim() || "Cliente por definir",
      contact: contact.trim() || undefined,
      requirementType,
      description: description.trim() || "Sin descripción especificada.",
      priority,
      status: "nuevo",
      date: new Date().toLocaleDateString("es-ES"),
      nextAction: target === "trabajo" ? "Ejecutar trabajo de campo" : target === "presupuesto" ? "Enviar presupuesto" : "Registrar horas",
    }
    onSavePedido(newPedido, target)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl bg-slate-50 border border-slate-200">
        <DialogHeader className="border-b border-slate-200 pb-4">
          <DialogTitle className="text-2xl font-extrabold text-slate-900">Nuevo Pedido</DialogTitle>
          <DialogDescription className="text-sm text-slate-500 font-medium">
            Registrar el pedido en segundos y continuar con el trabajo
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-2">
          {/* Left Column */}
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">CLIENTE</Label>
              <Input
                value={client}
                onChange={(e) => setClient(e.target.value)}
                placeholder="Buscar cliente: ISOMAD..."
                className="bg-slate-50 font-medium"
              />
              <Input
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Contacto: Hugo / Miguel Angel"
                className="text-xs bg-slate-50 text-slate-600"
              />
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">¿QUÉ NECESITA EL CLIENTE?</Label>
              <div className="space-y-2 text-xs font-bold">
                {[
                  { key: "presupuesto_nuevo", label: "PRESUPUESTO NUEVO" },
                  { key: "modificacion_presupuesto", label: "MODIFICACIÓN DE PRESUPUESTO" },
                  { key: "mantenimiento", label: "MANTENIMIENTO / SERVICIO" },
                  { key: "proyecto_solar", label: "PROYECTO FOTOVOLTAICO" },
                  { key: "automatizacion", label: "AUTOMATIZACIÓN / TABLERO" },
                ].map((item) => (
                  <label
                    key={item.key}
                    onClick={() => setRequirementType(item.key as any)}
                    className={`flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                      requirementType === item.key
                        ? "bg-slate-100 border-slate-900 text-slate-900"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="reqType"
                      checked={requirementType === item.key}
                      onChange={() => {}}
                      className="accent-slate-900"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-4">
            <div>
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">DESCRIPCIÓN DEL PEDIDO</Label>
              <Textarea
                rows={7}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe la solicitud del cliente..."
                className="mt-2 text-xs leading-relaxed bg-slate-50 border-slate-200"
              />
            </div>

            <div>
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">PRIORIDAD</Label>
              <div className="flex gap-2">
                {(["normal", "alta", "urgente"] as PedidoPriority[]).map((pr) => (
                  <button
                    key={pr}
                    type="button"
                    onClick={() => setPriority(pr)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold uppercase border transition-colors ${
                      priority === pr
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {pr}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap gap-2 justify-end mt-2">
          <Button
            type="button"
            onClick={() => handleSave()}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
          >
            GUARDAR PEDIDO
          </Button>

          <Button
            type="button"
            onClick={() => handleSave("trabajo")}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
          >
            GUARDAR Y CREAR TRABAJO
          </Button>

          <Button
            type="button"
            onClick={() => handleSave("presupuesto")}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
          >
            GUARDAR Y CREAR PRESUPUESTO
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="text-xs font-bold"
          >
            CANCELAR
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
