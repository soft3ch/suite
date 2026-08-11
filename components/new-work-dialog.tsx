"use client"

import * as React from "react"
import { CopyIcon, SparklesIcon } from "lucide-react"

import { AREAS, type AreaKey, type Project } from "@/lib/suite-data"
import { Button } from "@/components/ui/button"
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

type NewWorkDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  template: Project | null
  onCreate: (project: Project) => void
}

export function NewWorkDialog({
  open,
  onOpenChange,
  template,
  onCreate,
}: NewWorkDialogProps) {
  const isDuplicate = Boolean(template)
  const [title, setTitle] = React.useState("")
  const [client, setClient] = React.useState("")
  const [location, setLocation] = React.useState("")
  const [area, setArea] = React.useState<AreaKey>("automatismo")
  const [need, setNeed] = React.useState("")

  // Prefill when opening from a duplicated solution.
  React.useEffect(() => {
    if (open) {
      setTitle(template ? `${template.title} (copia)` : "")
      setClient("")
      setLocation("")
      setArea(template ? template.area : "automatismo")
      setNeed(template ? template.need : "")
    }
  }, [open, template])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const base = template
    const newProject: Project = {
      id: `${area.slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      title: title.trim() || "Trabajo sin título",
      client: client.trim() || "Cliente por definir",
      location: location.trim() || "Ubicación por definir",
      area,
      updatedAt: "ahora",
      status: "borrador",
      laborHours: base?.laborHours ?? 12,
      laborRatePerHour: base?.laborRatePerHour ?? 45,
      marginPercent: base?.marginPercent ?? 20,
      taxRate: 21,
      need: need.trim() || base?.need || "Descripción del trabajo por especificar.",
      notes: base ? [...base.notes] : [],
      materials: base
        ? base.materials.map((m, i) => ({ ...m, id: `dup-${Date.now()}-${i}` }))
        : [],
      files: [],
    }
    onCreate(newProject)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {isDuplicate ? (
                <CopyIcon className="size-4 text-primary" />
              ) : (
                <SparklesIcon className="size-4 text-primary" />
              )}
              {isDuplicate ? "Duplicar solución" : "Nuevo trabajo"}
            </DialogTitle>
            <DialogDescription className="text-pretty">
              {isDuplicate
                ? "Reutiliza la estructura, materiales y notas de un trabajo anterior. Ajusta el cliente, ubicación y detalles del nuevo trabajo."
                : "Crea una mesa de trabajo. Añade la necesidad inicial — el detalle técnico lo completas sobre la marcha."}
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="py-2 space-y-3">
            <Field>
              <FieldLabel htmlFor="nw-title">Título del trabajo</FieldLabel>
              <Input
                id="nw-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej. Automatización de portón corredero"
                autoFocus
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="nw-client">Cliente</FieldLabel>
                <Input
                  id="nw-client"
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  placeholder="Nombre o empresa"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="nw-location">Ubicación</FieldLabel>
                <Input
                  id="nw-location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Localidad / polígono"
                />
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="nw-need">Descripción de la necesidad</FieldLabel>
              <Textarea
                id="nw-need"
                rows={3}
                value={need}
                onChange={(e) => setNeed(e.target.value)}
                placeholder="Describe el problema técnico a resolver, requerimientos del cliente..."
                className="text-xs"
              />
            </Field>

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
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">
              {isDuplicate ? "Crear copia" : "Crear trabajo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
