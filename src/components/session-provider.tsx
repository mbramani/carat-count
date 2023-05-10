"use client"

import * as React from "react"
import {
  SessionProvider as NextAuthSessionProvider,
  SessionProviderProps,
} from "next-auth/react"

export function SessionProvider({ children }: SessionProviderProps) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
}
