import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, Users as UsersIcon, ShieldCheck, UserX } from 'lucide-react'

import { useUsers } from '../hooks/useUsers'
import { RoleBadge } from '../components/RoleBadge'

import { PageHeader } from '@/shared/components/PageHeader'
import { KpiCard } from '@/shared/components/KpiCard'
import { EntityTable } from '@/shared/components/EntityTable'

const LIMIT = 10

function formatId(id: number): string {
  return `#USR-${String(id).padStart(4, '0')}`
}

function currentPage(offset: number, limit: number): number {
  return Math.floor(offset / limit) + 1
}

export function UsersPage() {
  const { useUsersQuery } = useUsers()
  const navigate = useNavigate()
  const [offset, setOffset] = useState(0)

  const { data: users = [], isLoading } = useUsersQuery()

  const total = users.length
  const activeCount = users.filter((u) => !u.disabled).length
  const adminCount = users.filter((u) =>
    u.roles.some((r) => r.rol_code === 'ADMIN'),
  ).length

  // Paginación client-side — el endpoint devuelve todo el listado.
  const paged = useMemo(() => users.slice(offset, offset + LIMIT), [users, offset])

  const hasPrev = offset > 0
  const hasNext = offset + LIMIT < total
  function goNext() {
    setOffset((o) => o + LIMIT)
  }
  function goPrev() {
    setOffset((o) => Math.max(0, o - LIMIT))
  }

  function goToDetail(id: number) {
    navigate(`/users/${id}`)
  }

  return (
    <div className="flex flex-col gap-stack-lg">
      <PageHeader
        title="Usuarios"
        subtitle="Listado de cuentas registradas, roles y estado."
      />

      <div className="grid grid-cols-3 gap-stack-md">
        <KpiCard
          icon={<UsersIcon size={13} aria-hidden="true" />}
          label="Total Usuarios"
          value={total}
        />
        <KpiCard
          label="Activos"
          value={activeCount}
          subLabel="No deshabilitados"
        />
        <KpiCard
          icon={<ShieldCheck size={13} aria-hidden="true" />}
          label="Con rol ADMIN"
          value={adminCount}
          subLabel="Acceso total"
        />
      </div>

      <EntityTable
        title={`Cuentas — Página ${currentPage(offset, LIMIT)}`}
        isLoading={isLoading}
        isEmpty={paged.length === 0}
        entityLabel="usuarios"
        pagination={{
          startIndex: total === 0 ? 0 : offset + 1,
          endIndex: Math.min(offset + LIMIT, total),
          total,
          hasPrev,
          hasNext,
          goNext,
          goPrev,
        }}
        thead={
          <tr>
            <th className="px-6 py-3 text-left text-label-caps text-on-surface-variant w-32">ID</th>
            <th className="px-6 py-3 text-left text-label-caps text-on-surface-variant">USERNAME</th>
            <th className="px-6 py-3 text-left text-label-caps text-on-surface-variant">NOMBRE COMPLETO</th>
            <th className="px-6 py-3 text-left text-label-caps text-on-surface-variant">EMAIL</th>
            <th className="px-6 py-3 text-left text-label-caps text-on-surface-variant">ROLES</th>
            <th className="px-6 py-3 text-left text-label-caps text-on-surface-variant">ESTADO</th>
            <th className="px-6 py-3 text-right text-label-caps text-on-surface-variant">ACCIONES</th>
          </tr>
        }
      >
        {paged.map((user) => (
          <tr
            key={user.id}
            onClick={() => goToDetail(user.id)}
            className={`border-b border-outline-variant last:border-0 transition-colors cursor-pointer ${
              user.disabled
                ? 'opacity-50 hover:opacity-70'
                : 'hover:bg-surface-container'
            }`}
          >
            <td className="px-6 py-4">
              <span className="text-data-mono text-primary">{formatId(user.id)}</span>
            </td>
            <td className="px-6 py-4">
              <span className="font-sans font-semibold text-body-sm text-on-surface">
                {user.username}
              </span>
            </td>
            <td className="px-6 py-4">
              <span className="text-body-sm text-on-surface-variant">
                {user.full_name}
              </span>
            </td>
            <td className="px-6 py-4">
              <span className="text-data-mono text-on-surface-variant">
                {user.email}
              </span>
            </td>
            <td className="px-6 py-4">
              <div className="flex flex-wrap gap-1">
                {user.roles.length === 0 ? (
                  <span className="text-body-sm text-on-surface-variant">—</span>
                ) : (
                  user.roles.map((r) => <RoleBadge key={r.rol_code} code={r.rol_code} />)
                )}
              </div>
            </td>
            <td className="px-6 py-4">
              {user.disabled ? (
                <span className="text-label-caps text-danger inline-flex items-center gap-1">
                  <UserX size={13} aria-hidden="true" /> Deshabilitado
                </span>
              ) : (
                <span className="text-label-caps text-success">Activo</span>
              )}
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center justify-end gap-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    goToDetail(user.id)
                  }}
                  className="p-1.5 text-on-surface-variant hover:text-on-surface rounded-sm hover:bg-surface-container-high transition-colors"
                  aria-label={`Ver detalle de ${user.username}`}
                >
                  <Eye size={15} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </EntityTable>
    </div>
  )
}
