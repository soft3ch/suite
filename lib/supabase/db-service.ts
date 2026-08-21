import { createClient } from "@/lib/supabase/client"
import type {
  CategoriaEmpleado,
  Cliente,
  Empleado,
  ManoDeObraItem,
  MaterialRubro,
  Presupuesto,
  Proveedor,
  Resumen,
  ResumenPago,
  ResumenTarea,
  TrabajoDiario,
  TrabajoEmpleado,
  TrabajoMaterialExtra,
} from "@/lib/suite-data"

const supabase = createClient()

// ============================================================================
// 1. CLIENTES CRUD
// ============================================================================

export async function fetchClientesDb(): Promise<Cliente[]> {
  const { data, error } = await supabase
    .from("clientes")
    .select("*")
    .order("nombre", { ascending: true })

  if (error) {
    console.error("Error fetching clientes from Supabase:", error)
    throw error
  }

  return (data || []).map((row: any) => ({
    id: row.id,
    name: row.nombre,
    denominacionSocial: row.denominacion_social || undefined,
    cuitCuil: row.cuit_cuil || undefined,
    contact: row.contacto_principal || undefined,
    phone: row.telefono || undefined,
    email: row.email || undefined,
    address: row.direccion || undefined,
    localidad: row.localidad || "Virasoro, Corrientes",
    saldoActual: Number(row.saldo_actual) || 0,
  }))
}

export async function saveClienteDb(cliente: Partial<Cliente> & { name: string }): Promise<Cliente> {
  const payload: any = {
    nombre: cliente.name,
    denominacion_social: cliente.denominacionSocial || null,
    cuit_cuil: cliente.cuitCuil || null,
    contacto_principal: cliente.contact || null,
    telefono: cliente.phone || null,
    email: cliente.email || null,
    direccion: cliente.address || null,
    localidad: cliente.localidad || "Virasoro, Corrientes",
    saldo_actual: cliente.saldoActual || 0,
    updated_at: new Date().toISOString(),
  }

  let res: any

  // Check if it's an existing UUID
  const isUuid = cliente.id && cliente.id.includes("-") && cliente.id.length >= 30

  if (isUuid) {
    const { data, error } = await supabase
      .from("clientes")
      .update(payload)
      .eq("id", cliente.id)
      .select()
      .single()

    if (error) throw error
    res = data
  } else {
    const { data, error } = await supabase
      .from("clientes")
      .insert(payload)
      .select()
      .single()

    if (error) throw error
    res = data
  }

  return {
    id: res.id,
    name: res.nombre,
    denominacionSocial: res.denominacion_social || undefined,
    cuitCuil: res.cuit_cuil || undefined,
    contact: res.contacto_principal || undefined,
    phone: res.telefono || undefined,
    email: res.email || undefined,
    address: res.direccion || undefined,
    localidad: res.localidad || "Virasoro, Corrientes",
    saldoActual: Number(res.saldo_actual) || 0,
  }
}

export async function deleteClienteDb(id: string): Promise<void> {
  const { error } = await supabase.from("clientes").delete().eq("id", id)
  if (error) throw error
}

// ============================================================================
// 2. PROVEEDORES CRUD
// ============================================================================

export async function fetchProveedoresDb(): Promise<Proveedor[]> {
  const { data, error } = await supabase
    .from("proveedores")
    .select("*")
    .order("nombre", { ascending: true })

  if (error) {
    console.error("Error fetching proveedores from Supabase:", error)
    throw error
  }

  return (data || []).map((row: any) => ({
    id: row.id,
    name: row.nombre,
    rubro: row.rubro || "Materiales Eléctricos",
    contact: row.contacto || undefined,
    phone: row.telefono || undefined,
    whatsapp: row.whatsapp || row.telefono || undefined,
    email: row.email || undefined,
    address: row.direccion || undefined,
    condicionesPago: row.condiciones_pago || undefined,
    notes: row.notas || undefined,
  }))
}

