"use client"

import { AppRouter } from "@/server/routers/_app"
import { httpBatchLink, loggerLink } from "@trpc/client"
import {
  experimental_createActionHook as createActionHook,
  experimental_createTRPCNextAppDirClient as createTRPCNextAppDirClient,
  experimental_serverActionLink as serverActionLink,
} from "@trpc/next/app-dir/client"
import superjson from "superjson"

import { getUrl } from "./shared"

export const api = createTRPCNextAppDirClient<AppRouter>({
  config() {
    return {
      transformer: superjson,
      links: [
        loggerLink({
          enabled: (op) =>
            process.env.NODE_ENV === "development" ||
            (op.direction === "down" && op.result instanceof Error),
        }),
        httpBatchLink({
          url: getUrl(),
          headers() {
            return {
              "x-trpc-source": "client",
            }
          },
        }),
      ],
    }
  },
})

export const useAction = createActionHook({
  links: [loggerLink(), serverActionLink()],
  transformer: superjson,
})
