import { cookies, headers } from "next/headers"
import { experimental_createServerActionHandler as createServerActionHandler } from "@trpc/next/app-dir/server"
import { TRPCError, initTRPC } from "@trpc/server"
import { JWT, decode } from "next-auth/jwt"
import superjson from "superjson"
import { ZodError } from "zod"
import { env } from "~/env.mjs"

import { Context, createContextInner } from "./context"

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter(opts) {
    const { shape, error } = opts
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.code === "BAD_REQUEST" && error.cause instanceof ZodError
            ? error.cause.flatten()
            : null,
      },
    }
  },
})

const isAuthed = t.middleware((opts) => {
  const { ctx } = opts
  if (!ctx.session?.id) {
    throw new TRPCError({ code: "UNAUTHORIZED" })
  }
  return opts.next({
    ctx: {
      session: { ...ctx.session },
    },
  })
})

export const router = t.router
export const publicProcedure = t.procedure
export const protectedProcedure = t.procedure.use(isAuthed)

export const createAction = createServerActionHandler(t, {
  async createContext() {
    const token = cookies()?.get("next-auth.session-token") as
      | string
      | undefined

    let session: JWT | null

    try {
      session = await decode({ token, secret: env.NEXTAUTH_SECRET })
    } catch {
      session = null
    }

    const contextInner = await createContextInner({ session: session })

    return {
      ...contextInner,
      headers: Object.fromEntries(headers()),
    }
  },
})
