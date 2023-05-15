import Link from "next/link"
import { notFound } from "next/navigation"

import { getCurrentUser } from "@/lib/session"
import { ModeToggle } from "@/components/mode-toggle"
import { UserAccountNav } from "@/components/user-account-nav"

interface DashboardLayoutProps {
  children?: React.ReactNode
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const user = await getCurrentUser()

  if (!user) {
    return notFound()
  }

  return (
    <div className="flex min-h-screen flex-col space-y-6">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <Link href="/" className="font-bold">
            CaratCount
          </Link>
          <nav className="flex items-center gap-4">
            <ModeToggle />
            <UserAccountNav
              user={{
                name: user.name,
                image: user.image,
                email: user.email,
              }}
            />
          </nav>
        </div>
      </header>

      <main className="flex w-full flex-1 flex-col">{children}</main>
    </div>
  )
}
