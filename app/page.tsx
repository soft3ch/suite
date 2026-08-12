"use client"

import * as React from "react"

import {
  getStoredLibrarySolutions,
  getStoredProjects,
  getStoredPedidos,
  saveStoredLibrarySolutions,
  saveStoredProjects,
  saveStoredPedidos,
  type AreaKey,
  type LibrarySolution,
  type Pedido,
  type Project,
} from "@/lib/suite-data"
import { AppSidebar, type NavKey } from "@/components/app-sidebar"
import { AgendaTrabajoView } from "@/components/agenda-trabajo-view"
import { ClientesView } from "@/components/clientes-view"
import { BudgetSummaryView } from "@/components/budget-summary-view"
import { CalculoViaticosView } from "@/components/calculo-viaticos-view"
import { ConfiguracionSeguridadView } from "@/components/configuracion-seguridad-view"
import { CuentaCorrienteView } from "@/components/cuenta-corriente-view"
import { Dashboard } from "@/components/dashboard"
import { FotovoltaicaView } from "@/components/fotovoltaica-view"
import { InicioView } from "@/components/inicio-view"
import { LibraryView } from "@/components/library-view"
import { MaterialsSummaryView } from "@/components/materials-summary-view"
import { NewWorkDialog } from "@/components/new-work-dialog"
import { PedidosView } from "@/components/pedidos-view"
import { NuevoPedidoDialog } from "@/components/nuevo-pedido-dialog"
import { ProjectView } from "@/components/project-view"
import { ProveedoresCotizacionesView } from "@/components/proveedores-cotizaciones-view"
import { ReportesIndicadoresView } from "@/components/reportes-indicadores-view"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ZapIcon } from "lucide-react"

const DEFAULT_PEDIDOS: Pedido[] = [
  {
    id: "PD-2026-001",
    client: "NAVAR",
    contact: "Ing. Vera",
    requirementType: "mantenimiento",
    description: "Mantenimiento correctivo molino norte. Falla en contactor principal.",
    priority: "alta",
    status: "en_curso",
    date: "11/08/26",
    nextAction: "Comprar contactor Siemens 3RT1026",
  },
  {
    id: "PD-2026-002",
    client: "ISOMAD",
    contact: "Hugo / Miguel Angel",
    requirementType: "mantenimiento",
    description: "Mantenimiento correctivo tablero secadero.",
    priority: "urgente",
    status: "pendiente",
    date: "11/08/26",
    nextAction: "Visita técnica",
  },
  {
    id: "PD-2026-003",
    client: "Roca Sur",
    requirementType: "presupuesto_nuevo",
    description: "Sistema fotovoltaico on-grid 10 kW para depósito.",
    priority: "normal",
    status: "nuevo",
    date: "10/08/26",
    nextAction: "Enviar presupuesto",
  },
]