export async function saveProveedorDb(prov: Partial<Proveedor> & { name: string; rubro: string }): Promise<Proveedor> {
  const payload: any = {
    nombre: prov.name,
    rubro: prov.rubro,
    contacto: prov.contact || null,
    telefono: prov.phone || null,
    whatsapp: prov.whatsapp || null,
    email: prov.email || null,
    direccion: prov.address || null,
    condiciones_pago: prov.condicionesPago || null,
    notas: prov.notes || null,
  }

  let res: any
  const isUuid = prov.id && prov.id.includes("-") && prov.id.length >= 30

  if (isUuid) {
    const { data, error } = await supabase
      .from("proveedores")
      .update(payload)
      .eq("id", prov.id)
      .select()
      .single()

    if (error) throw error
    res = data
  } else {
    const { data, error } = await supabase
      .from("proveedores")
      .insert(payload)
      .select()
      .single()

    if (error) throw error
    res = data
  }

  return {
    id: res.id,
    name: res.nombre,
    rubro: res.rubro,
    contact: res.contacto || undefined,
    phone: res.telefono || undefined,
    whatsapp: res.whatsapp || undefined,
    email: res.email || undefined,
    address: res.direccion || undefined,
    condicionesPago: res.condiciones_pago || undefined,
    notes: res.notas || undefined,
  }
}

export async function deleteProveedorDb(id: string): Promise<void> {
  const { error } = await supabase.from("proveedores").delete().eq("id", id)
  if (error) throw error
}

// ============================================================================
// 3. PRESUPUESTOS CRUD (Con Mano de Obra y Rubros de Materiales)
// ============================================================================

export async function fetchPresupuestosDb(): Promise<Presupuesto[]> {
  const { data, error } = await supabase
    .from("presupuestos")
    .select(`
      *,
      presupuesto_mano_obra (*),
      presupuesto_materiales_rubro (*)
    `)
    .order("numero_presupuesto", { ascending: false })

  if (error) {
    console.error("Error fetching presupuestos from Supabase:", error)
    throw error
  }

  return (data || []).map((row: any) => {
    const moItems: ManoDeObraItem[] = (row.presupuesto_mano_obra || [])
      .sort((a: any, b: any) => a.orden - b.orden)
      .map((mo: any) => ({
        id: mo.id,
        orden: mo.orden,
        descripcion: mo.descripcion,
        unidad: mo.unidad || "ud",
        cantidad: Number(mo.cantidad) || 1,
        precioUnitario: Number(mo.precio_unitario) || 0,
        total: Number(mo.total) || 0,
      }))

    const matItems: MaterialRubro[] = (row.presupuesto_materiales_rubro || []).map((mat: any) => ({
      id: mat.id,
      rubro: mat.rubro,
      numeroComprobante: mat.numero_comprobante || undefined,
      monto: Number(mat.monto) || 0,
    }))

    return {
      id: row.id,
      numeroPresupuesto: row.numero_presupuesto,
      clienteId: row.cliente_id || undefined,
      clienteNombre: row.cliente_nombre,
      lugarObra: row.lugar_obra || undefined,
      fecha: row.fecha,
      descripcionServicio: row.descripcion_servicio,
      estado: row.estado,
      manoDeObraItems: moItems,
      materialesRubros: matItems,
      totalManoDeObra: Number(row.total_mano_obra) || 0,
      totalMateriales: Number(row.total_materiales) || 0,
      totalProyectoArs: Number(row.total_proyecto_ars) || 0,
      cotizacionUsd: Number(row.cotizacion_usd) || undefined,
      totalProyectoUsd: Number(row.total_proyecto_usd) || undefined,
      validezDias: Number(row.validez_dias) || 15,
      tipoFactura: row.tipo_factura || "Factura C",
      notasCondiciones: row.notas_condiciones || undefined,
    }
  })
}

