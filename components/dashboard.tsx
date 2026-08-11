"use client"

import { PlusIcon, SearchIcon, SearchXIcon } from "lucide-react"

import { AREAS, type AreaKey, type Project } from "@/lib/suite-data"
import { ProjectCard } from "@/components/project-card"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

type DashboardProps = {
  heading: string
  subheading: string
  query: string
  onQuery: (value: string) => void
  activeArea: AreaKey | null
  projects: Project[]
  onOpen: (id: string) => void
  onNewWork: () => void
}

export function Dashboard({
  heading,
  subheading,
  query,
  onQuery,
  activeArea,
  projects,
  onOpen,
  onNewWork,
}: DashboardProps) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8 md:py-10">
      <header className="mb-8">
        <h1 className="text-balance text-2xl font-semibold tracking-tight md:text-3xl">
          {heading}
        </h1>
        <p className="mt-1.5 max-w-2xl text-pretty text-sm text-muted-foreground md:text-base">
          {subheading}
        </p>

        <div className="mt-6 max-w-2xl">
          <InputGroup className="h-12 rounded-lg bg-card shadow-sm">
            <InputGroupAddon>
              <SearchIcon className="size-5 text-muted-foreground" />
            </InputGroupAddon>
            <InputGroupInput
              value={query}
              onChange={(e) => onQuery(e.target.value)}
              placeholder="Busca una solución anterior: motor, cuadro, bombeo, cliente…"
              aria-label="Buscar proyectos y soluciones"
              className="text-base"
            />
          </InputGroup>
          <p className="mt-2 px-1 text-xs text-muted-foreground">
            Encuentra un trabajo parecido, duplícalo y adáptalo. Así ganas tiempo.
          </p>
        </div>
      </header>

      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="flex items-baseline gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground">
            {activeArea ? AREAS[activeArea].label : "Trabajos Recientes"}
          </h2>
          <span className="font-mono text-xs text-muted-foreground">
            {projects.length}
          </span>
        </div>
      </div>

      {projects.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} onOpen={onOpen} />
          ))}
        </div>
      ) : (
        <Empty className="rounded-lg border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <SearchXIcon />
            </EmptyMedia>
            <EmptyTitle>Sin resultados</EmptyTitle>
            <EmptyDescription>
              No encontramos trabajos que coincidan con tu búsqueda. Empieza uno
              nuevo desde cero.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button onClick={onNewWork}>
              <PlusIcon data-icon="inline-start" />
              Nuevo Trabajo
            </Button>
          </EmptyContent>
        </Empty>
      )}
    </div>
  )
}
