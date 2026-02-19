"use client"

import { useState } from "react"
import { type PlanType, usePlanConfig, PLAN_LABELS } from "@/lib/plan-context"
import { ANIMALS } from "@/lib/animal-data"
import { PlanSelector } from "@/components/plan-selector"
import { AnimalCard } from "@/components/animal-card"
import { Badge } from "@/components/ui/badge"
import { FIELD_LABELS } from "@/lib/plan-context"
import { Eye, EyeOff } from "lucide-react"

export function AnimalViewer() {
  const [activePlan, setActivePlan] = useState<PlanType>("basic")
  const { getFieldsForPlan } = usePlanConfig()
  const visibleFields = getFieldsForPlan(activePlan)
  const allFields = Object.keys(FIELD_LABELS) as (keyof typeof FIELD_LABELS)[]
  const hiddenFields = allFields.filter((f) => !visibleFields.includes(f))

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground text-balance">
          Animal Viewer
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Select a plan below to preview which fields are visible to that tier of users.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <PlanSelector selected={activePlan} onSelect={setActivePlan} />

        <div className="flex flex-wrap items-center gap-4 rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Eye className="size-3.5 text-primary" />
              <span className="text-xs font-medium text-muted-foreground">Visible:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {visibleFields.length > 0 ? (
                visibleFields.map((f) => (
                  <Badge key={f} className="bg-primary/15 text-primary border-primary/20 text-xs">
                    {FIELD_LABELS[f]}
                  </Badge>
                ))
              ) : (
                <span className="text-xs text-muted-foreground">No fields visible</span>
              )}
            </div>
          </div>
          {hiddenFields.length > 0 && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <EyeOff className="size-3.5 text-muted-foreground/50" />
                <span className="text-xs font-medium text-muted-foreground">Hidden:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {hiddenFields.map((f) => (
                  <Badge key={f} variant="outline" className="text-muted-foreground/60 text-xs">
                    {FIELD_LABELS[f]}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        <h2 className="mb-1 text-sm font-medium text-muted-foreground">
          Showing animals for <span className="text-foreground font-semibold">{PLAN_LABELS[activePlan]}</span> plan
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ANIMALS.map((animal) => (
            <AnimalCard key={animal.id} animal={animal} plan={activePlan} />
          ))}
        </div>
      </div>
    </div>
  )
}
