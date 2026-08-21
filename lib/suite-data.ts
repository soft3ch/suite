export type Cliente = {
  id: string
  name: string
  denominacionSocial?: string
  cuitCuil?: string
  contact?: string
  phone?: string
  email?: string
  address?: string
  localidad?: string
  saldoActual: number
}

export type ManoDeObraItem = {
  id: string
  orden: number
  descripcion: string
  unidad: string // 'ud', 'mts', 'hs', 'global'
  cantidad: number
  precioUnitario: number
  total: number
}

export type MaterialRubro = {
  id: string
  rubro: string // ej. 'MATERIALES CANALIZACION + puesta tierra', 'MATERIALES PLACA', 'MATERIALES KIT SOLAR', 'MATERIALES ESTRUCTURA BASE'
  numeroComprobante?: string // ej. '0001-00029533-x'
  proveedor?: string // ej. 'Cable a Tierra', 'Surcan', 'NEA'
  monto: number
}

export type PresupuestoEstado =
  | "borrador"
  | "enviado"
  | "aprobado"
  | "esperando_materiales"
  | "en_ejecucion"
  | "completado"
  | "pagado"
  | "rechazado"

export type Presupuesto = {
  id: string
  numeroPresupuesto: number
  clienteId?: string
  clienteNombre: string
  lugarObra?: string
  fecha: string
  descripcionServicio: string
  estado: PresupuestoEstado
  manoDeObraItems: ManoDeObraItem[]
  materialesRubros: MaterialRubro[]
  totalManoDeObra: number
  totalMateriales: number
  totalProyectoArs: number
  cotizacionUsd?: number
  totalProyectoUsd?: number
  validezDias: number
  tipoFactura: string
  notasCondiciones?: string
}

export type CategoriaEmpleado = {
  id: string
  nombreCategoria: string
  precioHora: number
  activo: boolean
}

export type Empleado = {
  id: string
  nombreCompleto: string
  categoriaId?: string
  telefono?: string
  activo: boolean
}

export type TrabajoEmpleado = {
  id: string
  trabajoId?: string
  empleadoId?: string
  categoriaId?: string
  nombreEmpleadoRol: string
  horas: number
  precioHora: number
  total: number
}

export type TrabajoMaterialExtra = {
  id: string
  trabajoId?: string
  descripcion: string
  unidad?: string // 'ud', 'mts', 'kg', 'global'
  cantidad: number
  precioUnitario: number
  total: number
}

export type TrabajoEstadoFacturacion = "pendiente" | "facturado"

export type TrabajoDiario = {
  id: string
  clienteId?: string
  clienteNombre: string
  fecha: string
  sector: string
  numeroOrden?: string
  descripcionTareas: string
  viaticosQty: number // 0, 0.5, 1, 1.5, 2, etc.
  viaticosUnitario: number
  empleados: TrabajoEmpleado[]
  materialesExtras: TrabajoMaterialExtra[]
  totalManoObra: number
  totalMaterialesExtras: number
  montoTotal: number
  estadoFacturacion: TrabajoEstadoFacturacion
  resumenId?: string
}

export type ResumenTarea = {
  id: string
  sector: string // ej. 'MOLINO', 'RINCON', 'SECADERO 3', 'CHIPERA', 'CALDERA', 'OFICINA'
  fecha: string
  numeroOrden?: string // ej. 'ORDEN 190'
  descripcion: string
  viaticosQty: number // 0, 0.5, 1, 2
  viaticosUnitario: number
  materialesExtrasTotal?: number
  materialesDescripcion?: string
  montoTotal: number
  trabajoId?: string
}

export type ResumenPago = {
  id: string
  fecha: string
  concepto: string
  monto: number
}

export type ResumenEstado =
  | "pendiente"
  | "aprobado"
  | "facturado"
  | "pagado_total"
  | "pagado_parcial"

export type Resumen = {
  id: string
  numeroResumen: number
  clienteId?: string
  clienteNombre: string
  atencionA?: string // ej. 'Hugo / Miguel Angel', 'Martín y Raúl Sessa'
  referencia: string // ej. 'trabajos preventivo/correctivos solicitados en planta'
  fecha: string
  saldoAnterior: number
  tareas: ResumenTarea[]
  pagos: ResumenPago[]
  subtotalTrabajos: number
  totalResumen: number
  totalPagos: number
  saldoFinal: number
  estado: ResumenEstado
}

export type Proveedor = {
  id: string
  name: string
  rubro: string
  contact?: string
  phone?: string
  whatsapp?: string
  email?: string
  address?: string
  condicionesPago?: string
  notes?: string
}

