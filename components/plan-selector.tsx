"use client"

import { type PlanType, ALL_PLANS, PLAN_LABELS } from "@/lib/plan-context"
import { cn } from "@/lib/utils"
import { Crown, Zap, Star } from "lucide-react"

const PLAN_ICONS: Record<PlanType, typeof Crown> = {
  basic: Star,
  medium: Zap,
  max: Crown,
}

interface PlanSelectorProps {
  selected: PlanType
  onSelect: (plan: PlanType) => void
}

export function PlanSelector({ selected, onSelect }: PlanSelectorProps) {
  return (
    <div className="flex items-center gap-2" role="radiogroup" aria-label="Select plan">
      {ALL_PLANS.map((plan) => {
        const isActive = selected === plan
        const Icon = PLAN_ICONS[plan]
        return (
          <button
            key={plan}
            role="radio"
            aria-checked={isActive}
            onClick={() => onSelect(plan)}
            className={cn(
              "flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all",
              isActive
                ? "border-primary bg-primary/10 text-primary shadow-sm shadow-primary/20"
                : "border-border bg-card text-muted-foreground hover:border-muted-foreground/30 hover:text-foreground"
            )}
          >
            <Icon className="size-4" />
            {PLAN_LABELS[plan]}
          </button>
        )
      })}
    </div>
  )
}
