import {
  Receipt,
  UtensilsCrossed,
  Refrigerator,
  LayoutGrid,
  Users,
  LayoutDashboard,
  UserCircle,
  ChefHat,
  Banknote,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { ButtonGeneric } from './ButtonGeneric'
import { usePermissions } from '@/shared/hooks/usePermissions'
import type { Permissions } from '@/shared/lib/permissions'

interface NavItem {
  label: string
  icon: LucideIcon
  to: string
  capability: keyof Permissions
}

const allNavItems: NavItem[] = [
  { label: 'Dashboard',    icon: LayoutDashboard, to: '/dashboard',   capability: 'canViewDashboard'     },
  { label: 'Pedidos',      icon: Receipt,         to: '/orders',      capability: 'canViewOrders'        },
  { label: 'Cocina',       icon: ChefHat,         to: '/cocina',      capability: 'canViewCocina'        },
  { label: 'Caja',         icon: Banknote,        to: '/cajero',      capability: 'canViewCajero'        },
  { label: 'Productos',    icon: UtensilsCrossed, to: '/products',    capability: 'canManageProducts'    },
  { label: 'Ingredientes', icon: Refrigerator,    to: '/ingredients', capability: 'canManageIngredients' },
  { label: 'Categorías',   icon: LayoutGrid,      to: '/categories',  capability: 'canManageCategories'  },
  { label: 'Usuarios',     icon: Users,           to: '/users',       capability: 'canManageUsers'       },
]

function linkClasses(isActive: boolean): string {
  const base = 'flex items-center gap-3 px-4 py-3 transition-colors duration-200'
  const active = 'border-l-4 border-primary bg-primary-container/10 text-rb-bone font-bold'
  const inactive = 'text-rb-bone/60 hover:text-rb-bone hover:bg-rb-bone/5'
  return `${base} ${isActive ? active : inactive}`
}

interface SidebarProps {
  activeItem?: string
}

export default function Sidebar({ activeItem = '' }: SidebarProps) {
  const navigate = useNavigate()
  const perms = usePermissions()

  const visibleItems = allNavItems.filter((item) => perms[item.capability])

  function goToProfile() {
    navigate('/profile')
  }

  return (
    <aside className="w-sidebar flex flex-col h-screen fixed left-0 top-0 z-40 shadow-xl bg-rb-ink py-gutter">

      {/* Logo / Brand */}
      <div className="px-6 mb-10">
        <h1 className="text-headline-md text-primary">ROCK 'N BURGER</h1>
        <p className="text-label-caps text-rb-bone/40 mt-1">ADMIN HQ</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1" aria-label="Primary">
        {visibleItems.map(({ label, icon: Icon, to }) => {
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

      {/* CTA — abrir perfil */}
      <div className="px-4 mt-auto">
        <ButtonGeneric
          info={<><UserCircle size={18} aria-hidden="true" /> PERFIL</>}
          type="Primary"
          onClick={goToProfile}
          extraClass="w-full justify-center"
        />
      </div>

    </aside>
  )
}
