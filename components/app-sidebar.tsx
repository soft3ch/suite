"use client"

import * as React from "react"
import {
  FileTextIcon,
  LogOutIcon,
  PlusIcon,
  ReceiptTextIcon,
  ShieldCheckIcon,
  TruckIcon,
  UserCheckIcon,
  UsersIcon,
  ZapIcon,
} from "lucide-react"

import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export type NavKey = "clientes" | "presupuestos" | "resumenes" | "proveedores"

type AppSidebarProps = {
  activeNav: NavKey
  onNav: (key: NavKey) => void
  onNewPresupuesto: () => void
  onNewResumen: () => void
}

export function AppSidebar({
  activeNav,
  onNav,
  onNewPresupuesto,
  onNewResumen,
}: AppSidebarProps) {
  const { user, logout } = useAuth()

  const navItems = [
    {
      key: "clientes" as NavKey,
      label: "CLIENTES",
      icon: UsersIcon,
      description: "Directorio y fichas",
    },
    {
      key: "presupuestos" as NavKey,
      label: "PRESUPUESTOS",
      icon: ReceiptTextIcon,
      description: "Obras y grandes ofertas",
    },
    {
      key: "resumenes" as NavKey,
      label: "RESÚMENES",
      icon: FileTextIcon,
      description: "Cuentas corrientes y tareas",
    },
    {
      key: "proveedores" as NavKey,
      label: "PROVEEDORES",
      icon: TruckIcon,
      description: "Compras y cotizaciones",
    },
  ]

  return (
    <Sidebar className="border-r border-slate-800 bg-slate-950 text-slate-100">
      {/* Header */}
      <SidebarHeader className="gap-3 p-4 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-lg bg-blue-600 text-white font-black shadow-md shadow-blue-600/30">
            <ZapIcon className="size-5" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-mono text-base font-black tracking-tight text-white">
              EI SUITE
            </span>
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              Virasoro • Ariel Medina
            </span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-1.5 pt-1">
          <Button
            onClick={onNewPresupuesto}
            size="sm"
            className="w-full justify-center bg-blue-600 hover:bg-blue-500 font-bold text-white text-[10px] h-8 px-1.5"
          >
            + PRESUPUESTO
          </Button>
          <Button
            onClick={onNewResumen}
            size="sm"
            variant="outline"
            className="w-full justify-center border-slate-700 bg-slate-800 hover:bg-slate-700 text-white font-bold text-[10px] h-8 px-1.5"
          >
            + RESUMEN
          </Button>
        </div>
      </SidebarHeader>

      {/* Main Navigation */}
      <SidebarContent className="px-2 py-3 bg-slate-950">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-extrabold tracking-wider text-slate-500 uppercase px-3 py-1">
            Módulos Operativos
          </SidebarGroupLabel>
          <SidebarGroupContent className="pt-1">
            <SidebarMenu className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = activeNav === item.key
                return (
                  <SidebarMenuItem key={item.key}>
                    <SidebarMenuButton
                      isActive={isActive}
                      onClick={() => onNav(item.key)}
                      className={`text-xs font-bold py-2.5 px-3 rounded-lg transition-all ${
                        isActive
                          ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                          : "text-slate-300 hover:bg-slate-900 hover:text-white"
                      }`}
                    >
                      <Icon
                        className={`size-4 mr-2.5 ${
                          isActive ? "text-white" : "text-slate-400"
                        }`}
                      />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer Profile & Logout */}
      <SidebarFooter className="p-3 bg-slate-900 border-t border-slate-800 text-slate-400">
        {user && (
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="size-8 rounded-lg bg-slate-800 text-white flex items-center justify-center font-black text-xs shrink-0 border border-slate-700">
                {user.avatarInitials}
              </div>
              <div className="flex flex-col overflow-hidden leading-tight">
                <span className="text-xs font-extrabold text-white truncate">
                  {user.name}
                </span>
                <span className="text-[10px] text-slate-400 font-medium truncate">
                  {user.roleLabel}
                </span>
              </div>
            </div>

            <button
              onClick={logout}
              title="Cerrar sesión"
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
            >
              <LogOutIcon className="size-4" />
            </button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
