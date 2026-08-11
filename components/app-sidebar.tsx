"use client"

import {
  BoxesIcon,
  ClockIcon,
  FileTextIcon,
  LayoutDashboardIcon,
  LibraryIcon,
  PlusIcon,
  ReceiptTextIcon,
  SearchIcon,
  SunMediumIcon,
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

export type NavKey = "principal" | "buscar" | "recientes" | "biblioteca" | "materiales" | "presupuestos" | "documentacion"

const MAIN_NAV: { key: NavKey; label: string; icon: typeof SearchIcon }[] = [
  { key: "principal", label: "Pantalla Principal", icon: LayoutDashboardIcon },
  { key: "buscar", label: "Buscar Trabajo", icon: SearchIcon },
  { key: "recientes", label: "Trabajos Recientes", icon: ClockIcon },
  { key: "biblioteca", label: "Biblioteca de Soluciones", icon: LibraryIcon },
]

const AREA_ICONS: Record<AreaKey, typeof ZapIcon> = {
  automatismo: WrenchIcon,
  electricidad: ZapIcon,
  solar: SunMediumIcon,
}

const TOOLS: { key: NavKey; label: string; icon: typeof BoxesIcon }[] = [
  { key: "materiales", label: "Materiales", icon: BoxesIcon },
  { key: "presupuestos", label: "Presupuestos", icon: ReceiptTextIcon },
  { key: "documentacion", label: "Documentación", icon: FileTextIcon },
]

type AppSidebarProps = {
  activeNav: NavKey
  activeArea: AreaKey | null
  onNav: (key: NavKey) => void
  onArea: (key: AreaKey) => void
  onNewWork: () => void
}

export function AppSidebar({
  activeNav,
  activeArea,
  onNav,
  onArea,
  onNewWork,
}: AppSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader className="gap-3 p-3">
        <div className="flex items-center gap-2 px-1 pt-1">
          <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <ZapIcon className="size-4" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-mono text-sm font-semibold tracking-tight">
              EL SUITE
            </span>
            <span className="text-xs text-sidebar-foreground/60">
              Mesa de trabajo
            </span>
          </div>
        </div>
        <Button
          onClick={onNewWork}
          className="w-full justify-start bg-primary font-medium text-primary-foreground hover:bg-primary/90"
        >
          <PlusIcon data-icon="inline-start" />
          Nuevo Trabajo
        </Button>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {MAIN_NAV.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton
                    isActive={activeNav === item.key && !activeArea}
                    onClick={() => onNav(item.key)}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Áreas de dominio</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {(Object.keys(AREAS) as AreaKey[]).map((key) => {
                const Icon = AREA_ICONS[key]
                return (
                  <SidebarMenuItem key={key}>
                    <SidebarMenuButton
                      isActive={activeArea === key}
                      onClick={() => onArea(key)}
                    >
                      <Icon />
                      <span>{AREAS[key].label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Herramientas transversales</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {TOOLS.map((tool) => (
                <SidebarMenuItem key={tool.key}>
                  <SidebarMenuButton
                    isActive={activeNav === tool.key && !activeArea}
                    onClick={() => onNav(tool.key)}
                  >
                    <tool.icon />
                    <span>{tool.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3">
        <div className="flex items-center gap-2 rounded-md bg-sidebar-accent px-2 py-2 text-xs text-sidebar-accent-foreground/80">
          <WrenchIcon className="size-3.5 shrink-0" />
          <span className="text-pretty leading-snug">
            Reutiliza soluciones. Duplica y adapta.
          </span>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
