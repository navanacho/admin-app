// ─── Entidad principal ─────────────────────────────────────────────────────

export interface Ingredient {
  id:          number
  name:        string
  description: string | null
  is_allergen: boolean
  is_active:   boolean
  created_at:  string
  updated_at:  string
  deleted_at:  string | null
}

// ─── Respuesta de lista ────────────────────────────────────────────────────

export interface IngredientList {
  data:  Ingredient[]
  total: number
}

// ─── DTOs ──────────────────────────────────────────────────────────────────

export interface CreateIngredientDto {
  name:        string
  description: string | null
  is_allergen: boolean
}

export interface UpdateIngredientDto {
  name?:        string | null
  description?: string | null
  is_allergen?: boolean | null
}
