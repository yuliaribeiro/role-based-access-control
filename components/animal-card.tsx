"use client"

import type { Animal } from "@/lib/animal-data"
import { type FeatureField, FIELD_LABELS, type PlanType, usePlanConfig } from "@/lib/plan-context"
import { Badge } from "@/components/ui/badge"
import { Lock, Tag, Weight, PawPrint, CircleUser } from "lucide-react"

const FIELD_ICONS: Record<FeatureField, typeof Tag> = {
  name: Tag,
  weight: Weight,
  species: PawPrint,
  gender: CircleUser,
}

const ALL_DISPLAY_FIELDS: FeatureField[] = ["name", "weight", "species", "gender"]

interface AnimalCardProps {
  animal: Animal
  plan: PlanType
}

export function AnimalCard({ animal, plan }: AnimalCardProps) {
  const { getFieldsForPlan } = usePlanConfig()
  const visibleFields = getFieldsForPlan(plan)

  return (
    <div className="rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-md hover:shadow-primary/5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-foreground">
          {visibleFields.includes("name") ? animal.name : "Locked"}
        </h3>
        <Badge variant="outline" className="text-xs text-muted-foreground">
          {"#"}{animal.id.toString().padStart(3, "0")}
        </Badge>
      </div>
      <div className="flex flex-col gap-3">
        {ALL_DISPLAY_FIELDS.map((field) => {
          const isVisible = visibleFields.includes(field)
          const Icon = FIELD_ICONS[field]
          return (
            <div
              key={field}
              className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 px-3 py-2.5"
            >
              <div className="flex items-center gap-2 text-sm">
                <Icon className="size-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">{FIELD_LABELS[field]}</span>
              </div>
              {isVisible ? (
                <span className="text-sm font-medium text-foreground">
                  {animal[field]}
                </span>
              ) : (
                <div className="flex items-center gap-1 text-muted-foreground/50">
                  <Lock className="size-3" />
                  <span className="text-xs">Upgrade plan</span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
