"use client"

import * as React from "react"
import {
  EditIcon,
  FileTextIcon,
  MessageSquareIcon,
  PhoneIcon,
  PlusIcon,
  ReceiptTextIcon,
  SearchIcon,
  Trash2Icon,
  UserPlusIcon,
  WalletIcon,
} from "lucide-react"

import type { Cliente, Presupuesto, Resumen } from "@/lib/suite-data"
import { Badge } from "@/components/ui/badge"
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
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type ClientesViewProps = {
  clientes: Cliente[]
  presupuestos: Presupuesto[]
  resumenes: Resumen[]
  onSaveCliente: (cliente: Cliente) => void
  onDeleteCliente: (id: string) => void
  onCreatePresupuestoForCliente: (cliente: Cliente) => void
  onCreateResumenForCliente: (cliente: Cliente) => void
  onNavigateToPresupuesto: (id: string) => void
  onNavigateToResumen: (id: string) => void
}

export function ClientesView({
  clientes,
  presupuestos,
  resumenes,
  onSaveCliente,
  onDeleteCliente,
  onCreatePresupuestoForCliente,
  onCreateResumenForCliente,
  onNavigateToPresupuesto,
  onNavigateToResumen,
}: ClientesViewProps) {
  const [search, setSearch] = React.useState("")
  const [selectedId, setSelectedId] = React.useState<string>(clientes[0]?.id || "")
  const [activeTab, setActiveTab] = React.useState<"resumenes" | "presupuestos">("resumenes")
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editingCliente, setEditingCliente] = React.useState<Cliente | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = React.useState<string | null>(null)

  // Form State for new/edit client
  const [name, setName] = React.useState("")
  const [denominacionSocial, setDenominacionSocial] = React.useState("")
  const [cuitCuil, setCuitCuil] = React.useState("")
  const [contact, setContact] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [address, setAddress] = React.useState("")
  const [localidad, setLocalidad] = React.useState("Virasoro, Corrientes")

  const filteredClientes = React.useMemo(() => {
    const q = search.toLowerCase()
    return clientes.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.denominacionSocial && c.denominacionSocial.toLowerCase().includes(q)) ||
        (c.contact && c.contact.toLowerCase().includes(q))
    )
  }, [clientes, search])

  const selectedCliente = clientes.find((c) => c.id === selectedId) || clientes[0]

  // Filter linked items
  const clientPresupuestos = presupuestos.filter(
    (p) =>
      p.clienteId === selectedCliente?.id ||
      p.clienteNombre.toLowerCase() === selectedCliente?.name.toLowerCase()
  )

  const clientResumenes = resumenes.filter(
    (r) =>
      r.clienteId === selectedCliente?.id ||
      r.clienteNombre.toLowerCase() === selectedCliente?.name.toLowerCase()
  )

  function openCreateModal() {
    setEditingCliente(null)
    setName("")
    setDenominacionSocial("")
    setCuitCuil("")
    setContact("")
    setPhone("")
    setEmail("")
    setAddress("")
    setLocalidad("Virasoro, Corrientes")
    setDialogOpen(true)
  }

  function openEditModal(cli: Cliente) {
    setEditingCliente(cli)
    setName(cli.name)
    setDenominacionSocial(cli.denominacionSocial || "")
    setCuitCuil(cli.cuitCuil || "")
    setContact(cli.contact || "")
    setPhone(cli.phone || "")
    setEmail(cli.email || "")
    setAddress(cli.address || "")
    setLocalidad(cli.localidad || "Virasoro, Corrientes")
    setDialogOpen(true)
  }

  function handleSaveClient() {
    if (!name.trim()) return
    const cliToSave: Cliente = {
      id: editingCliente ? editingCliente.id : `cli-${Date.now()}`,
      name: name.trim(),
      denominacionSocial: denominacionSocial.trim() || undefined,
      cuitCuil: cuitCuil.trim() || undefined,
      contact: contact.trim() || undefined,
      phone: phone.trim() || undefined,
      email: email.trim() || undefined,
      address: address.trim() || undefined,
      localidad: localidad.trim() || "Virasoro, Corrientes",
      saldoActual: editingCliente ? editingCliente.saldoActual : 0,
    }
    onSaveCliente(cliToSave)
    setSelectedId(cliToSave.id)
    setDialogOpen(false)
    setEditingCliente(null)
  }

  function handleConfirmDelete() {
    if (!confirmDeleteId) return
    onDeleteCliente(confirmDeleteId)
    setConfirmDeleteId(null)
    const remaining = clientes.filter((c) => c.id !== confirmDeleteId)
    if (remaining.length > 0) {
      setSelectedId(remaining[0].id)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100svh-3.5rem)]">
      {/* Top bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Clientes</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Gestión comercial, alta, edición y acceso directo a presupuestos y resúmenes.
          </p>
        </div>
        <Button onClick={openCreateModal} className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs">
          <UserPlusIcon className="size-4 mr-1.5" /> + NUEVO CLIENTE
        </Button>
      </div>

      {/* Main Two-Column Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Column: Client List */}
        <div className="w-72 shrink-0 border-r border-slate-200 bg-white flex flex-col overflow-hidden">
          <div className="p-3 border-b border-slate-100">
            <div className="relative">
              <SearchIcon className="size-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <Input
                placeholder="Buscar cliente..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-8 text-xs bg-slate-50 border-slate-200"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredClientes.map((c) => {
              const isSelected = selectedCliente?.id === c.id
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  className={`w-full text-left p-3.5 transition-colors hover:bg-slate-50 ${isSelected ? "bg-slate-100 border-l-4 border-l-slate-900" : ""
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-slate-900">{c.name}</span>
                    {c.saldoActual > 0 && (
                      <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                        $ {c.saldoActual.toLocaleString("es-ES")}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate mt-0.5">
                    {c.contact || c.denominacionSocial || c.localidad}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Right Column: Client Detail & Actions */}
        <div className="flex-1 overflow-y-auto bg-slate-50 p-6 space-y-6">
          {selectedCliente ? (
            <div className="max-w-5xl mx-auto space-y-5">
              {/* Header Box */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-black text-slate-900">{selectedCliente.name}</h2>
                      {selectedCliente.denominacionSocial && (
                        <span className="text-xs text-slate-500 font-medium">
                          ({selectedCliente.denominacionSocial})
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-600 mt-1 flex flex-wrap gap-x-4 gap-y-1">
                      {selectedCliente.contact && (
                        <span>
                          <strong>Contacto:</strong> {selectedCliente.contact}
                        </span>
                      )}
                      {selectedCliente.phone && (
                        <span>
                          <strong>Tel:</strong> {selectedCliente.phone}
                        </span>
                      )}
                      {selectedCliente.address && (
                        <span>
                          <strong>Dirección:</strong> {selectedCliente.address}
                        </span>
                      )}
                      {selectedCliente.localidad && (
                        <span>
                          <strong>Localidad:</strong> {selectedCliente.localidad}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Direct Action Buttons for this client */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <Button
                      onClick={() => openEditModal(selectedCliente)}
                      variant="outline"
                      size="sm"
                      className="border-slate-300 font-bold text-xs hover:bg-slate-100"
                    >
                      <EditIcon className="size-3.5 mr-1" /> Editar
                    </Button>
                    <Button
                      onClick={() => setConfirmDeleteId(selectedCliente.id)}
                      variant="outline"
                      size="sm"
                      className="border-red-200 text-red-600 hover:bg-red-50 font-bold text-xs"
                    >
                      <Trash2Icon className="size-3.5 mr-1" /> Eliminar
                    </Button>
                    <Separator orientation="vertical" className="h-6 hidden sm:block" />
                    <Button
                      onClick={() => onCreateResumenForCliente(selectedCliente)}
                      className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
                    >
                      <PlusIcon className="size-3.5 mr-1" /> + RESUMEN
                    </Button>
                    <Button
                      onClick={() => onCreatePresupuestoForCliente(selectedCliente)}
                      variant="outline"
                      className="border-slate-300 font-bold text-xs hover:bg-slate-100"
                    >
                      <PlusIcon className="size-3.5 mr-1" /> + PRESUPUESTO
                    </Button>
                  </div>
                </div>
              </div>

              {/* Tabs: Resúmenes vs Presupuestos */}
              <div className="flex gap-2 border-b border-slate-200 pb-0">
                <button
                  onClick={() => setActiveTab("resumenes")}
                  className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 -mb-px flex items-center gap-1.5 ${activeTab === "resumenes"
                      ? "border-slate-900 text-slate-900"
                      : "border-transparent text-slate-400 hover:text-slate-700"
                    }`}
                >
                  <FileTextIcon className="size-4" />
                  Resúmenes / Cuenta Corriente ({clientResumenes.length})
                </button>
                <button
                  onClick={() => setActiveTab("presupuestos")}
                  className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 -mb-px flex items-center gap-1.5 ${activeTab === "presupuestos"
                      ? "border-slate-900 text-slate-900"
                      : "border-transparent text-slate-400 hover:text-slate-700"
                    }`}
                >
                  <ReceiptTextIcon className="size-4" />
                  Presupuestos Formales ({clientPresupuestos.length})
                </button>
              </div>

              {/* Tab Content: Resúmenes */}
              {activeTab === "resumenes" && (
                <Card className="border border-slate-200 bg-white shadow-sm overflow-hidden">
                  <CardHeader className="py-3 px-4 border-b bg-slate-50/50 flex flex-row items-center justify-between">
                    <CardTitle className="text-xs font-bold uppercase text-slate-700">
                      Historial de Resúmenes de Trabajo (Cuentas Corrientes)
                    </CardTitle>
                    <Button
                      size="sm"
                      onClick={() => onCreateResumenForCliente(selectedCliente)}
                      className="text-xs h-7 bg-slate-900 text-white font-bold"
                    >
                      + Crear Resumen para {selectedCliente.name}
                    </Button>
                  </CardHeader>
                  <CardContent className="p-0">
                    {clientResumenes.length === 0 ? (
                      <div className="p-8 text-center text-slate-400 text-xs font-medium">
                        No hay resúmenes cargados para este cliente aún.
                      </div>
                    ) : (
                      <Table className="text-xs">
                        <TableHeader>
                          <TableRow className="bg-slate-50">
                            <TableHead className="w-[100px]">N° RESUMEN</TableHead>
                            <TableHead className="w-[100px]">FECHA</TableHead>
                            <TableHead>REFERENCIA</TableHead>
                            <TableHead className="w-[130px] text-right">TOTAL TRABAJOS</TableHead>
                            <TableHead className="w-[130px] text-right">SALDO FINAL</TableHead>
                            <TableHead className="w-[100px] text-right">ACCIÓN</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {clientResumenes.map((r) => (
                            <TableRow key={r.id}>
                              <TableCell className="font-mono font-bold">RES {r.numeroResumen}</TableCell>
                              <TableCell className="font-mono text-slate-500">{r.fecha}</TableCell>
                              <TableCell className="font-medium text-slate-700">{r.referencia}</TableCell>
                              <TableCell className="text-right font-mono font-bold">
                                $ {r.totalResumen.toLocaleString("es-ES")}
                              </TableCell>
                              <TableCell className="text-right font-mono font-black text-emerald-600">
                                $ {r.saldoFinal.toLocaleString("es-ES")}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => onNavigateToResumen(r.id)}
                                  className="text-[10px] h-6 px-2 font-bold"
                                >
                                  Ver Resumen →
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Tab Content: Presupuestos */}
              {activeTab === "presupuestos" && (
                <Card className="border border-slate-200 bg-white shadow-sm overflow-hidden">
                  <CardHeader className="py-3 px-4 border-b bg-slate-50/50 flex flex-row items-center justify-between">
                    <CardTitle className="text-xs font-bold uppercase text-slate-700">
                      Presupuestos y Cotizaciones del Cliente
                    </CardTitle>
                    <Button
                      size="sm"
                      onClick={() => onCreatePresupuestoForCliente(selectedCliente)}
                      className="text-xs h-7 bg-slate-900 text-white font-bold"
                    >
                      + Crear Presupuesto para {selectedCliente.name}
                    </Button>
                  </CardHeader>
                  <CardContent className="p-0">
                    {clientPresupuestos.length === 0 ? (
                      <div className="p-8 text-center text-slate-400 text-xs font-medium">
                        No hay presupuestos formales emitidos para este cliente.
                      </div>
                    ) : (
                      <Table className="text-xs">
                        <TableHeader>
                          <TableRow className="bg-slate-50">
                            <TableHead className="w-[100px]">N° PRES.</TableHead>
                            <TableHead className="w-[100px]">FECHA</TableHead>
                            <TableHead>DESCRIPCIÓN DEL SERVICIO</TableHead>
                            <TableHead className="w-[140px] text-right">TOTAL ($ ARS)</TableHead>
                            <TableHead className="w-[120px]">ESTADO</TableHead>
                            <TableHead className="w-[100px] text-right">ACCIÓN</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {clientPresupuestos.map((p) => (
                            <TableRow key={p.id}>
                              <TableCell className="font-mono font-bold">#{p.numeroPresupuesto}</TableCell>
                              <TableCell className="font-mono text-slate-500">{p.fecha}</TableCell>
                              <TableCell className="font-medium text-slate-700">{p.descripcionServicio}</TableCell>
                              <TableCell className="text-right font-mono font-bold">
                                $ {p.totalProyectoArs.toLocaleString("es-ES")}
                              </TableCell>
                              <TableCell>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 uppercase">
                                  {p.estado}
                                </span>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => onNavigateToPresupuesto(p.id)}
                                  className="text-[10px] h-6 px-2 font-bold"
                                >
                                  Ver Oferta →
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 text-sm">
              Seleccioná un cliente para ver sus datos y movimientos.
            </div>
          )}
        </div>
      </div>

      {/* Modal Alta / Edición Cliente */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader className="border-b pb-3">
            <DialogTitle className="text-base font-bold text-slate-900">
              {editingCliente ? "Editar Cliente" : "Nuevo Cliente"}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              {editingCliente ? "Actualizá la información del cliente." : "Registrá una nueva empresa o cliente particular."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div>
              <Label className="text-[11px]">Nombre Fantasía / Nombre Corto *</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ej. NAVAR / ISOMAD..."
                className="mt-1 font-bold"
              />
            </div>

            <div>
              <Label className="text-[11px]">Razón Social / Denominación</Label>
              <Input
                value={denominacionSocial}
                onChange={(e) => setDenominacionSocial(e.target.value)}
                placeholder="ej. Navar SRL"
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-[11px]">Contacto en Planta</Label>
                <Input
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="ej. Hugo / Miguel Angel"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-[11px]">Teléfono / WhatsApp</Label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="ej. 3756-401122"
                  className="mt-1 font-mono"
                />
              </div>
            </div>

            <div>
              <Label className="text-[11px]">Dirección / Planta</Label>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="ej. Ruta 14 Km 752 / Parque Industrial"
                className="mt-1"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t pt-3">
            <Button variant="outline" size="sm" onClick={() => setDialogOpen(false)} className="text-xs">
              Cancelar
            </Button>
            <Button size="sm" onClick={handleSaveClient} className="bg-slate-900 text-white font-bold text-xs">
              {editingCliente ? "Guardar Cambios" : "Guardar Cliente"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Confirmación Eliminación */}
      <Dialog open={Boolean(confirmDeleteId)} onOpenChange={() => setConfirmDeleteId(null)}>
        <DialogContent className="sm:max-w-xs bg-white">
          <DialogHeader className="border-b pb-2">
            <DialogTitle className="text-sm font-bold text-red-600">¿Eliminar Cliente?</DialogTitle>
          </DialogHeader>
          <p className="text-xs text-slate-600 py-2">
            Esta acción eliminará la ficha del cliente en la base de datos de Supabase.
          </p>
          <div className="flex justify-end gap-2 border-t pt-3">
            <Button variant="outline" size="sm" onClick={() => setConfirmDeleteId(null)} className="text-xs font-bold">
              Cancelar
            </Button>
            <Button size="sm" onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs">
              Sí, Eliminar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