export type MaterialCatalogo = {
  id: string
  referencia: string
  nombre: string
  categoria: string
  unidad: string
  precioReferencia: number
  proveedorHabitual?: string
}

// ============================================================================
// DATOS SEMILLA REALES DE VIRASORO ELECTRICIDAD INDUSTRIAL (Ariel Medina)
// ============================================================================

export const DEFAULT_CLIENTES: Cliente[] = [
  {
    id: "cli-navar",
    name: "NAVAR",
    denominacionSocial: "Navar SRL",
    cuitCuil: "30-71448822-4",
    contact: "Hugo / Miguel Angel",
    phone: "3756-401122",
    email: "planta@navarsrl.com",
    address: "Ruta Nacional 14 Km 752",
    localidad: "Gobernador Virasoro, Corrientes",
    saldoActual: 293000,
  },
  {
    id: "cli-isomad",
    name: "ISOMAD",
    denominacionSocial: "Isomad Maderas SA",
    cuitCuil: "30-68994411-9",
    contact: "Martín y Raúl Sessa",
    phone: "3756-429988",
    email: "administracion@isomad.com.ar",
    address: "Parque Industrial Virasoro",
    localidad: "Virasoro, Corrientes",
    saldoActual: 0,
  },
  {
    id: "cli-iqsolar",
    name: "IQ SOLAR",
    denominacionSocial: "IQ Solar Energía SA",
    cuitCuil: "30-71882233-1",
    contact: "Ing. Roberto Paez",
    phone: "3764-889900",
    email: "obras@iqsolar.com.ar",
    address: "Lugar: MUY FRESCO",
    localidad: "Virasoro, Corrientes",
    saldoActual: 0,
  },
  {
    id: "cli-ypf",
    name: "YPF",
    denominacionSocial: "Estación de Servicio Virasoro",
    cuitCuil: "30-55441122-8",
    contact: "Administración YPF",
    phone: "3756-403344",
    email: "ypfvirasoro@gmail.com",
    address: "Av. San Martín y Circunvalación",
    localidad: "Virasoro, Corrientes",
    saldoActual: 0,
  },
  {
    id: "cli-rocasur",
    name: "ROCA SUR",
    denominacionSocial: "Roca Sur Forestal",
    contact: "Lic. Romero",
    phone: "3756-490011",
    localidad: "Santo Tomé, Corrientes",
    saldoActual: 0,
  },
]

export const DEFAULT_PROVEEDORES: Proveedor[] = [
  {
    id: "prov-cableatierra",
    name: "Cable a Tierra",
    rubro: "Cables, Puesta a Tierra y Materiales Eléctricos",
    contact: "Mariano",
    phone: "3764-112233",
    whatsapp: "+54 9 3764 11-2233",
    email: "ventas@cableatierra.com.ar",
    condicionesPago: "Transferencia 15 días",
    notes: "Buen precio en cables solares y jabalinas",
  },
  {
    id: "prov-surcan",
    name: "SURCAN",
    rubro: "Estructuras Solares y Perfiles de Aluminio",
    contact: "Ventas Surcan",
    phone: "3756-554433",
    whatsapp: "+54 9 3756 55-4433",
    condicionesPago: "Contado 5% descuento",
    notes: "Estructuras coplanares y elevadas para techo y suelo",
  },
  {
    id: "prov-nea",
    name: "NEA Eléctrica",
    rubro: "Tableros, Protecciones y Automatización",
    contact: "Carlos",
    phone: "3764-998877",
    whatsapp: "+54 9 3764 99-8877",
    condicionesPago: "Cuenta Corriente 30 días",
    notes: "Distribuidor oficial Schneider, ABB y Chint",
  },
  {
    id: "prov-solara",
    name: "Solar A Distribuidora",
    rubro: "Paneles Fotovoltaicos e Inversores",
    contact: "Alejandro",
    phone: "3764-334455",
    whatsapp: "+54 9 3764 33-4455",
    condicionesPago: "Transferencia anticipada",
    notes: "Paneles Jinko/Longi e inversores Huawei/Growatt",
  },
]