export async function savePresupuestoDb(pres: Presupuesto): Promise<Presupuesto> {
  const isUuid = pres.id && pres.id.includes("-") && pres.id.length >= 30

  // Format date to ISO/YYYY-MM-DD
  let dateFormatted = new Date().toISOString().slice(0, 10)
  if (pres.fecha && pres.fecha.includes("/")) {
    const parts = pres.fecha.split("/")
    if (parts.length === 3) {
      dateFormatted = `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`
    }
  } else if (pres.fecha && pres.fecha.includes("-")) {
    dateFormatted = pres.fecha
  }

  const payload: any = {
    numero_presupuesto: pres.numeroPresupuesto,
    cliente_id: pres.clienteId && pres.clienteId.length >= 30 ? pres.clienteId : null,
    cliente_nombre: pres.clienteNombre,
    lugar_obra: pres.lugarObra || null,
    fecha: dateFormatted,
    descripcion_servicio: pres.descripcionServicio,
    estado: pres.estado,
    total_mano_obra: pres.totalManoDeObra,
    total_materiales: pres.totalMateriales,
    total_proyecto_ars: pres.totalProyectoArs,
    cotizacion_usd: pres.cotizacionUsd || null,
    total_proyecto_usd: pres.totalProyectoUsd || null,
    validez_dias: pres.validezDias || 15,
    tipo_factura: pres.tipoFactura || "Factura C",
    notas_condiciones: pres.notasCondiciones || null,
    updated_at: new Date().toISOString(),
  }

  let savedPres: any

  if (isUuid) {
    const { data, error } = await supabase
      .from("presupuestos")
      .update(payload)
      .eq("id", pres.id)
      .select()
      .single()

    if (error) throw error
    savedPres = data

    // Delete existing relation rows to cleanly reinsert
    await supabase.from("presupuesto_mano_obra").delete().eq("presupuesto_id", pres.id)
    await supabase.from("presupuesto_materiales_rubro").delete().eq("presupuesto_id", pres.id)
  } else {
    const { data, error } = await supabase
      .from("presupuestos")
      .insert(payload)
      .select()
      .single()

    if (error) throw error
    savedPres = data
  }

  // Insert Mano de Obra
  if (pres.manoDeObraItems.length > 0) {
    const moPayload = pres.manoDeObraItems.map((mo, i) => ({
      presupuesto_id: savedPres.id,
      orden: i + 1,
      descripcion: mo.descripcion,
      unidad: mo.unidad || "ud",
      cantidad: mo.cantidad || 1,
      precio_unitario: mo.precioUnitario || 0,
      total: mo.total || 0,
    }))
    const { error: moError } = await supabase.from("presupuesto_mano_obra").insert(moPayload)
    if (moError) console.error("Error inserting mo:", moError)
  }

  // Insert Materiales Rubros
  if (pres.materialesRubros.length > 0) {
    const matPayload = pres.materialesRubros.map((mat) => ({
      presupuesto_id: savedPres.id,
      rubro: mat.rubro,
      numero_comprobante: mat.numeroComprobante || null,
      monto: mat.monto || 0,
    }))
    const { error: matError } = await supabase.from("presupuesto_materiales_rubro").insert(matPayload)
    if (matError) console.error("Error inserting rubros:", matError)
  }

  return {
    ...pres,
    id: savedPres.id,
  }
}

export async function deletePresupuestoDb(id: string): Promise<void> {
  const { error } = await supabase.from("presupuestos").delete().eq("id", id)
  if (error) throw error
}

// ============================================================================
// 4. RESÚMENES CRUD (Con Tareas y Pagos)
// ============================================================================

export async function fetchResumenesDb(): Promise<Resumen[]> {
  const { data, error } = await supabase
    .from("resumenes")
    .select(`
      *,
      resumen_tareas (*),
      resumen_pagos (*)
    `)
    .order("numero_resumen", { ascending: false })

  if (error) {
    console.error("Error fetching resumenes from Supabase:", error)
    throw error
  }

  return (data || []).map((row: any) => {
    const tareas: ResumenTarea[] = (row.resumen_tareas || []).map((t: any) => ({
      id: t.id,
      sector: t.sector,
      fecha: t.fecha,
      numeroOrden: t.numero_orden || undefined,
      descripcion: t.descripcion_tareas,
      viaticosQty: t.viaticos_cantidad || 1,
      viaticosUnitario: Number(t.viaticos_unitario) || 0,
      montoTotal: Number(t.monto_total) || 0,
    }))

    const pagos: ResumenPago[] = (row.resumen_pagos || []).map((p: any) => ({
      id: p.id,
      fecha: p.fecha,
      concepto: p.concepto || "Pago",
      monto: Number(p.monto) || 0,
    }))

    return {
      id: row.id,
      numeroResumen: row.numero_resumen,
      clienteId: row.cliente_id || undefined,
      clienteNombre: row.cliente_nombre,
      atencionA: row.atencion_a || undefined,
      referencia: row.referencia,
      fecha: row.fecha,
      saldoAnterior: Number(row.saldo_anterior) || 0,
      tareas,
      pagos,
      subtotalTrabajos: Number(row.subtotal_trabajos) || 0,
      totalResumen: Number(row.total_resumen) || 0,
      totalPagos: Number(row.total_pagos) || 0,
      saldoFinal: Number(row.saldo_final) || 0,
      estado: row.estado,
    }
  })
}

