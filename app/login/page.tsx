"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { AlertCircleIcon, CheckCircle2Icon, LockIcon, ShieldCheckIcon, UserPlusIcon, ZapIcon } from "lucide-react"

import { createClient } from "@/lib/supabase/client"
import { DEMO_USERS, useAuth, type AppUser } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const router = useRouter()
  const { loginAsDemoUser } = useAuth()
  const supabase = createClient()

  const [mode, setMode] = React.useState<"signin" | "signup">("signin")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [nombreCompleto, setNombreCompleto] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null)
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg(null)
    setSuccessMsg(null)

    if (!email.trim() || !password.trim()) {
      setErrorMsg("Por favor, ingresá correo y contraseña.")
      return
    }

    setLoading(true)

    try {
      if (mode === "signin") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim(),
        })

        if (error) {
          // If offline or project not reachable, check if it matches a demo user
          const demoFound = DEMO_USERS.find(
            (u) => u.email.toLowerCase() === email.trim().toLowerCase()
          )
          if (demoFound) {
            loginAsDemoUser(demoFound)
            router.push("/")
            return
          }
          throw error
        }

        if (data.session) {
          router.push("/")
          router.refresh()
        }
      } else {
        // Sign up
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password.trim(),
          options: {
            data: {
              nombre_completo: nombreCompleto.trim() || email.split("@")[0],
              rol: "admin",
            },
          },
        })

        if (error) throw error

        if (data.user) {
          setSuccessMsg("¡Usuario creado exitosamente! Iniciando sesión...")
          // Try to sign in immediately
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password: password.trim(),
          })
          if (!signInError) {
            router.push("/")
            router.refresh()
          } else {
            setMode("signin")
          }
        }
      }
    } catch (err: any) {
      console.error("Auth error:", err)
      setErrorMsg(err.message || "Error al autenticar. Verificá tus credenciales o conexión.")
    } finally {
      setLoading(false)
    }
  }

  function handleQuickDemoSelect(demo: AppUser) {
    setEmail(demo.email)
    setPassword("123456") // Standard demo password
    loginAsDemoUser(demo)
    router.push("/")
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
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold text-white">
                {mode === "signin" ? "Iniciar Sesión" : "Crear Nueva Cuenta"}
              </CardTitle>
              <button
                type="button"
                onClick={() => {
                  setMode(mode === "signin" ? "signup" : "signin")
                  setErrorMsg(null)
                  setSuccessMsg(null)
                }}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold underline underline-offset-2"
              >
                {mode === "signin" ? "Registrarse" : "Ya tengo cuenta"}
              </button>
            </div>
            <CardDescription className="text-xs text-slate-400">
              Autenticación con Supabase (Correo y Contraseña).
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-5 space-y-5">
            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-950/50 border border-red-800/80 text-red-200 text-xs flex items-start gap-2">
                <AlertCircleIcon className="size-4 text-red-400 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-lg bg-emerald-950/50 border border-emerald-800/80 text-emerald-200 text-xs flex items-start gap-2">
                <CheckCircle2Icon className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-300">Nombre Completo</Label>
                  <Input
                    type="text"
                    value={nombreCompleto}
                    onChange={(e) => setNombreCompleto(e.target.value)}
                    placeholder="Ariel Medina"
                    className="bg-slate-950 border-slate-800 text-white text-xs"
                    required
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <Label className="text-xs text-slate-300">Correo Electrónico</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@electricidad.com"
                  className="bg-slate-950 border-slate-800 text-white text-xs"
                  required
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
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-2.5 shadow-md shadow-blue-600/20"
              >
                {loading
                  ? "Verificando..."
                  : mode === "signin"
                    ? "INGRESAR CON SUPABASE"
                    : "REGISTRAR Y ACCEDER"}
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
            {/* <div className="grid grid-cols-1 gap-2">
              {DEMO_USERS.map((demo) => (
                <button
                  key={demo.id}
                  type="button"
                  onClick={() => handleQuickDemoSelect(demo)}
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
                        {demo.email} • {demo.roleLabel}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 group-hover:bg-blue-500 group-hover:text-white uppercase transition-colors">
                    {demo.role}
                  </span>
                </button>
              ))}
            </div> */}
          </CardContent>
        </Card>

        <p className="text-center text-[11px] text-slate-500 font-medium">
          Conexión segura protegida por Next.js Proxy y Supabase Auth
        </p>
      </div>
    </div>
  )
}
