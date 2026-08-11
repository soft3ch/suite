"use client"

import * as React from "react"

import {
  getStoredLibrarySolutions,
  getStoredProjects,
  saveStoredLibrarySolutions,
  saveStoredProjects,
  type AreaKey,
  type LibrarySolution,
  type Project,
} from "@/lib/suite-data"
import { AppSidebar, type NavKey } from "@/components/app-sidebar"
import { BudgetSummaryView } from "@/components/budget-summary-view"
import { Dashboard } from "@/components/dashboard"
import { LibraryView } from "@/components/library-view"
import { MaterialsSummaryView } from "@/components/materials-summary-view"
import { NewWorkDialog } from "@/components/new-work-dialog"
import { ProjectView } from "@/components/project-view"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

const NAV_COPY: Record<NavKey, { heading: string; subheading: string }> = {
  principal: {
    heading: "Mesa de trabajo",
    subheading:
      "Empieza por buscar una solución que ya resolviste. Duplícala y adáptala al nuevo trabajo para ganar tiempo.",
  },
  buscar: {
    heading: "Buscar trabajo",
    subheading:
      "Busca por título, cliente, referencia de material o área técnica entre todas tus soluciones.",
  },
  recientes: {
    heading: "Trabajos recientes",
    subheading: "Los últimos trabajos en los que has estado trabajando.",
  },
  biblioteca: {
    heading: "Biblioteca de soluciones",
    subheading:
      "Todo tu histórico de obra, listo para reutilizar. Cada trabajo es una plantilla en potencia.",
  },
  materiales: {
    heading: "Maestro de Materiales",
    subheading: "Catálogo unificado de materiales y equipos utilizados en tus soluciones.",
  },
  presupuestos: {
    heading: "Presupuestos y Valoraciones",
    subheading: "Resumen de valoraciones económicas y mano de obra de tus proyectos.",
  },
  documentacion: {
    heading: "Documentación de Obra",
    subheading: "Generador de memorias técnicas, fichas de componentes y ofertas.",
  },
}

export default function Page() {
  const [projects, setProjects] = React.useState<Project[]>([])
  const [librarySolutions, setLibrarySolutions] = React.useState<LibrarySolution[]>([])
  const [isLoaded, setIsLoaded] = React.useState(false)
  const [activeNav, setActiveNav] = React.useState<NavKey>("principal")
  const [activeArea, setActiveArea] = React.useState<AreaKey | null>(null)
  const [query, setQuery] = React.useState("")
  const [selectedId, setSelectedId] = React.useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [template, setTemplate] = React.useState<Project | null>(null)

  // Load stored projects and library solutions on client mount
  React.useEffect(() => {
    setProjects(getStoredProjects())
    setLibrarySolutions(getStoredLibrarySolutions())
    setIsLoaded(true)
  }, [])

  function updateProjects(updater: (prev: Project[]) => Project[]) {
    setProjects((prev) => {
      const next = updater(prev)
      saveStoredProjects(next)
      return next
    })
  }

  function updateLibrarySolutions(updater: (prev: LibrarySolution[]) => LibrarySolution[]) {
    setLibrarySolutions((prev) => {
      const next = updater(prev)
      saveStoredLibrarySolutions(next)
      return next
    })
  }

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
          (m) =>
            m.name.toLowerCase().includes(q) ||
            m.ref.toLowerCase().includes(q),
        )
      )
    })
  }, [projects, activeArea, query])

  function handleNav(key: NavKey) {
    setActiveNav(key)
    setActiveArea(null)
    setSelectedId(null)
  }

  function handleArea(key: AreaKey) {
    setActiveArea((prev) => (prev === key ? null : key))
    setSelectedId(null)
  }

  function openNewWork() {
    setTemplate(null)
    setDialogOpen(true)
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
      if (exists) {
        return prev.map((s) => (s.id === solution.id ? solution : s))
      }
      return [solution, ...prev]
    })
  }

  function handleDeleteLibrarySolution(id: string) {
    updateLibrarySolutions((prev) => prev.filter((s) => s.id !== id))
  }

  const copy = NAV_COPY[activeNav]

  return (
    <SidebarProvider>
      <AppSidebar
        activeNav={activeNav}
        activeArea={activeArea}
        onNav={handleNav}
        onArea={handleArea}
        onNewWork={openNewWork}
      />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur-sm no-print">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-1 h-4" />
          <span className="font-mono text-sm font-medium tracking-tight">
            EL SUITE
          </span>
          <span className="text-sm text-muted-foreground">
            {selectedProject
              ? `/ Proyecto (${selectedProject.id})`
              : activeNav === "biblioteca"
              ? "/ Biblioteca de Soluciones"
              : activeNav === "materiales"
              ? "/ Maestro de Materiales"
              : activeNav === "presupuestos"
              ? "/ Presupuestos"
              : "/ Panel"}
          </span>
        </header>

        <main className="min-h-[calc(100svh-3.5rem)]">
          {!isLoaded ? (
            <div className="flex items-center justify-center p-12 text-sm text-muted-foreground">
              Cargando mesa de trabajo...
            </div>
          ) : selectedProject ? (
            <ProjectView
              project={selectedProject}
              onBack={() => setSelectedId(null)}
              onDuplicate={handleDuplicate}
              onUpdateProject={handleUpdateProject}
              onDeleteProject={handleDeleteProject}
              onSaveToLibrary={handleSaveLibrarySolution}
            />
          ) : activeNav === "biblioteca" ? (
            <LibraryView
              solutions={librarySolutions}
              activeArea={activeArea}
              onUseTemplate={handleUseLibrarySolution}
              onSaveSolution={handleSaveLibrarySolution}
              onDeleteSolution={handleDeleteLibrarySolution}
            />
          ) : activeNav === "materiales" ? (
            <MaterialsSummaryView
              projects={projects}
              onOpenProject={(id) => {
                setSelectedId(id)
                setActiveNav("principal")
              }}
            />
          ) : activeNav === "presupuestos" ? (
            <BudgetSummaryView
              projects={projects}
              onOpenProject={(id) => {
                setSelectedId(id)
                setActiveNav("principal")
              }}
            />
          ) : (
            <Dashboard
              heading={copy.heading}
              subheading={copy.subheading}
              query={query}
              onQuery={setQuery}
              activeArea={activeArea}
              projects={filtered}
              onOpen={setSelectedId}
              onNewWork={openNewWork}
            />
          )}
        </main>
      </SidebarInset>

      <NewWorkDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        template={template}
        onCreate={handleCreate}
      />
    </SidebarProvider>
  )
}
