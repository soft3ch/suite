import { SunMediumIcon, WrenchIcon, ZapIcon } from "lucide-react"

import { AREAS, type AreaKey } from "@/lib/suite-data"
import { cn } from "@/lib/utils"

const AREA_STYLES: Record<AreaKey, string> = {
  automatismo: "border-primary/20 bg-primary/10 text-primary",
  electricidad:
    "border-[oklch(0.65_0.18_45_/_0.3)] bg-[oklch(0.65_0.18_45_/_0.12)] text-[oklch(0.5_0.16_45)]",
  solar:
    "border-[oklch(0.7_0.15_145_/_0.3)] bg-[oklch(0.7_0.15_145_/_0.12)] text-[oklch(0.45_0.13_145)]",
}

const AREA_ICONS = {
  automatismo: WrenchIcon,
  electricidad: ZapIcon,
  solar: SunMediumIcon,
}

export function AreaBadge({
  area,
  className,
}: {
  area: AreaKey
  className?: string
}) {
  const Icon = AREA_ICONS[area]
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium",
        AREA_STYLES[area],
        className,
      )}
    >
      <Icon className="size-3" />
      {AREAS[area].short}
    </span>
  )
}
