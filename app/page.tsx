"use client"

import * as React from "react"
import { DatabaseIcon, RefreshCwIcon, ZapIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import {
  deleteCategoriaDb,
  deleteClienteDb,
  deleteEmpleadoDb,
  deletePresupuestoDb,
  deleteProveedorDb,
  deleteResumenDb,
  deleteTrabajoDiarioDb,
  fetchCategoriasDb,
  fetchClientesDb,
  fetchEmpleadosDb,
  fetchPresupuestosDb,
  fetchProveedoresDb,
  fetchResumenesDb,
  fetchTrabajosDiariosDb,
  saveCategoriaDb,
  saveClienteDb,
  saveEmpleadoDb,
  savePresupuestoDb,
  saveProveedorDb,
  saveResumenDb,
  saveTrabajoDiarioDb,
} from "@/lib/supabase/db-service"
import {
  getStoredClientes,
  getStoredPresupuestos,
  getStoredProveedores,
  getStoredResumenes,
  type CategoriaEmpleado,
  type Cliente,
  type Empleado,
  type Presupuesto,
  type Proveedor,
  type Resumen,
  type TrabajoDiario,
} from "@/lib/suite-data"
import { AppSidebar, type NavKey } from "@/components/app-sidebar"
import { ClientesView } from "@/components/clientes-view"
import { ConfiguracionTarifasView } from "@/components/configuracion-tarifas-view"
import { LoginView } from "@/components/login-view"
import { PresupuestoEditorView } from "@/components/presupuesto-editor-view"
import { ProveedoresView } from "@/components/proveedores-view"
import { ResumenEditorView } from "@/components/resumen-editor-view"
import { TrabajosView } from "@/components/trabajos-view"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

function MainDashboard() {
  const { user, isAuthenticated } = useAuth()

  const [clientes, setClientes] = React.useState<Cliente[]>([])
  const [presupuestos, setPresupuestos] = React.useState<Presupuesto[]>([])
  const [resumenes, setResumenes] = React.useState<Resumen[]>([])
  const [proveedores, setProveedores] = React.useState<Proveedor[]>([])
  const [categorias, setCategorias] = React.useState<CategoriaEmpleado[]>([])
  const [empleados, setEmpleados] = React.useState<Empleado[]>([])
  const [trabajos, setTrabajos] = React.useState<TrabajoDiario[]>([])

  const [isLoaded, setIsLoaded] = React.useState(false)
  const [isSyncing, setIsSyncing] = React.useState(false)

  const [activeNav, setActiveNav] = React.useState<NavKey>("clientes")
  const [targetClienteIdForNewItem, setTargetClienteIdForNewItem] = React.useState<string | undefined>(undefined)

  // ── Load Real Data from Supabase DB on mount ────────────────────────────
  async function loadDataFromDb() {
    setIsSyncing(true)
    try {
      const [cliData, presData, resData, provData, catData, empData, trabData] = await Promise.all([
        fetchClientesDb(),
        fetchPresupuestosDb(),
        fetchResumenesDb(),
        fetchProveedoresDb(),
        fetchCategoriasDb(),
        fetchEmpleadosDb(),
        fetchTrabajosDiariosDb(),
      ])

      setClientes(cliData)
      setPresupuestos(presData)
      setResumenes(resData)
      setProveedores(provData)
      setCategorias(catData)
      setEmpleados(empData)
      setTrabajos(trabData)
    } catch (e) {
      console.warn("Could not load from DB, using fallback data:", e)
      setClientes(getStoredClientes())
      setPresupuestos(getStoredPresupuestos())
      setResumenes(getStoredResumenes())
      setProveedores(getStoredProveedores())
    } finally {
      setIsLoaded(true)
      setIsSyncing(false)
    }
  }

  React.useEffect(() => {
    loadDataFromDb()
  }, [])

  // ── CLIENTES DB HANDLERS ────────────────────────────────────────────────
  async function handleSaveCliente(cliente: Cliente) {
    setClientes((prev) => {
      const exists = prev.some((c) => c.id === cliente.id)
      if (exists) return prev.map((c) => (c.id === cliente.id ? cliente : c))
      return [cliente, ...prev]
    })
    try {
      const saved = await saveClienteDb(cliente)
      setClientes((prev) => prev.map((c) => (c.id === cliente.id ? saved : c)))
    } catch (e) {
      console.error("Error saving cliente to Supabase:", e)
    }
  }

  async function handleDeleteCliente(id: string) {
    setClientes((prev) => prev.filter((c) => c.id !== id))
    try {
      await deleteClienteDb(id)
    } catch (e) {
      console.error("Error deleting cliente from Supabase:", e)
    }
  }

  // ── PRESUPUESTOS DB HANDLERS ─────────────────────────────────────────────
  async function handleSavePresupuesto(presupuesto: Presupuesto) {
    setPresupuestos((prev) => {
      const exists = prev.some((p) => p.id === presupuesto.id)
      if (exists) return prev.map((p) => (p.id === presupuesto.id ? presupuesto : p))
      return [presupuesto, ...prev]
    })
    try {
      const saved = await savePresupuestoDb(presupuesto)
      setPresupuestos((prev) => prev.map((p) => (p.id === presupuesto.id ? saved : p)))
    } catch (e) {
      console.error("Error saving presupuesto to Supabase:", e)
    }
  }

  async function handleDeletePresupuesto(id: string) {
    setPresupuestos((prev) => prev.filter((p) => p.id !== id))
    try {
      await deletePresupuestoDb(id)
    } catch (e) {
      console.error("Error deleting presupuesto from Supabase:", e)
    }
  }

  // ── RESÚMENES DB HANDLERS ────────────────────────────────────────────────
  async function handleSaveResumen(resumen: Resumen) {
    setResumenes((prev) => {
      const exists = prev.some((r) => r.id === resumen.id)
      if (exists) return prev.map((r) => (r.id === resumen.id ? resumen : r))
      return [resumen, ...prev]
    })
    try {
      const saved = await saveResumenDb(resumen)
      setResumenes((prev) => prev.map((r) => (r.id === resumen.id ? saved : r)))

      // Reload DB to sync updated status of linked trabajos and client balance
      loadDataFromDb()
    } catch (e) {
      console.error("Error saving resumen to Supabase:", e)
    }
  }

  async function handleDeleteResumen(id: string) {
    setResumenes((prev) => prev.filter((r) => r.id !== id))
    try {
      await deleteResumenDb(id)
    } catch (e) {
      console.error("Error deleting resumen from Supabase:", e)
    }
  }

  // ── PROVEEDORES DB HANDLERS ──────────────────────────────────────────────
  async function handleSaveProveedor(proveedor: Proveedor) {
    setProveedores((prev) => {
      const exists = prev.some((p) => p.id === proveedor.id)
      if (exists) return prev.map((p) => (p.id === proveedor.id ? proveedor : p))
      return [proveedor, ...prev]
    })
    try {
      const saved = await saveProveedorDb(proveedor)
      setProveedores((prev) => prev.map((p) => (p.id === proveedor.id ? saved : p)))
    } catch (e) {
      console.error("Error saving proveedor to Supabase:", e)
    }
  }

  async function handleDeleteProveedor(id: string) {
    setProveedores((prev) => prev.filter((p) => p.id !== id))
    try {
      await deleteProveedorDb(id)
    } catch (e) {
      console.error("Error deleting proveedor from Supabase:", e)
    }
  }

  // ── TRABAJOS DIARIOS DB HANDLERS ─────────────────────────────────────────
  async function handleSaveTrabajo(trabajo: TrabajoDiario) {
    setTrabajos((prev) => {
      const exists = prev.some((t) => t.id === trabajo.id)
      if (exists) return prev.map((t) => (t.id === trabajo.id ? trabajo : t))
      return [trabajo, ...prev]
    })
    try {
      const saved = await saveTrabajoDiarioDb(trabajo)
      setTrabajos((prev) => prev.map((t) => (t.id === trabajo.id ? saved : t)))
    } catch (e) {
      console.error("Error saving trabajo diario to Supabase:", e)
    }
  }

  async function handleDeleteTrabajo(id: string) {
    setTrabajos((prev) => prev.filter((t) => t.id !== id))
    try {
      await deleteTrabajoDiarioDb(id)
    } catch (e) {
      console.error("Error deleting trabajo diario from Supabase:", e)
    }
  }

  // ── CATEGORÍAS & EMPLEADOS DB HANDLERS ──────────────────────────────────
  async function handleSaveCategoria(categoria: CategoriaEmpleado) {
    setCategorias((prev) => {
      const exists = prev.some((c) => c.id === categoria.id)
      if (exists) return prev.map((c) => (c.id === categoria.id ? categoria : c))
      return [...prev, categoria]
    })
    try {
      const saved = await saveCategoriaDb(categoria)
      setCategorias((prev) => prev.map((c) => (c.id === categoria.id ? saved : c)))
    } catch (e) {
      console.error("Error saving categoria to Supabase:", e)
    }
  }

  async function handleDeleteCategoria(id: string) {
    setCategorias((prev) => prev.filter((c) => c.id !== id))
    try {
      await deleteCategoriaDb(id)
    } catch (e) {
      console.error("Error deleting categoria from Supabase:", e)
    }
  }

  async function handleSaveEmpleado(empleado: Empleado) {
    setEmpleados((prev) => {
      const exists = prev.some((e) => e.id === empleado.id)
      if (exists) return prev.map((e) => (e.id === empleado.id ? empleado : e))
      return [...prev, empleado]
    })
    try {
      const saved = await saveEmpleadoDb(empleado)
      setEmpleados((prev) => prev.map((e) => (e.id === empleado.id ? saved : e)))
    } catch (e) {
      console.error("Error saving empleado to Supabase:", e)
    }
  }

  async function handleDeleteEmpleado(id: string) {
    setEmpleados((prev) => prev.filter((e) => e.id !== id))
    try {
      await deleteEmpleadoDb(id)
    } catch (e) {
      console.error("Error deleting empleado from Supabase:", e)
    }
  }

  function handleCreatePresupuestoForCliente(clienteId: string) {
    setTargetClienteIdForNewItem(clienteId)
    setActiveNav("presupuestos")
  }

  function handleCreateResumenForCliente(clienteId: string) {
    setTargetClienteIdForNewItem(clienteId)
    setActiveNav("resumenes")
  }

  if (!isAuthenticated) {
    return <LoginView />
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 gap-3">
        <div className="size-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-mono font-bold tracking-wider uppercase text-slate-300">
          Conectando a Supabase DB...
        </span>
      </div>
    )
  }

  function renderView() {
    switch (activeNav) {
      case "clientes":
        return (
          <ClientesView
            clientes={clientes}
            presupuestos={presupuestos}
            resumenes={resumenes}
            onSaveCliente={handleSaveCliente}
            onDeleteCliente={handleDeleteCliente}
            onCreatePresupuestoForCliente={handleCreatePresupuestoForCliente}
            onCreateResumenForCliente={handleCreateResumenForCliente}
            onNavigateToPresupuesto={(id) => setActiveNav("presupuestos")}
            onNavigateToResumen={(id) => setActiveNav("resumenes")}
          />
        )

      case "presupuestos":
        return (
          <PresupuestoEditorView
            presupuestos={presupuestos}
            clientes={clientes}
            proveedores={proveedores}
            onSavePresupuesto={handleSavePresupuesto}
            onDeletePresupuesto={handleDeletePresupuesto}
            initialClienteId={targetClienteIdForNewItem}
          />
        )

      case "trabajos":
        return (
          <TrabajosView
            trabajos={trabajos}
            clientes={clientes}
            categorias={categorias}
            empleados={empleados}
            onSaveTrabajo={handleSaveTrabajo}
            onDeleteTrabajo={handleDeleteTrabajo}
          />
        )

      case "resumenes":
        return (
          <ResumenEditorView
            resumenes={resumenes}
            clientes={clientes}
            trabajos={trabajos}
            onSaveResumen={handleSaveResumen}
            onDeleteResumen={handleDeleteResumen}
            initialClienteId={targetClienteIdForNewItem}
          />
        )

      case "proveedores":
        return (
          <ProveedoresView
            proveedores={proveedores}
            onSaveProveedor={handleSaveProveedor}
            onDeleteProveedor={handleDeleteProveedor}
          />
        )

      case "tarifas":
        return (
          <ConfiguracionTarifasView
            categorias={categorias}
            empleados={empleados}
            onSaveCategoria={handleSaveCategoria}
            onDeleteCategoria={handleDeleteCategoria}
            onSaveEmpleado={handleSaveEmpleado}
            onDeleteEmpleado={handleDeleteEmpleado}
          />
        )
    }
  }

  const navTitles: Record<NavKey, string> = {
    clientes: "/ Clientes y Cuentas",
    presupuestos: "/ Presupuestos Formales",
    trabajos: "/ Trabajos Diarios Realizados",
    resumenes: "/ Resúmenes de Trabajo (Cuentas Corrientes)",
    proveedores: "/ Directorio de Proveedores",
    tarifas: "/ Tarifas por Hora y Nómina de Personal",
  }

  return (
    <SidebarProvider>
      <AppSidebar
        activeNav={activeNav}
        onNav={(key) => {
          setTargetClienteIdForNewItem(undefined)
          setActiveNav(key)
        }}
        onNewPresupuesto={() => {
          setTargetClienteIdForNewItem(undefined)
          setActiveNav("presupuestos")
        }}
        onNewResumen={() => {
          setTargetClienteIdForNewItem(undefined)
          setActiveNav("resumenes")
        }}
      />
      <SidebarInset className="bg-slate-50 flex flex-col min-h-screen">
        {/* Top Navbar Header */}
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between gap-2 border-b border-slate-200 bg-white/95 px-4 backdrop-blur no-print">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="text-slate-700 hover:text-slate-900" />
            <Separator orientation="vertical" className="h-5 bg-slate-200" />
            <span className="text-xs font-mono font-bold tracking-tight text-slate-800 flex items-center gap-1.5">
              <ZapIcon className="size-4 text-amber-500 fill-amber-500" />
              EI SUITE
              <span className="text-slate-400 font-normal">{navTitles[activeNav]}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={loadDataFromDb}
              disabled={isSyncing}
              className="text-[11px] h-7 gap-1 font-bold border-slate-200"
            >
              <RefreshCwIcon className={`size-3 text-blue-600 ${isSyncing ? "animate-spin" : ""}`} />
              {isSyncing ? "Sincronizando DB..." : "Sincronizar"}
            </Button>
            <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full text-[10px] font-extrabold border border-emerald-200">
              <DatabaseIcon className="size-3 text-emerald-600" />
              Supabase DB Conectada
            </div>
          </div>
        </header>

        <main className="flex-1 pb-12">{renderView()}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default function Page() {
  return <MainDashboard />
}
