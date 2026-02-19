"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Settings, Eye, Lock, Check, X } from "lucide-react"
import { cn } from "@/lib/utils"

type Plan = "basic" | "medium" | "max"
type Field = "name" | "weight" | "species" | "gender"

const PLANS: Plan[] = ["basic", "medium", "max"]
const FIELDS: Field[] = ["name", "weight", "species", "gender"]
const FIELD_LABELS: Record<Field, string> = {
  name: "Name",
  weight: "Weight",
  species: "Species",
  gender: "Gender",
}

const ANIMAL = { name: "Luna", weight: "4.2 kg", species: "Felis catus", gender: "Female" }

const DEFAULT_CONFIG: Record<Plan, Field[]> = {
  basic: ["name"],
  medium: ["name", "weight"],
  max: ["name", "weight", "species", "gender"],
}

export default function Home() {
  const [view, setView] = useState<"viewer" | "admin">("viewer")
  const [config, setConfig] = useState<Record<Plan, Field[]>>(DEFAULT_CONFIG)
  const [activePlan, setActivePlan] = useState<Plan>("basic")

  function toggle(plan: Plan, field: Field) {
    setConfig((prev) => {
      const current = prev[plan]
      const has = current.includes(field)
      return { ...prev, [plan]: has ? current.filter((f) => f !== field) : [...current, field] }
    })
  }

  const visibleFields = config[activePlan]

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-6">
          <span className="text-sm font-semibold">Feature Gate POC</span>
          <div className="flex gap-1">
            <Button
              variant={view === "viewer" ? "default" : "ghost"}
              size="sm"
              onClick={() => setView("viewer")}
            >
              <Eye className="size-4" />
              Viewer
            </Button>
            <Button
              variant={view === "admin" ? "default" : "ghost"}
              size="sm"
              onClick={() => setView("admin")}
            >
              <Settings className="size-4" />
              Admin
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-8">
        {view === "viewer" ? (
          /* ───── VIEWER ───── */
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-xl font-bold">Animal Info</h1>
              <p className="text-sm text-muted-foreground">
                Pick a plan to see which fields are visible.
              </p>
            </div>

            {/* Plan picker */}
            <div className="flex gap-2">
              {PLANS.map((plan) => (
                <button
                  key={plan}
                  onClick={() => setActivePlan(plan)}
                  className={cn(
                    "rounded-lg border px-4 py-2 text-sm font-medium capitalize transition-colors",
                    activePlan === plan
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:text-foreground"
                  )}
                >
                  {plan}
                </button>
              ))}
            </div>

            {/* Animal fields */}
            <div className="rounded-xl border border-border bg-card p-1">
              {FIELDS.map((field) => {
                const visible = visibleFields.includes(field)
                return (
                  <div
                    key={field}
                    className="flex items-center justify-between rounded-lg px-4 py-3"
                  >
                    <span className="text-sm text-muted-foreground">{FIELD_LABELS[field]}</span>
                    {visible ? (
                      <span className="text-sm font-medium text-foreground">{ANIMAL[field]}</span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground/50">
                        <Lock className="size-3" />
                        Hidden
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          /* ───── ADMIN ───── */
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-xl font-bold">Plan Admin</h1>
              <p className="text-sm text-muted-foreground">
                Toggle which fields each plan can see.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {PLANS.map((plan) => (
                <div key={plan} className="rounded-xl border border-border bg-card">
                  <div className="border-b border-border px-4 py-3">
                    <h2 className="text-sm font-semibold capitalize">{plan}</h2>
                    <span className="text-xs text-muted-foreground">
                      {config[plan].length}/{FIELDS.length} fields
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 p-2">
                    {FIELDS.map((field) => {
                      const on = config[plan].includes(field)
                      return (
                        <label
                          key={field}
                          className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 hover:bg-secondary/60"
                        >
                          <div className="flex items-center gap-2">
                            {on ? (
                              <Check className="size-3.5 text-primary" />
                            ) : (
                              <X className="size-3.5 text-muted-foreground/40" />
                            )}
                            <span className={cn("text-sm", on ? "text-foreground" : "text-muted-foreground")}>
                              {FIELD_LABELS[field]}
                            </span>
                          </div>
                          <Switch
                            checked={on}
                            onCheckedChange={() => toggle(plan, field)}
                            aria-label={`${FIELD_LABELS[field]} in ${plan}`}
                          />
                        </label>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-2.5 text-left text-xs font-medium uppercase text-muted-foreground">
                      Field
                    </th>
                    {PLANS.map((p) => (
                      <th key={p} className="px-4 py-2.5 text-center text-xs font-medium uppercase text-muted-foreground">
                        {p}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {FIELDS.map((field, i) => (
                    <tr key={field} className={i < FIELDS.length - 1 ? "border-b border-border" : ""}>
                      <td className="px-4 py-2.5 font-medium">{FIELD_LABELS[field]}</td>
                      {PLANS.map((plan) => (
                        <td key={plan} className="px-4 py-2.5 text-center">
                          {config[plan].includes(field) ? (
                            <Badge className="bg-primary/15 text-primary border-primary/20">On</Badge>
                          ) : (
                            <Badge variant="outline" className="text-muted-foreground/50">Off</Badge>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