export default function Page() {
  const [projects, setProjects] = React.useState<Project[]>([])
  const [librarySolutions, setLibrarySolutions] = React.useState<LibrarySolution[]>([])
  const [pedidos, setPedidos] = React.useState<Pedido[]>([])
  const [isLoaded, setIsLoaded] = React.useState(false)

  const [activeNav, setActiveNav] = React.useState<NavKey>("inicio")
  const [activeArea, setActiveArea] = React.useState<AreaKey | null>(null)
  const [query, setQuery] = React.useState("")
  const [selectedId, setSelectedId] = React.useState<string | null>(null)

  // Project dialog (existing)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [template, setTemplate] = React.useState<Project | null>(null)

  // New Pedido dialog
  const [pedidoDialogOpen, setPedidoDialogOpen] = React.useState(false)

  // Load stored data on client mount
  React.useEffect(() => {
    setProjects(getStoredProjects())
    setLibrarySolutions(getStoredLibrarySolutions())
    const storedPedidos = getStoredPedidos()
    setPedidos(storedPedidos.length > 0 ? storedPedidos : DEFAULT_PEDIDOS)
    setIsLoaded(true)
  }, [])

  // ── Projects ──────────────────────────────────────────────────────────
  function updateProjects(updater: (prev: Project[]) => Project[]) {
    setProjects((prev) => {
      const next = updater(prev)
      saveStoredProjects(next)
      return next
    })
  }

  // ── Library ───────────────────────────────────────────────────────────
  function updateLibrarySolutions(updater: (prev: LibrarySolution[]) => LibrarySolution[]) {
    setLibrarySolutions((prev) => {
      const next = updater(prev)
      saveStoredLibrarySolutions(next)
      return next
    })
  }

  // ── Pedidos ───────────────────────────────────────────────────────────
  function updatePedidos(updater: (prev: Pedido[]) => Pedido[]) {
    setPedidos((prev) => {
      const next = updater(prev)
      saveStoredPedidos(next)
      return next
    })
  }

  // ── Project Handlers ──────────────────────────────────────────────────
  const selectedProject = projects.find((p) => p.id === selectedId) ?? null

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    return projects.filter((p) => {
      if (activeArea && p.area !== activeArea) return false
      if (!q) return true
      return (
        p.title.toLowerCase().includes(q) ||
        p.client.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.materials.some(
          (m) => m.name.toLowerCase().includes(q) || m.ref.toLowerCase().includes(q),
        )
      )
    })
  }, [projects, activeArea, query])

  function handleNav(key: NavKey) {
    setActiveNav(key)
    setActiveArea(null)
    setSelectedId(null)
  }

  function handleDuplicate(project: Project) {
    setTemplate(project)
    setDialogOpen(true)
  }

  function handleUseLibrarySolution(solution: LibrarySolution) {
    const mockProject: Project = {
      id: solution.id,
      title: solution.title,
      client: "Nuevo Cliente",
      location: "Localización por definir",
      area: solution.area,
      updatedAt: "ahora",
      need: solution.description,
      notes: [...solution.notes],
      materials: solution.materials.map((m, i) => ({ ...m, id: `lib-m-${i}` })),
      files: [],
      laborHours: solution.recommendedHours,
      laborRatePerHour: 45,
      marginPercent: 20,
      status: "borrador",
    }
    setTemplate(mockProject)
    setDialogOpen(true)
  }

  function handleCreate(newProject: Project) {
    updateProjects((prev) => [newProject, ...prev])
    setDialogOpen(false)
    setTemplate(null)
    setSelectedId(newProject.id)
  }

  function handleUpdateProject(updated: Project) {
    updateProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
  }

  function handleDeleteProject(id: string) {
    updateProjects((prev) => prev.filter((p) => p.id !== id))
    setSelectedId(null)
  }

  function handleSaveLibrarySolution(solution: LibrarySolution) {
    updateLibrarySolutions((prev) => {
      const exists = prev.some((s) => s.id === solution.id)
      if (exists) return prev.map((s) => (s.id === solution.id ? solution : s))
      return [solution, ...prev]
    })
  }

  function handleDeleteLibrarySolution(id: string) {
    updateLibrarySolutions((prev) => prev.filter((s) => s.id !== id))
  }

  function handleSavePedido(pedido: Pedido, createTarget?: "trabajo" | "presupuesto") {
    updatePedidos((prev) => [pedido, ...prev])
    setPedidoDialogOpen(false)
    if (createTarget === "trabajo") {
      handleNav("agenda")
    } else if (createTarget === "presupuesto") {
      handleNav("presupuestos")
    }
  }

  function openNuevoPedido() {
    setPedidoDialogOpen(true)
  }

  // ── Breadcrumb Label ──────────────────────────────────────────────────
  function getBreadcrumb() {
    if (selectedProject) return `/ ${selectedProject.client} — ${selectedProject.title}`
    const labels: Partial<Record<NavKey, string>> = {
      inicio: "/ Inicio",
      buscador: "/ Buscador",
      clientes: "/ Clientes",
      pedidos: "/ Pedidos",
      agenda: "/ Agenda de Trabajo",
      ordenes: "/ Órdenes de Trabajo",
      presupuestos: "/ Presupuestos",
      aprobaciones: "/ Aprobaciones",
      materiales: "/ Materiales",
      proveedores: "/ Proveedores y Cotizaciones",
      equipo: "/ Equipo y Horas",
      resumenes: "/ Resúmenes",
      facturacion: "/ Facturación",
      cuentas: "/ Cuentas Corrientes",
      viaticos: "/ Viáticos",
      fotovoltaica: "/ Fotovoltaica",
      biblioteca: "/ Biblioteca de Soluciones",
      documentacion: "/ Documentación",
      compartir: "/ Compartir",
      reportes: "/ Reportes e Indicadores",
      alertas: "/ Alertas",
      configuracion: "/ Configuración",
      usuarios: "/ Usuarios y Seguridad",
    }
    return labels[activeNav] ?? ""
  }

  // ── Render the active view ────────────────────────────────────────────
  function renderView() {
    if (!isLoaded) {
      return (
        <div className="flex items-center justify-center p-12 text-sm text-muted-foreground">
          Cargando EI SUITE...
        </div>
      )
    }

    if (selectedProject) {
      return (
        <ProjectView
          project={selectedProject}
          onBack={() => setSelectedId(null)}
          onDuplicate={handleDuplicate}
          onUpdateProject={handleUpdateProject}
          onDeleteProject={handleDeleteProject}
          onSaveToLibrary={handleSaveLibrarySolution}
        />
      )
    }

    switch (activeNav) {
      case "inicio":
        return (
          <InicioView
            pedidos={pedidos}
            onNewPedido={openNuevoPedido}
            onNavigate={handleNav}
            onOpenProject={(id) => setSelectedId(id)}
          />
        )

      case "clientes":
        return (
          <ClientesView
            onNewPedido={openNuevoPedido}
            onNavigate={handleNav}
          />
        )

      case "pedidos":
        return (
          <PedidosView
            pedidos={pedidos}
            onNewPedido={openNuevoPedido}
            onUpdatePedido={(updated) =>
              updatePedidos((prev) =>
                prev.map((p) => (p.id === updated.id ? updated : p)),
              )
            }
            onDeletePedido={(id) =>
              updatePedidos((prev) => prev.filter((p) => p.id !== id))
            }
            onSavePedido={handleSavePedido}
          />
        )

      case "agenda":
        return (
          <AgendaTrabajoView
            pedidos={pedidos}
            onNewPedido={openNuevoPedido}
          />
        )

      case "biblioteca":
        return (
          <LibraryView
            solutions={librarySolutions}
            activeArea={activeArea}
            onUseTemplate={handleUseLibrarySolution}
            onSaveSolution={handleSaveLibrarySolution}
            onDeleteSolution={handleDeleteLibrarySolution}
          />
        )

      case "materiales":
        return (
          <MaterialsSummaryView
            projects={projects}
            onOpenProject={(id) => {
              setSelectedId(id)
              setActiveNav("buscador")
            }}
          />
        )

      case "presupuestos":
      case "resumenes":
        return (
          <BudgetSummaryView
            projects={projects}
            onOpenProject={(id) => {
              setSelectedId(id)
              setActiveNav("buscador")
            }}
          />
        )

      case "proveedores":
        return <ProveedoresCotizacionesView />

      case "viaticos":
        return <CalculoViaticosView />

      case "fotovoltaica":
        return <FotovoltaicaView />

      case "cuentas":
      case "facturacion":
        return <CuentaCorrienteView />

      case "reportes":
        return <ReportesIndicadoresView />

      case "configuracion":
      case "usuarios":
        return <ConfiguracionSeguridadView />

      // For not-yet-built views, show the standard Dashboard
      default:
        return (
          <Dashboard
            heading={activeNav.charAt(0).toUpperCase() + activeNav.slice(1)}
            subheading="Vista en construcción. Pronto disponible."
            query={query}
            onQuery={setQuery}
            activeArea={activeArea}
            projects={filtered}
            onOpen={setSelectedId}
            onNewWork={() => {
              setTemplate(null)
              setDialogOpen(true)
            }}
          />
        )
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar
        activeNav={activeNav}
        onNav={handleNav}
        onNewPedido={openNuevoPedido}
      />
      <SidebarInset>
        {/* ── Header ───────────────────────────────────────────────── */}
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-slate-900 text-white px-4 no-print">
          <SidebarTrigger className="-ml-1 text-white hover:bg-slate-800 rounded" />
          <Separator orientation="vertical" className="mr-1 h-5 bg-slate-700" />
          <div className="flex items-center gap-2">
            <ZapIcon className="size-4 text-blue-400" />
            <span className="font-mono text-sm font-extrabold tracking-tight text-white">
              EI SUITE
            </span>
            <span className="text-xs text-slate-400 font-medium hidden sm:block">
              Electricidad Industrial
            </span>
          </div>
          <span className="text-xs text-slate-400 ml-1 font-mono hidden sm:block">
            {getBreadcrumb()}
          </span>
        </header>

        {/* ── Main Content ─────────────────────────────────────────── */}
        <main className="min-h-[calc(100svh-3.5rem)] bg-slate-50">
          {renderView()}
        </main>
      </SidebarInset>

      {/* ── Dialogs ──────────────────────────────────────────────────── */}
      <NewWorkDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        template={template}
        onCreate={handleCreate}
      />

      <NuevoPedidoDialog
        open={pedidoDialogOpen}
        onOpenChange={setPedidoDialogOpen}
        onSavePedido={handleSavePedido}
      />
    </SidebarProvider>
  )
}
