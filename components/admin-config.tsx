"use client"

import {
  ALL_PLANS,
  ALL_FIELDS,
  FIELD_LABELS,
  PLAN_LABELS,
  usePlanConfig,
  type PlanType,
} from "@/lib/plan-context"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RotateCcw, Crown, Zap, Star, Check, X } from "lucide-react"

const PLAN_ICONS: Record<PlanType, typeof Crown> = {
  basic: Star,
  medium: Zap,
  max: Crown,
}

const PLAN_DESCRIPTIONS: Record<PlanType, string> = {
  basic: "Entry-level access for new users",
  medium: "Enhanced features for regular users",
  max: "Full access to all features",
}

export function AdminConfig() {
  const { config, toggleFieldInPlan, isFieldInPlan, resetToDefaults } = usePlanConfig()

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground text-balance">
            Plan Administration
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Configure which animal fields are visible in each subscription plan. Changes apply immediately.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={resetToDefaults}
          className="shrink-0"
        >
          <RotateCcw className="size-3.5" />
          Reset defaults
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {ALL_PLANS.map((plan) => {
          const Icon = PLAN_ICONS[plan]
          const enabledCount = config[plan].length
          return (
            <div
              key={plan}
              className="flex flex-col rounded-xl border border-border bg-card"
            >
              <div className="flex items-center gap-3 border-b border-border px-5 py-4">
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="size-4 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-semibold text-foreground">
                      {PLAN_LABELS[plan]}
                    </h2>
                    <Badge variant="secondary" className="text-xs">
                      {enabledCount}/{ALL_FIELDS.length} fields
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {PLAN_DESCRIPTIONS[plan]}
                  </p>
                </div>
              </div>

              <div className="flex flex-col p-2">
                {ALL_FIELDS.map((field) => {
                  const enabled = isFieldInPlan(plan, field)
                  return (
                    <label
                      key={field}
                      className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-3 transition-colors hover:bg-secondary/60"
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`flex size-5 items-center justify-center rounded-md ${
                            enabled
                              ? "bg-primary/15 text-primary"
                              : "bg-secondary text-muted-foreground/40"
                          }`}
                        >
                          {enabled ? (
                            <Check className="size-3" />
                          ) : (
                            <X className="size-3" />
                          )}
                        </div>
                        <span
                          className={`text-sm font-medium ${
                            enabled ? "text-foreground" : "text-muted-foreground"
                          }`}
                        >
                          {FIELD_LABELS[field]}
                        </span>
                      </div>
                      <Switch
                        checked={enabled}
                        onCheckedChange={() => toggleFieldInPlan(plan, field)}
                        aria-label={`Toggle ${FIELD_LABELS[field]} for ${PLAN_LABELS[plan]} plan`}
                      />
                    </label>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Live summary table */}
      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border px-5 py-3">
          <h2 className="text-sm font-semibold text-foreground">
            Configuration Summary
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" role="table">
            <thead>
              <tr className="border-b border-border">
                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Field
                </th>
                {ALL_PLANS.map((plan) => (
                  <th
                    key={plan}
                    className="px-5 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider"
                  >
                    {PLAN_LABELS[plan]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ALL_FIELDS.map((field, i) => (
                <tr
                  key={field}
                  className={i < ALL_FIELDS.length - 1 ? "border-b border-border" : ""}
                >
                  <td className="px-5 py-3 font-medium text-foreground">
                    {FIELD_LABELS[field]}
                  </td>
                  {ALL_PLANS.map((plan) => {
                    const active = isFieldInPlan(plan, field)
                    return (
                      <td key={plan} className="px-5 py-3 text-center">
                        {active ? (
                          <span className="inline-flex items-center justify-center size-6 rounded-full bg-primary/15">
                            <Check className="size-3.5 text-primary" />
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center size-6 rounded-full bg-secondary">
                            <X className="size-3.5 text-muted-foreground/40" />
                          </span>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
