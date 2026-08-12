"use client"

import {
  AlertTriangleIcon,
  BarChart3Icon,
  BellIcon,
  BoxesIcon,
  CalendarDaysIcon,
  CheckCircle2Icon,
  ClipboardListIcon,
  ClockIcon,
  FileCheck2Icon,
  FileTextIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  LibraryIcon,
  LogOutIcon,
  PackageIcon,
  PlusIcon,
  ReceiptTextIcon,
  SearchIcon,
  SendIcon,
  SettingsIcon,
  Share2Icon,
  ShieldCheckIcon,
  ShoppingCartIcon,
  SunMediumIcon,
  TruckIcon,
  UserCheckIcon,
  UsersIcon,
  WalletIcon,
  WrenchIcon,
  ZapIcon,
} from "lucide-react"

import { AREAS, type AreaKey } from "@/lib/suite-data"
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
import { Button } from "@/components/ui/button"

export type NavKey =
  | "inicio"
  | "buscador"
  | "clientes"
  | "pedidos"
  | "agenda"
  | "ordenes"
  | "presupuestos"
  | "aprobaciones"
  | "compras"
  | "materiales"
  | "proveedores"
  | "equipo"
  | "resumenes"
  | "facturacion"
  | "cuentas"
  | "viaticos"
  | "fotovoltaica"
  | "biblioteca"
  | "documentacion"
  | "compartir"
  | "reportes"
  | "alertas"
  | "configuracion"
  | "usuarios"

type NavGroup = {
  label: string
  items: { key: NavKey; label: string; icon: any }[]
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: "OPERACIÓN DIARIA",
    items: [
      { key: "inicio", label: "INICIO", icon: LayoutDashboardIcon },
      { key: "buscador", label: "BUSCADOR GLOBAL", icon: SearchIcon },
      { key: "clientes", label: "CLIENTES", icon: UsersIcon },
      { key: "pedidos", label: "PEDIDOS", icon: ClipboardListIcon },
      { key: "agenda", label: "AGENDA DE TRABAJO", icon: CalendarDaysIcon },
      { key: "ordenes", label: "ORDENES DE TRABAJO", icon: FileCheck2Icon },
    ],
  },
  {
    label: "COMERCIAL Y FACTURACIÓN",
    items: [
      { key: "presupuestos", label: "PRESUPUESTOS", icon: ReceiptTextIcon },
      { key: "aprobaciones", label: "APROBACIONES", icon: CheckCircle2Icon },
      { key: "resumenes", label: "RESÚMENES", icon: FileTextIcon },
      { key: "facturacion", label: "FACTURACIÓN", icon: WalletIcon },
      { key: "cuentas", label: "CUENTAS CORRIENTES", icon: WalletIcon },
    ],
  },
  {
    label: "MATERIALES Y CAMPO",
    items: [
      { key: "materiales", label: "MATERIALES", icon: BoxesIcon },
      { key: "proveedores", label: "PROVEEDORES Y COTIZACIONES", icon: PackageIcon },
      { key: "compras", label: "COMPRAS", icon: ShoppingCartIcon },
      { key: "viaticos", label: "VIÁTICOS", icon: TruckIcon },
      { key: "equipo", label: "EQUIPO Y HORAS", icon: UserCheckIcon },
    ],
  },
  {
    label: "SOLUCIONES Y TÉCNICA",
    items: [
      { key: "fotovoltaica", label: "FOTOVOLTAICA", icon: SunMediumIcon },
      { key: "biblioteca", label: "BIBLIOTECA DE SOLUCIONES", icon: LibraryIcon },
      { key: "documentacion", label: "DOCUMENTACIÓN", icon: FileTextIcon },
      { key: "compartir", label: "COMPARTIR / EXPORTAR", icon: Share2Icon },
    ],
  },
  {
    label: "CONTROL Y GESTIÓN",
    items: [
      { key: "reportes", label: "REPORTES E INDICADORES", icon: BarChart3Icon },
      { key: "alertas", label: "ALERTAS Y SEGUIMIENTO", icon: BellIcon },
      { key: "configuracion", label: "CONFIGURACIÓN", icon: SettingsIcon },
      { key: "usuarios", label: "USUARIOS Y SEGURIDAD", icon: ShieldCheckIcon },
    ],
  },
]

type AppSidebarProps = {
  activeNav: NavKey
  onNav: (key: NavKey) => void
  onNewPedido: () => void
}

export function AppSidebar({ activeNav, onNav, onNewPedido }: AppSidebarProps) {
  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <SidebarHeader className="gap-3 p-3 bg-slate-900 text-white">
        <div className="flex items-center gap-2.5 px-1 pt-1">
          <div className="flex size-9 items-center justify-center rounded-md bg-blue-600 text-white font-bold">
            <ZapIcon className="size-5" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-mono text-base font-bold tracking-tight text-white">
              EI SUITE
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              Electricidad Industrial
            </span>
          </div>
        </div>
        <Button
          onClick={onNewPedido}
          className="w-full justify-center bg-blue-600 font-semibold text-white hover:bg-blue-700 shadow-sm text-xs py-2"
        >
          <PlusIcon className="size-4 mr-1.5" />
          NUEVO PEDIDO
        </Button>
      </SidebarHeader>

      <SidebarContent className="px-1 py-2">
        {NAV_GROUPS.map((group) => (
          <SidebarGroup key={group.label} className="py-1.5">
            <SidebarGroupLabel className="text-[10px] font-bold tracking-wider text-slate-400 uppercase px-3 py-1">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const Icon = item.icon
                  const isActive = activeNav === item.key
                  return (
                    <SidebarMenuItem key={item.key}>
                      <SidebarMenuButton
                        isActive={isActive}
                        onClick={() => onNav(item.key)}
                        className={`text-xs font-semibold tracking-wide py-1.5 px-3 rounded-md transition-colors ${
                          isActive
                            ? "bg-slate-700 text-white font-bold"
                            : "text-slate-300 hover:bg-slate-800 hover:text-white"
                        }`}
                      >
                        <Icon className="size-4 mr-2 text-slate-400 group-hover:text-white" />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-3 bg-slate-900 border-t border-slate-800 text-slate-400 text-[11px]">
        <div className="flex items-center gap-2">
          <WrenchIcon className="size-4 text-blue-400 shrink-0" />
          <span>v2.0 • Electricidad Industrial</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
