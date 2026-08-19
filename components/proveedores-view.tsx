"use client"

import * as React from "react"
import { MessageSquareIcon, PhoneIcon, PlusIcon, SearchIcon, Trash2Icon, TruckIcon } from "lucide-react"

import type { Proveedor } from "@/lib/suite-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

type ProveedoresViewProps = {
  proveedores: Proveedor[]
  onSaveProveedor: (proveedor: Proveedor) => void
  onDeleteProveedor: (id: string) => void
}

export function ProveedoresView({
  proveedores,
  onSaveProveedor,
  onDeleteProveedor,
}: ProveedoresViewProps) {
  const [search, setSearch] = React.useState("")
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editingProveedor, setEditingProveedor] = React.useState<Proveedor | null>(null)

  // Form State
  const [name, setName] = React.useState("")
  const [rubro, setRubro] = React.useState("")
  const [contact, setContact] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [whatsapp, setWhatsapp] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [condicionesPago, setCondicionesPago] = React.useState("")
  const [notes, setNotes] = React.useState("")

  function openCreate() {
    setEditingProveedor(null)
    setName("")
    setRubro("Cables y Materiales Eléctricos")
    setContact("")
    setPhone("")
    setWhatsapp("")
    setEmail("")
    setCondicionesPago("Transferencia 15 días")
    setNotes("")
    setDialogOpen(true)
  }

  function openEdit(prov: Proveedor) {
    setEditingProveedor(prov)
    setName(prov.name)
    setRubro(prov.rubro)
    setContact(prov.contact || "")
    setPhone(prov.phone || "")
    setWhatsapp(prov.whatsapp || "")
    setEmail(prov.email || "")
    setCondicionesPago(prov.condicionesPago || "")
    setNotes(prov.notes || "")
    setDialogOpen(true)
  }

  function handleSave() {
    if (!name.trim()) return
    const prov: Proveedor = {
      id: editingProveedor?.id || `prov-${Date.now()}`,
      name: name.trim(),
      rubro: rubro.trim() || "General",
      contact: contact.trim() || undefined,
      phone: phone.trim() || undefined,
      whatsapp: whatsapp.trim() || undefined,
      email: email.trim() || undefined,
      condicionesPago: condicionesPago.trim() || undefined,
      notes: notes.trim() || undefined,
    }
    onSaveProveedor(prov)
    setDialogOpen(false)
  }

  const filtered = React.useMemo(() => {
    const q = search.toLowerCase()
    return proveedores.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.rubro.toLowerCase().includes(q) ||
        (p.contact && p.contact.toLowerCase().includes(q))
    )
  }, [proveedores, search])

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Proveedores</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Directorio de contactos para solicitar cotizaciones de materiales y equipos.
          </p>
        </div>
        <Button onClick={openCreate} className="bg-slate-900 text-white font-bold text-xs">
          <PlusIcon className="size-4 mr-1.5" /> + NUEVO PROVEEDOR
        </Button>
      </div>

      <div className="w-full md:w-80 relative">
        <SearchIcon className="size-4 absolute left-3 top-2.5 text-slate-400" />
        <Input
          placeholder="Buscar proveedor o rubro..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-9 text-xs bg-white"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((prov) => (
          <Card key={prov.id} className="border border-slate-200 bg-white hover:border-slate-300 transition-all shadow-sm">
            <CardHeader className="py-3 px-4 border-b bg-slate-50/50 flex flex-row items-start justify-between">
              <div>
                <CardTitle className="text-sm font-extrabold text-slate-900">{prov.name}</CardTitle>
                <p className="text-[11px] text-blue-600 font-semibold">{prov.rubro}</p>
              </div>
              <button
                onClick={() => onDeleteProveedor(prov.id)}
                className="text-slate-400 hover:text-red-600 transition-colors"
              >
                <Trash2Icon className="size-3.5" />
              </button>
            </CardHeader>

            <CardContent className="p-4 space-y-2 text-xs text-slate-600">
              {prov.contact && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Contacto:</span>
                  <span className="font-bold text-slate-800">{prov.contact}</span>
                </div>
              )}
              {prov.phone && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Teléfono:</span>
                  <span className="font-mono text-slate-800">{prov.phone}</span>
                </div>
              )}
              {prov.condicionesPago && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Condición:</span>
                  <span className="font-semibold text-slate-700">{prov.condicionesPago}</span>
                </div>
              )}
              {prov.notes && (
                <div className="pt-2 border-t text-[11px] text-slate-500 italic">
                  "{prov.notes}"
                </div>
              )}

              <div className="pt-3 flex gap-2">
                {(() => {
                  const waNumber = (prov.whatsapp || prov.phone || "").replace(/\D/g, "")
                  const href = waNumber ? `https://wa.me/${waNumber}` : `https://wa.me/`
                  return (
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm"
                    >
                      <MessageSquareIcon className="size-3.5" /> WhatsApp
                    </a>
                  )
                })()}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openEdit(prov)}
                  className="text-xs font-bold"
                >
                  Editar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal Alta / Edición Proveedor */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader className="border-b pb-3">
            <DialogTitle className="text-base font-bold text-slate-900">
              {editingProveedor ? "Editar Proveedor" : "Nuevo Proveedor"}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Ingresá los datos de contacto y condiciones comerciales.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div>
              <Label className="text-[11px]">Nombre / Empresa</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ej. Cable a Tierra..."
                className="mt-1 font-bold"
              />
            </div>

            <div>
              <Label className="text-[11px]">Rubro Principal</Label>
              <Input
                value={rubro}
                onChange={(e) => setRubro(e.target.value)}
                placeholder="ej. Cables, Puesta a Tierra, Paneles..."
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-[11px]">Contacto</Label>
                <Input
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="ej. Mariano"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-[11px]">Teléfono / WhatsApp</Label>
                <Input
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="+54 9 3764..."
                  className="mt-1 font-mono"
                />
              </div>
            </div>

            <div>
              <Label className="text-[11px]">Condición de Pago habitual</Label>
              <Input
                value={condicionesPago}
                onChange={(e) => setCondicionesPago(e.target.value)}
                placeholder="ej. Transferencia 15 días / Contado"
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-[11px]">Notas / Descuentos</Label>
              <Textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="ej. 5% de descuento por pago al contado..."
                className="mt-1 text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t pt-3">
            <Button variant="outline" size="sm" onClick={() => setDialogOpen(false)} className="text-xs">
              Cancelar
            </Button>
            <Button size="sm" onClick={handleSave} className="bg-slate-900 text-white font-bold text-xs">
              Guardar Proveedor
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
