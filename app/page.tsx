"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Settings, Eye, Building2, Check, X } from "lucide-react"
import { cn } from "@/lib/utils"

/* ── Types ── */
type Plan = "basic" | "medium" | "max"
type Field = "name" | "weight" | "species" | "gender"
type Role = "admin" | "staff" | "guest"
type View = "viewer" | "plan-admin" | "org-admin"

/* ── Constants ── */
const PLANS: Plan[] = ["basic", "medium", "max"]
const FIELDS: Field[] = ["name", "weight", "species", "gender"]
const ROLES: Role[] = ["admin", "staff", "guest"]

const DEFAULT_LABELS: Record<Field, string> = {
  name: "Name",
  weight: "Weight",
  species: "Species",
  gender: "Gender",
}

const ANIMAL = { name: "Luna", weight: "4.2 kg", species: "Felis catus", gender: "Female" }

const DEFAULT_PLAN_CONFIG: Record<Plan, Field[]> = {
  basic: ["name"],
  medium: ["name", "weight"],
  max: ["name", "weight", "species", "gender"],
}

/* Org config: per plan, per role, which fields are enabled (true) or disabled (false).
   By default admin gets all enabled, staff gets name/weight, guest gets only name. */
function buildDefaultOrgConfig(): Record<Plan, Record<Role, Record<Field, boolean>>> {
  const roleDefaults: Record<Role, Record<Field, boolean>> = {
    admin: { name: true, weight: true, species: true, gender: true },
    staff: { name: true, weight: true, species: false, gender: false },
    guest: { name: true, weight: false, species: false, gender: false },
  }
  return {
    basic: JSON.parse(JSON.stringify(roleDefaults)),
    medium: JSON.parse(JSON.stringify(roleDefaults)),
    max: JSON.parse(JSON.stringify(roleDefaults)),
  }
}