export async function saveResumenDb(res: Resumen): Promise<Resumen> {
  const isUuid = res.id && res.id.includes("-") && res.id.length >= 30

  let dateFormatted = new Date().toISOString().slice(0, 10)
  if (res.fecha && res.fecha.includes("/")) {
    const parts = res.fecha.split("/")
    if (parts.length === 3) {
      dateFormatted = `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`
    }
  } else if (res.fecha && res.fecha.includes("-")) {
    dateFormatted = res.fecha
  }

  const payload: any = {
    numero_resumen: res.numeroResumen,
    cliente_id: res.clienteId && res.clienteId.length >= 30 ? res.clienteId : null,
    cliente_nombre: res.clienteNombre,
    atencion_a: res.atencionA || null,
    referencia: res.referencia,
    fecha: dateFormatted,
    saldo_anterior: res.saldoAnterior || 0,
    subtotal_trabajos: res.subtotalTrabajos || 0,
    total_resumen: res.totalResumen || 0,
    total_pagos: res.totalPagos || 0,
    saldo_final: res.saldoFinal || 0,
    estado: res.estado,
    updated_at: new Date().toISOString(),
  }

  let savedRes: any

  if (isUuid) {
    const { data, error } = await supabase
      .from("resumenes")
      .update(payload)
      .eq("id", res.id)
      .select()
      .single()

    if (error) throw error
    savedRes = data

    await supabase.from("resumen_tareas").delete().eq("resumen_id", res.id)
    await supabase.from("resumen_pagos").delete().eq("resumen_id", res.id)
  } else {
    const { data, error } = await supabase
      .from("resumenes")
      .insert(payload)
      .select()
      .single()

    if (error) throw error
    savedRes = data
  }

  // Insert Tareas
  if (res.tareas.length > 0) {
    const tareasPayload = res.tareas.map((t) => {
      let tDate = dateFormatted
      if (t.fecha && t.fecha.includes("/")) {
        const parts = t.fecha.split("/")
        if (parts.length === 3) {
          tDate = `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`
        }
      }
      return {
        resumen_id: savedRes.id,
        sector: t.sector,
        fecha: tDate,
        numero_orden: t.numeroOrden || null,
        descripcion_tareas: t.descripcion,
        viaticos_cantidad: t.viaticosQty || 1,
        viaticos_unitario: t.viaticosUnitario || 35000,
        monto_total: t.montoTotal || 0,
      }
    })
    const { error: tError } = await supabase.from("resumen_tareas").insert(tareasPayload)
    if (tError) console.error("Error inserting tareas:", tError)
  }

  // Insert Pagos
  if (res.pagos.length > 0) {
    const pagosPayload = res.pagos.map((p) => {
      let pDate = dateFormatted
      if (p.fecha && p.fecha.includes("/")) {
        const parts = p.fecha.split("/")
        if (parts.length === 3) {
          pDate = `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`
        }
      }
      return {
        resumen_id: savedRes.id,
        fecha: pDate,
        concepto: p.concepto || "Pago recibido",
        monto: p.monto || 0,
      }
    })
    const { error: pError } = await supabase.from("resumen_pagos").insert(pagosPayload)
    if (pError) console.error("Error inserting pagos:", pError)
  }

  // Update client balance in Supabase if linked
  if (savedRes.cliente_id) {
    await supabase
      .from("clientes")
      .update({ saldo_actual: res.saldoFinal, updated_at: new Date().toISOString() })
      .eq("id", savedRes.cliente_id)
  }

  // Update status of linked trabajos_diarios to 'facturado'
  for (const t of res.tareas) {
    if (t.trabajoId) {
      await supabase
        .from("trabajos_diarios")
        .update({ estado_facturacion: "facturado", resumen_id: savedRes.id })
        .eq("id", t.trabajoId)
    }
  }

  return {
    ...res,
    id: savedRes.id,
  }
}

export async function deleteResumenDb(id: string): Promise<void> {
  const { error } = await supabase.from("resumenes").delete().eq("id", id)
  if (error) throw error
}

// ============================================================================
// 5. CATEGORÍAS DE EMPLEADOS & EMPLEADOS CRUD
// ============================================================================

