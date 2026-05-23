import { Receipt, UtensilsCrossed, Refrigerator, LayoutGrid, Plus } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

interface NavItem {
  label: string
  icon: LucideIcon
  to: string
}

const navItems: NavItem[] = [
  { label: 'Orders',      icon: Receipt         , to:"/orders"},
  { label: 'Products',    icon: UtensilsCrossed , to:"/products"},
  { label: 'Ingredients', icon: Refrigerator    , to:"/ingredients"},
  { label: 'Categories',  icon: LayoutGrid      , to:"/categories"},
]

function linkClasses(isActive: boolean): string {
  const base = 'flex items-center gap-3 px-4 py-3 transition-colors duration-200'
  const active = 'border-l-4 border-primary bg-primary-container/10 text-rb-bone font-bold'
  const inactive = 'text-rb-bone/60 hover:text-rb-bone hover:bg-rb-bone/5'
  return `${base} ${isActive ? active : inactive}`
}

interface SidebarProps {
  activeItem?: string
  onNewOrder?: () => void
}

export default function Sidebar({ activeItem = 'Orders', onNewOrder }: SidebarProps) {
  return (
    <aside className="w-sidebar flex flex-col h-screen fixed left-0 top-0 z-40 shadow-xl bg-rb-ink py-gutter">

      {/* Logo / Brand */}
      <div className="px-6 mb-10">
        <h1 className="text-headline-md text-primary">ROCK 'N BURGER</h1>
        <p className="text-label-caps text-rb-bone/40 mt-1">ADMIN HQ</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1" aria-label="Primary">
        {navItems.map(({ label, icon: Icon, to }) => {
          const isActive = label === activeItem
          return (
            <Link
              key={label}
              to={to}
              className={linkClasses(isActive)}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon size={20} aria-hidden="true" />
              <span className="font-sans text-body-md">{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* CTA New Order */}
      <div className="px-4 mt-auto">
        <button
          type="button"
          onClick={onNewOrder}
          className="w-full py-4 bg-primary text-on-primary text-label-caps rounded-md shadow-red-glow flex items-center justify-center gap-2 hover:bg-primary-container transition-colors"
        >
          <Plus size={18} aria-hidden="true" />
          NEW ORDER
        </button>
      </div>

    </aside>
  )
}
