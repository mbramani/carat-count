"use server"

import { headers } from "next/headers"
import { AppRouter } from "@/server/routers/_app"
import { httpBatchLink, loggerLink } from "@trpc/client"
import { experimental_createTRPCNextAppDirServer as createTRPCNextAppDirServer } from "@trpc/next/app-dir/server"
import superjson from "superjson"

import { getUrl } from "./shared"

export const api = createTRPCNextAppDirServer<AppRouter>({
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
            // Forward headers from the browser to the API
            return {
              ...Object.fromEntries(headers()),
              "x-trpc-source": "rsc",
            }
          },
        }),
      ],
    }
  },
})
