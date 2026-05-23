// ─── Entidad principal ─────────────────────────────────────────────────────

export interface Category {
  id:            number
  parent_id:     number | null
  name:          string
  description:   string | null
  order_display: number
  image_url:     string | null
  is_active:     boolean
  created_at:    string
  updated_at:    string
  deleted_at:    string | null
}

// ─── Respuesta de lista ────────────────────────────────────────────────────

export interface CategoryList {
  data:  Category[]
  total: number
}

// ─── DTOs ──────────────────────────────────────────────────────────────────

export interface CreateCategoryDto {
  parent_id:     number | null
  name:          string
  description:   string | null
  order_display: number
  image_url:     string | null
}

export interface UpdateCategoryDto {
  parent_id?:     number | null
  name?:          string | null
  description?:   string | null
  order_display?: number | null
  image_url?:     string | null
}

// ─── Estructura recursiva para el árbol ────────────────────────────────────

export interface CategoryNode extends Category {
  children: CategoryNode[]
}
