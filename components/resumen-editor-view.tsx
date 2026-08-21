"use client"

import * as React from "react"
import {
  ArrowLeftIcon,
  CalendarIcon,
  CheckCircle2Icon,
  FileTextIcon,
  PlusIcon,
  PrinterIcon,
  SaveIcon,
  SearchIcon,
  Trash2Icon,
  WalletIcon,
} from "lucide-react"

import type { Cliente, Resumen, ResumenEstado, ResumenPago, ResumenTarea } from "@/lib/suite-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"

type ResumenEditorViewProps = {
  resumenes: Resumen[]
  clientes: Cliente[]
  onSaveResumen: (resumen: Resumen) => void
  onDeleteResumen: (id: string) => void
  initialClienteId?: string
}

const ESTADO_CONFIG: Record<ResumenEstado, { label: string; bg: string }> = {
  pendiente: { label: "PENDIENTE", bg: "bg-amber-100 text-amber-800" },
  aprobado: { label: "APROBADO", bg: "bg-blue-100 text-blue-800" },
  facturado: { label: "FACTURADO", bg: "bg-purple-100 text-purple-800" },
  pagado_total: { label: "PAGADO (SALDO $0)", bg: "bg-emerald-100 text-emerald-800" },
  pagado_parcial: { label: "PAGO PARCIAL", bg: "bg-teal-100 text-teal-800" },
}

