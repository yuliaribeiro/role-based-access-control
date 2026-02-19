"use client"

import { AdminConfig } from "@/components/admin-config"
import { AppHeader } from "@/components/app-header"

export default function AdminPage() {
  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-5xl px-6 py-8">
        <AdminConfig />
      </main>
    </>
  )
}
