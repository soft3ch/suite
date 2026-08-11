export type AreaKey = "automatismo" | "electricidad" | "solar"

export type Area = {
  key: AreaKey
  label: string
  short: string
}

export const AREAS: Record<AreaKey, Area> = {
  automatismo: {
    key: "automatismo",
    label: "Soluciones de Automatismo",
    short: "Automatismo",
  },
  electricidad: {
    key: "electricidad",
    label: "Electricidad Industrial",
    short: "Electricidad Ind.",
  },
  solar: {
    key: "solar",
    label: "Sistema Solar",
    short: "Solar",
  },
}

export type Material = {
  id: string
  ref: string
  name: string
  qty: number
  unit: string
  unitPrice?: number
}

export type ProjectFile = {
  id: string
  name: string
  kind: "foto" | "esquema" | "pdf"
}

export type ProjectStatus = "borrador" | "presupuestado" | "en_ejecucion" | "finalizado"

export type Project = {
  id: string
  title: string
  client: string
  location: string
  area: AreaKey
  updatedAt: string
  need: string
  notes: string[]
  materials: Material[]
  files: ProjectFile[]
  laborHours?: number
  laborRatePerHour?: number
  marginPercent?: number
  taxRate?: number
  status?: ProjectStatus
  isTemplate?: boolean
}

export type LibrarySolution = {
  id: string
  title: string
  description: string
  area: AreaKey
  tags: string[]
  notes: string[]
  materials: Material[]
  recommendedHours: number
}

export const DEFAULT_LIBRARY_SOLUTIONS: LibrarySolution[] = [
  {
    id: "LIB-AUT-01",
    title: "Módulo de Control y Bombeo con Paro Seco",
    description: "Solución estándar para automatización de llenado de depósitos mediante relé de nivel y 3 electrodos.",
    area: "automatismo",
    tags: ["PLC/Relé", "Bombeo", "Sensores"],
    recommendedHours: 8,
    notes: [
      "Incluye protección por marcha en seco.",
      "Conectar electrodo común a chasis si el depósito es metálico.",
    ],
    materials: [
      { id: "lm1", ref: "RM35LM", name: "Relé de control de nivel Schneider", qty: 1, unit: "ud", unitPrice: 85.50 },
      { id: "lm2", ref: "ELEC-INOX", name: "Juego 3 electrodos inox + soporte", qty: 1, unit: "kit", unitPrice: 32.00 },
      { id: "lm3", ref: "LC1D12", name: "Contactor 12A 230V AC", qty: 1, unit: "ud", unitPrice: 28.00 },
      { id: "lm4", ref: "GV2ME08", name: "Guardamotor 2.5 - 4A", qty: 1, unit: "ud", unitPrice: 42.10 },
    ]
  },
  {
    id: "LIB-ELE-01",
    title: "Tablero de Distribución Secundario para Motores",
    description: "Configuración estándar de armario metálico con protecciones superinmunizadas para 4 arrancadores directos.",
    area: "electricidad",
    tags: ["Tableros", "Protecciones", "Motores"],
    recommendedHours: 16,
    notes: [
      "Diferenciales superinmunizados SI para evitar disparos por armónicos.",
      "Reservar 20% de espacio libre en carril DIN.",
    ],
    materials: [
      { id: "lm5", ref: "A9F79425", name: "Magnetotérmico 4P 25A curva C", qty: 4, unit: "ud", unitPrice: 34.20 },
      { id: "lm6", ref: "A9Z41440", name: "Diferencial 4P 40A 300mA SI", qty: 2, unit: "ud", unitPrice: 110.00 },
      { id: "lm7", ref: "LC1D18", name: "Contactor 18A 3P", qty: 4, unit: "ud", unitPrice: 35.00 },
      { id: "lm8", ref: "NSYS3D", name: "Armario metálico 800x600x250 Schneider", qty: 1, unit: "ud", unitPrice: 195.00 },
    ]
  },
  {
    id: "LIB-SOL-01",
    title: "Sistema Solar Autoconsumo Híbrido 6 kWp",
    description: "Kit completo de autoconsumo fotovoltaico con inversor preparado para baterías de litio.",
    area: "solar",
    tags: ["On-Grid", "Híbrido", "Inversor"],
    recommendedHours: 24,
    notes: [
      "Orientación recomendada: Sur 30º.",
      "Comprobar tirada de cable DC < 25m para no superar 1% de caída de tensión.",
    ],
    materials: [
      { id: "lm9", ref: "JKM440N", name: "Panel monocristalino Jinko 440W", qty: 14, unit: "ud", unitPrice: 105.00 },
      { id: "lm10", ref: "SUN2000-6KTL", name: "Inversor híbrido Huawei 6kW", qty: 1, unit: "ud", unitPrice: 1250.00 },
      { id: "lm11", ref: "EST-COPLA", name: "Estructura coplanar sobre teja", qty: 14, unit: "ud", unitPrice: 22.00 },
      { id: "lm12", ref: "DC-6mm", name: "Cable solar 6 mm² (bobina)", qty: 1, unit: "ud", unitPrice: 78.00 },
    ]
  }
]

