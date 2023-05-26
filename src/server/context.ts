import { NextRequest } from "next/server"
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch"
import { JWT, getToken } from "next-auth/jwt"

import { db } from "@/lib/db"

interface CreateInnerContextOptions
  extends Partial<FetchCreateContextFnOptions> {
  session: JWT | null
}
export async function createContextInner(opts?: CreateInnerContextOptions) {
  return {
    db,
    session: opts?.session,
  }
}

export async function createContext(opts?: FetchCreateContextFnOptions) {
  const session = await getToken({
    req: opts?.req as NextRequest,
  })
  const contextInner = await createContextInner({ session })

  return {
    ...contextInner,
    headers: opts && Object.fromEntries(opts.req.headers),
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>
