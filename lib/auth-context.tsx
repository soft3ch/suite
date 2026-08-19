"use client"

import * as React from "react"
import { createClient } from "@/lib/supabase/client"

export type UserRole = "admin" | "administrativo" | "tecnico_senior" | "tecnico"

export type AppUser = {
  id: string
  name: string
  email: string
  role: UserRole
  roleLabel: string
  avatarInitials: string
  scopes: string[]
}

export const DEMO_USERS: AppUser[] = [
  {
    id: "u-admin-1",
    name: "Ariel Medina",
    email: "admin@electricidad.com",
    role: "admin",
    roleLabel: "Administrador / Titular",
    avatarInitials: "AM",
    scopes: [
      "clientes:read", "clientes:write", "clientes:delete",
      "presupuestos:read", "presupuestos:write", "presupuestos:delete",
      "resumenes:read", "resumenes:write", "resumenes:delete",
      "proveedores:read", "proveedores:write", "proveedores:delete",
      "finanzas:view", "usuarios:manage",
    ],
  },
  {
    id: "u-admin-2",
    name: "Hugo (Ventas)",
    email: "hugo@electricidad.com",
    role: "administrativo",
    roleLabel: "Administrativo Comercial",
    avatarInitials: "H",
    scopes: [
      "clientes:read", "clientes:write",
      "presupuestos:read", "presupuestos:write",
      "resumenes:read", "resumenes:write",
      "proveedores:read", "proveedores:write",
      "finanzas:view",
    ],
  },
  {
    id: "u-tec-1",
    name: "Miguel Gauto",
    email: "miguel@electricidad.com",
    role: "tecnico_senior",
    roleLabel: "Técnico Senior",
    avatarInitials: "MG",
    scopes: [
      "clientes:read",
      "presupuestos:read", "presupuestos:write",
      "resumenes:read", "resumenes:write",
      "proveedores:read",
    ],
  },
  {
    id: "u-tec-2",
    name: "Ivan (Campo)",
    email: "ivan@electricidad.com",
    role: "tecnico",
    roleLabel: "Técnico de Campo",
    avatarInitials: "I",
    scopes: [
      "clientes:read",
      "resumenes:read",
    ],
  },
]

type AuthContextType = {
  user: AppUser | null
  isAuthenticated: boolean
  login: (email: string) => boolean
  loginAsDemoUser: (user: AppUser) => void
  logout: () => Promise<void>
  hasScope: (scope: string) => boolean
  canManageFinances: boolean
  canEditClients: boolean
  canCreateQuotes: boolean
  canCreateResumenes: boolean
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined)

const AUTH_STORAGE_KEY = "ei_suite_auth_user_v1"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AppUser | null>(null)
  const [isLoaded, setIsLoaded] = React.useState(false)
  const supabase = createClient()

  React.useEffect(() => {
    // 1. Check local session storage first
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY)
      if (stored) {
        setUser(JSON.parse(stored))
      } else {
        setUser(DEMO_USERS[0])
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(DEMO_USERS[0]))
      }
    } catch (e) {
      setUser(DEMO_USERS[0])
    }

    // 2. Check Supabase auth session if configured
    if (supabase) {
      supabase.auth.getUser().then(({ data: { user: sbUser } }) => {
        if (sbUser) {
          const email = sbUser.email || ""
          const demoFound = DEMO_USERS.find(
            (u) => u.email.toLowerCase() === email.toLowerCase()
          )
          if (demoFound) {
            setUser(demoFound)
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(demoFound))
          } else {
            const custom: AppUser = {
              id: sbUser.id,
              name: sbUser.user_metadata?.nombre_completo || email.split("@")[0],
              email,
              role: sbUser.user_metadata?.rol || "admin",
              roleLabel: sbUser.user_metadata?.rol === "admin" ? "Administrador" : "Usuario",
              avatarInitials: email.slice(0, 2).toUpperCase(),
              scopes: DEMO_USERS[0].scopes,
            }
            setUser(custom)
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(custom))
          }
        }
      })

      const { data: authListener } = supabase.auth.onAuthStateChange(
        (event, session) => {
          if (session?.user) {
            const email = session.user.email || ""
            const demoFound = DEMO_USERS.find(
              (u) => u.email.toLowerCase() === email.toLowerCase()
            )
            if (demoFound) {
              setUser(demoFound)
              localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(demoFound))
            } else {
              const custom: AppUser = {
                id: session.user.id,
                name: session.user.user_metadata?.nombre_completo || email.split("@")[0],
                email,
                role: session.user.user_metadata?.rol || "admin",
                roleLabel: "Usuario",
                avatarInitials: email.slice(0, 2).toUpperCase(),
                scopes: DEMO_USERS[0].scopes,
              }
              setUser(custom)
              localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(custom))
            }
          } else if (event === "SIGNED_OUT") {
            setUser(null)
            localStorage.removeItem(AUTH_STORAGE_KEY)
          }
        }
      )

      setIsLoaded(true)

      return () => {
        authListener?.subscription.unsubscribe()
      }
    } else {
      setIsLoaded(true)
    }
  }, [])

  function login(email: string): boolean {
    const found = DEMO_USERS.find((u) => u.email.toLowerCase() === email.trim().toLowerCase())
    if (found) {
      setUser(found)
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(found))
      return true
    }
    const customUser: AppUser = {
      id: `u-custom-${Date.now()}`,
      name: email.split("@")[0],
      email,
      role: "admin",
      roleLabel: "Usuario",
      avatarInitials: email.slice(0, 2).toUpperCase(),
      scopes: DEMO_USERS[0].scopes,
    }
    setUser(customUser)
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(customUser))
    return true
  }

  function loginAsDemoUser(demoUser: AppUser) {
    setUser(demoUser)
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(demoUser))
  }

  async function logout() {
    setUser(null)
    localStorage.removeItem(AUTH_STORAGE_KEY)
    if (supabase) {
      await supabase.auth.signOut()
    }
  }

  function hasScope(scope: string): boolean {
    if (!user) return false
    if (user.role === "admin") return true
    return user.scopes.includes(scope)
  }

  const canManageFinances = user?.role === "admin" || user?.role === "administrativo"
  const canEditClients = hasScope("clientes:write")
  const canCreateQuotes = hasScope("presupuestos:write")
  const canCreateResumenes = hasScope("resumenes:write")

  if (!isLoaded) {
    return null
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        login,
        loginAsDemoUser,
        logout,
        hasScope,
        canManageFinances,
        canEditClients,
        canCreateQuotes,
        canCreateResumenes,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
