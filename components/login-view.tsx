"use client"

import * as React from "react"
import { LockIcon, ShieldCheckIcon, UserCheckIcon, ZapIcon } from "lucide-react"

import { DEMO_USERS, useAuth, type AppUser } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LoginView() {
  const { login, loginAsDemoUser } = useAuth()
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")

  function handleManualSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    login(email)
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 sm:p-6 text-slate-100">
      <div className="w-full max-w-md space-y-6">
        {/* Logo & Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-blue-600 text-white font-black shadow-lg shadow-blue-600/30">
            <ZapIcon className="size-6" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white font-mono">
            EI SUITE
          </h1>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
            Virasoro Electricidad Industrial • Ariel Medina
          </p>
        </div>

        {/* Login Card */}
        <Card className="border border-slate-800 bg-slate-900 text-slate-100 shadow-2xl">
          <CardHeader className="pb-3 border-b border-slate-800">
            <CardTitle className="text-base font-bold text-white">
              Iniciar Sesión
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Ingresá con tu usuario o seleccioná un perfil de prueba para entrar directo.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-5 space-y-5">
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-300">Correo Electrónico</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@electricidad.com"
                  className="bg-slate-950 border-slate-800 text-white text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-slate-300">Contraseña</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-slate-950 border-slate-800 text-white text-xs"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-2.5 shadow-md shadow-blue-600/20"
              >
                INGRESAR AL SISTEMA
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold">
                <span className="bg-slate-900 px-3 text-slate-500">
                  Acceso Rápido por Perfil (Demo)
                </span>
              </div>
            </div>

            {/* Quick Demo Switchers */}
            <div className="grid grid-cols-1 gap-2">
              {DEMO_USERS.map((demo) => (
                <button
                  key={demo.id}
                  type="button"
                  onClick={() => loginAsDemoUser(demo)}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-800 hover:border-slate-700 transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-slate-800 group-hover:bg-blue-600 text-white font-black text-xs flex items-center justify-center transition-colors">
                      {demo.avatarInitials}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-200 group-hover:text-white">
                        {demo.name}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {demo.roleLabel}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 group-hover:bg-blue-500 group-hover:text-white uppercase transition-colors">
                    {demo.role}
                  </span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-[11px] text-slate-500 font-medium">
          Sistema protegido con control de acceso y roles • v2.0
        </p>
      </div>
    </div>
  )
}
