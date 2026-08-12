"use client"

import * as React from "react"
import { DollarSignIcon, DownloadIcon, PlusIcon, PrinterIcon, SearchIcon, WalletIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function CuentaCorrienteView() {
  const [accountType, setAccountType] = React.useState<"clientes" | "colaboradores">("clientes")
  const [search, setSearch] = React.useState("NAVAR")

  const ledger = [
    { fecha: "11/08/26", tipo: "Factura", referencia: "Resumen mantenimiento", debe: 293000, haber: 0, saldo: 293000 },
    { fecha: "08/08/26", tipo: "Pago", referencia: "Transferencia bancaria", debe: 0, haber: 150000, saldo: 143000 },
    { fecha: "05/08/26", tipo: "Factura", referencia: "Mantenimiento molino", debe: 258000, haber: 0, saldo: 293000 },
    { fecha: "30/07/26", tipo: "Pago", referencia: "Transferencia bancaria", debe: 0, haber: 100000, saldo: 35000 },
  ]

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8 space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Cuenta Corriente</h1>
        <p className="text-sm text-slate-500 font-medium mt-1">
          Clientes y colaboradores, con movimientos y saldos siempre actualizados.
        </p>
      </div>

      {/* Filter Header */}
      <Card className="border border-slate-200 bg-white">
        <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setAccountType("clientes")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
                accountType === "clientes" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              CLIENTES
            </button>
            <button
              onClick={() => setAccountType("colaboradores")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
                accountType === "colaboradores" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              COLABORADORES
            </button>
          </div>

          <div className="w-full md:w-80 relative">
            <SearchIcon className="size-4 absolute left-3 top-2.5 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar cliente o proveedor..."
              className="pl-9 h-9 text-xs bg-slate-50 border-slate-200 font-bold"
            />
          </div>

          <Button className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shrink-0">
            + REGISTRAR PAGO
          </Button>
        </CardContent>
      </Card>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border border-slate-200 bg-white">
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase">SALDO ACTUAL</CardTitle>
          </CardHeader>
          <CardContent className="pb-3 px-4">
            <div className="text-2xl font-black font-mono text-slate-900">$ 293.000</div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 bg-white">
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase">PRESUPUESTOS ABIERTOS</CardTitle>
          </CardHeader>
          <CardContent className="pb-3 px-4">
            <div className="text-2xl font-black font-mono text-slate-900">2</div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 bg-white">
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase">FACTURAS PENDIENTES</CardTitle>
          </CardHeader>
          <CardContent className="pb-3 px-4">
            <div className="text-2xl font-black font-mono text-slate-900">1</div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 bg-white">
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase">ÚLTIMO PAGO</CardTitle>
          </CardHeader>
          <CardContent className="pb-3 px-4">
            <div className="text-2xl font-black font-mono text-emerald-600">$ 150.000</div>
          </CardContent>
        </Card>
      </div>

      {/* Ledger Table */}
      <Card className="border border-slate-200 bg-white overflow-hidden shadow-sm">
        <CardHeader className="py-4 border-b border-slate-100">
          <CardTitle className="text-base font-bold text-slate-900 uppercase">MOVIMIENTOS</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 text-[11px] font-extrabold uppercase text-slate-500">
                <TableHead className="w-[100px]">FECHA</TableHead>
                <TableHead className="w-[100px]">TIPO</TableHead>
                <TableHead>REFERENCIA</TableHead>
                <TableHead className="w-[130px] text-right">DEBE</TableHead>
                <TableHead className="w-[130px] text-right">HABER</TableHead>
                <TableHead className="w-[140px] text-right">SALDO</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ledger.map((item, idx) => (
                <TableRow key={idx} className="text-xs">
                  <TableCell className="font-mono text-slate-500">{item.fecha}</TableCell>
                  <TableCell className="font-bold text-slate-900">{item.tipo}</TableCell>
                  <TableCell className="font-medium text-slate-700">{item.referencia}</TableCell>
                  <TableCell className="text-right font-mono font-bold">
                    {item.debe > 0 ? `$ ${item.debe.toLocaleString("es-ES")}` : "-"}
                  </TableCell>
                  <TableCell className="text-right font-mono text-emerald-600 font-bold">
                    {item.haber > 0 ? `$ ${item.haber.toLocaleString("es-ES")}` : "-"}
                  </TableCell>
                  <TableCell className="text-right font-mono font-black text-slate-900">
                    $ {item.saldo.toLocaleString("es-ES")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Footer Bar */}
      <div className="bg-slate-900 p-4 rounded-xl flex flex-wrap gap-3 items-center justify-between text-white">
        <div className="flex gap-2">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs">
            + PAGO
          </Button>
          <Button variant="outline" className="text-xs text-white border-slate-700 bg-slate-800 hover:bg-slate-700 font-bold">
            + AJUSTE
          </Button>
        </div>
        <Button onClick={() => window.print()} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs">
          Generar PDF de cuenta corriente →
        </Button>
      </div>
    </div>
  )
}