export function ResumenEditorView({
  resumenes,
  clientes,
  onSaveResumen,
  onDeleteResumen,
  initialClienteId,
}: ResumenEditorViewProps) {
  const [selectedResumen, setSelectedResumen] = React.useState<Resumen | null>(null)
  const [isEditing, setIsEditing] = React.useState(false)
  const [isPrintMode, setIsPrintMode] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const [deletingResumenId, setDeletingResumenId] = React.useState<string | null>(null)

  // Form State
  const [numeroResumen, setNumeroResumen] = React.useState(12)
  const [clienteNombre, setClienteNombre] = React.useState("")
  const [clienteId, setClienteId] = React.useState<string | undefined>(undefined)
  const [atencionA, setAtencionA] = React.useState("")
  const [referencia, setReferencia] = React.useState("trabajos preventivo/correctivos solicitados en planta")
  const [fecha, setFecha] = React.useState(new Date().toLocaleDateString("es-ES"))
  const [saldoAnterior, setSaldoAnterior] = React.useState<number>(0)
  const [estado, setEstado] = React.useState<ResumenEstado>("pendiente")
  const [tareas, setTareas] = React.useState<ResumenTarea[]>([])
  const [pagos, setPagos] = React.useState<ResumenPago[]>([])

  React.useEffect(() => {
    if (initialClienteId) {
      const cli = clientes.find((c) => c.id === initialClienteId)
      if (cli) {
        startNewResumen(cli)
      }
    }
  }, [initialClienteId])

  function startNewResumen(targetCliente?: Cliente) {
    const nextNum =
      resumenes.length > 0
        ? Math.max(...resumenes.map((r) => r.numeroResumen)) + 1
        : 12
    setNumeroResumen(nextNum)
    setClienteNombre(targetCliente ? targetCliente.name : "")
    setClienteId(targetCliente ? targetCliente.id : undefined)
    setAtencionA(targetCliente?.contact || "Jefe de Mantenimiento")
    setReferencia("trabajos preventivo/correctivos solicitados en planta")
    setFecha(new Date().toLocaleDateString("es-ES"))
    setSaldoAnterior(targetCliente?.saldoActual || 0)
    setEstado("pendiente")
    setTareas([
      {
        id: `tar-${Date.now()}-1`,
        sector: "MOLINO",
        fecha: new Date().toLocaleDateString("es-ES"),
        numeroOrden: "",
        descripcion: "Mantenimiento preventivo / correctivo realizado...",
        viaticosQty: 1,
        viaticosUnitario: 35000,
        montoTotal: 120000,
      },
    ])
    setPagos([])
    setSelectedResumen(null)
    setIsEditing(true)
    setIsPrintMode(false)
  }

  function startEditResumen(res: Resumen) {
    setSelectedResumen(res)
    setNumeroResumen(res.numeroResumen)
    setClienteNombre(res.clienteNombre)
    setClienteId(res.clienteId)
    setAtencionA(res.atencionA || "")
    setReferencia(res.referencia)
    setFecha(res.fecha)
    setSaldoAnterior(res.saldoAnterior)
    setEstado(res.estado)
    setTareas(res.tareas)
    setPagos(res.pagos)
    setIsEditing(true)
    setIsPrintMode(false)
  }

  function handleAddTarea() {
    setTareas((prev) => [
      ...prev,
      {
        id: `tar-${Date.now()}-${prev.length + 1}`,
        sector: "SECTOR PLANTA",
        fecha: new Date().toLocaleDateString("es-ES"),
        numeroOrden: "",
        descripcion: "",
        viaticosQty: 1,
        viaticosUnitario: 35000,
        montoTotal: 0,
      },
    ])
  }

  function handleUpdateTarea(id: string, field: keyof ResumenTarea, value: any) {
    setTareas((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t
        const updated = { ...t, [field]: value }
        if (field === "viaticosQty" || field === "viaticosUnitario") {
          const viaticoTotal = (Number(updated.viaticosQty) || 1) * (Number(updated.viaticosUnitario) || 0)
          if (updated.montoTotal === 0 || updated.montoTotal < viaticoTotal) {
            updated.montoTotal = viaticoTotal
          }
        }
        return updated
      })
    )
  }

  function handleRemoveTarea(id: string) {
    setTareas((prev) => prev.filter((t) => t.id !== id))
  }

  function handleAddPago() {
    setPagos((prev) => [
      ...prev,
      {
        id: `pago-${Date.now()}-${prev.length + 1}`,
        fecha: new Date().toLocaleDateString("es-ES"),
        concepto: "Pago transferencia bancaria",
        monto: 0,
      },
    ])
  }

  function handleUpdatePago(id: string, field: keyof ResumenPago, value: any) {
    setPagos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    )
  }

  function handleRemovePago(id: string) {
    setPagos((prev) => prev.filter((p) => p.id !== id))
  }

  // Calculations
  const subtotalTrabajos = tareas.reduce((acc, t) => acc + (Number(t.montoTotal) || 0), 0)
  const totalResumen = Number(saldoAnterior) + subtotalTrabajos
  const totalPagos = pagos.reduce((acc, p) => acc + (Number(p.monto) || 0), 0)
  const saldoFinal = totalResumen - totalPagos

  function handleSave() {
    const finalEstado: ResumenEstado =
      saldoFinal <= 0 && totalPagos > 0 ? "pagado_total" : totalPagos > 0 ? "pagado_parcial" : estado

    const res: Resumen = {
      id: selectedResumen?.id || `res-${Date.now()}`,
      numeroResumen,
      clienteId,
      clienteNombre: clienteNombre.trim() || "Cliente sin asignar",
      atencionA: atencionA.trim() || undefined,
      referencia,
      fecha,
      saldoAnterior: Number(saldoAnterior) || 0,
      tareas,
      pagos,
      subtotalTrabajos,
      totalResumen,
      totalPagos,
      saldoFinal,
      estado: finalEstado,
    }
    onSaveResumen(res)
    setSelectedResumen(res)
    setIsEditing(false)
  }

  const filtered = React.useMemo(() => {
    const q = search.toLowerCase()
    return resumenes.filter(
      (r) =>
        r.clienteNombre.toLowerCase().includes(q) ||
        r.numeroResumen.toString().includes(q) ||
        r.referencia.toLowerCase().includes(q)
    )
  }, [resumenes, search])

  // ── VIEW 1: PRINT / PDF PREVIEW ──────────────────────────────────────────
  if (selectedResumen && isPrintMode) {
    const r = selectedResumen
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

        {/* Real Printable Format matching Real Resumen #11 / #119 */}
        <div className="print-sheet max-w-5xl mx-auto bg-white border border-slate-300 shadow-xl p-8 rounded-lg text-slate-900 font-sans space-y-5">
          {/* Header */}
          <div className="text-center space-y-1 pb-3 border-b-2 border-slate-900">
            <h1 className="text-2xl font-black tracking-wide uppercase text-blue-900">
              Virasoro electricidad Industrial
            </h1>
            <p className="text-xs font-bold text-slate-600">
              CORRIENTES, {r.fecha}
            </p>
          </div>

          {/* Client & Resumen Number */}
          <div className="flex justify-between items-start text-xs pt-1">
            <div>
              <p className="text-slate-500 font-bold uppercase text-[10px]">SEÑORES</p>
              <p className="text-base font-black text-slate-900">{r.clienteNombre}</p>
              {r.atencionA && (
                <p className="text-slate-600 font-medium">At: {r.atencionA}</p>
              )}
              <p className="text-slate-500 text-[11px] mt-1">REF: {r.referencia}</p>
            </div>

            <div className="text-right">
              <span className="bg-slate-900 text-white font-black text-sm px-3 py-1 rounded inline-block uppercase font-mono">
                RESUMEN {r.numeroResumen}
              </span>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">Hoja N° 1</p>
            </div>
          </div>

          {/* Main Table */}
          <Table className="border border-slate-300 text-xs">
            <TableHeader className="bg-slate-100">
              <TableRow>
                <TableHead className="w-[110px] font-bold">SECTOR</TableHead>
                <TableHead className="w-[85px] font-bold">FECHA</TableHead>
                <TableHead className="font-bold">DESCRIPCIÓN TAREAS REALIZADAS</TableHead>
                <TableHead className="w-[120px] font-bold text-center">VIÁTICOS</TableHead>
                <TableHead className="w-[130px] font-bold text-right">
                  TOTAL TRABAJO
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Arrastre saldo anterior */}
              {r.saldoAnterior > 0 && (
                <TableRow className="bg-amber-50/50 font-bold">
                  <TableCell colSpan={4} className="text-slate-800">
                    SALDO RESUMEN ANTERIOR
                  </TableCell>
                  <TableCell className="text-right font-mono text-amber-900 font-bold">
                    $ {r.saldoAnterior.toLocaleString("es-ES")}
                  </TableCell>
                </TableRow>
              )}

              {/* Tareas */}
              {r.tareas.map((t) => {
                const viaticoTotal = (t.viaticosQty || 1) * (t.viaticosUnitario || 0)
                return (
                  <TableRow key={t.id} className="align-top">
                    <TableCell className="font-bold text-slate-900">{t.sector}</TableCell>
                    <TableCell className="font-mono text-slate-600 text-[11px]">
                      {t.fecha}
                      {t.numeroOrden && <div className="text-[10px] text-slate-400">{t.numeroOrden}</div>}
                    </TableCell>
                    <TableCell className="whitespace-pre-line text-[11px] leading-relaxed text-slate-800">
                      {t.descripcion}
                    </TableCell>
                    <TableCell className="text-center font-mono text-[11px]">
                      {t.viaticosUnitario > 0 ? (
                        <div className="font-semibold text-slate-800">
                          {t.viaticosQty || 1} x ${t.viaticosUnitario.toLocaleString("es-ES")}
                          <div className="text-[10px] text-slate-500 font-mono">
                            (${viaticoTotal.toLocaleString("es-ES")})
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-mono font-bold text-slate-900">
                      $ {t.montoTotal.toLocaleString("es-ES")}
                    </TableCell>
                  </TableRow>
                )
              })}

              {/* Subtotal Resumen */}
              <TableRow className="bg-slate-100 font-extrabold">
                <TableCell colSpan={4} className="text-right uppercase">
                  SALDO ACUMULADO DEL RESUMEN:
                </TableCell>
                <TableCell className="text-right font-mono text-sm">
                  $ {r.totalResumen.toLocaleString("es-ES")}
                </TableCell>
              </TableRow>

              {/* Pagos / Cobranzas */}
              {r.pagos.map((p) => (
                <TableRow key={p.id} className="bg-emerald-50 text-emerald-900 font-bold">
                  <TableCell colSpan={4} className="text-right">
                    PAGO RECIBIDO ({p.fecha} - {p.concepto}):
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    - $ {p.monto.toLocaleString("es-ES")}
                  </TableCell>
                </TableRow>
              ))}

              {/* Saldo Final */}
              <TableRow className="bg-slate-900 text-white font-black text-sm">
                <TableCell colSpan={4} className="text-right uppercase">
                  SALDO FINAL AL DÍA:
                </TableCell>
                <TableCell className="text-right font-mono text-emerald-400 text-base">
                  $ {r.saldoFinal.toLocaleString("es-ES")}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          {/* Signatures */}
          <div className="pt-8 grid grid-cols-2 gap-8 text-center text-xs text-slate-500">
            <div className="border-t border-slate-300 pt-2">Firma y Aclaración Empresa</div>
            <div className="border-t border-slate-300 pt-2">Conforme Cliente</div>
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
            {selectedResumen?.id && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeletingResumenId(selectedResumen.id)}
                className="border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold"
              >
                <Trash2Icon className="size-3.5 mr-1" /> Eliminar
              </Button>
            )}
            <Button onClick={handleSave} className="bg-slate-900 text-white font-bold text-xs">
              <SaveIcon className="size-4 mr-1.5" /> GUARDAR RESUMEN
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Form (2 cols) */}
          <div className="md:col-span-2 space-y-6">
            {/* Header info */}
            <Card className="border border-slate-200 bg-white">
              <CardHeader className="py-3 px-4 border-b">
                <CardTitle className="text-xs font-black uppercase text-slate-700">
                  DATOS DEL RESUMEN / CUENTA CORRIENTE
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3 text-xs">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label className="text-[11px]">N° Resumen</Label>
                    <Input
                      type="number"
                      value={numeroResumen}
                      onChange={(e) => setNumeroResumen(Number(e.target.value))}
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
                  <div>
                    <Label className="text-[11px]">Saldo Anterior ($)</Label>
                    <Input
                      type="number"
                      value={saldoAnterior}
                      onChange={(e) => setSaldoAnterior(Number(e.target.value))}
                      className="mt-1 font-mono font-bold bg-amber-50/50"
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
                          if (found.contact) setAtencionA(found.contact)
                          setSaldoAnterior(found.saldoActual || 0)
                        }
                      }}
                      className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-950"
                    >
                      <option value="">-- Seleccionar Cliente Registrado --</option>
                      {clientes.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} {c.denominacionSocial ? `(${c.denominacionSocial})` : ""} — Saldo: ${c.saldoActual.toLocaleString("es-ES")}
                        </option>
                      ))}
                    </select>
                    {!clienteId && (
                      <Input
                        value={clienteNombre}
                        onChange={(e) => setClienteNombre(e.target.value)}
                        placeholder="O escribir nombre de cliente libre..."
                        className="mt-1 text-xs"
                      />
                    )}
                  </div>
                  <div>
                    <Label className="text-[11px]">Atención a (Contacto en planta)</Label>
                    <Input
                      value={atencionA}
                      onChange={(e) => setAtencionA(e.target.value)}
                      placeholder="ej. Hugo / Miguel Angel"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-[11px]">Referencia</Label>
                  <Input
                    value={referencia}
                    onChange={(e) => setReferencia(e.target.value)}
                    placeholder="ej. trabajos preventivo/correctivos solicitados en planta"
                    className="mt-1 font-semibold"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Tareas realizadas por Sector */}
            <Card className="border border-slate-200 bg-white">
              <CardHeader className="py-3 px-4 border-b flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-black uppercase text-slate-700">
                  TAREAS REALIZADAS POR SECTOR
                </CardTitle>
                <Button size="sm" variant="outline" onClick={handleAddTarea} className="text-xs h-7">
                  <PlusIcon className="size-3.5 mr-1" /> Añadir Tarea
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                  {tareas.map((tarea, idx) => (
                    <div key={tarea.id} className="p-3 space-y-2 bg-slate-50/50">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                        <span>Tarea #{idx + 1}</span>
                        <button
                          onClick={() => handleRemoveTarea(tarea.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2Icon className="size-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <Label className="text-[10px]">Sector de Planta</Label>
                          <Input
                            value={tarea.sector}
                            onChange={(e) => handleUpdateTarea(tarea.id, "sector", e.target.value)}
                            placeholder="MOLINO / RINCON / SECADERO"
                            className="mt-0.5 font-bold uppercase text-xs"
                          />
                        </div>
                        <div>
                          <Label className="text-[10px]">Fecha / N° Orden</Label>
                          <Input
                            value={tarea.fecha}
                            onChange={(e) => handleUpdateTarea(tarea.id, "fecha", e.target.value)}
                            placeholder="05/08/2026"
                            className="mt-0.5 font-mono text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="text-[10px]">Descripción Detallada del Trabajo</Label>
                        <Textarea
                          rows={3}
                          value={tarea.descripcion}
                          onChange={(e) => handleUpdateTarea(tarea.id, "descripcion", e.target.value)}
                          placeholder="Detalle técnico de lo que se cambió, midió o reparó..."
                          className="mt-0.5 text-xs bg-white"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-xs pt-1">
                        <div>
                          <Label className="text-[10px]">Cant. Viáticos</Label>
                          <Input
                            type="number"
                            value={tarea.viaticosQty || 1}
                            onChange={(e) =>
                              handleUpdateTarea(tarea.id, "viaticosQty", Number(e.target.value))
                            }
                            className="mt-0.5 font-mono text-center text-xs"
                          />
                        </div>
                        <div>
                          <Label className="text-[10px]">Valor Viático ($)</Label>
                          <Input
                            type="number"
                            value={tarea.viaticosUnitario}
                            onChange={(e) =>
                              handleUpdateTarea(tarea.id, "viaticosUnitario", Number(e.target.value))
                            }
                            className="mt-0.5 font-mono text-xs"
                          />
                        </div>
                        <div>
                          <Label className="text-[10px]">Monto Total Tarea ($)</Label>
                          <Input
                            type="number"
                            value={tarea.montoTotal}
                            onChange={(e) =>
                              handleUpdateTarea(tarea.id, "montoTotal", Number(e.target.value))
                            }
                            className="mt-0.5 font-mono font-bold text-right text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pagos y Cobranzas */}
            <Card className="border border-slate-200 bg-white">
              <CardHeader className="py-3 px-4 border-b flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-black uppercase text-slate-700">
                  PAGOS Y COBRANZAS RECIBIDAS
                </CardTitle>
                <Button size="sm" variant="outline" onClick={handleAddPago} className="text-xs h-7">
                  <PlusIcon className="size-3.5 mr-1" /> Registrar Pago
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                  {pagos.length === 0 ? (
                    <div className="p-4 text-center text-slate-400 text-xs font-medium">
                      No hay pagos registrados aún en este resumen.
                    </div>
                  ) : (
                    pagos.map((pago) => (
                      <div key={pago.id} className="p-3 grid grid-cols-12 gap-2 items-center text-xs">
                        <div className="col-span-3">
                          <Label className="text-[10px] text-slate-400">Fecha</Label>
                          <Input
                            value={pago.fecha}
                            onChange={(e) => handleUpdatePago(pago.id, "fecha", e.target.value)}
                            className="mt-0.5 font-mono text-xs"
                          />
                        </div>
                        <div className="col-span-5">
                          <Label className="text-[10px] text-slate-400">Concepto</Label>
                          <Input
                            value={pago.concepto}
                            onChange={(e) => handleUpdatePago(pago.id, "concepto", e.target.value)}
                            className="mt-0.5 text-xs"
                          />
                        </div>
                        <div className="col-span-3">
                          <Label className="text-[10px] text-slate-400">Monto Pago ($)</Label>
                          <Input
                            type="number"
                            value={pago.monto}
                            onChange={(e) =>
                              handleUpdatePago(pago.id, "monto", Number(e.target.value))
                            }
                            className="mt-0.5 font-mono font-bold text-right text-emerald-600 text-xs"
                          />
                        </div>
                        <div className="col-span-1 flex justify-center pt-3">
                          <button
                            onClick={() => handleRemovePago(pago.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2Icon className="size-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Financial Summary Sidebar */}
          <div className="space-y-4">
            <Card className="border-2 border-slate-900 bg-slate-900 text-white">
              <CardHeader className="py-3 px-4 border-b border-slate-800">
                <CardTitle className="text-xs font-black uppercase text-slate-300">
                  ESTADO DE CUENTA
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3 text-xs font-mono">
                <div className="flex justify-between text-slate-300">
                  <span>Saldo Anterior:</span>
                  <span>$ {Number(saldoAnterior).toLocaleString("es-ES")}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Trabajos Actuales:</span>
                  <span>$ {subtotalTrabajos.toLocaleString("es-ES")}</span>
                </div>
                <div className="border-t border-slate-800 pt-2 flex justify-between font-bold text-slate-200">
                  <span>Total Resumen:</span>
                  <span>$ {totalResumen.toLocaleString("es-ES")}</span>
                </div>
                <div className="flex justify-between text-emerald-400">
                  <span>Pagos Registrados:</span>
                  <span>- $ {totalPagos.toLocaleString("es-ES")}</span>
                </div>
                <div className="border-t border-slate-800 pt-3 flex justify-between font-black text-sm text-emerald-400 font-sans">
                  <span>SALDO FINAL:</span>
                  <span>$ {saldoFinal.toLocaleString("es-ES")}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // ── VIEW 3: RESUMENES LIST ────────────────────────────────────────────────
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Resúmenes de Trabajo</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Gestión de tareas en planta, arrastre de saldos y control de cuentas corrientes.
          </p>
        </div>
        <Button onClick={() => startNewResumen()} className="bg-slate-900 text-white font-bold text-xs">
          <PlusIcon className="size-4 mr-1.5" /> + NUEVO RESUMEN
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="w-full md:w-80 relative">
          <SearchIcon className="size-4 absolute left-3 top-2.5 text-slate-400" />
          <Input
            placeholder="Buscar resumen por N°, cliente..."
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
              <TableHead className="w-[100px]">N° RES.</TableHead>
              <TableHead>CLIENTE / PLANTA</TableHead>
              <TableHead className="w-[100px]">FECHA</TableHead>
              <TableHead className="w-[130px] text-right">TOTAL TRABAJOS</TableHead>
              <TableHead className="w-[130px] text-right">SALDO FINAL</TableHead>
              <TableHead className="w-[140px]">ESTADO</TableHead>
              <TableHead className="w-[160px] text-right">ACCIONES</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((r) => {
              const st = ESTADO_CONFIG[r.estado] || ESTADO_CONFIG["pendiente"]
              return (
                <TableRow key={r.id} className="text-xs">
                  <TableCell className="font-mono font-bold text-slate-900">
                    RES {r.numeroResumen}
                  </TableCell>
                  <TableCell>
                    <div className="font-bold text-slate-900">{r.clienteNombre}</div>
                    <div className="text-[11px] text-slate-400">{r.atencionA}</div>
                  </TableCell>
                  <TableCell className="font-mono text-slate-500">{r.fecha}</TableCell>
                  <TableCell className="text-right font-mono font-bold text-slate-900">
                    $ {r.totalResumen.toLocaleString("es-ES")}
                  </TableCell>
                  <TableCell className="text-right font-mono font-black text-emerald-600">
                    $ {r.saldoFinal.toLocaleString("es-ES")}
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
                        setSelectedResumen(r)
                        setIsPrintMode(true)
                      }}
                      className="text-[10px] h-7 px-2 font-bold"
                    >
                      <PrinterIcon className="size-3 mr-1" /> Imprimir
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => startEditResumen(r)}
                      className="text-[10px] h-7 px-2 bg-slate-900 text-white font-bold"
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setDeletingResumenId(r.id)}
                      className="text-[10px] h-7 px-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 font-bold"
                    >
                      <Trash2Icon className="size-3 mr-1" /> Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* Modal de Confirmación de Eliminación de Resumen */}
      <Dialog open={!!deletingResumenId} onOpenChange={(open) => !open && setDeletingResumenId(null)}>
        <DialogContent className="sm:max-w-md bg-white text-slate-900">
          <DialogHeader>
            <DialogTitle className="text-base font-black text-slate-900">
              ¿Eliminar resumen de trabajo?
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Esta acción eliminará de forma permanente el resumen, sus tareas y pagos asociados de Supabase.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeletingResumenId(null)}
              className="text-xs font-bold"
            >
              Cancelar
            </Button>
            <Button
              size="sm"
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs"
              onClick={() => {
                if (deletingResumenId) {
                  onDeleteResumen(deletingResumenId)
                  setDeletingResumenId(null)
                  setIsEditing(false)
                }
              }}
            >
              Confirmar Eliminación
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