// Presupuesto Real N° 427 (IQ Solar / Proyecto Muy Fresco)
export const DEFAULT_PRESUPUESTOS: Presupuesto[] = [
  {
    id: "pres-427",
    numeroPresupuesto: 427,
    clienteId: "cli-iqsolar",
    clienteNombre: "IQ SOLAR",
    lugarObra: "MUY FRESCO",
    fecha: "17/07/2026",
    descripcionServicio: "MANO DE OBRA ARMADO DE PLACA DE SISTEMA ONGRID 10KW",
    estado: "aprobado",
    manoDeObraItems: [
      {
        id: "mo-1",
        orden: 1,
        descripcion:
          "MANO DE OBRA DISEÑO, ARMADO, CONEXION PLACA PARA SISTEMA SOLAR ONGRID 10 KW CON SUS PROTECCIONES + ARMADO Y CONEXION TABLERO METALICO P/80 BOCAS DISTRIBUCION SALIDAS DE ALTERNA DE LOS INVERSORES CON SUS RESPECTIVAS PROTECCIONES Y CABLEADO A TIERRA DEL SISTEMA + VIATICOS BUSQUEDA DE MATERIALES. CONEXION Y PROGRAMACION DE MEDIDOR DE INYECCION A LA RED. CONEXION A RED ARRIBA DEL CONMUTADOR",
        unidad: "ud",
        cantidad: 1,
        precioUnitario: 680000,
        total: 680000,
      },
      {
        id: "mo-2",
        orden: 2,
        descripcion:
          "CANALIZACION CON CAÑERIA DAISA Y CAJAS DE PASO TRAMO ANCHO DE LOS PANELES + CANALIZACION CON BANDEJA DE 50 PARTE DEL TECHO Y EL PRIMER PISO + CANALIZACION CON DATACANAL EN PLANTA BAJA SECTOR TABLERO HASTA EL INVERSOR",
        unidad: "mts",
        cantidad: 74,
        precioUnitario: 397000 / 74,
        total: 397000,
      },
      {
        id: "mo-3",
        orden: 3,
        descripcion:
          "68 MTS DE CABLEADO DE DOS STRING CON CABLE SOLAR 4MM + CABLEADO Y CONEXION DE 68 MTS CABLE PUESTA TIERRA 10 MM + ARMADO DE FICHAS MC4 Y CONEXION A TIERRA",
        unidad: "mts",
        cantidad: 68,
        precioUnitario: 188000 / 68,
        total: 188000,
      },
      {
        id: "mo-4",
        orden: 4,
        descripcion: "SECRETARIO / AYUDANTE",
        unidad: "hs",
        cantidad: 14,
        precioUnitario: 5000,
        total: 70000,
      },
    ],
    materialesRubros: [
      {
        id: "mat-1",
        rubro: "MATERIALES CANALIZACION + puesta tierra",
        numeroComprobante: "0001-00029533-x",
        proveedor: "Cable a Tierra",
        monto: 932068,
      },
      {
        id: "mat-2",
        rubro: "MATERIALES PLACA",
        numeroComprobante: "0001-00029529-x",
        proveedor: "NEA Eléctrica",
        monto: 1089233,
      },
      {
        id: "mat-3",
        rubro: "MATERIALES KIT SOLAR",
        numeroComprobante: "0001-00029527-x",
        proveedor: "Solar A Distribuidora",
        monto: 8559309,
      },
      {
        id: "mat-4",
        rubro: "MATERIALES ESTRUCTURA BASE para elevar y fijar",
        numeroComprobante: "SURCAN 0009-00090617-x",
        proveedor: "SURCAN",
        monto: 2060000,
      },
    ],
    totalManoDeObra: 1335000,
    totalMateriales: 12640610,
    totalProyectoArs: 15475610,
    cotizacionUsd: 1500,
    totalProyectoUsd: 10317,
    validezDias: 15,
    tipoFactura: "Factura C",
    notasCondiciones:
      "La forma de pago se acuerda con el cliente al momento de la aprobación. Válido por 15 días hábiles.",
  },
]

