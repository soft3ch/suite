"use client"

import * as React from "react"
import Image from "next/image"
import {
  ArrowLeftIcon,
  BookmarkPlusIcon,
  CalculatorIcon,
  CheckCircle2Icon,
  CopyIcon,
  FileIcon,
  FileTextIcon,
  ImageIcon,
  MapPinIcon,
  PencilIcon,
  PencilRulerIcon,
  PrinterIcon,
  PlusIcon,
  SaveIcon,
  Trash2Icon,
  UploadIcon,
  UserIcon,
} from "lucide-react"

import {
  calculateProjectBudget,
  type AreaKey,
  type LibrarySolution,
  type Material,
  type Project,
  type ProjectFile,
  type ProjectStatus,
} from "@/lib/suite-data"
import { AreaBadge } from "@/components/area-badge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

const PHOTO_BY_AREA: Record<AreaKey, string> = {
  automatismo: "/photos/automatismo.png",
  electricidad: "/photos/electricidad.png",
  solar: "/photos/solar.png",
}

export function ProjectView({
  project,
  onBack,
  onDuplicate,
  onUpdateProject,
  onDeleteProject,
  onSaveToLibrary,
}: {
  project: Project
  onBack: () => void
  onDuplicate: (project: Project) => void
  onUpdateProject: (updated: Project) => void
  onDeleteProject?: (id: string) => void
  onSaveToLibrary?: (solution: LibrarySolution) => void
}) {
  const [materials, setMaterials] = React.useState<Material[]>(project.materials)
  const [notes, setNotes] = React.useState<string[]>(project.notes || [])
  const [need, setNeed] = React.useState(project.need || "")
  const [isEditingNeed, setIsEditingNeed] = React.useState(false)
  const [newNote, setNewNote] = React.useState("")
  const [laborHours, setLaborHours] = React.useState<number>(project.laborHours ?? 12)
  const [laborRate, setLaborRate] = React.useState<number>(project.laborRatePerHour ?? 45)
  const [marginPercent, setMarginPercent] = React.useState<number>(project.marginPercent ?? 20)
  const [status, setStatus] = React.useState<ProjectStatus>(project.status ?? "borrador")
  const [files, setFiles] = React.useState<ProjectFile[]>(project.files || [])
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false)

  // Sync state when project changes
  React.useEffect(() => {
    setMaterials(project.materials)
    setNotes(project.notes || [])
    setNeed(project.need || "")
    setIsEditingNeed(false)
    setLaborHours(project.laborHours ?? 12)
    setLaborRate(project.laborRatePerHour ?? 45)
    setMarginPercent(project.marginPercent ?? 20)
    setStatus(project.status ?? "borrador")
    setFiles(project.files || [])
  }, [project])

  // Helper to persist updates to parent
  function saveUpdates(overrides?: Partial<Project>) {
    const updated: Project = {
      ...project,
      need,
      materials,
      notes,
      laborHours,
      laborRatePerHour: laborRate,
      marginPercent,
      status,
      files,
      ...overrides,
    }
    onUpdateProject(updated)
  }

  function handleSaveNeed() {
    setIsEditingNeed(false)
    saveUpdates({ need })
  }

  function updateMaterialQty(id: string, qty: number) {
    const next = materials.map((m) => (m.id === id ? { ...m, qty: Math.max(0, qty) } : m))
    setMaterials(next)
    saveUpdates({ materials: next })
  }

  function updateMaterialField(id: string, field: "ref" | "name" | "unitPrice", value: string | number) {
    const next = materials.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    setMaterials(next)
    saveUpdates({ materials: next })
  }

  function removeMaterial(id: string) {
    const next = materials.filter((m) => m.id !== id)
    setMaterials(next)
    saveUpdates({ materials: next })
  }

  function addMaterial() {
    const next = [
      ...materials,
      {
        id: `new-${Date.now()}`,
        ref: "",
        name: "",
        qty: 1,
        unit: "ud",
        unitPrice: 0,
      },
    ]
    setMaterials(next)
    saveUpdates({ materials: next })
  }

  function addTechnicalNote() {
    if (!newNote.trim()) return
    const next = [...notes, newNote.trim()]
    setNotes(next)
    setNewNote("")
    saveUpdates({ notes: next })
  }

  function removeTechnicalNote(index: number) {
    const next = notes.filter((_, i) => i !== index)
    setNotes(next)
    saveUpdates({ notes: next })
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const uploaded = e.target.files?.[0]
    if (!uploaded) return
    const kind = uploaded.name.match(/\.(jpg|jpeg|png|webp)$/i)
      ? "foto"
      : uploaded.name.endsWith(".pdf")
      ? "pdf"
      : "esquema"
    const newFile: ProjectFile = {
      id: `f-${Date.now()}`,
      name: uploaded.name,
      kind,
    }
    const next = [...files, newFile]
    setFiles(next)
    saveUpdates({ files: next })
  }

  function handleSaveAsLibrarySolution() {
    if (!onSaveToLibrary) return
    const newSolution: LibrarySolution = {
      id: `LIB-${project.id}`,
      title: project.title,
      description: need,
      area: project.area,
      tags: [project.area.toUpperCase(), "Plantilla Obra"],
      notes: [...notes],
      materials: [...materials],
      recommendedHours: laborHours,
    }
    onSaveToLibrary(newSolution)
  }

  const budgetMetrics = calculateProjectBudget({
    ...project,
    materials,
    laborHours,
    laborRatePerHour: laborRate,
    marginPercent,
  })

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 md:px-8 md:py-8">
      <Button variant="ghost" size="sm" onClick={onBack} className="mb-4 -ml-2 text-muted-foreground no-print">
        <ArrowLeftIcon className="size-4 mr-1" />
        Volver
      </Button>

      <header className="flex flex-col gap-4 border-b pb-6 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-2">
            <AreaBadge area={project.area} />
            <span className="font-mono text-xs text-muted-foreground">{project.id}</span>
            <Badge variant="outline" className="text-[10px] uppercase font-mono">
              {status}
            </Badge>
          </div>
          <h1 className="text-balance text-2xl font-semibold tracking-tight">{project.title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <UserIcon className="size-4" />
              {project.client}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPinIcon className="size-4" />
              {project.location}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 no-print shrink-0">
          {onSaveToLibrary && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveAsLibrarySolution}
              title="Guardar como plantilla reutilizable en la Biblioteca"
            >
              <BookmarkPlusIcon className="size-4 mr-1.5" />
              Guardar en Biblioteca
            </Button>
          )}

          <Button size="sm" onClick={() => onDuplicate(project)} className="shadow-sm">
            <CopyIcon className="size-4 mr-1.5" />
            Duplicar Solución
          </Button>

          {onDeleteProject && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2Icon className="size-4 mr-1.5" />
              Eliminar
            </Button>
          )}
        </div>
      </header>

      <Tabs defaultValue="resumen" className="mt-6">
        <TabsList className="h-9 no-print">
          <TabsTrigger value="resumen">Resumen</TabsTrigger>
          <TabsTrigger value="materiales">Equipos y Materiales ({materials.length})</TabsTrigger>
          <TabsTrigger value="presupuesto">Presupuesto</TabsTrigger>
          <TabsTrigger value="documentos">Documentación / PDF</TabsTrigger>
          <TabsTrigger value="archivos">Archivos ({files.length})</TabsTrigger>
        </TabsList>

        {/* Tab 1: Resumen */}
        <TabsContent value="resumen" className="mt-5 space-y-6">
          <section>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Descripción de la necesidad
              </h3>
              {!isEditingNeed ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditingNeed(true)}
                  className="h-7 text-xs text-muted-foreground no-print"
                >
                  <PencilIcon className="size-3.5 mr-1" /> Editar
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleSaveNeed}
                  className="h-7 text-xs no-print"
                >
                  <SaveIcon className="size-3.5 mr-1" /> Guardar
                </Button>
              )}
            </div>

            {isEditingNeed ? (
              <div className="space-y-2 no-print">
                <Textarea
                  rows={4}
                  value={need}
                  onChange={(e) => setNeed(e.target.value)}
                  placeholder="Describe las necesidades del cliente..."
                  className="text-sm leading-relaxed"
                />
                <div className="flex justify-end">
                  <Button size="sm" onClick={handleSaveNeed}>
                    Guardar Descripción
                  </Button>
                </div>
              </div>
            ) : (
              <p className="max-w-3xl text-pretty leading-relaxed text-foreground bg-card p-4 rounded-lg border">
                {need || "Sin descripción especificada. Haz clic en Editar para agregarla."}
              </p>
            )}
          </section>

          <Separator />

          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Notas técnicas de obra
              </h3>
            </div>

            <div className="flex gap-2 max-w-3xl no-print">
              <Input
                placeholder="Añadir una nota técnica o advertencia de campo..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTechnicalNote()}
              />
              <Button onClick={addTechnicalNote} variant="secondary">
                <PlusIcon className="size-4 mr-1" /> Añadir
              </Button>
            </div>

            <ul className="grid max-w-3xl gap-2">
              {notes.map((note, i) => (
                <li key={i} className="flex items-start justify-between gap-2.5 rounded-md border bg-card p-3 text-sm leading-relaxed">
                  <div className="flex items-start gap-2">
                    <PencilRulerIcon className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>{note}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-6 text-muted-foreground hover:text-destructive no-print"
                    onClick={() => removeTechnicalNote(i)}
                  >
                    <Trash2Icon className="size-3.5" />
                  </Button>
                </li>
              ))}
            </ul>
          </section>
        </TabsContent>

        {/* Tab 2: Equipos y Materiales */}
        <TabsContent value="materiales" className="mt-5">
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="text-sm text-muted-foreground">
              {materials.length} componentes · lista dinámica de campo
            </p>
            <Button variant="outline" size="sm" onClick={addMaterial} className="no-print">
              <PlusIcon className="size-4 mr-1" />
              Añadir componente
            </Button>
          </div>
          <div className="overflow-hidden rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[22%]">Referencia</TableHead>
                  <TableHead>Descripción del componente</TableHead>
                  <TableHead className="w-[120px]">Precio Unit (€)</TableHead>
                  <TableHead className="w-[120px]">Cantidad</TableHead>
                  <TableHead className="w-[52px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {materials.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell>
                      <Input
                        value={m.ref}
                        onChange={(e) => updateMaterialField(m.id, "ref", e.target.value)}
                        placeholder="Ref."
                        className="h-8 border-transparent bg-transparent font-mono text-xs shadow-none hover:border-input focus-visible:border-input"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={m.name}
                        onChange={(e) => updateMaterialField(m.id, "name", e.target.value)}
                        placeholder="Descripción del componente"
                        className="h-8 border-transparent bg-transparent shadow-none hover:border-input focus-visible:border-input"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min={0}
                        step={0.01}
                        value={m.unitPrice || 0}
                        onChange={(e) => updateMaterialField(m.id, "unitPrice", Number(e.target.value))}
                        className="h-8 w-24 font-mono text-xs text-right"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <Input
                          type="number"
                          min={0}
                          value={m.qty}
                          onChange={(e) => updateMaterialQty(m.id, Number(e.target.value))}
                          className="h-8 w-16 text-center tabular-nums font-bold"
                        />
                        <span className="text-xs text-muted-foreground">{m.unit}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeMaterial(m.id)}
                        className="size-8 text-muted-foreground hover:text-destructive no-print"
                      >
                        <Trash2Icon className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Tab 3: Presupuesto */}
        <TabsContent value="presupuesto" className="mt-5 space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardContent className="pt-6 space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Parámetros de Mano de Obra y Margen
                </h3>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <Label className="text-xs">Horas estimadas de obra</Label>
                    <Input
                      type="number"
                      min={1}
                      value={laborHours}
                      onChange={(e) => {
                        const v = Number(e.target.value)
                        setLaborHours(v)
                        saveUpdates({ laborHours: v })
                      }}
                      className="mt-1 font-mono"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Precio hora (€/h)</Label>
                    <Input
                      type="number"
                      min={1}
                      value={laborRate}
                      onChange={(e) => {
                        const v = Number(e.target.value)
                        setLaborRate(v)
                        saveUpdates({ laborRatePerHour: v })
                      }}
                      className="mt-1 font-mono"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Margen comercial (%)</Label>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={marginPercent}
                      onChange={(e) => {
                        const v = Number(e.target.value)
                        setMarginPercent(v)
                        saveUpdates({ marginPercent: v })
                      }}
                      className="mt-1 font-mono"
                    />
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                    Estado del Presupuesto
                  </h4>
                  <div className="flex gap-2">
                    {(["borrador", "presupuestado", "en_ejecucion", "finalizado"] as ProjectStatus[]).map((st) => (
                      <Button
                        key={st}
                        variant={status === st ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          setStatus(st)
                          saveUpdates({ status: st })
                        }}
                        className="text-xs capitalize"
                      >
                        {st.replace("_", " ")}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6 space-y-3 font-mono text-xs">
                <h3 className="font-sans text-sm font-semibold uppercase tracking-wide text-primary">
                  Desglose Económico
                </h3>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal Materiales:</span>
                  <span>{budgetMetrics.materialsSubtotal.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mano de Obra ({laborHours}h × {laborRate}€):</span>
                  <span>{budgetMetrics.laborSubtotal.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between border-t pt-2 font-semibold">
                  <span>Coste Base:</span>
                  <span>{budgetMetrics.baseCost.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Margen ({marginPercent}%):</span>
                  <span>+{budgetMetrics.marginAmount.toFixed(2)} €</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-sm">
                  <span>Base Imponible:</span>
                  <span>{budgetMetrics.netTotal.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>IVA (21%):</span>
                  <span>+{budgetMetrics.taxAmount.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between border-t pt-2 text-base font-bold text-primary font-sans">
                  <span>Total Cliente:</span>
                  <span>{budgetMetrics.grandTotal.toFixed(2)} €</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 4: Documentación / PDF */}
        <TabsContent value="documentos" className="mt-5 space-y-4">
          <div className="flex items-center justify-between border-b pb-4 no-print">
            <div>
              <h3 className="text-base font-semibold">Vista Previa de Ficha Técnica / Presupuesto</h3>
              <p className="text-xs text-muted-foreground">
                Documento listo para enviar al cliente o imprimir para el técnico en obra.
              </p>
            </div>
            <Button onClick={() => window.print()} className="shadow-sm">
              <PrinterIcon className="size-4 mr-2" /> Exportar / Imprimir PDF
            </Button>
          </div>

          <div className="p-8 border rounded-xl bg-card space-y-6 text-foreground print:border-none print:shadow-none">
            <div className="flex justify-between items-start border-b pb-4">
              <div>
                <h2 className="text-xl font-bold font-mono tracking-tight">EL SUITE — FICHA TÉCNICA Y PRESUPUESTO</h2>
                <p className="text-xs text-muted-foreground mt-1">Ref: {project.id} | Área: {project.area.toUpperCase()}</p>
              </div>
              <div className="text-right text-xs text-muted-foreground font-mono">
                <div>Fecha: {new Date().toLocaleDateString("es-ES")}</div>
                <div>Estado: {status.toUpperCase()}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="border p-3 rounded-lg bg-muted/20">
                <span className="font-semibold text-muted-foreground uppercase text-[10px]">Cliente</span>
                <p className="font-bold text-sm mt-0.5">{project.client}</p>
              </div>
              <div className="border p-3 rounded-lg bg-muted/20">
                <span className="font-semibold text-muted-foreground uppercase text-[10px]">Ubicación</span>
                <p className="font-bold text-sm mt-0.5">{project.location}</p>
              </div>
            </div>

            <section className="space-y-1 text-xs">
              <h4 className="font-bold uppercase tracking-wider text-muted-foreground text-[10px]">1. Descripción de la Obra</h4>
              <p className="leading-relaxed border p-3 rounded bg-card">{need}</p>
            </section>

            <section className="space-y-2 text-xs">
              <h4 className="font-bold uppercase tracking-wider text-muted-foreground text-[10px]">2. Lista de Materiales y Equipos</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">Ref</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead className="w-[80px] text-center">Cant.</TableHead>
                    <TableHead className="w-[100px] text-right">P. Unit (€)</TableHead>
                    <TableHead className="w-[100px] text-right">Total (€)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {materials.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell className="font-mono text-xs">{m.ref}</TableCell>
                      <TableCell className="text-xs">{m.name}</TableCell>
                      <TableCell className="text-center font-bold text-xs">{m.qty} {m.unit}</TableCell>
                      <TableCell className="text-right font-mono text-xs">{(m.unitPrice || 0).toFixed(2)} €</TableCell>
                      <TableCell className="text-right font-mono text-xs font-bold">
                        {((m.qty || 0) * (m.unitPrice || 0)).toFixed(2)} €
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </section>

            <section className="space-y-1 text-xs">
              <h4 className="font-bold uppercase tracking-wider text-muted-foreground text-[10px]">3. Notas Técnicas de Campo</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                {notes.map((n, i) => (
                  <li key={i}>{n}</li>
                ))}
              </ul>
            </section>

            <div className="border-t pt-4 flex justify-between items-end font-mono text-xs">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase">Horas Estimadas: {laborHours} h</p>
              </div>
              <div className="text-right space-y-1">
                <div>Subtotal: {budgetMetrics.netTotal.toFixed(2)} €</div>
                <div>IVA (21%): {budgetMetrics.taxAmount.toFixed(2)} €</div>
                <div className="text-base font-bold font-sans text-primary">TOTAL PRESUPUESTO: {budgetMetrics.grandTotal.toFixed(2)} €</div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Tab 5: Archivos */}
        <TabsContent value="archivos" className="mt-5">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-muted-foreground transition-colors hover:border-primary/50 hover:bg-accent/40 hover:text-primary no-print">
              <UploadIcon className="size-6" />
              <span className="text-xs font-medium">Adjuntar archivo</span>
              <input type="file" onChange={handleFileUpload} className="hidden" />
            </label>
            {files.map((file) => (
              <FileTile key={file.id} file={file} photoSrc={PHOTO_BY_AREA[project.area]} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Confirmation Dialog for Deletion */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <Trash2Icon className="size-5" /> ¿Eliminar este trabajo?
            </DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el trabajo <strong>{project.title}</strong> ({project.id}) y toda su lista de materiales y presupuestos.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setShowDeleteConfirm(false)
                if (onDeleteProject) onDeleteProject(project.id)
              }}
            >
              Eliminar Trabajo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function FileTile({ file, photoSrc }: { file: ProjectFile; photoSrc: string }) {
  return (
    <Card className="gap-0 overflow-hidden py-0">
      <div className="relative flex aspect-square items-center justify-center bg-muted">
        {file.kind === "foto" ? (
          <Image
            src={photoSrc || "/placeholder.svg"}
            alt={`Foto del resultado: ${file.name}`}
            fill
            sizes="(max-width: 640px) 50vw, 25vw"
            className="object-cover"
          />
        ) : file.kind === "esquema" ? (
          <PencilRulerIcon className="size-8 text-muted-foreground" />
        ) : (
          <FileIcon className="size-8 text-muted-foreground" />
        )}
      </div>
      <CardContent className="flex items-center gap-2 p-2.5">
        {file.kind === "foto" ? (
          <ImageIcon className="size-3.5 shrink-0 text-muted-foreground" />
        ) : (
          <FileIcon className="size-3.5 shrink-0 text-muted-foreground" />
        )}
        <span className="truncate text-xs" title={file.name}>
          {file.name}
        </span>
      </CardContent>
    </Card>
  )
}
