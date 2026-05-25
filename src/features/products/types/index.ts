// ─── Vínculos m:m embebidos en el Product ─────────────────────────────────

export interface ProductCategoryLink {
  id:         number
  name:       string
  is_primary: boolean
}

export interface ProductIngredientLink {
  id:           number
  name:         string
  is_removable: boolean
  quantity:     number
  is_allergen:  boolean
}

// ─── Entidad principal ─────────────────────────────────────────────────────

export interface Product {
  id:             number
  name:           string
  description:    string | null
  stock_quantity: number
  /** Decimal serializado como string por Pydantic/JSON */
  base_price:     string
  image_urls:     string[]
  prep_time_min:  number | null
  available:      boolean
  created_at:     string
  updated_at:     string
  deleted_at:     string | null
  categories:     ProductCategoryLink[]
  ingredients:    ProductIngredientLink[]
}

export interface ProductList {
  total: number
  data:  Product[]
}

// ─── Inputs (para create/update) ──────────────────────────────────────────

export interface ProductCategoryInput {
  id:         number
  is_primary: boolean
}

export interface ProductIngredientInput {
  id:           number
  is_removable: boolean
  /** Cantidad de unidades del ingrediente que consume el producto. Default 1, min 1 — opcional porque el backend completa el default. */
  quantity?:    number
}

export interface CreateProductDto {
  name:           string
  description:    string | null
  stock_quantity: number
  /** Enviado como number; el backend lo convierte a Decimal */
  base_price:     number
  image_urls:     string[]
  prep_time_min:  number | null
  available:      boolean
  categories:     ProductCategoryInput[]
  ingredients:    ProductIngredientInput[]
}

export interface UpdateProductDto {
  name?:           string | null
  description?:    string | null
  base_price?:     number | null
  stock_quantity?: number | null
  image_urls?:     string[] | null
  prep_time_min?:  number | null
  available?:      boolean | null
  /** null = no tocar; array = reemplazar */
  categories?:     ProductCategoryInput[] | null
  ingredients?:    ProductIngredientInput[] | null
}
