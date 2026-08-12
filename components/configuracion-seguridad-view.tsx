"use client"

import * as React from "react"
import { LockIcon, PlusIcon, SaveIcon, ShieldCheckIcon, TrashIcon, UserIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ConfiguracionSeguridadView() {
  const [activeTab, setActiveTab] = React.useState<"empresa" | "usuarios" | "roles" | "backup">("empresa")

  const users = [
    { name: "Federico Menna", role: "Administrador", email: "federico@electricidad.com", status: "Activo" },
    { name: "Miguel Gauto", role: "Técnico Senior", email: "miguel@electricidad.com", status: "Activo" },
    { name: "Carlos Sena", role: "Técnico", email: "carlos@electricidad.com", status: "Activo" },
    { name: "Diego López", role: "Colaborador", email: "diego@electricidad.com", status: "Inactivo" },
  ]

  const roles = [
    {
      name: "Administrador",
      permissions: [
        "Crear / Editar / Eliminar Trabajos",
        "Ver y aprobar Presupuestos",
        "Acceso a Cuentas Corrientes",
        "Configuración del sistema",
        "Reportes e indicadores",
      ],
    },
    {
      name: "Técnico Senior",
      permissions: [
        "Crear / Editar Trabajos",
        "Ver Presupuestos",
        "Acceso parcial a materiales",
        "Registrar horas",
      ],
    },
    {
      name: "Técnico",
      permissions: [
        "Ver Trabajos asignados",
        "Registrar avance",
        "Acceso a documentación técnica",
      ],
    },
    {
      name: "Colaborador",
      permissions: [
        "Ver Trabajos asignados",
        "Registrar horas",
      ],
    },
  ]

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8 space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Configuración y Seguridad</h1>
        <p className="text-sm text-slate-500 font-medium mt-1">
          Empresa, usuarios, roles y respaldo de datos.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap text-xs font-bold">
        {[
          { key: "empresa", label: "EMPRESA" },
          { key: "usuarios", label: "USUARIOS" },
          { key: "roles", label: "ROLES Y PERMISOS" },
          { key: "backup", label: "BACKUP" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === tab.key
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Empresa */}
      {activeTab === "empresa" && (
        <Card className="border border-slate-200 bg-white">
          <CardHeader className="py-4 border-b border-slate-100">
            <CardTitle className="text-sm font-bold uppercase text-slate-900">DATOS DE LA EMPRESA</CardTitle>
          </CardHeader>
          <CardContent className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div className="space-y-3">
              <div>
                <Label className="text-[11px]">Razón Social</Label>
                <Input defaultValue="Electricidad Industrial SRL" className="mt-1 font-semibold" />
              </div>
              <div>
                <Label className="text-[11px]">CUIT</Label>
                <Input defaultValue="30-71248391-2" className="mt-1 font-mono" />
              </div>
              <div>
                <Label className="text-[11px]">Localidad</Label>
                <Input defaultValue="Virasoro, Corrientes" className="mt-1 font-medium" />
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <Label className="text-[11px]">Teléfono</Label>
                <Input defaultValue="+54 3756 400 123" className="mt-1 font-mono" />
              </div>
              <div>
                <Label className="text-[11px]">Email</Label>
                <Input defaultValue="admin@electricidad.com" className="mt-1" />
              </div>
              <div>
                <Label className="text-[11px]">Slogan / Subtítulo en documentos</Label>
                <Input defaultValue="Electricidad Industrial" className="mt-1" />
              </div>
            </div>
            <div className="md:col-span-2 flex justify-end pt-2 border-t border-slate-100">
              <Button className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs">
                <SaveIcon className="size-4 mr-1.5" /> GUARDAR CAMBIOS
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab: Usuarios */}
      {activeTab === "usuarios" && (
        <Card className="border border-slate-200 bg-white overflow-hidden">
          <CardHeader className="py-4 border-b border-slate-100 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold uppercase text-slate-900">USUARIOS DEL SISTEMA</CardTitle>
            <Button className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs">
              <PlusIcon className="size-4 mr-1.5" /> AGREGAR USUARIO
            </Button>
          </CardHeader>
          <CardContent className="p-0 divide-y divide-slate-100">
            {users.map((u, idx) => (
              <div key={idx} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-full bg-slate-900 text-white font-bold text-sm flex items-center justify-center">
                    {u.name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-900">{u.name}</div>
                    <div className="text-xs text-slate-500">{u.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">{u.role}</span>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                    u.status === "Activo" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                  }`}>
                    {u.status}
                  </span>
                  <button className="text-red-500 hover:text-red-700 p-1 rounded transition-colors">
                    <TrashIcon className="size-4" />
                  </button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Tab: Roles */}
      {activeTab === "roles" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {roles.map((role, idx) => (
            <Card key={idx} className="border border-slate-200 bg-white">
              <CardHeader className="py-4 border-b border-slate-100">
                <CardTitle className="text-sm font-bold uppercase text-slate-900 flex items-center gap-2">
                  <ShieldCheckIcon className="size-4 text-blue-600" />
                  {role.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-1.5 text-xs text-slate-600 font-medium">
                {role.permissions.map((p, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-emerald-500 font-black mt-0.5">✓</span>
                    <span>{p}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Tab: Backup */}
      {activeTab === "backup" && (
        <Card className="border border-slate-200 bg-white">
          <CardHeader className="py-4 border-b border-slate-100">
            <CardTitle className="text-sm font-bold uppercase text-slate-900">COPIA DE SEGURIDAD</CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4 text-xs">
            <p className="text-slate-600 font-medium">
              Todos los datos están almacenados en este dispositivo. Exportá una copia de seguridad periódicamente.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={() => {
                  const data = {
                    projects: localStorage.getItem("el_suite_projects_data_v2"),
                    library: localStorage.getItem("el_suite_library_data_v2"),
                    pedidos: localStorage.getItem("el_suite_pedidos_data_v2"),
                  }
                  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement("a")
                  a.href = url
                  a.download = `el_suite_backup_${new Date().toISOString().slice(0, 10)}.json`
                  a.click()
                  URL.revokeObjectURL(url)
                }}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold"
              >
                EXPORTAR BACKUP (.json)
              </Button>
              <Button variant="outline" className="font-bold text-slate-700">
                IMPORTAR BACKUP
              </Button>
            </div>
            <div className="text-slate-400 text-[11px] pt-2">
              Última copia de seguridad: hoy 11:47 hs (automática local)
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
