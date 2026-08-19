"use client"

import * as React from "react"

import { useAuth } from "@/lib/auth-context"
import {
  deleteClienteDb,
  deletePresupuestoDb,
  deleteProveedorDb,
  deleteResumenDb,
  fetchClientesDb,
  fetchPresupuestosDb,
  fetchProveedoresDb,
  fetchResumenesDb,
  saveClienteDb,
  savePresupuestoDb,
  saveProveedorDb,
  saveResumenDb,
} from "@/lib/supabase/db-service"
import {
  getStoredClientes,
  getStoredPresupuestos,
  getStoredProveedores,
  getStoredResumenes,
  type Cliente,
  type Presupuesto,
  type Proveedor,
  type Resumen,
} from "@/lib/suite-data"
import { AppSidebar, type NavKey } from "@/components/app-sidebar"
import { ClientesView } from "@/components/clientes-view"
import { LoginView } from "@/components/login-view"
import { PresupuestoEditorView } from "@/components/presupuesto-editor-view"
import { ProveedoresView } from "@/components/proveedores-view"
import { ResumenEditorView } from "@/components/resumen-editor-view"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { DatabaseIcon, RefreshCwIcon, ZapIcon } from "lucide-react"

function MainDashboard() {
  const { user, isAuthenticated } = useAuth()

  const [clientes, setClientes] = React.useState<Cliente[]>([])
  const [presupuestos, setPresupuestos] = React.useState<Presupuesto[]>([])
  const [resumenes, setResumenes] = React.useState<Resumen[]>([])
  const [proveedores, setProveedores] = React.useState<Proveedor[]>([])
  const [isLoaded, setIsLoaded] = React.useState(false)
  const [isSyncing, setIsSyncing] = React.useState(false)

  const [activeNav, setActiveNav] = React.useState<NavKey>("clientes")
  const [targetClienteIdForNewItem, setTargetClienteIdForNewItem] = React.useState<string | undefined>(undefined)

  // ── Load Real Data from Supabase DB on mount ────────────────────────────
  async function loadDataFromDb() {
    setIsSyncing(true)
    try {
      const [cliData, presData, resData, provData] = await Promise.all([
        fetchClientesDb(),
        fetchPresupuestosDb(),
        fetchResumenesDb(),
        fetchProveedoresDb(),
      ])

      setClientes(cliData)
      setPresupuestos(presData)
      setResumenes(resData)
      setProveedores(provData)
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
    // Optimistic UI update
    setClientes((prev) => {
      const exists = prev.some((c) => c.id === cliente.id)
      return exists ? prev.map((c) => (c.id === cliente.id ? cliente : c)) : [cliente, ...prev]
    })

    try {
      const saved = await saveClienteDb(cliente)
      setClientes((prev) => prev.map((c) => (c.id === cliente.id ? saved : c)))
    } catch (err) {
      console.error("Error saving cliente to Supabase:", err)
    }
  }

  async function handleDeleteCliente(id: string) {
    setClientes((prev) => prev.filter((c) => c.id !== id))
    try {
      await deleteClienteDb(id)
    } catch (err) {
      console.error("Error deleting cliente from Supabase:", err)
    }
  }

  // ── PRESUPUESTOS DB HANDLERS ────────────────────────────────────────────
  async function handleSavePresupuesto(presupuesto: Presupuesto) {
    setPresupuestos((prev) => {
      const exists = prev.some((p) => p.id === presupuesto.id)
      return exists ? prev.map((p) => (p.id === presupuesto.id ? presupuesto : p)) : [presupuesto, ...prev]
    })

    try {
      const saved = await savePresupuestoDb(presupuesto)
      setPresupuestos((prev) => prev.map((p) => (p.id === presupuesto.id ? saved : p)))
    } catch (err) {
      console.error("Error saving presupuesto to Supabase:", err)
    }
  }

  async function handleDeletePresupuesto(id: string) {
    setPresupuestos((prev) => prev.filter((p) => p.id !== id))
    try {
      await deletePresupuestoDb(id)
    } catch (err) {
      console.error("Error deleting presupuesto from Supabase:", err)
    }
  }

  // ── RESÚMENES DB HANDLERS ───────────────────────────────────────────────
  async function handleSaveResumen(resumen: Resumen) {
    setResumenes((prev) => {
      const exists = prev.some((r) => r.id === resumen.id)
      return exists ? prev.map((r) => (r.id === resumen.id ? resumen : r)) : [resumen, ...prev]
    })

    if (resumen.clienteId) {
      setClientes((prev) =>
        prev.map((c) => (c.id === resumen.clienteId ? { ...c, saldoActual: resumen.saldoFinal } : c))
      )
    }

    try {
      const saved = await saveResumenDb(resumen)
      setResumenes((prev) => prev.map((r) => (r.id === resumen.id ? saved : r)))
    } catch (err) {
      console.error("Error saving resumen to Supabase:", err)
    }
  }

  async function handleDeleteResumen(id: string) {
    setResumenes((prev) => prev.filter((r) => r.id !== id))
    try {
      await deleteResumenDb(id)
    } catch (err) {
      console.error("Error deleting resumen from Supabase:", err)
    }
  }

  // ── PROVEEDORES DB HANDLERS ─────────────────────────────────────────────
  async function handleSaveProveedor(proveedor: Proveedor) {
    setProveedores((prev) => {
      const exists = prev.some((p) => p.id === proveedor.id)
      return exists ? prev.map((p) => (p.id === proveedor.id ? proveedor : p)) : [proveedor, ...prev]
    })

    try {
      const saved = await saveProveedorDb(proveedor)
      setProveedores((prev) => prev.map((p) => (p.id === proveedor.id ? saved : p)))
    } catch (err) {
      console.error("Error saving proveedor to Supabase:", err)
    }
  }

  async function handleDeleteProveedor(id: string) {
    setProveedores((prev) => prev.filter((p) => p.id !== id))
    try {
      await deleteProveedorDb(id)
    } catch (err) {
      console.error("Error deleting proveedor from Supabase:", err)
    }
  }

  // Navigation helpers from client card
  function handleCreatePresupuestoForCliente(cliente: Cliente) {
    setTargetClienteIdForNewItem(cliente.id)
    setActiveNav("presupuestos")
  }

  function handleCreateResumenForCliente(cliente: Cliente) {
    setTargetClienteIdForNewItem(cliente.id)
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

      case "resumenes":
        return (
          <ResumenEditorView
            resumenes={resumenes}
            clientes={clientes}
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
    }
  }

  const navTitles: Record<NavKey, string> = {
    clientes: "/ Clientes y Cuentas",
    presupuestos: "/ Presupuestos Formales",
    resumenes: "/ Resúmenes de Trabajo (Cuentas Corrientes)",
    proveedores: "/ Directorio de Proveedores",
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

      <SidebarInset>
        {/* Header bar */}
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between border-b bg-slate-900 text-white px-4 no-print shadow-sm">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1 text-white hover:bg-slate-800 rounded" />
            <Separator orientation="vertical" className="mr-1 h-5 bg-slate-700" />
            <div className="flex items-center gap-2">
              <ZapIcon className="size-4 text-blue-400" />
              <span className="font-mono text-sm font-black tracking-tight text-white">
                EI SUITE
              </span>
              <span className="text-xs text-slate-400 font-medium hidden sm:block">
                Electricidad Industrial
              </span>
            </div>
            <span className="text-xs text-slate-400 ml-1 font-mono hidden sm:block">
              {navTitles[activeNav]}
            </span>
          </div>

          {/* Right Header Status */}
          <div className="flex items-center gap-3">
            <button
              onClick={loadDataFromDb}
              title="Sincronizar datos con Supabase"
              disabled={isSyncing}
              className="flex items-center gap-1.5 text-[11px] font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-md border border-slate-700 transition-colors"
            >
              <RefreshCwIcon className={`size-3 ${isSyncing ? "animate-spin text-blue-400" : ""}`} />
              <span className="hidden sm:inline">Sincronizar DB</span>
            </button>

            {user && (
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700">
                <span className="size-2 rounded-full bg-emerald-400" />
                <span className="font-bold text-white">{user.name}</span>
                <span className="text-[10px] text-slate-400 font-mono">({user.role})</span>
              </div>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="min-h-[calc(100svh-3.5rem)] bg-slate-50">
          {renderView()}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default function Page() {
  return <MainDashboard />
}