export const PROJECTS: Project[] = [
  {
    id: "AUT-2041",
    title: "Automatización portón corredero de nave",
    client: "Talleres Marín S.L.",
    location: "Polígono Los Olivos, Getafe",
    area: "automatismo",
    updatedAt: "hace 2 días",
    status: "finalizado",
    laborHours: 12,
    laborRatePerHour: 45,
    marginPercent: 20,
    taxRate: 21,
    need: "Motorizar un portón corredero de 6 m con control por mando a distancia y fotocélulas de seguridad. El cliente necesita apertura peatonal parcial y maniobra de emergencia por corte de red.",
    notes: [
      "Motor 24V para uso intensivo — el portón abre >40 ciclos/día.",
      "Fotocélulas en ambos sentidos, altura 50 cm.",
      "Batería de respaldo obligatoria por corte frecuente en el polígono.",
    ],
    materials: [
      { id: "m1", ref: "CAME BX-704AGS", name: "Motor corredero 24V 800 kg", qty: 1, unit: "ud", unitPrice: 380.00 },
      { id: "m2", ref: "DIR10", name: "Par fotocélulas orientables", qty: 2, unit: "par", unitPrice: 42.00 },
      { id: "m3", ref: "TOP-432EE", name: "Mando a distancia 2 canales", qty: 4, unit: "ud", unitPrice: 18.50 },
      { id: "m4", ref: "LB18", name: "Kit baterías respaldo 24V", qty: 1, unit: "kit", unitPrice: 85.00 },
      { id: "m5", ref: "CAB-2x1.5", name: "Cable manguera 2x1.5 mm²", qty: 25, unit: "m", unitPrice: 1.20 },
    ],
    files: [
      { id: "f1", name: "resultado-final.jpg", kind: "foto" },
      { id: "f2", name: "esquema-conexionado.pdf", kind: "esquema" },
      { id: "f3", name: "manual-cuadro.pdf", kind: "pdf" },
    ],
  },
  {
    id: "ELE-1180",
    title: "Cuadro de distribución secundario — línea de embotellado",
    client: "Aguas del Valle",
    location: "Nave 3, Aranjuez",
    area: "electricidad",
    updatedAt: "hace 5 días",
    status: "en_ejecucion",
    laborHours: 20,
    laborRatePerHour: 50,
    marginPercent: 25,
    taxRate: 21,
    need: "Montaje de cuadro secundario para alimentar 4 motores trifásicos de la línea de embotellado, con protección diferencial superinmunizada y arrancadores.",
    notes: [
      "Diferenciales superinmunizados SI por armónicos de variadores.",
      "Reservar 20% de espacio libre en el cuadro para ampliaciones.",
      "Etiquetado según norma interna del cliente.",
    ],
    materials: [
      { id: "m1", ref: "A9F79425", name: "Magnetotérmico 4P 25A curva C", qty: 4, unit: "ud", unitPrice: 34.20 },
      { id: "m2", ref: "A9Z41440", name: "Diferencial 4P 40A 300mA SI", qty: 2, unit: "ud", unitPrice: 110.00 },
      { id: "m3", ref: "LC1D18", name: "Contactor 18A 3P", qty: 4, unit: "ud", unitPrice: 35.00 },
      { id: "m4", ref: "GV2ME", name: "Guardamotor regulable 9-14A", qty: 4, unit: "ud", unitPrice: 42.50 },
      { id: "m5", ref: "NSYS3", name: "Armario metálico 800x600x250", qty: 1, unit: "ud", unitPrice: 195.00 },
    ],
    files: [
      { id: "f1", name: "cuadro-montado.jpg", kind: "foto" },
      { id: "f2", name: "unifilar.pdf", kind: "esquema" },
    ],
  },
  {
    id: "SOL-0925",
    title: "Autoconsumo solar 6 kWp con excedentes",
    client: "Familia Ortega",
    location: "Villaviciosa de Odón",
    area: "solar",
    updatedAt: "hace 1 semana",
    status: "presupuestado",
    laborHours: 24,
    laborRatePerHour: 45,
    marginPercent: 20,
    taxRate: 21,
    need: "Instalación de autoconsumo fotovoltaico de 6 kWp en cubierta inclinada, con compensación de excedentes y monitorización por app.",
    notes: [
      "Orientación sur, 30° — sin sombras relevantes.",
      "Inversor con salida para futura batería (hybrid ready).",
      "Tramitar legalización y acuerdo de compensación con la comercializadora.",
    ],
    materials: [
      { id: "m1", ref: "JKM440N", name: "Panel monocristalino 440W", qty: 14, unit: "ud", unitPrice: 105.00 },
      { id: "m2", ref: "SUN2000-6KTL", name: "Inversor híbrido 6kW", qty: 1, unit: "ud", unitPrice: 1250.00 },
      { id: "m3", ref: "EST-COPLA", name: "Estructura coplanar teja", qty: 14, unit: "ud", unitPrice: 22.00 },
      { id: "m4", ref: "DC-6mm", name: "Cable solar 6 mm²", qty: 60, unit: "m", unitPrice: 1.30 },
      { id: "m5", ref: "SPD-T2", name: "Protección sobretensiones DC T2", qty: 1, unit: "ud", unitPrice: 65.00 },
    ],
    files: [
      { id: "f1", name: "cubierta-terminada.jpg", kind: "foto" },
      { id: "f2", name: "layout-paneles.pdf", kind: "esquema" },
      { id: "f3", name: "memoria-tecnica.pdf", kind: "pdf" },
    ],
  },
  {
    id: "AUT-1993",
    title: "Control de nivel y bombeo en depósito",
    client: "Riegos del Sur",
    location: "Ciempozuelos",
    area: "automatismo",
    updatedAt: "hace 2 semanas",
    status: "finalizado",
    laborHours: 8,
    laborRatePerHour: 45,
    marginPercent: 20,
    taxRate: 21,
    need: "Automatizar el llenado de un depósito de 20.000 L con sondas de nivel y arranque/paro automático de bomba, más alarma por marcha en seco.",
    notes: [
      "Relé de nivel con 3 electrodos (mín, máx, común).",
      "Protección de bomba contra marcha en seco.",
    ],
    materials: [
      { id: "m1", ref: "RM35LM", name: "Relé de control de nivel", qty: 1, unit: "ud", unitPrice: 85.50 },
      { id: "m2", ref: "ELEC-INOX", name: "Juego electrodos inox + soporte", qty: 1, unit: "kit", unitPrice: 32.00 },
      { id: "m3", ref: "LC1D12", name: "Contactor 12A", qty: 1, unit: "ud", unitPrice: 28.00 },
    ],
    files: [{ id: "f1", name: "deposito.jpg", kind: "foto" }],
  },
  {
    id: "ELE-1042",
    title: "Reforma de iluminación LED en taller",
    client: "Mecánica Delgado",
    location: "Fuenlabrada",
    area: "electricidad",
    updatedAt: "hace 3 semanas",
    status: "finalizado",
    laborHours: 10,
    laborRatePerHour: 40,
    marginPercent: 15,
    taxRate: 21,
    need: "Sustitución de campanas industriales por luminarias LED de alta bahía, con nuevo circuito y detección de presencia en zona de almacén.",
    notes: [
      "Nivel de iluminación objetivo: 500 lux en zona de trabajo.",
      "Detección de presencia solo en almacén.",
    ],
    materials: [
      { id: "m1", ref: "HB-150W", name: "Campana LED alta bahía 150W", qty: 8, unit: "ud", unitPrice: 75.00 },
      { id: "m2", ref: "PIR-360", name: "Detector presencia 360º", qty: 2, unit: "ud", unitPrice: 32.00 },
      { id: "m3", ref: "CAB-3x2.5", name: "Cable 3x2.5 mm² libre halógenos", qty: 40, unit: "m", unitPrice: 1.40 },
    ],
    files: [
      { id: "f1", name: "taller-antes.jpg", kind: "foto" },
      { id: "f2", name: "taller-despues.jpg", kind: "foto" },
    ],
  },
  {
    id: "SOL-0710",
    title: "Bombeo solar directo para pozo agrícola",
    client: "Finca La Encina",
    location: "Colmenar de Oreja",
    area: "solar",
    updatedAt: "hace 1 mes",
    status: "finalizado",
    laborHours: 18,
    laborRatePerHour: 45,
    marginPercent: 20,
    taxRate: 21,
    need: "Sistema de bombeo solar directo sin baterías para pozo de 45 m, con variador solar y protección de la bomba sumergible.",
    notes: [
      "Variador solar con seguimiento del punto de máxima potencia.",
      "Sonda de nivel de pozo para paro por bajo nivel.",
    ],
    materials: [
      { id: "m1", ref: "JKM440N", name: "Panel monocristalino 440W", qty: 8, unit: "ud", unitPrice: 105.00 },
      { id: "m2", ref: "PS2-1800", name: "Variador solar de bombeo", qty: 1, unit: "ud", unitPrice: 650.00 },
      { id: "m3", ref: "SUB-2.2KW", name: "Bomba sumergible 2.2 kW", qty: 1, unit: "ud", unitPrice: 420.00 },
    ],
    files: [{ id: "f1", name: "instalacion-pozo.jpg", kind: "foto" }],
  },
]

