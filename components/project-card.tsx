"use client"

import { ArrowUpRightIcon, MapPinIcon, UserIcon } from "lucide-react"

import type { Project } from "@/lib/suite-data"
import { AreaBadge } from "@/components/area-badge"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function ProjectCard({
  project,
  onOpen,
}: {
  project: Project
  onOpen: (id: string) => void
}) {
  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={() => onOpen(project.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onOpen(project.id)
        }
      }}
      className="group cursor-pointer gap-0 py-0 transition-colors hover:border-primary/40 hover:bg-card focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-ring/40 focus-visible:outline-none"
    >
      <CardHeader className="gap-0 border-b p-4 [.border-b]:pb-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <AreaBadge area={project.area} />
          <span className="font-mono text-xs text-muted-foreground">
            {project.id}
          </span>
        </div>
        <CardTitle className="text-pretty text-base leading-snug">
          {project.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-1.5 p-4 text-sm">
        <div className="flex items-center gap-2 text-foreground">
          <UserIcon className="size-3.5 shrink-0 text-muted-foreground" />
          <span className="truncate">{project.client}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPinIcon className="size-3.5 shrink-0" />
          <span className="truncate">{project.location}</span>
        </div>
      </CardContent>
      <CardFooter className="items-center justify-between border-t p-4 text-xs text-muted-foreground">
        <span>Actualizado {project.updatedAt}</span>
        <span className="inline-flex items-center gap-1 font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
          Abrir
          <ArrowUpRightIcon className="size-3.5" />
        </span>
      </CardFooter>
    </Card>
  )
}
