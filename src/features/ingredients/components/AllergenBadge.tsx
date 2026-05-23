interface AllergenBadgeProps {
  isAllergen: boolean
}

/**
 * Badge que indica si un ingrediente contiene alérgenos.
 * true  → pill warning "ALÉRGENO"
 * false → pill success "SIN ALÉRGENO"
 */
export function AllergenBadge({ isAllergen }: AllergenBadgeProps) {
  if (isAllergen) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-label-caps bg-warning/10 text-warning">
        <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-warning" aria-hidden="true" />
        ALÉRGENO
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-label-caps bg-success/10 text-success">
      <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-success" aria-hidden="true" />
      SIN ALÉRGENO
    </span>
  )
}
