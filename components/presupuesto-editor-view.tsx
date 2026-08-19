"use client"

import * as React from "react"
import {
  ArrowLeftIcon,
  CheckCircle2Icon,
  CopyIcon,
  DollarSignIcon,
  DownloadIcon,
  FileTextIcon,
  LayersIcon,
  PlusIcon,
  PrinterIcon,
  SaveIcon,
  SearchIcon,
  SparklesIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react"

import {
  DEFAULT_PACKS_MATERIALES,
  type Cliente,
  type ManoDeObraItem,
  type MaterialRubro,
  type Presupuesto,
  type PresupuestoEstado,
  type Proveedor,
} from "@/lib/suite-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SolicitudCotizacionDialog } from "@/components/solicitud-cotizacion-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"

type PresupuestoEditorViewProps = {
  presupuestos: Presupuesto[]
  clientes: Cliente[]
  proveedores: Proveedor[]
  onSavePresupuesto: (presupuesto: Presupuesto) => void
  onDeletePresupuesto: (id: string) => void
  initialClienteId?: string
}

const ESTADO_CONFIG: Record<PresupuestoEstado, { label: string; bg: string }> = {
  borrador: { label: "BORRADOR", bg: "bg-slate-100 text-slate-700" },
  enviado: { label: "ENVIADO", bg: "bg-blue-100 text-blue-800" },
  aprobado: { label: "APROBADO", bg: "bg-emerald-100 text-emerald-800" },
  esperando_materiales: { label: "ESPERANDO MATERIALES", bg: "bg-amber-100 text-amber-800" },
  en_ejecucion: { label: "EN EJECUCIÓN", bg: "bg-purple-100 text-purple-800" },
  completado: { label: "COMPLETADO", bg: "bg-teal-100 text-teal-800" },
  pagado: { label: "PAGADO", bg: "bg-emerald-200 text-emerald-900" },
  rechazado: { label: "RECHAZADO", bg: "bg-rose-100 text-rose-800" },
}

export function PresupuestoEditorView({
  presupuestos,
  clientes,
  proveedores,
  onSavePresupuesto,
  onDeletePresupuesto,
  initialClienteId,
}: PresupuestoEditorViewProps) {
  const [selectedPresupuesto, setSelectedPresupuesto] = React.useState<Presupuesto | null>(null)
  const [isEditing, setIsEditing] = React.useState(false)
  const [isPrintMode, setIsPrintMode] = React.useState(false)
  const [search, setSearch] = React.useState("")

  // Form State
  const [numero, setNumero] = React.useState(428)
  const [clienteNombre, setClienteNombre] = React.useState("")
  const [clienteId, setClienteId] = React.useState<string | undefined>(undefined)
  const [lugarObra, setLugarObra] = React.useState("")
  const [fecha, setFecha] = React.useState(new Date().toLocaleDateString("es-ES"))
  const [descripcionServicio, setDescripcionServicio] = React.useState("")
  const [estado, setEstado] = React.useState<PresupuestoEstado>("borrador")
  const [cotizacionUsd, setCotizacionUsd] = React.useState<number>(1500)
  const [manoDeObra, setManoDeObra] = React.useState<ManoDeObraItem[]>([])
  const [materialesRubros, setMaterialesRubros] = React.useState<MaterialRubro[]>([])
  const [cotizacionDialogOpen, setCotizacionDialogOpen] = React.useState(false)

  function handleApplyWinningQuote(proveedorNombre: string, monto: number, comprobante?: string) {
    setMaterialesRubros((prev) => [
      ...prev,
      {
        id: `mat-win-${Date.now()}`,
        rubro: `MATERIALES (${proveedorNombre.toUpperCase()})`,
        numeroComprobante: comprobante || `COT-${Date.now().toString().slice(-4)}`,
        proveedor: proveedorNombre,
        monto,
      },
    ])
  }

  const dialogInitialMaterials = React.useMemo(() => {
    const list: any[] = []
    materialesRubros.forEach((m, idx) => {
      if (m.rubro) {
        list.push({
          id: `pres-mat-${idx}`,
          nombre: m.rubro,
          cantidad: 1,
          unidad: "ud",
        })
      }
    })
    manoDeObra.forEach((mo, idx) => {
      if (mo.descripcion) {
        list.push({
          id: `pres-mo-${idx}`,
          nombre: mo.descripcion,
          cantidad: mo.cantidad || 1,
          unidad: mo.unidad || "ud",
        })
      }
    })
    return list
  }, [materialesRubros, manoDeObra])

  // Open creation mode if initialClienteId is passed
  React.useEffect(() => {
    if (initialClienteId) {
      const cli = clientes.find((c) => c.id === initialClienteId)
      if (cli) {
        startNewPresupuesto(cli)
      }
    }
  }, [initialClienteId])

  function startNewPresupuesto(targetCliente?: Cliente) {
    const nextNum =
      presupuestos.length > 0
        ? Math.max(...presupuestos.map((p) => p.numeroPresupuesto)) + 1
        : 428
    setNumero(nextNum)
    setClienteNombre(targetCliente ? targetCliente.name : "")
    setClienteId(targetCliente ? targetCliente.id : undefined)
    setLugarObra(targetCliente?.address || "Planta Virasoro")
    setFecha(new Date().toLocaleDateString("es-ES"))
    setDescripcionServicio("MANO DE OBRA Y MATERIALES")
    setEstado("borrador")
    setCotizacionUsd(1500)
    setManoDeObra([
      {
        id: `mo-${Date.now()}-1`,
        orden: 1,
        descripcion: "MANO DE OBRA INSTALACIÓN Y CONEXIONADO",
        unidad: "ud",
        cantidad: 1,
        precioUnitario: 450000,
        total: 450000,
      },
    ])
    setMaterialesRubros([
      {
        id: `mat-${Date.now()}-1`,
        rubro: "MATERIALES CANALIZACION Y CONDUCTORES",
        numeroComprobante: "",
        proveedor: "Cable a Tierra",
        monto: 350000,
      },
    ])
    setSelectedPresupuesto(null)
    setIsEditing(true)
    setIsPrintMode(false)
  }

  function startEditPresupuesto(presupuesto: Presupuesto) {
    setSelectedPresupuesto(presupuesto)
    setNumero(presupuesto.numeroPresupuesto)
    setClienteNombre(presupuesto.clienteNombre)
    setClienteId(presupuesto.clienteId)
    setLugarObra(presupuesto.lugarObra || "")
    setFecha(presupuesto.fecha)
    setDescripcionServicio(presupuesto.descripcionServicio)
    setEstado(presupuesto.estado)
    setCotizacionUsd(presupuesto.cotizacionUsd || 1500)
    setManoDeObra(presupuesto.manoDeObraItems)
    setMaterialesRubros(presupuesto.materialesRubros)
    setIsEditing(true)
    setIsPrintMode(false)
  }

  function handleAddManoDeObra() {
    setManoDeObra((prev) => [
      ...prev,
      {
        id: `mo-${Date.now()}-${prev.length + 1}`,
        orden: prev.length + 1,
        descripcion: "",
        unidad: "ud",
        cantidad: 1,
        precioUnitario: 0,
        total: 0,
      },
    ])
  }

  function handleUpdateManoDeObra(id: string, field: keyof ManoDeObraItem, value: any) {
    setManoDeObra((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item
        const updated = { ...item, [field]: value }
        if (field === "cantidad" || field === "precioUnitario") {
          updated.total = (Number(updated.cantidad) || 0) * (Number(updated.precioUnitario) || 0)
        }
        return updated
      })
    )
  }

  function handleRemoveManoDeObra(id: string) {
    setManoDeObra((prev) => prev.filter((m) => m.id !== id))
  }

  function handleAddMaterialRubro() {
    setMaterialesRubros((prev) => [
      ...prev,
      {
        id: `mat-${Date.now()}-${prev.length + 1}`,
        rubro: "",
        numeroComprobante: "",
        proveedor: proveedores[0]?.name || "Cable a Tierra",
        monto: 0,
      },
    ])
  }

  function handleUpdateMaterialRubro(id: string, field: keyof MaterialRubro, value: any) {
    setMaterialesRubros((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    )
  }

  function handleRemoveMaterialRubro(id: string) {
    setMaterialesRubros((prev) => prev.filter((m) => m.id !== id))
  }

  function applyPack(pack: typeof DEFAULT_PACKS_MATERIALES[0]) {
    const newItems: MaterialRubro[] = pack.items.map((item, idx) => ({
      id: `mat-pack-${Date.now()}-${idx}`,
      rubro: item.rubro,
      numeroComprobante: "",
      proveedor: proveedores[0]?.name || "Cable a Tierra",
      monto: item.monto,
    }))
    setMaterialesRubros((prev) => [...prev, ...newItems])
  }

  // Calculations
  const totalManoDeObra = manoDeObra.reduce((acc, m) => acc + (Number(m.total) || 0), 0)
  const totalMateriales = materialesRubros.reduce((acc, m) => acc + (Number(m.monto) || 0), 0)
  const totalProyectoArs = totalManoDeObra + totalMateriales
  const totalProyectoUsd = cotizacionUsd > 0 ? Math.round(totalProyectoArs / cotizacionUsd) : 0

  function handleSave() {
    const pres: Presupuesto = {
      id: selectedPresupuesto?.id || `pres-${Date.now()}`,
      numeroPresupuesto: numero,
      clienteId,
      clienteNombre: clienteNombre.trim() || "Cliente sin asignar",
      lugarObra: lugarObra.trim() || "Virasoro",
      fecha,
      descripcionServicio,
      estado,
      manoDeObraItems: manoDeObra,
      materialesRubros,
      totalManoDeObra,
      totalMateriales,
      totalProyectoArs,
      cotizacionUsd,
      totalProyectoUsd,
      validezDias: 15,
      tipoFactura: "Factura C",
      notasCondiciones:
        "La forma de pago se acuerda con el cliente al momento de la aprobación. Válido por 15 días hábiles.",
    }
    onSavePresupuesto(pres)
    setSelectedPresupuesto(pres)
    setIsEditing(false)
  }

  const filteredPresupuestos = React.useMemo(() => {
    const q = search.toLowerCase()
    return presupuestos.filter(
      (p) =>
        p.clienteNombre.toLowerCase().includes(q) ||
        p.numeroPresupuesto.toString().includes(q) ||
        p.descripcionServicio.toLowerCase().includes(q)
    )
  }, [presupuestos, search])

  // ── VIEW 1: PRINT / PDF PREVIEW ──────────────────────────────────────────
  if (selectedPresupuesto && isPrintMode) {
    const p = selectedPresupuesto
    return (
      <div className="min-h-screen bg-slate-100 p-4 sm:p-8 space-y-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between no-print">
          <Button variant="ghost" onClick={() => setIsPrintMode(false)} className="text-xs font-bold">
            <ArrowLeftIcon className="size-4 mr-1.5" /> Volver al editor
          </Button>
          <Button onClick={() => window.print()} className="bg-slate-900 text-white text-xs font-bold">
            <PrinterIcon className="size-4 mr-1.5" /> Imprimir / Guardar como PDF
          </Button>
        </div>

        {/* Real Printable Format matching Real Quote #427 */}
        <div className="print-sheet max-w-5xl mx-auto bg-white border border-slate-300 shadow-xl p-8 rounded-lg text-slate-900 font-sans space-y-6">
          {/* Header Banner */}
          <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-start">
            <div>
              <div className="bg-blue-900 text-white font-black text-xl px-3 py-1 inline-block uppercase tracking-wider">
                ELECTRICIDAD INDUSTRIAL
              </div>
              <div className="text-xs font-bold text-slate-700 mt-2">
                Denominación social: ARIEL MEDINA
              </div>
              <div className="text-xs text-slate-600">Dirección: LISANDRO DE LA TORRE 2520 • CUIT: 20-28610594-4</div>
              <div className="text-xs text-slate-600">Tel: 3764-339082 • Email: virasoroelectricidadindustrial@gmail.com</div>
            </div>

            <div className="text-right">
              <h2 className="text-2xl font-black tracking-tight text-slate-900">PRESUPUESTO</h2>
              <div className="text-xs font-bold text-slate-600 mt-1">Fecha: {p.fecha}</div>
              <div className="text-sm font-black font-mono mt-0.5">N° Presupuesto: {p.numeroPresupuesto}</div>
            </div>
          </div>

          {/* Client Box */}
          <div className="border border-slate-300 p-3 bg-slate-50 grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="font-bold text-slate-500 uppercase text-[10px]">CLIENTE</span>
              <p className="font-extrabold text-sm text-slate-900">{p.clienteNombre}</p>
              <p className="text-slate-600">{p.lugarObra}</p>
            </div>
            <div>
              <span className="font-bold text-slate-500 uppercase text-[10px]">ESTADO</span>
              <p className="font-bold text-xs uppercase text-slate-800">{p.estado.replace("_", " ")}</p>
              <p className="text-slate-600">Válido por 15 días hábiles</p>
            </div>
          </div>

          {/* Service Description */}
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
              DESCRIPCIÓN DEL SERVICIO
            </span>
            <div className="text-xs font-bold bg-slate-100 p-2.5 rounded border border-slate-200">
              {p.descripcionServicio}
            </div>
          </div>

          {/* Mano de obra table */}
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
              1. MANO DE OBRA Y SERVICIOS TÉCNICOS
            </span>
            <Table className="border border-slate-200 text-xs">
              <TableHeader className="bg-slate-100">
                <TableRow>
                  <TableHead className="w-[40px] font-bold">ID</TableHead>
                  <TableHead className="font-bold">DESCRIPCIÓN</TableHead>
                  <TableHead className="w-[60px] font-bold text-center">UNIDAD</TableHead>
                  <TableHead className="w-[120px] font-bold text-right">PRECIO</TableHead>
                  <TableHead className="w-[120px] font-bold text-right">TOTAL</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {p.manoDeObraItems.map((mo, i) => (
                  <TableRow key={mo.id}>
                    <TableCell className="font-mono text-center">{i + 1}</TableCell>
                    <TableCell className="font-medium text-[11px] leading-snug">{mo.descripcion}</TableCell>
                    <TableCell className="text-center font-mono">{mo.cantidad} {mo.unidad}</TableCell>
                    <TableCell className="text-right font-mono">$ {mo.precioUnitario.toLocaleString("es-ES")}</TableCell>
                    <TableCell className="text-right font-mono font-bold">$ {mo.total.toLocaleString("es-ES")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="text-right font-bold text-xs p-2 bg-slate-100 border border-t-0 border-slate-200">
              TOTAL MANO DE OBRA: $ {p.totalManoDeObra.toLocaleString("es-ES")}
            </div>
          </div>

          {/* Materiales por rubro table */}
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
              2. RESUMEN DE MATERIALES POR COMPROBANTE/RUBRO
            </span>
            <Table className="border border-slate-200 text-xs">
              <TableHeader className="bg-slate-100">
                <TableRow>
                  <TableHead className="font-bold">RUBRO DE MATERIAL</TableHead>
                  <TableHead className="w-[200px] font-bold">N° COMPROBANTE / PROVEEDOR</TableHead>
                  <TableHead className="w-[140px] font-bold text-right">MONTO</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {p.materialesRubros.map((mat) => (
                  <TableRow key={mat.id}>
                    <TableCell className="font-semibold text-[11px]">{mat.rubro}</TableCell>
                    <TableCell className="text-slate-600 font-mono text-[11px]">{mat.numeroComprobante || mat.proveedor || "-"}</TableCell>
                    <TableCell className="text-right font-mono font-bold">$ {mat.monto.toLocaleString("es-ES")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="text-right font-bold text-xs p-2 bg-slate-100 border border-t-0 border-slate-200">
              TOTAL MATERIALES: $ {p.totalMateriales.toLocaleString("es-ES")}
            </div>
          </div>

          {/* Grand Total Box */}
          <div className="border-2 border-slate-900 p-4 bg-slate-900 text-white rounded-lg flex justify-between items-center">
            <div>
              <div className="text-xs uppercase font-bold text-slate-300">TOTAL GENERAL DEL PROYECTO</div>
              <div className="text-xs text-slate-400">Tipo de factura: {p.tipoFactura}</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black font-mono text-emerald-400">
                $ {p.totalProyectoArs.toLocaleString("es-ES")}
              </div>
              {p.totalProyectoUsd && p.totalProyectoUsd > 0 && (
                <div className="text-xs font-mono text-slate-300">
                  {p.totalProyectoUsd.toLocaleString("es-ES")} u$s (TC: {p.cotizacionUsd})
                </div>
              )}
            </div>
          </div>

          {/* Footer Note */}
          <div className="border-t pt-4 text-[10px] text-slate-500 leading-relaxed space-y-1">
            <p>• La información de este presupuesto no es una factura y solo es una estimación de los servicios descritos más arriba.</p>
            <p>• La forma de pago al momento de aprobación se acuerda con el cliente. Válido por {p.validezDias} días hábiles.</p>
          </div>
        </div>
      </div>
    )
  }

  // ── VIEW 2: FORM / EDITOR MODE ───────────────────────────────────────────
  if (isEditing) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-6 md:px-8 space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)} className="text-xs font-bold">
            <ArrowLeftIcon className="size-4 mr-1" /> Volver al listado
          </Button>
          <div className="flex items-center gap-2">
            <Button onClick={handleSave} className="bg-slate-900 text-white font-bold text-xs">
              <SaveIcon className="size-4 mr-1.5" /> GUARDAR PRESUPUESTO
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Form (2 cols) */}
          <div className="md:col-span-2 space-y-6">
            {/* Header info card */}
            <Card className="border border-slate-200 bg-white">
              <CardHeader className="py-3 px-4 border-b">
                <CardTitle className="text-xs font-black uppercase text-slate-700">
                  DATOS PRINCIPALES DEL PRESUPUESTO
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-[11px]">N° Presupuesto</Label>
                    <Input
                      type="number"
                      value={numero}
                      onChange={(e) => setNumero(Number(e.target.value))}
                      className="mt-1 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <Label className="text-[11px]">Fecha</Label>
                    <Input
                      value={fecha}
                      onChange={(e) => setFecha(e.target.value)}
                      className="mt-1 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-[11px]">Cliente Asignado *</Label>
                    <select
                      value={clienteId || ""}
                      onChange={(e) => {
                        const val = e.target.value
                        setClienteId(val || undefined)
                        const found = clientes.find((c) => c.id === val)
                        if (found) {
                          setClienteNombre(found.name)
                          if (found.address) setLugarObra(found.address)
                        }
                      }}
                      className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-950"
                    >
                      <option value="">-- Seleccionar Cliente Registrado --</option>
                      {clientes.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} {c.denominacionSocial ? `(${c.denominacionSocial})` : ""}
                        </option>
                      ))}
                    </select>
                    {!clienteId && (
                      <Input
                        value={clienteNombre}
                        onChange={(e) => setClienteNombre(e.target.value)}
                        placeholder="O escribir cliente libre..."
                        className="mt-1 text-xs"
                      />
                    )}
                  </div>
                  <div>
                    <Label className="text-[11px]">Lugar / Planta / Obra</Label>
                    <Input
                      value={lugarObra}
                      onChange={(e) => setLugarObra(e.target.value)}
                      placeholder="ej. MUY FRESCO / Virasoro"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-[11px]">Descripción del Servicio / Título</Label>
                  <Input
                    value={descripcionServicio}
                    onChange={(e) => setDescripcionServicio(e.target.value)}
                    placeholder="ej. MANO DE OBRA ARMADO DE PLACA DE SISTEMA ONGRID 10KW"
                    className="mt-1 font-semibold"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Bloque 1: Mano de Obra */}
            <Card className="border border-slate-200 bg-white">
              <CardHeader className="py-3 px-4 border-b flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-black uppercase text-slate-700">
                  1. MANO DE OBRA Y SERVICIOS
                </CardTitle>
                <Button size="sm" variant="outline" onClick={handleAddManoDeObra} className="text-xs h-7">
                  <PlusIcon className="size-3.5 mr-1" /> Añadir Tarea
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                  {manoDeObra.map((item, idx) => (
                    <div key={item.id} className="p-3 space-y-2 bg-slate-50/50">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                        <span>Ítem #{idx + 1}</span>
                        <button
                          onClick={() => handleRemoveManoDeObra(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2Icon className="size-3.5" />
                        </button>
                      </div>
                      <Textarea
                        rows={2}
                        value={item.descripcion}
                        onChange={(e) => handleUpdateManoDeObra(item.id, "descripcion", e.target.value)}
                        placeholder="Descripción detallada del servicio o instalación..."
                        className="text-xs bg-white"
                      />
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <Label className="text-[10px]">Cantidad / Unidad</Label>
                          <div className="flex gap-1 mt-1">
                            <Input
                              type="number"
                              value={item.cantidad}
                              onChange={(e) =>
                                handleUpdateManoDeObra(item.id, "cantidad", Number(e.target.value))
                              }
                              className="w-16 font-mono text-center"
                            />
                            <Input
                              value={item.unidad}
                              onChange={(e) => handleUpdateManoDeObra(item.id, "unidad", e.target.value)}
                              placeholder="ud/mts/hs"
                              className="w-16 text-center text-xs"
                            />
                          </div>
                        </div>
                        <div>
                          <Label className="text-[10px]">Precio Unitario ($)</Label>
                          <Input
                            type="number"
                            value={item.precioUnitario}
                            onChange={(e) =>
                              handleUpdateManoDeObra(item.id, "precioUnitario", Number(e.target.value))
                            }
                            className="mt-1 font-mono text-right"
                          />
                        </div>
                        <div>
                          <Label className="text-[10px]">Total ($)</Label>
                          <Input
                            type="number"
                            value={item.total}
                            readOnly
                            className="mt-1 font-mono font-bold text-right bg-slate-100"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Bloque 2: Materiales por Rubro */}
            <Card className="border border-slate-200 bg-white">
              <CardHeader className="py-3 px-4 border-b flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xs font-black uppercase text-slate-700">
                    2. MATERIALES POR RUBRO / COMPROBANTE
                  </CardTitle>
                </div>
                <div className="flex gap-1.5">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setCotizacionDialogOpen(true)}
                    className="text-xs h-7 border-emerald-300 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 font-bold"
                  >
                    📲 Solicitar Cotización a Proveedores
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleAddMaterialRubro} className="text-xs h-7">
                    <PlusIcon className="size-3.5 mr-1" /> Añadir Rubro
                  </Button>
                </div>
              </CardHeader>

              {/* Quick Packs Bar */}
              <div className="bg-slate-100 p-2.5 border-b flex items-center gap-2 text-xs">
                <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                  <SparklesIcon className="size-3 text-amber-500" /> Packs rápidos:
                </span>
                {DEFAULT_PACKS_MATERIALES.map((pack) => (
                  <button
                    key={pack.nombre}
                    onClick={() => applyPack(pack)}
                    className="px-2.5 py-1 bg-white hover:bg-slate-200 border rounded text-[11px] font-bold text-slate-800 transition-colors"
                  >
                    + {pack.nombre}
                  </button>
                ))}
              </div>

              <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                  {materialesRubros.map((mat, idx) => (
                    <div key={mat.id} className="p-3 grid grid-cols-1 md:grid-cols-12 gap-2 items-center text-xs">
                      <div className="md:col-span-5">
                        <Label className="text-[10px] text-slate-400">Rubro de Material</Label>
                        <Input
                          value={mat.rubro}
                          onChange={(e) => handleUpdateMaterialRubro(mat.id, "rubro", e.target.value)}
                          placeholder="ej. MATERIALES KIT SOLAR..."
                          className="mt-0.5 font-semibold text-xs"
                        />
                      </div>
                      <div className="md:col-span-3">
                        <Label className="text-[10px] text-slate-400">N° Comprobante / Proveedor</Label>
                        <Input
                          value={mat.numeroComprobante || ""}
                          onChange={(e) => handleUpdateMaterialRubro(mat.id, "numeroComprobante", e.target.value)}
                          placeholder="0001-00029527-x"
                          className="mt-0.5 font-mono text-xs"
                        />
                      </div>
                      <div className="md:col-span-3">
                        <Label className="text-[10px] text-slate-400">Monto ($)</Label>
                        <Input
                          type="number"
                          value={mat.monto}
                          onChange={(e) =>
                            handleUpdateMaterialRubro(mat.id, "monto", Number(e.target.value))
                          }
                          className="mt-0.5 font-mono font-bold text-right text-xs"
                        />
                      </div>
                      <div className="md:col-span-1 flex justify-center pt-3">
                        <button
                          onClick={() => handleRemoveMaterialRubro(mat.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2Icon className="size-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary Sidebar (1 col) */}
          <div className="space-y-4">
            <Card className="border-2 border-slate-900 bg-slate-900 text-white">
              <CardHeader className="py-3 px-4 border-b border-slate-800">
                <CardTitle className="text-xs font-black uppercase text-slate-300">
                  TOTALES DEL PRESUPUESTO
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3 text-xs font-mono">
                <div className="flex justify-between text-slate-300">
                  <span>Mano de Obra:</span>
                  <span>$ {totalManoDeObra.toLocaleString("es-ES")}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Materiales:</span>
                  <span>$ {totalMateriales.toLocaleString("es-ES")}</span>
                </div>
                <div className="border-t border-slate-800 pt-2 flex justify-between font-black text-sm text-emerald-400 font-sans">
                  <span>TOTAL PROYECTO:</span>
                  <span>$ {totalProyectoArs.toLocaleString("es-ES")}</span>
                </div>

                <div className="border-t border-slate-800 pt-3 space-y-1 text-slate-300 font-sans text-xs">
                  <Label className="text-[10px] text-slate-400 uppercase">Cotización Dólar ($ / USD)</Label>
                  <Input
                    type="number"
                    value={cotizacionUsd}
                    onChange={(e) => setCotizacionUsd(Number(e.target.value))}
                    className="bg-slate-950 border-slate-800 text-white font-mono text-xs"
                  />
                  <div className="text-right text-xs font-mono font-bold text-amber-400 pt-1">
                    ≈ {totalProyectoUsd.toLocaleString("es-ES")} USD
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 bg-white">
              <CardHeader className="py-3 px-4 border-b">
                <CardTitle className="text-xs font-bold uppercase text-slate-700">
                  ESTADO COMERCIAL
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                <div className="grid grid-cols-2 gap-1.5">
                  {(
                    [
                      "borrador",
                      "enviado",
                      "aprobado",
                      "esperando_materiales",
                      "en_ejecucion",
                      "completado",
                      "pagado",
                    ] as PresupuestoEstado[]
                  ).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setEstado(st)}
                      className={`px-2 py-1.5 rounded text-[10px] font-bold uppercase transition-all ${
                        estado === st
                          ? "bg-slate-900 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {st.replace("_", " ")}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <SolicitudCotizacionDialog
          open={cotizacionDialogOpen}
          onOpenChange={setCotizacionDialogOpen}
          proveedores={proveedores}
          initialMaterials={dialogInitialMaterials}
          onApplyWinningQuote={handleApplyWinningQuote}
        />
      </div>
    )
  }

  // ── VIEW 3: PRESUPUESTOS LIST ─────────────────────────────────────────────
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Presupuestos</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Armado formal de ofertas con desglose de mano de obra y rubros de materiales.
          </p>
        </div>
        <Button onClick={() => startNewPresupuesto()} className="bg-slate-900 text-white font-bold text-xs">
          <PlusIcon className="size-4 mr-1.5" /> + NUEVO PRESUPUESTO
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="w-full md:w-80 relative">
          <SearchIcon className="size-4 absolute left-3 top-2.5 text-slate-400" />
          <Input
            placeholder="Buscar presupuesto por N°, cliente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs bg-white"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 text-[11px] font-extrabold uppercase text-slate-500">
              <TableHead className="w-[100px]">N° PRES.</TableHead>
              <TableHead>CLIENTE / OBRA</TableHead>
              <TableHead>SERVICIO</TableHead>
              <TableHead className="w-[140px] text-right">TOTAL ($ ARS)</TableHead>
              <TableHead className="w-[100px] text-right">TOTAL (USD)</TableHead>
              <TableHead className="w-[140px]">ESTADO</TableHead>
              <TableHead className="w-[160px] text-right">ACCIONES</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPresupuestos.map((p) => {
              const st = ESTADO_CONFIG[p.estado] || ESTADO_CONFIG["borrador"]
              return (
                <TableRow key={p.id} className="text-xs">
                  <TableCell className="font-mono font-bold text-slate-900">
                    #{p.numeroPresupuesto}
                  </TableCell>
                  <TableCell>
                    <div className="font-bold text-slate-900">{p.clienteNombre}</div>
                    <div className="text-[11px] text-slate-400">{p.lugarObra}</div>
                  </TableCell>
                  <TableCell className="font-medium text-slate-700 max-w-xs truncate">
                    {p.descripcionServicio}
                  </TableCell>
                  <TableCell className="text-right font-mono font-bold text-slate-900">
                    $ {p.totalProyectoArs.toLocaleString("es-ES")}
                  </TableCell>
                  <TableCell className="text-right font-mono text-slate-500">
                    {p.totalProyectoUsd ? `$ ${p.totalProyectoUsd}` : "-"}
                  </TableCell>
                  <TableCell>
                    <span className={`text-[9px] font-extrabold px-2.5 py-1 rounded-full ${st.bg}`}>
                      {st.label}
                    </span>
                  </TableCell>
                  <TableCell className="text-right space-x-1.5">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedPresupuesto(p)
                        setIsPrintMode(true)
                      }}
                      className="text-[10px] h-7 px-2 font-bold"
                    >
                      <PrinterIcon className="size-3 mr-1" /> Imprimir
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => startEditPresupuesto(p)}
                      className="text-[10px] h-7 px-2 bg-slate-900 text-white font-bold"
                    >
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <SolicitudCotizacionDialog
        open={cotizacionDialogOpen}
        onOpenChange={setCotizacionDialogOpen}
        proveedores={proveedores}
        onApplyWinningQuote={handleApplyWinningQuote}
      />
    </div>
  )
}
