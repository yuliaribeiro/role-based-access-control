"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

export type PlanType = "basic" | "medium" | "max"
export type FeatureField = "name" | "weight" | "species" | "gender"

export const ALL_PLANS: PlanType[] = ["basic", "medium", "max"]
export const ALL_FIELDS: FeatureField[] = ["name", "weight", "species", "gender"]

export const FIELD_LABELS: Record<FeatureField, string> = {
  name: "Animal Name",
  weight: "Animal Weight",
  species: "Animal Species",
  gender: "Animal Gender",
}

export const PLAN_LABELS: Record<PlanType, string> = {
  basic: "Basic",
  medium: "Medium",
  max: "Max",
}

export type PlanConfig = Record<PlanType, FeatureField[]>

const DEFAULT_CONFIG: PlanConfig = {
  basic: ["name"],
  medium: ["name", "weight"],
  max: ["name", "weight", "species", "gender"],
}

interface PlanContextValue {
  config: PlanConfig
  toggleFieldInPlan: (plan: PlanType, field: FeatureField) => void
  isFieldInPlan: (plan: PlanType, field: FeatureField) => boolean
  getFieldsForPlan: (plan: PlanType) => FeatureField[]
  resetToDefaults: () => void
}

const PlanContext = createContext<PlanContextValue | null>(null)

export function PlanProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<PlanConfig>(DEFAULT_CONFIG)

  const toggleFieldInPlan = useCallback((plan: PlanType, field: FeatureField) => {
    setConfig((prev) => {
      const current = prev[plan]
      const has = current.includes(field)
      return {
        ...prev,
        [plan]: has ? current.filter((f) => f !== field) : [...current, field],
      }
    })
  }, [])

  const isFieldInPlan = useCallback(
    (plan: PlanType, field: FeatureField) => config[plan].includes(field),
    [config]
  )

  const getFieldsForPlan = useCallback(
    (plan: PlanType) => config[plan],
    [config]
  )

  const resetToDefaults = useCallback(() => {
    setConfig(DEFAULT_CONFIG)
  }, [])

  return (
    <PlanContext.Provider
      value={{ config, toggleFieldInPlan, isFieldInPlan, getFieldsForPlan, resetToDefaults }}
    >
      {children}
    </PlanContext.Provider>
  )
}

export function usePlanConfig() {
  const ctx = useContext(PlanContext)
  if (!ctx) throw new Error("usePlanConfig must be used within a PlanProvider")
  return ctx
}