// Resúmenes Reales N° 11 (NAVAR) y N° 119 (ISOMAD)
export const DEFAULT_RESUMENES: Resumen[] = [
  {
    id: "res-11-navar",
    numeroResumen: 11,
    clienteId: "cli-navar",
    clienteNombre: "NAVAR",
    atencionA: "HUGO / MIGUEL ANGEL",
    referencia: "trabajos preventivo/correctivos solicitados en planta",
    fecha: "05/08/2026",
    saldoAnterior: 0,
    tareas: [
      {
        id: "tar-1",
        sector: "MOLINO",
        fecha: "04/08/2026",
        descripcion:
          "SE TRABAJÓ EN BÚSQUEDA DE FUGA ILUMINACIÓN PERIMETRAL ESTABAN BAJAS LOS TRES CIRCUITOS SE PROBÓ Y EL CIRCUITO 3 HACE SALTAR LA PPAL.\nNOTA: EN EL INTERRUPTOR PPAL SE LEVANTÓ A 40 mA EL MÓDULO DIFERENCIAL PARA QUE SALTE EL DISYUNTOR LOCAL NO EL INTERRUPTOR PPAL.",
        viaticosQty: 1,
        viaticosUnitario: 35000,
        montoTotal: 35000,
      },
      {
        id: "tar-2",
        sector: "RINCON",
        fecha: "05/08/2026",
        descripcion:
          "TAB.CORRECTOR SECADERO: SE REALIZÓ MANTENIMIENTO CORRECTIVO, SE CAMBIÓ 3 CONTACTORES, UN CAPACITOR, RECONFIGURACIÓN DEL CONTROLADOR, CAMBIO DE CABLE RESISTENCIA DE PREINSERCIÓN DE UN CONTACTOR, LIMPIEZA DEL GABINETE. SE REEMPLAZÓ UNA TÉRMICA UNIPOLAR DE COMANDO ROTA.\n\nTAB.CORRECTOR CHIPERA: SE REALIZÓ MANTENIMIENTO CORRECTIVO, SE CONFIGURÓ CONTROLADOR Y NO CORREGÍA SE BUSCÓ PORQUE Y ERA EL CONTROLADOR LA ENTRADA DEL TI NO FUNCIONA DA CUALQUIER VALOR, SE CAMBIÓ POR UNO USADO QUE YA FUE REPARADO DEL EX TABLERO CORRECTOR MOLINO ESTE FUNCIONA PERO LOS PASOS 1 Y 2 NO FUNCIONAN SE LOS PASÓ A LA SALIDA 10 Y 11, TAMBIÉN LA FUNCIÓN DE SENTIDO DEL TI NO FUNCIONAN SE LOS DEJÓ EN MANUAL, LUEGO SE CONFIGURÓ Y RELEVÓ LOS CAPACITORES PARA CONFIGURAR LOS VALORES DE CAPACITORES DE CADA PASO. EN DOS PASOS QUE TENÍAN DOS CAPACITORES EN PARALELOS DE 25+10 SE LOS DEJÓ EN 10 PARA OBTENER PASOS MÁS CHICOS Y PUEDA CORREGIR MEJOR ERAN TODOS MUY GRANDES. QUEDÓ FUNCIONANDO.\n\n(1 VIAJE + 5 HS + 1 HS RECUPERO DE MATERIALES EN EL MOLINO)",
        viaticosQty: 1,
        viaticosUnitario: 35000,
        montoTotal: 258000,
      },
    ],
    pagos: [],
    subtotalTrabajos: 293000,
    totalResumen: 293000,
    totalPagos: 0,
    saldoFinal: 293000,
    estado: "pendiente",
  },
  {
    id: "res-119-isomad",
    numeroResumen: 119,
    clienteId: "cli-isomad",
    clienteNombre: "ISOMAD",
    atencionA: "Martín y Raúl Sessa",
    referencia: "Trabajos correctivos varios solicitados en planta",
    fecha: "02/05/2026",
    saldoAnterior: 15000, // Arrastre saldo resumen 118
    tareas: [
      {
        id: "tar-isomad-1",
        sector: "CHIPERA / DESEMBARILLADORA / CALDERA / SECADERO 3 / OFICINA",
        fecha: "12/05/2026",
        numeroOrden: "ORDEN 190 / CS 197 / CS 194",
        descripcion:
          "CHIPERA: CAMBIO DETECTOR DE METALES LÍNEA 1, EL ACTUAL FALLA SE COLOCÓ UNO NUEVO COMPLETO, TAMBIÉN SE CAMBIÓ EL CABLE DE ALIMENTACIÓN DEL SENSOR Y COLOCÓ CON CAÑERÍA PVC QUEDA PARA AMURAR.\n\nDESEMBARILLADORA: EL ASCENSOR DE APILADO DE TABLAS NO QUEDABA EN EL LUGAR BAJABA, ERA EL MICRO FIN DE CARRERA DE RETENCIÓN. SE CAMBIÓ MICRO 1 FIN DE CARRERA.\n\nCALDERA: EMPROLIJAR Y REPARAR CABLE DE PUESTA A TIERRA, SE MIDIÓ CON TELURÍMETRO EL VALOR Y DA 0,23 OHM PERFECTO.\n\nSECADERO 3: REVISIÓN DEL MOTOR N°5 DE CÁMARA 3 QUE SALTABA GUARDAMOTOR, SE MEGO MOTOR Y REVISÓ CONEXIONES. SE PROBÓ Y QUEDA FUNCIONANDO.\n\nOFICINA: SE CAMBIARON DOS ARTEFACTOS LED 220V 60X60 DE ILUMINACIÓN INTERNA OFICINA DUEÑOS.\n\n(1 VIÁTICO + AYUDANTE)",
        viaticosQty: 1,
        viaticosUnitario: 85000,
        montoTotal: 392000,
      },
    ],
    pagos: [
      {
        id: "pago-iso-1",
        fecha: "23/05/2026",
        concepto: "Pago transferencia bancaria",
        monto: 407000,
      },
    ],
    subtotalTrabajos: 392000,
    totalResumen: 407000, // 15.000 anterior + 392.000
    totalPagos: 407000,
    saldoFinal: 0,
    estado: "pagado_total",
  },
]

