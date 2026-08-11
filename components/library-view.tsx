"use client"

import * as React from "react"
import { CopyIcon, LayersIcon, LightbulbIcon, PencilIcon, PlusIcon, SparklesIcon, TagIcon, Trash2Icon, WrenchIcon } from "lucide-react"

import {
  AREAS,
  type AreaKey,
  type LibrarySolution,
  type Material,
} from "@/lib/suite-data"
import { AreaBadge } from "@/components/area-badge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

type LibraryViewProps = {
  solutions: LibrarySolution[]
  activeArea: AreaKey | null
  onUseTemplate: (solution: LibrarySolution) => void
  onSaveSolution: (solution: LibrarySolution) => void
  onDeleteSolution: (id: string) => void
}

export function LibraryView({
  solutions,
  activeArea,
  onUseTemplate,
  onSaveSolution,
  onDeleteSolution,
}: LibraryViewProps) {
  const [search, setSearch] = React.useState("")
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editingSol, setEditingSol] = React.useState<LibrarySolution | null>(null)

  // Form states for creating/editing a solution
  const [title, setTitle] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [area, setArea] = React.useState<AreaKey>("automatismo")
  const [tagsStr, setTagsStr] = React.useState("")
  const [hours, setHours] = React.useState(8)

  function openCreateDialog() {
    setEditingSol(null)
    setTitle("")
    setDescription("")
    setArea("automatismo")
    setTagsStr("Estándar, Obra")
    setHours(8)
    setDialogOpen(true)
  }

  function openEditDialog(sol: LibrarySolution) {
    setEditingSol(sol)
    setTitle(sol.title)
    setDescription(sol.description)
    setArea(sol.area)
    setTagsStr(sol.tags.join(", "))
    setHours(sol.recommendedHours || 8)
    setDialogOpen(true)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const tags = tagsStr.split(",").map((t) => t.trim()).filter(Boolean)
    const newSolution: LibrarySolution = {
      id: editingSol ? editingSol.id : `LIB-${area.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      title: title.trim() || "Solución Plantilla sin título",
      description: description.trim() || "Sin descripción",
      area,
      tags: tags.length > 0 ? tags : ["Plantilla"],
      notes: editingSol ? editingSol.notes : ["Verificar especificaciones según obra."],
      materials: editingSol ? editingSol.materials : [],
      recommendedHours: hours,
    }
    onSaveSolution(newSolution)
    setDialogOpen(false)
  }

  const filteredSolutions = React.useMemo(() => {
    const q = search.trim().toLowerCase()
    return solutions.filter((sol) => {
      if (activeArea && sol.area !== activeArea) return false
      if (!q) return true
      return (
        sol.title.toLowerCase().includes(q) ||
        sol.description.toLowerCase().includes(q) ||
        sol.tags.some((t) => t.toLowerCase().includes(q)) ||
        sol.materials.some(
          (m) => m.name.toLowerCase().includes(q) || m.ref.toLowerCase().includes(q)
        )
      )
    })
  }, [solutions, activeArea, search])

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8 md:py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <LayersIcon className="size-5 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">Biblioteca de Soluciones Reutilizables</h1>
          </div>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Soluciones técnicas probadas en obra. Selecciona una plantilla para clonar su estructura de equipos, materiales y notas en tu nuevo trabajo, o añade tus propias plantillas.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Input
            placeholder="Buscar soluciones o referencias..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-full md:w-60"
          />
          <Button onClick={openCreateDialog} className="shrink-0 shadow-sm">
            <PlusIcon className="size-4 mr-1.5" /> Nueva Solución
          </Button>
        </div>
      </div>

      {filteredSolutions.length === 0 ? (
        <div className="text-center py-12 border rounded-xl bg-card/50">
          <LightbulbIcon className="size-10 mx-auto text-muted-foreground mb-3 opacity-60" />
          <h3 className="text-base font-semibold">No se encontraron soluciones</h3>
          <p className="text-xs text-muted-foreground mt-1 mb-4">
            Prueba a cambiar los filtros de búsqueda o agrega una nueva plantilla de solución.
          </p>
          <Button onClick={openCreateDialog} variant="outline" size="sm">
            <PlusIcon className="size-4 mr-1" /> Crear Solución en Biblioteca
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredSolutions.map((solution) => (
            <Card key={solution.id} className="flex flex-col justify-between hover:border-primary/50 transition-colors">
              <CardHeader className="space-y-2">
                <div className="flex items-center justify-between">
                  <AreaBadge area={solution.area} />
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7 text-muted-foreground hover:text-foreground"
                      onClick={() => openEditDialog(solution)}
                      title="Editar Plantilla"
                    >
                      <PencilIcon className="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7 text-muted-foreground hover:text-destructive"
                      onClick={() => onDeleteSolution(solution.id)}
                      title="Eliminar Plantilla"
                    >
                      <Trash2Icon className="size-3.5" />
                    </Button>
                    <span className="font-mono text-xs text-muted-foreground ml-1">{solution.id}</span>
                  </div>
                </div>
                <CardTitle className="text-lg leading-snug">{solution.title}</CardTitle>
                <CardDescription className="text-xs leading-relaxed line-clamp-3">
                  {solution.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 text-xs">
                <div className="flex flex-wrap gap-1.5">
                  {solution.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-[10px] font-normal">
                      <TagIcon className="size-2.5 mr-1 text-muted-foreground" />
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="bg-muted/40 p-3 rounded-lg space-y-2 border">
                  <div className="flex items-center justify-between text-muted-foreground font-medium">
                    <span className="flex items-center gap-1">
                      <WrenchIcon className="size-3.5" /> Componentes base
                    </span>
                    <span>{solution.materials.length} ítems</span>
                  </div>
                  <ul className="space-y-1 text-[11px]">
                    {solution.materials.slice(0, 3).map((m) => (
                      <li key={m.id} className="flex items-center justify-between truncate">
                        <span className="truncate font-mono">{m.ref || m.name}</span>
                        <span className="text-muted-foreground ml-2">{m.qty} {m.unit}</span>
                      </li>
                    ))}
                    {solution.materials.length > 3 && (
                      <li className="text-[10px] text-muted-foreground italic">
                        + {solution.materials.length - 3} componentes adicionales...
                      </li>
                    )}
                  </ul>
                </div>
              </CardContent>

              <CardFooter className="pt-2">
                <Button
                  className="w-full shadow-sm"
                  onClick={() => onUseTemplate(solution)}
                >
                  <CopyIcon className="size-4 mr-2" />
                  Usar como plantilla
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog for Adding or Editing a Library Solution */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <SparklesIcon className="size-4 text-primary" />
                {editingSol ? "Editar Solución en Biblioteca" : "Nueva Solución en Biblioteca"}
              </DialogTitle>
              <DialogDescription>
                Define una estructura de solución estándar reutilizable para tus futuros trabajos.
              </DialogDescription>
            </DialogHeader>

            <FieldGroup className="py-2 space-y-3">
              <Field>
                <FieldLabel htmlFor="sol-title">Título de la Solución</FieldLabel>
                <Input
                  id="sol-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej. Tablero de Bombeo Doble con Variador"
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="sol-desc">Descripción técnica</FieldLabel>
                <Textarea
                  id="sol-desc"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explica qué problema resuelve esta solución y cuándo debe aplicarse..."
                  className="text-xs"
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="sol-tags">Etiquetas (separadas por coma)</FieldLabel>
                  <Input
                    id="sol-tags"
                    value={tagsStr}
                    onChange={(e) => setTagsStr(e.target.value)}
                    placeholder="PLC, Bombeo, VFD"
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="sol-hours">Horas estimadas (h)</FieldLabel>
                  <Input
                    id="sol-hours"
                    type="number"
                    min={1}
                    value={hours}
                    onChange={(e) => setHours(Number(e.target.value))}
                  />
                </Field>
              </div>

              <Field>
                <FieldLabel>Área técnica</FieldLabel>
                <ToggleGroup
                  variant="outline"
                  value={[area]}
                  onValueChange={(vals: string[]) => {
                    const next = (vals.find((v) => v !== area) ?? area) as AreaKey
                    setArea(next)
                  }}
                  className="w-full"
                >
                  {(Object.keys(AREAS) as AreaKey[]).map((key) => (
                    <ToggleGroupItem key={key} value={key} className="flex-1 text-xs">
                      {AREAS[key].short}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </Field>
            </FieldGroup>

            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                {editingSol ? "Guardar Cambios" : "Crear Solución"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
