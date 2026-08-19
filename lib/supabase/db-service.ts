import { createClient } from "@/lib/supabase/client"
import type {
  Cliente,
  ManoDeObraItem,
  MaterialRubro,
  Presupuesto,
  Proveedor,
  Resumen,
  ResumenPago,
  ResumenTarea,
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

  return {
    ...res,
    id: savedRes.id,
  }
}

export async function deleteResumenDb(id: string): Promise<void> {
  const { error } = await supabase.from("resumenes").delete().eq("id", id)
  if (error) throw error
}
