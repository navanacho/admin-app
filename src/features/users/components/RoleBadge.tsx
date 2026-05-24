const ROLE_STYLES: Record<string, string> = {
  ADMIN:   'bg-primary text-on-primary',
  STOCK:   'bg-rb-bone/15 text-rb-bone',
  PEDIDOS: 'bg-success/15 text-success',
}

const ROLE_DEFAULT = 'bg-surface-container text-on-surface-variant'

interface RoleBadgeProps {
  code: string
}

export function RoleBadge({ code }: RoleBadgeProps) {
  const cls = ROLE_STYLES[code] ?? ROLE_DEFAULT
  return (
    <span className={`text-label-caps px-2 py-1 rounded-sm ${cls}`}>{code}</span>
  )
}