export const DEFAULT_PACKS_MATERIALES = [
  {
    nombre: "Kit Solar On-Grid 10 kW Típico",
    categoria: "Solar",
    items: [
      { rubro: "MATERIALES KIT SOLAR (Inversor 10kW + 20 Paneles 615W)", monto: 8500000 },
      { rubro: "MATERIALES ESTRUCTURA BASE (Aluminio Coplanar/Elevado)", monto: 2000000 },
      { rubro: "MATERIALES PLACA (Tablero DC/AC, Térmicas, Descargadores)", monto: 1100000 },
      { rubro: "MATERIALES CANALIZACION (Cañería Daisa, Cajas, Cable Solar 6mm)", monto: 950000 },
    ],
  },
  {
    nombre: "Mantenimiento Tablero / Compensador Típico",
    categoria: "Automatismo",
    items: [
      { rubro: "MATERIALES CONTACTORES Y CAPACITORES (3 Contactores + 1 Capacitor 25kVAr)", monto: 380000 },
      { rubro: "MATERIALES TÉRMICAS Y COMANDO (Térmicas unipolares, borneras)", monto: 120000 },
    ],
  },
]

// ── Storage Keys & Helpers ──────────────────────────────────────────────────

const STORAGE_KEY_CLIENTES = "ei_suite_clientes_data_v3"
const STORAGE_KEY_PRESUPUESTOS = "ei_suite_presupuestos_data_v3"
const STORAGE_KEY_RESUMENES = "ei_suite_resumenes_data_v3"
const STORAGE_KEY_PROVEEDORES = "ei_suite_proveedores_data_v3"

export function getStoredClientes(): Cliente[] {
  if (typeof window === "undefined") return DEFAULT_CLIENTES
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CLIENTES)
    if (!raw) return DEFAULT_CLIENTES
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_CLIENTES
  } catch (e) {
    return DEFAULT_CLIENTES
  }
}

export function saveStoredClientes(clientes: Cliente[]): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY_CLIENTES, JSON.stringify(clientes))
  } catch (e) {}
}

export function getStoredPresupuestos(): Presupuesto[] {
  if (typeof window === "undefined") return DEFAULT_PRESUPUESTOS
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PRESUPUESTOS)
    if (!raw) return DEFAULT_PRESUPUESTOS
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_PRESUPUESTOS
  } catch (e) {
    return DEFAULT_PRESUPUESTOS
  }
}

export function saveStoredPresupuestos(presupuestos: Presupuesto[]): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY_PRESUPUESTOS, JSON.stringify(presupuestos))
  } catch (e) {}
}

export function getStoredResumenes(): Resumen[] {
  if (typeof window === "undefined") return DEFAULT_RESUMENES
  try {
    const raw = localStorage.getItem(STORAGE_KEY_RESUMENES)
    if (!raw) return DEFAULT_RESUMENES
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_RESUMENES
  } catch (e) {
    return DEFAULT_RESUMENES
  }
}

export function saveStoredResumenes(resumenes: Resumen[]): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY_RESUMENES, JSON.stringify(resumenes))
  } catch (e) {}
}

export function getStoredProveedores(): Proveedor[] {
  if (typeof window === "undefined") return DEFAULT_PROVEEDORES
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROVEEDORES)
    if (!raw) return DEFAULT_PROVEEDORES
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_PROVEEDORES
  } catch (e) {
    return DEFAULT_PROVEEDORES
  }
}

export function saveStoredProveedores(proveedores: Proveedor[]): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY_PROVEEDORES, JSON.stringify(proveedores))
  } catch (e) {}
}
