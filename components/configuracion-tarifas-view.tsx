"use client"

import * as React from "react"
import {
  BriefcaseIcon,
  CheckIcon,
  ClockIcon,
  DollarSignIcon,
  Edit2Icon,
  PlusIcon,
  Trash2Icon,
  UserCheckIcon,
  UsersIcon,
} from "lucide-react"

import type { CategoriaEmpleado, Empleado } from "@/lib/suite-data"
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

type ConfiguracionTarifasViewProps = {
  categorias: CategoriaEmpleado[]
  empleados: Empleado[]
  onSaveCategoria: (categoria: CategoriaEmpleado) => void
  onDeleteCategoria: (id: string) => void
  onSaveEmpleado: (empleado: Empleado) => void
  onDeleteEmpleado: (id: string) => void
}

export function ConfiguracionTarifasView({
  categorias,
  empleados,
  onSaveCategoria,
  onDeleteCategoria,
  onSaveEmpleado,
  onDeleteEmpleado,
}: ConfiguracionTarifasViewProps) {
  // Category Modal State
  const [catDialogOpen, setCatDialogOpen] = React.useState(false)
  const [editingCat, setEditingCat] = React.useState<CategoriaEmpleado | null>(null)
  const [catNombre, setCatNombre] = React.useState("")
  const [catPrecioHora, setCatPrecioHora] = React.useState(5000)

  // Employee Modal State
  const [empDialogOpen, setEmpDialogOpen] = React.useState(false)
  const [editingEmp, setEditingEmp] = React.useState<Empleado | null>(null)
  const [empNombre, setEmpNombre] = React.useState("")
  const [empCategoriaId, setEmpCategoriaId] = React.useState<string | undefined>(undefined)
  const [empTelefono, setEmpTelefono] = React.useState("")

  function openCreateCat() {
    setEditingCat(null)
    setCatNombre("")
    setCatPrecioHora(6500)
    setCatDialogOpen(true)
  }

  function openEditCat(cat: CategoriaEmpleado) {
    setEditingCat(cat)
    setCatNombre(cat.nombreCategoria)
    setCatPrecioHora(cat.precioHora)
    setCatDialogOpen(true)
  }

  function handleSaveCatSubmit() {
    if (!catNombre.trim()) return
    onSaveCategoria({
      id: editingCat?.id || `cat-${Date.now()}`,
      nombreCategoria: catNombre.trim(),
      precioHora: Number(catPrecioHora) || 5000,
      activo: true,
    })
    setCatDialogOpen(false)
  }

  function openCreateEmp() {
    setEditingEmp(null)
    setEmpNombre("")
    setEmpCategoriaId(categorias[0]?.id)
    setEmpTelefono("")
    setEmpDialogOpen(true)
  }

  function openEditEmp(emp: Empleado) {
    setEditingEmp(emp)
    setEmpNombre(emp.nombreCompleto)
    setEmpCategoriaId(emp.categoriaId)
    setEmpTelefono(emp.telefono || "")
    setEmpDialogOpen(true)
  }

  function handleSaveEmpSubmit() {
    if (!empNombre.trim()) return
    onSaveEmpleado({
      id: editingEmp?.id || `emp-${Date.now()}`,
      nombreCompleto: empNombre.trim(),
      categoriaId: empCategoriaId,
      telefono: empTelefono.trim() || undefined,
      activo: true,
    })
    setEmpDialogOpen(false)
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8 space-y-8">
      {/* Header */}
      <div className="border-b pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            ⚙️ Tarifas por Hora y Nómina de Personal
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Configuración de precios/hora por categoría para cálculo automático en la carga de trabajos diarios.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={openCreateCat} variant="outline" className="text-xs font-bold border-slate-300">
            <PlusIcon className="size-3.5 mr-1" /> + Nueva Categoría
          </Button>
          <Button onClick={openCreateEmp} className="bg-slate-900 text-white font-bold text-xs">
            <PlusIcon className="size-3.5 mr-1" /> + Nuevo Empleado
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bloque 1: Categorías y Tarifas/Hora */}
        <Card className="border border-slate-200 bg-white shadow-sm">
          <CardHeader className="py-3 px-4 border-b bg-slate-50 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-black uppercase text-slate-700 flex items-center gap-1.5">
              <ClockIcon className="size-4 text-blue-600" /> CATEGORÍAS & TARIFAS POR HORA
            </CardTitle>
            <Button size="sm" variant="ghost" onClick={openCreateCat} className="text-xs text-blue-600 font-bold h-7">
              + Añadir
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-100/50 text-[10px] uppercase font-bold text-slate-500">
                  <TableHead>CATEGORÍA / ROL</TableHead>
                  <TableHead className="text-right">TARIFA ($/HORA)</TableHead>
                  <TableHead className="w-[100px] text-right">ACCIONES</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categorias.map((cat) => (
                  <TableRow key={cat.id} className="text-xs">
                    <TableCell className="font-bold text-slate-900">
                      {cat.nombreCategoria}
                    </TableCell>
                    <TableCell className="text-right font-mono font-bold text-emerald-600">
                      $ {cat.precioHora.toLocaleString("es-ES")} / hr
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <button
                        onClick={() => openEditCat(cat)}
                        className="p-1 text-slate-500 hover:text-slate-900 transition-colors"
                      >
                        <Edit2Icon className="size-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteCategoria(cat.id)}
                        className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2Icon className="size-3.5" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Bloque 2: Nómina de Empleados */}
        <Card className="border border-slate-200 bg-white shadow-sm">
          <CardHeader className="py-3 px-4 border-b bg-slate-50 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-black uppercase text-slate-700 flex items-center gap-1.5">
              <UsersIcon className="size-4 text-emerald-600" /> NÓMINA DE EMPLEADOS / TÉCNICOS
            </CardTitle>
            <Button size="sm" variant="ghost" onClick={openCreateEmp} className="text-xs text-blue-600 font-bold h-7">
              + Añadir
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-100/50 text-[10px] uppercase font-bold text-slate-500">
                  <TableHead>NOMBRE Y APELLIDO</TableHead>
                  <TableHead>CATEGORÍA ASIGNADA</TableHead>
                  <TableHead className="w-[100px] text-right">ACCIONES</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {empleados.map((emp) => {
                  const cat = categorias.find((c) => c.id === emp.categoriaId)
                  return (
                    <TableRow key={emp.id} className="text-xs">
                      <TableCell className="font-bold text-slate-900">
                        {emp.nombreCompleto}
                        {emp.telefono && <div className="text-[10px] font-mono text-slate-400">{emp.telefono}</div>}
                      </TableCell>
                      <TableCell>
                        {cat ? (
                          <Badge variant="outline" className="text-[10px] font-bold bg-slate-100 text-slate-800 border-slate-300">
                            {cat.nombreCategoria} (${cat.precioHora}/h)
                          </Badge>
                        ) : (
                          <span className="text-slate-400 italic">Sin categoría</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        <button
                          onClick={() => openEditEmp(emp)}
                          className="p-1 text-slate-500 hover:text-slate-900 transition-colors"
                        >
                          <Edit2Icon className="size-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteEmpleado(emp.id)}
                          className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2Icon className="size-3.5" />
                        </button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Modal Categoría */}
      <Dialog open={catDialogOpen} onOpenChange={setCatDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white text-slate-900">
          <DialogHeader>
            <DialogTitle className="text-base font-black text-slate-900">
              {editingCat ? "Editar Categoría de Empleado" : "Nueva Categoría de Empleado"}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Establecé el valor hora para el cálculo automático de mano de obra.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            <div>
              <Label className="text-[11px]">Nombre de la Categoría *</Label>
              <Input
                value={catNombre}
                onChange={(e) => setCatNombre(e.target.value)}
                placeholder="ej. Oficial Electricista, Ayudante..."
                className="mt-1 font-bold"
              />
            </div>
            <div>
              <Label className="text-[11px]">Valor de la Hora ($) *</Label>
              <Input
                type="number"
                value={catPrecioHora}
                onChange={(e) => setCatPrecioHora(Number(e.target.value))}
                placeholder="ej. 8000"
                className="mt-1 font-mono font-bold text-emerald-600"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" size="sm" onClick={() => setCatDialogOpen(false)} className="text-xs font-bold">
              Cancelar
            </Button>
            <Button size="sm" onClick={handleSaveCatSubmit} className="bg-slate-900 text-white font-bold text-xs">
              Guardar Categoría
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Empleado */}
      <Dialog open={empDialogOpen} onOpenChange={setEmpDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white text-slate-900">
          <DialogHeader>
            <DialogTitle className="text-base font-black text-slate-900">
              {editingEmp ? "Editar Empleado" : "Nuevo Empleado"}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Alta de personal para asignación de horas en trabajos diarios.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            <div>
              <Label className="text-[11px]">Nombre Completo *</Label>
              <Input
                value={empNombre}
                onChange={(e) => setEmpNombre(e.target.value)}
                placeholder="ej. Hugo / Miguel Gauto"
                className="mt-1 font-bold"
              />
            </div>
            <div>
              <Label className="text-[11px]">Categoría por Defecto</Label>
              <select
                value={empCategoriaId || ""}
                onChange={(e) => setEmpCategoriaId(e.target.value || undefined)}
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-950"
              >
                <option value="">-- Sin categoría asignada --</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombreCategoria} (${c.precioHora}/h)
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label className="text-[11px]">Teléfono (Opcional)</Label>
              <Input
                value={empTelefono}
                onChange={(e) => setEmpTelefono(e.target.value)}
                placeholder="ej. 3756-401122"
                className="mt-1 font-mono"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" size="sm" onClick={() => setEmpDialogOpen(false)} className="text-xs font-bold">
              Cancelar
            </Button>
            <Button size="sm" onClick={handleSaveEmpSubmit} className="bg-slate-900 text-white font-bold text-xs">
              Guardar Empleado
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
