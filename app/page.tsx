"use client"

import { AnimalViewer } from "@/components/animal-viewer"
import { AppHeader } from "@/components/app-header"

export default function HomePage() {
  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-5xl px-6 py-8">
        <AnimalViewer />
      </main>
    </>
  )
}