const STORAGE_KEY = "el_suite_projects_data_v1"
const LIBRARY_STORAGE_KEY = "el_suite_library_data_v1"

export function getStoredProjects(): Project[] {
  if (typeof window === "undefined") return PROJECTS
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return PROJECTS
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : PROJECTS
  } catch (e) {
    console.error("Error reading projects from localStorage:", e)
    return PROJECTS
  }
}

export function saveStoredProjects(projects: Project[]): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
  } catch (e) {
    console.error("Error saving projects to localStorage:", e)
  }
}

export function getStoredLibrarySolutions(): LibrarySolution[] {
  if (typeof window === "undefined") return DEFAULT_LIBRARY_SOLUTIONS
  try {
    const raw = localStorage.getItem(LIBRARY_STORAGE_KEY)
    if (!raw) return DEFAULT_LIBRARY_SOLUTIONS
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_LIBRARY_SOLUTIONS
  } catch (e) {
    console.error("Error reading library solutions from localStorage:", e)
    return DEFAULT_LIBRARY_SOLUTIONS
  }
}

export function saveStoredLibrarySolutions(solutions: LibrarySolution[]): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(LIBRARY_STORAGE_KEY, JSON.stringify(solutions))
  } catch (e) {
    console.error("Error saving library solutions to localStorage:", e)
  }
}

export function calculateProjectBudget(project: Project) {
  const materialsSubtotal = project.materials.reduce(
    (acc, m) => acc + (m.qty || 0) * (m.unitPrice || 0),
    0
  )
  const laborHours = project.laborHours ?? 8
  const laborRate = project.laborRatePerHour ?? 45
  const laborSubtotal = laborHours * laborRate
  const baseCost = materialsSubtotal + laborSubtotal
  const marginPercent = project.marginPercent ?? 20
  const marginAmount = (baseCost * marginPercent) / 100
  const netTotal = baseCost + marginAmount
  const taxRate = project.taxRate ?? 21
  const taxAmount = (netTotal * taxRate) / 100
  const grandTotal = netTotal + taxAmount

  return {
    materialsSubtotal,
    laborHours,
    laborRate,
    laborSubtotal,
    baseCost,
    marginPercent,
    marginAmount,
    netTotal,
    taxRate,
    taxAmount,
    grandTotal,
  }
}