export async function fetchCategoriasDb(): Promise<CategoriaEmpleado[]> {
  const { data, error } = await supabase
    .from("categorias_empleados")
    .select("*")
    .order("nombre_categoria", { ascending: true })

  if (error) {
    console.error("Error fetching categorias from Supabase:", error)
    return []
  }

  return (data || []).map((row: any) => ({
    id: row.id,
    nombreCategoria: row.nombre_categoria,
    precioHora: Number(row.precio_hora) || 5000,
    activo: row.activo ?? true,
  }))
}

export async function saveCategoriaDb(cat: Partial<CategoriaEmpleado> & { nombreCategoria: string; precioHora: number }): Promise<CategoriaEmpleado> {
  const payload = {
    nombre_categoria: cat.nombreCategoria,
    precio_hora: cat.precioHora,
    activo: cat.activo ?? true,
  }

  let res: any
  if (cat.id && cat.id.includes("-")) {
    const { data, error } = await supabase.from("categorias_empleados").update(payload).eq("id", cat.id).select().single()
    if (error) throw error
    res = data
  } else {
    const { data, error } = await supabase.from("categorias_empleados").insert(payload).select().single()
    if (error) throw error
    res = data
  }

  return {
    id: res.id,
    nombreCategoria: res.nombre_categoria,
    precioHora: Number(res.precio_hora),
    activo: res.activo,
  }
}

export async function deleteCategoriaDb(id: string): Promise<void> {
  const { error } = await supabase.from("categorias_empleados").delete().eq("id", id)
  if (error) throw error
}

export async function fetchEmpleadosDb(): Promise<Empleado[]> {
  const { data, error } = await supabase
    .from("empleados")
    .select("*")
    .order("nombre_completo", { ascending: true })

  if (error) {
    console.error("Error fetching empleados from Supabase:", error)
    return []
  }

  return (data || []).map((row: any) => ({
    id: row.id,
    nombreCompleto: row.nombre_completo,
    categoriaId: row.categoria_id || undefined,
    telefono: row.telefono || undefined,
    activo: row.activo ?? true,
  }))
}

export async function saveEmpleadoDb(emp: Partial<Empleado> & { nombreCompleto: string }): Promise<Empleado> {
  const payload = {
    nombre_completo: emp.nombreCompleto,
    categoria_id: emp.categoriaId || null,
    telefono: emp.telefono || null,
    activo: emp.activo ?? true,
  }

  let res: any
  if (emp.id && emp.id.includes("-")) {
    const { data, error } = await supabase.from("empleados").update(payload).eq("id", emp.id).select().single()
    if (error) throw error
    res = data
  } else {
    const { data, error } = await supabase.from("empleados").insert(payload).select().single()
    if (error) throw error
    res = data
  }

  return {
    id: res.id,
    nombreCompleto: res.nombre_completo,
    categoriaId: res.categoria_id || undefined,
    telefono: res.telefono || undefined,
    activo: res.activo,
  }
}

export async function deleteEmpleadoDb(id: string): Promise<void> {
  const { error } = await supabase.from("empleados").delete().eq("id", id)
  if (error) throw error
}

// ============================================================================
// 6. TRABAJOS DIARIOS CRUD (Con Horas Personal y Materiales Extras)
// ============================================================================

export async function fetchTrabajosDiariosDb(): Promise<TrabajoDiario[]> {
  const { data, error } = await supabase
    .from("trabajos_diarios")
    .select(`
      *,
      trabajo_empleados (*),
      trabajo_materiales_extras (*)
    `)
    .order("fecha", { ascending: false })

  if (error) {
    console.error("Error fetching trabajos diarios from Supabase:", error)
    return []
  }

  return (data || []).map((row: any) => {
    const empList: TrabajoEmpleado[] = (row.trabajo_empleados || []).map((e: any) => ({
      id: e.id,
      trabajoId: e.trabajo_id,
      empleadoId: e.empleado_id || undefined,
      categoriaId: e.categoria_id || undefined,
      nombreEmpleadoRol: e.nombre_empleado_rol,
      horas: Number(e.horas) || 1,
      precioHora: Number(e.precio_hora) || 0,
      total: Number(e.total) || 0,
    }))

    const matList: TrabajoMaterialExtra[] = (row.trabajo_materiales_extras || []).map((m: any) => ({
      id: m.id,
      trabajoId: m.trabajo_id,
      descripcion: m.descripcion,
      unidad: m.unidad || "ud",
      cantidad: Number(m.cantidad) || 1,
      precioUnitario: Number(m.precio_unitario) || 0,
      total: Number(m.total) || 0,
    }))

    return {
      id: row.id,
      clienteId: row.cliente_id || undefined,
      clienteNombre: row.cliente_nombre,
      fecha: row.fecha,
      sector: row.sector,
      numeroOrden: row.numero_orden || undefined,
      descripcionTareas: row.descripcion_tareas,
      viaticosQty: Number(row.viaticos_cantidad) || 0,
      viaticosUnitario: Number(row.viaticos_unitario) || 35000,
      empleados: empList,
      materialesExtras: matList,
      totalManoObra: Number(row.total_mano_obra) || 0,
      totalMaterialesExtras: Number(row.total_materiales_extras) || 0,
      montoTotal: Number(row.monto_total) || 0,
      estadoFacturacion: row.estado_facturacion || "pendiente",
      resumenId: row.resumen_id || undefined,
    }
  })
}