/* ── Component ── */
export default function Home() {
  const [view, setView] = useState<View>("viewer")

  // Plan admin state
  const [planConfig, setPlanConfig] = useState<Record<Plan, Field[]>>(DEFAULT_PLAN_CONFIG)
  const [labels, setLabels] = useState<Record<Field, string>>(DEFAULT_LABELS)

  // Org admin state
  const [orgConfig, setOrgConfig] = useState(buildDefaultOrgConfig)

  // Viewer state
  const [activePlan, setActivePlan] = useState<Plan>("basic")
  const [activeRole, setActiveRole] = useState<Role>("admin")

  function togglePlanField(plan: Plan, field: Field) {
    setPlanConfig((prev) => {
      const current = prev[plan]
      const has = current.includes(field)
      return { ...prev, [plan]: has ? current.filter((f) => f !== field) : [...current, field] }
    })
  }

  function toggleOrgField(plan: Plan, role: Role, field: Field) {
    setOrgConfig((prev) => ({
      ...prev,
      [plan]: {
        ...prev[plan],
        [role]: { ...prev[plan][role], [field]: !prev[plan][role][field] },
      },
    }))
  }

  // Fields visible in the selected plan
  const visibleFields = planConfig[activePlan]

  const NAV: { key: View; label: string; icon: React.ReactNode }[] = [
    { key: "viewer", label: "Viewer", icon: <Eye className="size-4" /> },
    { key: "plan-admin", label: "Plan Admin", icon: <Settings className="size-4" /> },
    { key: "org-admin", label: "Org Admin", icon: <Building2 className="size-4" /> },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Header ── */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-6">
          <span className="text-sm font-semibold">Feature Gate POC</span>
          <div className="flex gap-1">
            {NAV.map((item) => (
              <Button
                key={item.key}
                variant={view === item.key ? "default" : "ghost"}
                size="sm"
                onClick={() => setView(item.key)}
              >
                {item.icon}
                <span className="hidden sm:inline">{item.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-8">
        {/* ══════════ VIEWER ══════════ */}
        {view === "viewer" && (
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-xl font-bold text-balance">Animal Info</h1>
              <p className="text-sm text-muted-foreground">
                Pick a plan and role to preview what the user sees.
              </p>
            </div>

            {/* Pickers */}
            <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
              {/* Plan picker */}
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Plan
                </span>
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
              </div>

              {/* Role picker */}
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Role
                </span>
                <div className="flex gap-2">
                  {ROLES.map((role) => (
                    <button
                      key={role}
                      onClick={() => setActiveRole(role)}
                      className={cn(
                        "rounded-lg border px-4 py-2 text-sm font-medium capitalize transition-colors",
                        activeRole === role
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Animal fields */}
            <div className="rounded-xl border border-border bg-card p-1">
              {visibleFields.length === 0 ? (
                <p className="px-4 py-6 text-center text-sm text-muted-foreground">
                  No fields are enabled for this plan.
                </p>
              ) : (
                visibleFields.map((field) => {
                  const enabled = orgConfig[activePlan][activeRole][field]
                  return (
                    <div
                      key={field}
                      className={cn(
                        "flex items-center justify-between rounded-lg px-4 py-3 transition-opacity",
                        !enabled && "opacity-35"
                      )}
                    >
                      <span className="text-sm text-muted-foreground">{labels[field]}</span>
                      <div className="flex items-center gap-2">
                        <span className={cn("text-sm font-medium", enabled ? "text-foreground" : "text-muted-foreground line-through")}>
                          {ANIMAL[field]}
                        </span>
                        {!enabled && (
                          <Badge variant="outline" className="text-[10px] text-muted-foreground/60">
                            Disabled
                          </Badge>
                        )}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        )}

        {/* ══════════ PLAN ADMIN ══════════ */}
        {view === "plan-admin" && (
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-xl font-bold text-balance">Plan Admin</h1>
              <p className="text-sm text-muted-foreground">
                Toggle which fields each plan can see. Hidden fields won{"'"}t render at all.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {PLANS.map((plan) => (
                <div key={plan} className="rounded-xl border border-border bg-card">
                  <div className="border-b border-border px-4 py-3">
                    <h2 className="text-sm font-semibold capitalize">{plan}</h2>
                    <span className="text-xs text-muted-foreground">
                      {planConfig[plan].length}/{FIELDS.length} fields
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 p-2">
                    {FIELDS.map((field) => {
                      const on = planConfig[plan].includes(field)
                      return (
                        <div
                          key={field}
                          className="flex items-center justify-between gap-2 rounded-lg px-3 py-2 hover:bg-secondary/60"
                        >
                          <div className="flex items-center gap-2">
                            {on ? (
                              <Check className="size-3.5 shrink-0 text-primary" />
                            ) : (
                              <X className="size-3.5 shrink-0 text-muted-foreground/40" />
                            )}
                            <input
                              type="text"
                              value={labels[field]}
                              onChange={(e) =>
                                setLabels((prev) => ({ ...prev, [field]: e.target.value }))
                              }
                              className={cn(
                                "w-full rounded border border-transparent bg-transparent px-1.5 py-0.5 text-sm outline-none transition-colors focus:border-border focus:bg-secondary",
                                on ? "text-foreground" : "text-muted-foreground"
                              )}
                              aria-label={`Label for ${field}`}
                            />
                          </div>
                          <Switch
                            checked={on}
                            onCheckedChange={() => togglePlanField(plan, field)}
                            aria-label={`${labels[field]} in ${plan}`}
                          />
                        </div>
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
                      <td className="px-4 py-2.5 font-medium">{labels[field]}</td>
                      {PLANS.map((plan) => (
                        <td key={plan} className="px-4 py-2.5 text-center">
                          {planConfig[plan].includes(field) ? (
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

        {/* ══════════ ORG ADMIN ══════════ */}
        {view === "org-admin" && (
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-xl font-bold text-balance">Organization Admin</h1>
              <p className="text-sm text-muted-foreground">
                For each plan, control whether visible features are enabled or disabled per user
                role. Only fields turned on in Plan Admin appear here.
              </p>
            </div>

            {PLANS.map((plan) => {
              const planFields = planConfig[plan]
              return (
                <div key={plan} className="flex flex-col gap-3">
                  {/* Plan heading */}
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-semibold capitalize">{plan} Plan</h2>
                    <Badge variant="outline" className="text-xs text-muted-foreground">
                      {planFields.length} {planFields.length === 1 ? "field" : "fields"}
                    </Badge>
                  </div>

                  {planFields.length === 0 ? (
                    <p className="rounded-xl border border-border bg-card px-4 py-6 text-center text-sm text-muted-foreground">
                      No fields enabled for this plan. Toggle fields on in Plan Admin first.
                    </p>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-3">
                      {ROLES.map((role) => {
                        const enabledCount = planFields.filter(
                          (f) => orgConfig[plan][role][f]
                        ).length
                        return (
                          <div key={role} className="rounded-xl border border-border bg-card">
                            <div className="border-b border-border px-4 py-3">
                              <h3 className="text-sm font-semibold capitalize">{role}</h3>
                              <span className="text-xs text-muted-foreground">
                                {enabledCount}/{planFields.length} enabled
                              </span>
                            </div>
                            <div className="flex flex-col gap-1 p-2">
                              {planFields.map((field) => {
                                const enabled = orgConfig[plan][role][field]
                                return (
                                  <div
                                    key={field}
                                    className="flex items-center justify-between gap-2 rounded-lg px-3 py-2 hover:bg-secondary/60"
                                  >
                                    <div className="flex items-center gap-2">
                                      {enabled ? (
                                        <Check className="size-3.5 shrink-0 text-primary" />
                                      ) : (
                                        <X className="size-3.5 shrink-0 text-muted-foreground/40" />
                                      )}
                                      <span
                                        className={cn(
                                          "text-sm",
                                          enabled ? "text-foreground" : "text-muted-foreground"
                                        )}
                                      >
                                        {labels[field]}
                                      </span>
                                    </div>
                                    <Switch
                                      checked={enabled}
                                      onCheckedChange={() => toggleOrgField(plan, role, field)}
                                      aria-label={`${labels[field]} for ${role} in ${plan}`}
                                    />
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {/* Summary table per plan */}
                  {planFields.length > 0 && (
                    <div className="overflow-hidden rounded-xl border border-border bg-card">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="px-4 py-2.5 text-left text-xs font-medium uppercase text-muted-foreground">
                              Field
                            </th>
                            {ROLES.map((r) => (
                              <th
                                key={r}
                                className="px-4 py-2.5 text-center text-xs font-medium uppercase capitalize text-muted-foreground"
                              >
                                {r}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {planFields.map((field, i) => (
                            <tr
                              key={field}
                              className={
                                i < planFields.length - 1 ? "border-b border-border" : ""
                              }
                            >
                              <td className="px-4 py-2.5 font-medium">{labels[field]}</td>
                              {ROLES.map((role) => (
                                <td key={role} className="px-4 py-2.5 text-center">
                                  {orgConfig[plan][role][field] ? (
                                    <Badge className="bg-primary/15 text-primary border-primary/20">
                                      Enabled
                                    </Badge>
                                  ) : (
                                    <Badge
                                      variant="outline"
                                      className="text-muted-foreground/50"
                                    >
                                      Disabled
                                    </Badge>
                                  )}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
