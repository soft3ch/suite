"use client"

import * as React from "react"
import {
  CheckIcon,
  CopyIcon,
  DollarSignIcon,
  MessageSquareIcon,
  PlusIcon,
  PrinterIcon,
  SendIcon,
  SparklesIcon,
  Trash2Icon,
  TruckIcon,
} from "lucide-react"

import type { MaterialRubro, Proveedor } from "@/lib/suite-data"
import { Badge } from "@/components/ui/badge"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export type MaterialItemCotizacion = {
  id: string
  nombre: string
  cantidad: number
  unidad: string
}

export type CotizacionProveedorRespuesta = {
  proveedorId: string
  proveedorNombre: string
  montoOfrecido: number
  comprobanteNumero?: string
  notas?: string
}

type SolicitudCotizacionDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  proveedores: Proveedor[]
  initialMaterials?: MaterialItemCotizacion[]
  onApplyWinningQuote: (proveedorNombre: string, monto: number, comprobante?: string) => void
}

export function SolicitudCotizacionDialog({
  open,
  onOpenChange,
  proveedores,
  initialMaterials = [],
  onApplyWinningQuote,
}: SolicitudCotizacionDialogProps) {
  const [activeStep, setActiveStep] = React.useState<"solicitar" | "comparar">("solicitar")

  // Materials list for quote request (NO prices)
  const [materials, setMaterials] = React.useState<MaterialItemCotizacion[]>([])
  const [selectedProveedorIds, setSelectedProveedorIds] = React.useState<string[]>([])
  const [copiedSuccess, setCopiedSuccess] = React.useState(false)

  // Supplier responses for comparison
  const [respuestas, setRespuestas] = React.useState<CotizacionProveedorRespuesta[]>([])

  const prevOpenRef = React.useRef(false)

  React.useEffect(() => {
    // Only initialize when dialog transitions from closed (false) to open (true)
    if (open && !prevOpenRef.current) {
      if (initialMaterials && initialMaterials.length > 0) {
        setMaterials([...initialMaterials])
      } else {
        setMaterials([
          { id: "m1", nombre: "Cañería Daisa 3/4 + Cajas de paso", cantidad: 74, unidad: "mts" },
          { id: "m2", nombre: "Cable solar 6 mm² (bobina)", cantidad: 150, unidad: "mts" },
          { id: "m3", nombre: "Conectores MC4 par macho/hembra", cantidad: 10, unidad: "par" },
        ])
      }
      setSelectedProveedorIds(proveedores.map((p) => p.id))
      setRespuestas(
        proveedores.slice(0, 3).map((p, idx) => ({
          proveedorId: p.id,
          proveedorNombre: p.name,
          montoOfrecido: idx === 0 ? 932068 : idx === 1 ? 890000 : 950000,
          comprobanteNumero: `0001-000295${30 + idx}-x`,
        }))
      )
    }
    prevOpenRef.current = open
  }, [open, initialMaterials, proveedores])

  function handleAddMaterial() {
    setMaterials((prev) => [
      ...prev,
      {
        id: `mat-${Date.now()}-${prev.length + 1}`,
        nombre: "",
        cantidad: 1,
        unidad: "ud",
      },
    ])
  }

  function handleUpdateMaterial(id: string, field: keyof MaterialItemCotizacion, value: any) {
    setMaterials((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    )
  }

  function handleRemoveMaterial(id: string) {
    setMaterials((prev) => prev.filter((m) => m.id !== id))
  }

  function toggleProveedor(id: string) {
    setSelectedProveedorIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    )
  }

  // Generate WhatsApp text without prices
  function buildWhatsAppText(proveedorNombre: string) {
    let txt = `Hola ${proveedorNombre}, te solicito cotización para los siguientes materiales para Virasoro Electricidad Industrial:\n\n`
    materials.forEach((m, i) => {
      txt += `${i + 1}. ${m.nombre} — ${m.cantidad} ${m.unidad}\n`
    })
    txt += `\n¡Gracias! Quedo a la espera de tu respuesta.`
    return txt
  }

  function handleCopyText(proveedorNombre: string) {
    const txt = buildWhatsAppText(proveedorNombre)
    navigator.clipboard.writeText(txt)
    setCopiedSuccess(true)
    setTimeout(() => setCopiedSuccess(false), 2000)
  }

  function handleOpenWhatsApp(prov: Proveedor) {
    const txt = encodeURIComponent(buildWhatsAppText(prov.name))
    const phone = prov.whatsapp ? prov.whatsapp.replace(/\D/g, "") : ""
    const url = phone ? `https://wa.me/${phone}?text=${txt}` : `https://wa.me/?text=${txt}`
    window.open(url, "_blank")
  }

  function handleUpdateRespuesta(provId: string, field: keyof CotizacionProveedorRespuesta, value: any) {
    setRespuestas((prev) =>
      prev.map((r) => (r.proveedorId === provId ? { ...r, [field]: value } : r))
    )
  }

  function handleSelectWinner(r: CotizacionProveedorRespuesta) {
    onApplyWinningQuote(r.proveedorNombre, r.montoOfrecido, r.comprobanteNumero)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl bg-white text-slate-900">
        <DialogHeader className="border-b pb-3">
          <div className="flex justify-between items-center pr-6">
            <div>
              <DialogTitle className="text-lg font-black text-slate-900">
                Solicitud de Cotización a Proveedores
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Enviá la lista de materiales sin precios a varios proveedores y elegí la mejor oferta.
              </DialogDescription>
            </div>
            {/* Step Selector */}
            <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveStep("solicitar")}
                className={`px-3 py-1 text-xs font-extrabold rounded-md transition-all ${
                  activeStep === "solicitar"
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-200"
                }`}
              >
                1. Lista & Envíos
              </button>
              <button
                onClick={() => setActiveStep("comparar")}
                className={`px-3 py-1 text-xs font-extrabold rounded-md transition-all ${
                  activeStep === "comparar"
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-200"
                }`}
              >
                2. Comparar & Elegir Ganador
              </button>
            </div>
          </div>
        </DialogHeader>

        {/* ── STEP 1: SOLICITAR (LISTA DE MATERIALES SIN PRECIOS + ENVÍO A PROVEEDORES) ── */}
        {activeStep === "solicitar" && (
          <div className="space-y-4 py-2 text-xs">
            {/* Materials List Box */}
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
              <div className="bg-slate-100 p-3 flex justify-between items-center border-b">
                <span className="font-extrabold text-slate-700 uppercase text-[11px]">
                  MATERIALES A COTIZAR (SOLO CANTIDAD, SIN PRECIOS)
                </span>
                <Button size="sm" variant="outline" onClick={handleAddMaterial} className="text-xs h-7">
                  <PlusIcon className="size-3.5 mr-1" /> Añadir Material
                </Button>
              </div>

              <div className="divide-y divide-slate-200 max-h-56 overflow-y-auto">
                {materials.map((m, idx) => (
                  <div key={m.id} className="p-2.5 grid grid-cols-12 gap-2 items-center bg-white">
                    <div className="col-span-7">
                      <Input
                        value={m.nombre}
                        onChange={(e) => handleUpdateMaterial(m.id, "nombre", e.target.value)}
                        placeholder="ej. Cable solar 6 mm²..."
                        className="text-xs font-bold bg-slate-50"
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        value={m.cantidad}
                        onChange={(e) =>
                          handleUpdateMaterial(m.id, "cantidad", Number(e.target.value))
                        }
                        className="text-xs font-mono text-center font-bold"
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        value={m.unidad}
                        onChange={(e) => handleUpdateMaterial(m.id, "unidad", e.target.value)}
                        placeholder="mts/ud"
                        className="text-xs text-center"
                      />
                    </div>
                    <div className="col-span-1 flex justify-center">
                      <button
                        onClick={() => handleRemoveMaterial(m.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2Icon className="size-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Select Suppliers to Send */}
            <div className="space-y-2">
              <span className="font-extrabold text-slate-700 uppercase text-[11px]">
                ENVIAR SOLICITUD A LOS SIGUIENTES PROVEEDORES:
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {proveedores.map((prov) => {
                  const isSelected = selectedProveedorIds.includes(prov.id)
                  return (
                    <div
                      key={prov.id}
                      className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
                        isSelected ? "border-slate-900 bg-slate-50" : "border-slate-200 bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleProveedor(prov.id)}
                          className="accent-slate-900 size-4 rounded"
                        />
                        <div>
                          <div className="font-bold text-slate-900 text-xs">{prov.name}</div>
                          <div className="text-[10px] text-slate-500">{prov.rubro}</div>
                        </div>
                      </div>

                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          onClick={() => handleOpenWhatsApp(prov)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] h-7 px-2"
                        >
                          <MessageSquareIcon className="size-3 mr-1" /> WhatsApp
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCopyText(prov.name)}
                          className="text-[10px] h-7 px-2 font-bold"
                        >
                          <CopyIcon className="size-3 mr-1" /> Copiar
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {copiedSuccess && (
              <div className="text-center text-xs font-bold text-emerald-600 animate-fade-in">
                ✓ Texto formateado copiado al portapapeles.
              </div>
            )}

            <div className="flex justify-between border-t pt-3">
              <Button variant="outline" size="sm" onClick={() => onOpenChange(false)} className="text-xs">
                Cerrar
              </Button>
              <Button
                size="sm"
                onClick={() => setActiveStep("comparar")}
                className="bg-slate-900 text-white font-bold text-xs"
              >
                Paso 2: Registrar Respuestas y Comparar →
              </Button>
            </div>
          </div>
        )}

        {/* ── STEP 2: COMPARAR OFERTAS Y ELEGIR GANADOR ── */}
        {activeStep === "comparar" && (
          <div className="space-y-4 py-2 text-xs">
            <p className="text-xs text-slate-600 font-medium">
              Cargá los precios cotizados por cada proveedor al responder y elegí con un clic la mejor opción para volcar al presupuesto.
            </p>

            <Table className="border border-slate-200 text-xs">
              <TableHeader className="bg-slate-100">
                <TableRow>
                  <TableHead className="font-bold">PROVEEDOR</TableHead>
                  <TableHead className="w-[180px] font-bold">N° COMPROBANTE / OFERTA</TableHead>
                  <TableHead className="w-[160px] font-bold text-right">MONTO COTIZADO ($)</TableHead>
                  <TableHead className="w-[140px] text-right">SELECCIÓN</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {respuestas.map((r) => (
                  <TableRow key={r.proveedorId} className="align-middle">
                    <TableCell className="font-extrabold text-slate-900">
                      {r.proveedorNombre}
                    </TableCell>
                    <TableCell>
                      <Input
                        value={r.comprobanteNumero || ""}
                        onChange={(e) =>
                          handleUpdateRespuesta(r.proveedorId, "comprobanteNumero", e.target.value)
                        }
                        placeholder="0001-00029530-x"
                        className="h-8 font-mono text-xs"
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Input
                        type="number"
                        value={r.montoOfrecido}
                        onChange={(e) =>
                          handleUpdateRespuesta(r.proveedorId, "montoOfrecido", Number(e.target.value))
                        }
                        className="h-8 font-mono font-bold text-right text-xs"
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        onClick={() => handleSelectWinner(r)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] h-8 px-3"
                      >
                        <CheckIcon className="size-3.5 mr-1" /> Elegir Oferta
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex justify-between border-t pt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveStep("solicitar")}
                className="text-xs"
              >
                ← Volver a Envíos
              </Button>
              <Button variant="outline" size="sm" onClick={() => onOpenChange(false)} className="text-xs">
                Cancelar
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