export async function saveTrabajoDiarioDb(trabajo: TrabajoDiario): Promise<TrabajoDiario> {
  const isUuid = trabajo.id && trabajo.id.includes("-") && trabajo.id.length >= 30

  let dateFormatted = new Date().toISOString().slice(0, 10)
  if (trabajo.fecha && trabajo.fecha.includes("/")) {
    const parts = trabajo.fecha.split("/")
    if (parts.length === 3) {
      dateFormatted = `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`
    }
  } else if (trabajo.fecha && trabajo.fecha.includes("-")) {
    dateFormatted = trabajo.fecha
  }

  const payload: any = {
    cliente_id: trabajo.clienteId && trabajo.clienteId.length >= 30 ? trabajo.clienteId : null,
    cliente_nombre: trabajo.clienteNombre,
    fecha: dateFormatted,
    sector: trabajo.sector,
    numero_orden: trabajo.numeroOrden || null,
    descripcion_tareas: trabajo.descripcionTareas,
    viaticos_cantidad: trabajo.viaticosQty || 0,
    viaticos_unitario: trabajo.viaticosUnitario || 35000,
    total_mano_obra: trabajo.totalManoObra || 0,
    total_materiales_extras: trabajo.totalMaterialesExtras || 0,
    monto_total: trabajo.montoTotal || 0,
    estado_facturacion: trabajo.estadoFacturacion || "pendiente",
    resumen_id: trabajo.resumenId || null,
    updated_at: new Date().toISOString(),
  }

  let savedTrabajo: any

  if (isUuid) {
    const { data, error } = await supabase
      .from("trabajos_diarios")
      .update(payload)
      .eq("id", trabajo.id)
      .select()
      .single()

    if (error) throw error
    savedTrabajo = data

    await supabase.from("trabajo_empleados").delete().eq("trabajo_id", trabajo.id)
    await supabase.from("trabajo_materiales_extras").delete().eq("trabajo_id", trabajo.id)
  } else {
    const { data, error } = await supabase
      .from("trabajos_diarios")
      .insert(payload)
      .select()
      .single()

    if (error) throw error
    savedTrabajo = data
  }

  // Insert Empleados/Horas
  if (trabajo.empleados.length > 0) {
    const empPayload = trabajo.empleados.map((e) => ({
      trabajo_id: savedTrabajo.id,
      empleado_id: e.empleadoId || null,
      categoria_id: e.categoriaId || null,
      nombre_empleado_rol: e.nombreEmpleadoRol,
      horas: e.horas || 1,
      precio_hora: e.precioHora || 0,
      total: e.total || 0,
    }))
    await supabase.from("trabajo_empleados").insert(empPayload)
  }

  // Insert Materiales Extras
  if (trabajo.materialesExtras.length > 0) {
    const matPayload = trabajo.materialesExtras.map((m) => ({
      trabajo_id: savedTrabajo.id,
      descripcion: m.descripcion,
      unidad: m.unidad || "ud",
      cantidad: m.cantidad || 1,
      precio_unitario: m.precioUnitario || 0,
      total: m.total || 0,
    }))
    await supabase.from("trabajo_materiales_extras").insert(matPayload)
  }

  return {
    ...trabajo,
    id: savedTrabajo.id,
  }
}

export async function deleteTrabajoDiarioDb(id: string): Promise<void> {
  const { error } = await supabase.from("trabajos_diarios").delete().eq("id", id)
  if (error) throw error
}
