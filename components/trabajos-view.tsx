"use client"

import * as React from "react"
import {
  ArrowLeftIcon,
  BriefcaseIcon,
  CheckCircle2Icon,
  ClockIcon,
  DollarSignIcon,
  Edit2Icon,
  FileTextIcon,
  LayersIcon,
  PlusIcon,
  SaveIcon,
  SearchIcon,
  SparklesIcon,
  Trash2Icon,
  UserCheckIcon,
  WrenchIcon,
} from "lucide-react"

import { useAuth } from "@/lib/auth-context"
import type {
  CategoriaEmpleado,
  Cliente,
  Empleado,
  TrabajoDiario,
  TrabajoEmpleado,
  TrabajoEstadoFacturacion,
  TrabajoMaterialExtra,
} from "@/lib/suite-data"
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

type TrabajosViewProps = {
  trabajos: TrabajoDiario[]
  clientes: Cliente[]
  categorias: CategoriaEmpleado[]
  empleados: Empleado[]
  onSaveTrabajo: (trabajo: TrabajoDiario) => void
  onDeleteTrabajo: (id: string) => void
}

export function TrabajosView({
  trabajos,
  clientes,
  categorias,
  empleados,
  onSaveTrabajo,
  onDeleteTrabajo,
}: TrabajosViewProps) {
  const { user } = useAuth()
  const [selectedTrabajo, setSelectedTrabajo] = React.useState<TrabajoDiario | null>(null)
  const [isEditing, setIsEditing] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const [filterClienteId, setFilterClienteId] = React.useState<string>("todos")
  const [filterEstado, setFilterEstado] = React.useState<string>("todos")
  const [deletingId, setDeletingId] = React.useState<string | null>(null)

  // Form State
  const [clienteId, setClienteId] = React.useState<string | undefined>(undefined)
  const [clienteNombre, setClienteNombre] = React.useState("")
  const [fecha, setFecha] = React.useState(new Date().toLocaleDateString("es-ES"))
  const [sector, setSector] = React.useState("")
  const [numeroOrden, setNumeroOrden] = React.useState("")
  const [descripcionTareas, setDescripcionTareas] = React.useState("")
  const [viaticosQty, setViaticosQty] = React.useState<number>(1)
  const [viaticosUnitario, setViaticosUnitario] = React.useState<number>(35000)
  const [trabajoEmpleadosList, setTrabajoEmpleadosList] = React.useState<TrabajoEmpleado[]>([])
  const [trabajoMaterialesList, setTrabajoMaterialesList] = React.useState<TrabajoMaterialExtra[]>([])

  const defaultUserRoleName = user?.name || user?.email || "Técnico"

  const currentUserCategoryPrice = React.useMemo(() => {
    if (!user) return 8000
    const userName = (user.name || "").toLowerCase()
    const userRoleLabel = (user.roleLabel || "").toLowerCase()

    // 1. Check if user is in empleados list with a category assigned
    const foundEmp = empleados.find((e) => {
      const empName = e.nombreCompleto.toLowerCase()
      return empName.includes(userName) || userName.includes(empName)
    })

    if (foundEmp && foundEmp.categoriaId) {
      const cat = categorias.find((c) => c.id === foundEmp.categoriaId)
      if (cat) return cat.precioHora
    }

    // 2. Search category directly matching roleLabel (e.g. "Senior", "Oficial", "Ayudante")
    const foundCat = categorias.find((c) => {
      const catName = c.nombreCategoria.toLowerCase()
      return (
        (userRoleLabel.includes("senior") && catName.includes("senior")) ||
        (userRoleLabel.includes("oficial") && catName.includes("oficial")) ||
        (userRoleLabel.includes("ayudante") && catName.includes("ayudante")) ||
        catName.includes(userRoleLabel)
      )
    })

    if (foundCat) return foundCat.precioHora

    return categorias[0]?.precioHora || 8000
  }, [user, empleados, categorias])

  function startNewTrabajo() {
    setSelectedTrabajo(null)
    const defaultCli = clientes[0]
    setClienteId(defaultCli?.id)
    setClienteNombre(defaultCli?.name || "")
    setFecha(new Date().toLocaleDateString("es-ES"))
    setSector("")
    setNumeroOrden("")
    setDescripcionTareas("")
    setViaticosQty(1)
    setViaticosUnitario(35000)

    setTrabajoEmpleadosList([
      {
        id: `emp-${Date.now()}`,
        nombreEmpleadoRol: defaultUserRoleName,
        horas: 8,
        precioHora: currentUserCategoryPrice,
        total: currentUserCategoryPrice * 8,
      },
    ])
    setTrabajoMaterialesList([])
    setIsEditing(true)
  }

  function startEditTrabajo(t: TrabajoDiario) {
    setSelectedTrabajo(t)
    setClienteId(t.clienteId)
    setClienteNombre(t.clienteNombre)
    setFecha(t.fecha)
    setSector(t.sector)
    setNumeroOrden(t.numeroOrden || "")
    setDescripcionTareas(t.descripcionTareas)
    setViaticosQty(t.viaticosQty)
    setViaticosUnitario(t.viaticosUnitario)
    setTrabajoEmpleadosList([...t.empleados])
    setTrabajoMaterialesList([...t.materialesExtras])
    setIsEditing(true)
  }

  // Auto-calculated totals
  const totalManoObra = React.useMemo(() => {
    return trabajoEmpleadosList.reduce((acc, e) => acc + (Number(e.total) || 0), 0)
  }, [trabajoEmpleadosList])

  const totalMaterialesExtras = React.useMemo(() => {
    return trabajoMaterialesList.reduce((acc, m) => acc + (Number(m.total) || 0), 0)
  }, [trabajoMaterialesList])

  const totalViaticos = React.useMemo(() => {
    return (Number(viaticosQty) || 0) * (Number(viaticosUnitario) || 0)
  }, [viaticosQty, viaticosUnitario])

  const montoTotalCalculado = totalManoObra + totalViaticos + totalMaterialesExtras

  // Handlers for Employees/Hours list (Uses logged-in user automatically)
  function handleAddEmpleadoRow() {
    setTrabajoEmpleadosList((prev) => [
      ...prev,
      {
        id: `emp-${Date.now()}-${prev.length + 1}`,
        nombreEmpleadoRol: defaultUserRoleName,
        horas: 4,
        precioHora: currentUserCategoryPrice,
        total: currentUserCategoryPrice * 4,
      },
    ])
  }

  function handleUpdateEmpleadoRow(id: string, field: keyof TrabajoEmpleado, value: any) {
    setTrabajoEmpleadosList((prev) =>
      prev.map((e) => {
        if (e.id !== id) return e
        const updated = { ...e, [field]: value }
        updated.total = (Number(updated.horas) || 0) * (Number(updated.precioHora) || 0)
        return updated
      })
    )
  }

  function handleRemoveEmpleadoRow(id: string) {
    setTrabajoEmpleadosList((prev) => prev.filter((e) => e.id !== id))
  }

  // Handlers for Materiales Extras list (With unidad)
  function handleAddMaterialExtraRow() {
    setTrabajoMaterialesList((prev) => [
      ...prev,
      {
        id: `mat-${Date.now()}-${prev.length + 1}`,
        descripcion: "",
        unidad: "ud",
        cantidad: 1,
        precioUnitario: 0,
        total: 0,
      },
    ])
  }

  function handleUpdateMaterialExtraRow(id: string, field: keyof TrabajoMaterialExtra, value: any) {
    setTrabajoMaterialesList((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m
        const updated = { ...m, [field]: value }
        updated.total = (Number(updated.cantidad) || 0) * (Number(updated.precioUnitario) || 0)
        return updated
      })
    )
  }

  function handleRemoveEmpleadoRow(id: string) {
    setTrabajoEmpleadosList((prev) => prev.filter((e) => e.id !== id))
  }

  // Handlers for Materiales Extras list
  function handleAddMaterialExtraRow() {
    setTrabajoMaterialesList((prev) => [
      ...prev,
      {
        id: `mat-${Date.now()}-${prev.length + 1}`,
        descripcion: "",
        cantidad: 1,
        precioUnitario: 0,
        total: 0,
      },
    ])
  }

  function handleUpdateMaterialExtraRow(id: string, field: keyof TrabajoMaterialExtra, value: any) {
    setTrabajoMaterialesList((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m
        const updated = { ...m, [field]: value }
        updated.total = (Number(updated.cantidad) || 0) * (Number(updated.precioUnitario) || 0)
        return updated
      })
    )
  }

  function handleRemoveMaterialExtraRow(id: string) {
    setTrabajoMaterialesList((prev) => prev.filter((m) => m.id !== id))
  }

  function handleSave() {
    if (!clienteNombre.trim() || !sector.trim()) return

    const t: TrabajoDiario = {
      id: selectedTrabajo?.id || `trab-${Date.now()}`,
      clienteId,
      clienteNombre: clienteNombre.trim(),
      fecha: fecha.trim(),
      sector: sector.trim().toUpperCase(),
      numeroOrden: numeroOrden.trim() || undefined,
      descripcionTareas: descripcionTareas.trim() || "Mantenimiento / Trabajo técnico en planta",
      viaticosQty: Number(viaticosQty) || 0,
      viaticosUnitario: Number(viaticosUnitario) || 35000,
      empleados: trabajoEmpleadosList,
      materialesExtras: trabajoMaterialesList,
      totalManoObra,
      totalMaterialesExtras,
      montoTotal: montoTotalCalculado,
      estadoFacturacion: selectedTrabajo?.estadoFacturacion || "pendiente",
      resumenId: selectedTrabajo?.resumenId,
    }

    onSaveTrabajo(t)
    setIsEditing(false)
  }

  const filteredTrabajos = React.useMemo(() => {
    const q = search.toLowerCase()
    return trabajos.filter((t) => {
      const matchSearch =
        t.clienteNombre.toLowerCase().includes(q) ||
        t.sector.toLowerCase().includes(q) ||
        t.descripcionTareas.toLowerCase().includes(q) ||
        (t.numeroOrden && t.numeroOrden.toLowerCase().includes(q))
      const matchCliente = filterClienteId === "todos" || t.clienteId === filterClienteId
      const matchEstado = filterEstado === "todos" || t.estadoFacturacion === filterEstado
      return matchSearch && matchCliente && matchEstado
    })
  }, [trabajos, search, filterClienteId, filterEstado])

  // ── VIEW 1: EDITOR / FORM MODE ───────────────────────────────────────────
  if (isEditing) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-6 md:px-8 space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)} className="text-xs font-bold">
            <ArrowLeftIcon className="size-4 mr-1" /> Volver al listado
          </Button>
          <div className="flex items-center gap-2">
            {selectedTrabajo?.id && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeletingId(selectedTrabajo.id)}
                className="border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold"
              >
                <Trash2Icon className="size-3.5 mr-1" /> Eliminar
              </Button>
            )}
            <Button onClick={handleSave} className="bg-slate-900 text-white font-bold text-xs">
              <SaveIcon className="size-4 mr-1.5" /> GUARDAR TRABAJO DIARIO
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Form (2 cols) */}
          <div className="md:col-span-2 space-y-6">
            {/* Header info */}
            <Card className="border border-slate-200 bg-white shadow-sm">
              <CardHeader className="py-3 px-4 border-b bg-slate-50">
                <CardTitle className="text-xs font-black uppercase text-slate-700">
                  DATOS PRINCIPALES DEL TRABAJO DIARIO
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-[11px]">Cliente Asignado *</Label>
                    <select
                      value={clienteId || ""}
                      onChange={(e) => {
                        const val = e.target.value
                        setClienteId(val || undefined)
                        const found = clientes.find((c) => c.id === val)
                        if (found) setClienteNombre(found.name)
                      }}
                      className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-950"
                    >
                      <option value="">-- Seleccionar Cliente --</option>
                      {clientes.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} {c.denominacionSocial ? `(${c.denominacionSocial})` : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label className="text-[11px]">Fecha Realización</Label>
                    <Input
                      value={fecha}
                      onChange={(e) => setFecha(e.target.value)}
                      className="mt-1 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-[11px]">Sector / Planta *</Label>
                    <Input
                      value={sector}
                      onChange={(e) => setSector(e.target.value)}
                      placeholder="MOLINO / RINCON / SECADERO..."
                      className="mt-1 font-bold uppercase"
                    />
                  </div>
                  <div>
                    <Label className="text-[11px]">N° Orden / Referencia (Opcional)</Label>
                    <Input
                      value={numeroOrden}
                      onChange={(e) => setNumeroOrden(e.target.value)}
                      placeholder="ej. ORDEN 190 / CS 197"
                      className="mt-1 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-[11px]">Descripción Detallada del Trabajo *</Label>
                  <Textarea
                    rows={4}
                    value={descripcionTareas}
                    onChange={(e) => setDescripcionTareas(e.target.value)}
                    placeholder="Detalle técnico de lo que se cambió, instaló o reparó..."
                    className="mt-1 text-xs"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Bloque 1: Horas de Personal / Mano de Obra (Cálculo Automático) */}
            <Card className="border border-slate-200 bg-white shadow-sm">
              <CardHeader className="py-3 px-4 border-b flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xs font-black uppercase text-slate-700 flex items-center gap-1.5">
                    <ClockIcon className="size-4 text-blue-600" /> 1. MANO DE OBRA (CÁLCULO AUTOMÁTICO)
                  </CardTitle>
                </div>
                <Button size="sm" variant="outline" onClick={handleAddEmpleadoRow} className="text-xs h-7">
                  <PlusIcon className="size-3.5 mr-1" /> Añadir Horas
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                  {trabajoEmpleadosList.map((empItem) => (
                    <div key={empItem.id} className="p-3 grid grid-cols-12 gap-2 items-center text-xs">
                      <div className="col-span-4">
                        <Label className="text-[10px] text-slate-400">Horas Trabajadas</Label>
                        <Input
                          type="number"
                          value={empItem.horas}
                          onChange={(e) =>
                            handleUpdateEmpleadoRow(empItem.id, "horas", Number(e.target.value))
                          }
                          placeholder="ej. 8 hs"
                          className="mt-0.5 font-mono text-center text-xs font-bold"
                        />
                      </div>

                      <div className="col-span-4">
                        <Label className="text-[10px] text-slate-400">Precio por Hora ($/Hora)</Label>
                        <Input
                          type="number"
                          value={empItem.precioHora}
                          onChange={(e) =>
                            handleUpdateEmpleadoRow(empItem.id, "precioHora", Number(e.target.value))
                          }
                          placeholder="ej. 8000"
                          className="mt-0.5 font-mono text-right text-xs"
                        />
                      </div>

                      <div className="col-span-3 text-right font-mono font-bold text-slate-900">
                        <Label className="text-[10px] text-slate-400 block">Subtotal Mano Obra</Label>
                        <div className="py-1.5 text-xs text-emerald-600 font-extrabold">
                          $ {empItem.total.toLocaleString("es-ES")}
                        </div>
                      </div>

                      <div className="col-span-1 flex justify-center">
                        <button
                          onClick={() => handleRemoveEmpleadoRow(empItem.id)}
                          className="text-slate-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2Icon className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-slate-50 border-t flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-500 uppercase">Subtotal Mano de Obra:</span>
                  <span className="font-mono text-sm text-slate-900">$ {totalManoObra.toLocaleString("es-ES")}</span>
                </div>
              </CardContent>
            </Card>

            {/* Bloque 2: Materiales Extras Consumidos */}
            <Card className="border border-slate-200 bg-white shadow-sm">
              <CardHeader className="py-3 px-4 border-b flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xs font-black uppercase text-slate-700 flex items-center gap-1.5">
                    <WrenchIcon className="size-4 text-amber-600" /> 2. MATERIALES EXTRAS CONSUMIDOS (OPCIONAL)
                  </CardTitle>
                </div>
                <Button size="sm" variant="outline" onClick={handleAddMaterialExtraRow} className="text-xs h-7">
                  <PlusIcon className="size-3.5 mr-1" /> Añadir Repuesto/Material
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                  {trabajoMaterialesList.length === 0 ? (
                    <div className="p-3 text-center text-slate-400 text-xs italic">
                      No hay materiales extras agregados a este trabajo.
                    </div>
                  ) : (
                    trabajoMaterialesList.map((matItem) => (
                      <div key={matItem.id} className="p-3 grid grid-cols-12 gap-2 items-center text-xs">
                        <div className="col-span-5">
                          <Label className="text-[10px] text-slate-400">Descripción Repuesto / Material</Label>
                          <Input
                            value={matItem.descripcion}
                            onChange={(e) =>
                              handleUpdateMaterialExtraRow(matItem.id, "descripcion", e.target.value)
                            }
                            placeholder="ej. Cable PVC, Contactor..."
                            className="mt-0.5 font-semibold text-xs"
                          />
                        </div>
                        <div className="col-span-2">
                          <Label className="text-[10px] text-slate-400">Cantidad</Label>
                          <Input
                            type="number"
                            value={matItem.cantidad}
                            onChange={(e) =>
                              handleUpdateMaterialExtraRow(matItem.id, "cantidad", Number(e.target.value))
                            }
                            className="mt-0.5 font-mono text-center text-xs font-bold"
                          />
                        </div>
                        <div className="col-span-2">
                          <Label className="text-[10px] text-slate-400">Unidad</Label>
                          <Input
                            value={matItem.unidad || "ud"}
                            onChange={(e) =>
                              handleUpdateMaterialExtraRow(matItem.id, "unidad", e.target.value)
                            }
                            placeholder="ud/mts/kg"
                            className="mt-0.5 text-center text-xs"
                          />
                        </div>
                        <div className="col-span-2">
                          <Label className="text-[10px] text-slate-400">Precio Unit. ($)</Label>
                          <Input
                            type="number"
                            value={matItem.precioUnitario}
                            onChange={(e) =>
                              handleUpdateMaterialExtraRow(matItem.id, "precioUnitario", Number(e.target.value))
                            }
                            className="mt-0.5 font-mono text-right text-xs"
                          />
                        </div>
                        <div className="col-span-1 flex justify-center">
                          <button
                            onClick={() => handleRemoveMaterialExtraRow(matItem.id)}
                            className="text-slate-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2Icon className="size-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-3 bg-slate-50 border-t flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-500 uppercase">Subtotal Materiales Extras:</span>
                  <span className="font-mono text-sm text-slate-900">$ {totalMaterialesExtras.toLocaleString("es-ES")}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Summary (1 col) */}
          <div className="space-y-6">
            {/* Viáticos Selector Card */}
            <Card className="border border-slate-200 bg-white shadow-sm">
              <CardHeader className="py-3 px-4 border-b bg-amber-50/50">
                <CardTitle className="text-xs font-black uppercase text-amber-900 flex items-center gap-1">
                  🚗 VIÁTICOS DEL TRABAJO
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3 text-xs">
                <Label className="text-[10px] uppercase font-bold text-slate-500">Seleccionar Viáticos:</Label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { label: "Sin Viático (0)", qty: 0 },
                    { label: "Medio Viático (1/2)", qty: 0.5 },
                    { label: "1 Viático (1)", qty: 1 },
                    { label: "2 Viáticos (2)", qty: 2 },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setViaticosQty(preset.qty)}
                      className={`px-2.5 py-2 rounded text-[11px] font-bold text-center transition-all ${
                        viaticosQty === preset.qty
                          ? "bg-amber-500 text-white shadow-sm"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                <div className="pt-2 border-t space-y-2">
                  <div>
                    <Label className="text-[10px]">Valor Unitario por Viático ($)</Label>
                    <Input
                      type="number"
                      value={viaticosUnitario}
                      onChange={(e) => setViaticosUnitario(Number(e.target.value))}
                      className="mt-1 font-mono text-xs font-bold"
                    />
                  </div>
                  <div className="flex justify-between items-center font-bold text-slate-800 pt-1">
                    <span>Subtotal Viáticos:</span>
                    <span className="font-mono text-amber-600">$ {totalViaticos.toLocaleString("es-ES")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Grand Total Calculated Box */}
            <Card className="border-2 border-slate-900 bg-slate-900 text-white shadow-md">
              <CardHeader className="py-3 px-4 border-b border-slate-800">
                <CardTitle className="text-xs font-black uppercase text-amber-400">
                  RESUMEN DE COSTOS DEL TRABAJO
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Mano de Obra:</span>
                  <span className="font-mono">$ {totalManoObra.toLocaleString("es-ES")}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Viáticos ({viaticosQty}):</span>
                  <span className="font-mono">$ {totalViaticos.toLocaleString("es-ES")}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Materiales Extras:</span>
                  <span className="font-mono">$ {totalMaterialesExtras.toLocaleString("es-ES")}</span>
                </div>

                <div className="border-t border-slate-800 pt-3">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">TOTAL GENERAL TRABAJO:</div>
                  <div className="text-2xl font-black font-mono text-emerald-400 mt-1">
                    $ {montoTotalCalculado.toLocaleString("es-ES")}
                  </div>
                </div>

                <Button onClick={handleSave} className="w-full mt-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs">
                  <SaveIcon className="size-4 mr-1.5" /> GUARDAR TRABAJO DIARIO
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // ── VIEW 2: TRABAJOS DIARIOS LIST ─────────────────────────────────────────
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            🛠️ Trabajos Diarios Realizados
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Registro día a día de tareas, horas de personal, viáticos y repuestos pendientes de facturar.
          </p>
        </div>
        <Button onClick={startNewTrabajo} className="bg-slate-900 text-white font-bold text-xs">
          <PlusIcon className="size-4 mr-1.5" /> + REGISTRAR TRABAJO DIARIO
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="relative">
          <SearchIcon className="size-4 absolute left-3 top-2.5 text-slate-400" />
          <Input
            placeholder="Buscar por cliente, sector o tarea..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs bg-white"
          />
        </div>

        <select
          value={filterClienteId}
          onChange={(e) => setFilterClienteId(e.target.value)}
          className="h-9 rounded-md border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700"
        >
          <option value="todos">-- Todos los Clientes --</option>
          {clientes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={filterEstado}
          onChange={(e) => setFilterEstado(e.target.value)}
          className="h-9 rounded-md border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700"
        >
          <option value="todos">-- Todos los Estados --</option>
          <option value="pendiente">⚡ Pendientes de Facturar</option>
          <option value="facturado">✓ Facturados en Resumen</option>
        </select>
      </div>

      {/* List Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 text-[11px] font-extrabold uppercase text-slate-500">
              <TableHead className="w-[100px]">FECHA</TableHead>
              <TableHead>CLIENTE / SECTOR</TableHead>
              <TableHead>DESCRIPCIÓN DE TAREAS</TableHead>
              <TableHead className="w-[100px] text-center">VIÁTICOS</TableHead>
              <TableHead className="w-[120px] text-right">TOTAL ($)</TableHead>
              <TableHead className="w-[150px]">ESTADO</TableHead>
              <TableHead className="w-[120px] text-right">ACCIONES</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTrabajos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-slate-400 text-xs font-medium">
                  No hay trabajos diarios cargados con los filtros seleccionados.
                </TableCell>
              </TableRow>
            ) : (
              filteredTrabajos.map((t) => (
                <TableRow key={t.id} className="text-xs">
                  <TableCell className="font-mono text-slate-600 font-bold">{t.fecha}</TableCell>
                  <TableCell>
                    <div className="font-bold text-slate-900">{t.clienteNombre}</div>
                    <div className="text-[11px] text-blue-600 font-semibold uppercase">{t.sector}</div>
                  </TableCell>
                  <TableCell className="font-medium text-slate-700 max-w-xs truncate">
                    {t.descripcionTareas}
                  </TableCell>
                  <TableCell className="text-center font-mono font-bold text-slate-700">
                    {t.viaticosQty > 0 ? (
                      <span className="bg-amber-100 text-amber-900 text-[10px] px-2 py-0.5 rounded-full font-extrabold">
                        {t.viaticosQty} viático{t.viaticosQty > 1 ? "s" : ""}
                      </span>
                    ) : (
                      <span className="text-slate-400 font-normal">Sin viático</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-mono font-bold text-slate-900">
                    $ {t.montoTotal.toLocaleString("es-ES")}
                  </TableCell>
                  <TableCell>
                    {t.estadoFacturacion === "pendiente" ? (
                      <Badge className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-[10px] font-black uppercase">
                        ⚡ PENDIENTE DE FACTURAR
                      </Badge>
                    ) : (
                      <Badge className="bg-emerald-600 text-white text-[10px] font-black uppercase">
                        ✓ FACTURADO EN RESUMEN
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-1.5">
                    <Button
                      size="sm"
                      onClick={() => startEditTrabajo(t)}
                      className="text-[10px] h-7 px-2 bg-slate-900 text-white font-bold"
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setDeletingId(t.id)}
                      className="text-[10px] h-7 px-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 font-bold"
                    >
                      <Trash2Icon className="size-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <DialogContent className="sm:max-w-md bg-white text-slate-900">
          <DialogHeader>
            <DialogTitle className="text-base font-black text-slate-900">
              ¿Eliminar trabajo diario?
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Esta acción eliminará de forma permanente el registro del trabajo diario de Supabase.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 mt-2">
            <Button variant="outline" size="sm" onClick={() => setDeletingId(null)} className="text-xs font-bold">
              Cancelar
            </Button>
            <Button
              size="sm"
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs"
              onClick={() => {
                if (deletingId) {
                  onDeleteTrabajo(deletingId)
                  setDeletingId(null)
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
