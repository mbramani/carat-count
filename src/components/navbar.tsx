"use client"

import * as React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"

import { ModeToggle } from "./mode-toggle"
import { buttonVariants } from "./ui/button"

export function Navbar() {
  return (
    <header className="container z-40 bg-background">
      <div className="flex h-20 items-center justify-between py-4 md:py-6">
        <Link href="/" className="font-bold">
          CaratCount
        </Link>
        <nav className="flex items-center gap-2">
          <ModeToggle />
          <Link
            href="/login"
            className={cn(
              buttonVariants({ variant: "secondary", size: "sm" }),
              "px-4"
            )}
          >
            Login
          </Link>
        </nav>
      </div>
    </header>
  )
}
