import { useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Plus,
  Trash2,
  Power,
  PowerOff,
  UserCircle,
} from 'lucide-react'

import { useUsers } from '../hooks/useUsers'
import { RoleBadge } from '../components/RoleBadge'
import { AssignRoleForm } from '../components/AssignRoleForm'
import { UserOrdersSection } from '@/features/orders'
import { UserAddressesSection } from '@/features/addresses'

import { PageHeader } from '@/shared/components/PageHeader'
import { ButtonGeneric } from '@/shared/components/ButtonGeneric'
import { KpiCard } from '@/shared/components/KpiCard'
import { Modal } from '@/shared/components/Modal'
import { ConfirmModal } from '@/shared/components/ConfirmModal'

import type { AsignarRolDto } from '../types'

function formatId(id: number): string {
  return `#USR-${String(id).padStart(4, '0')}`
}

function formatDate(value: string): string {
  return new Date(value).toLocaleString('es-AR', {
    dateStyle: 'short',
    timeStyle: 'short',
  })
}

export function UserDetailPage() {
  const {
    useUserById,
    useActivateUser,
    useDeactivateUser,
    useAsignarRol,
    useQuitarRol,
  } = useUsers()

  const navigate = useNavigate()
  const { id: idParam } = useParams<{ id: string }>()
  const id = Number(idParam)
  const isValidId = !Number.isNaN(id) && id > 0

  const { data: user, isLoading, error } = useUserById(isValidId ? id : null)

  const { mutate: activate, isPending: isActivating } = useActivateUser()
  const { mutate: deactivate, isPending: isDeactivating } = useDeactivateUser()
  const { mutate: asignar, isPending: isAsignando } = useAsignarRol()
  const { mutate: quitar, isPending: isQuitando } = useQuitarRol()

  // ── Modal asignar rol ────────────────────────────────────────────────────
  const assignModalRef = useRef<HTMLDialogElement>(null)
  function handleAssign(dto: AsignarRolDto) {
    if (!user) return
    asignar(
      { id: user.id, dto },
      { onSuccess: () => assignModalRef.current?.close() },
    )
  }

  // ── Modal confirmar quitar rol ───────────────────────────────────────────
  const confirmRemoveRef = useRef<HTMLDialogElement>(null)
  const [roleToRemove, setRoleToRemove] = useState<string | null>(null)
  function openConfirmRemove(rolCode: string) {
    setRoleToRemove(rolCode)
    confirmRemoveRef.current?.showModal()
  }
  function handleRemoveRole() {
    if (!user || !roleToRemove) return
    quitar(
      { id: user.id, rolCode: roleToRemove },
      { onSuccess: () => confirmRemoveRef.current?.close() },
    )
  }

  // ── Modal confirmar deshabilitar ─────────────────────────────────────────
  const confirmDisableRef = useRef<HTMLDialogElement>(null)
  function handleToggleDisabled() {
    if (!user) return
    if (user.disabled) {
      activate(user.id)
    } else {
      confirmDisableRef.current?.showModal()
    }
  }
  function handleConfirmDisable() {
    if (!user) return
    deactivate(user.id, {
      onSuccess: () => confirmDisableRef.current?.close(),
    })
  }

  if (!isValidId) {
    return (
      <div className="flex flex-col gap-stack-lg">
        <PageHeader title="Usuario inválido" subtitle="El ID no es válido." />
        <ButtonGeneric
          info={
            <>
              <ArrowLeft size={16} aria-hidden="true" /> Volver
            </>
          }
          type="Secondary"
          onClick={() => navigate('/users')}
        />
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-stack-lg">
        <PageHeader title="Cargando usuario..." />
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="flex flex-col gap-stack-lg">
        <PageHeader
          title="No se pudo cargar el usuario"
          subtitle="Verificá el ID o tus permisos."
          action={
            <ButtonGeneric
              info={
                <>
                  <ArrowLeft size={16} aria-hidden="true" /> Volver
                </>
              }
              type="Secondary"
              onClick={() => navigate('/users')}
            />
          }
        />
      </div>
    )
  }

  const isTogglingDisabled = isActivating || isDeactivating

  return (
    <div className="flex flex-col gap-stack-lg">
      <PageHeader
        title={formatId(user.id)}
        subtitle={`${user.full_name} · @${user.username}`}
        action={
          <ButtonGeneric
            info={
              <>
                <ArrowLeft size={16} aria-hidden="true" /> Volver
              </>
            }
            type="Secondary"
            onClick={() => navigate('/users')}
          />
        }
      />

      <div className="grid grid-cols-3 gap-stack-md">
        <KpiCard
          icon={<UserCircle size={13} aria-hidden="true" />}
          label="Estado"
          value={user.disabled ? 'Deshabilitado' : 'Activo'}
        />
        <KpiCard label="Roles" value={user.roles.length} subLabel="Asignados" />
        <KpiCard label="Username" value={`@${user.username}`} />
      </div>

      <div className="grid grid-cols-3 gap-stack-lg">
        {/* ── Columna izquierda: info + roles ──────────────────────────────── */}
        <div className="col-span-2 flex flex-col gap-stack-lg">
          <section className="bg-surface-container-lowest border border-outline-variant rounded-md overflow-hidden">
            <header className="px-6 py-4 border-b border-outline-variant">
              <h2 className="text-headline-md text-on-surface">Información</h2>
            </header>
            <div className="p-6 grid grid-cols-2 gap-stack-md">
              <div>
                <p className="text-label-caps text-on-surface-variant">Nombre completo</p>
                <p className="text-body-sm text-primary mt-1">{user.full_name}</p>
              </div>
              <div>
                <p className="text-label-caps text-on-surface-variant">Username</p>
                <p className="text-data-mono text-primary mt-1">@{user.username}</p>
              </div>
              <div className="col-span-2">
                <p className="text-label-caps text-on-surface-variant">Email</p>
                <p className="text-data-mono text-primary mt-1">{user.email}</p>
              </div>
            </div>
          </section>

          <section className="bg-surface-container-lowest border border-outline-variant rounded-md overflow-hidden">
            <header className="flex items-center justify-between px-6 py-4 border-b border-outline-variant">
              <h2 className="text-headline-md text-on-surface">Roles asignados</h2>
              <button
                type="button"
                onClick={() => assignModalRef.current?.showModal()}
                className="flex items-center gap-1.5 text-label-caps text-primary hover:text-rb-red-hover transition-colors"
              >
                <Plus size={14} aria-hidden="true" /> Asignar rol
              </button>
            </header>
            <div className="p-6">
              {user.roles.length === 0 ? (
                <p className="text-body-sm text-on-surface-variant">
                  Sin roles asignados. El usuario es un cliente regular.
                </p>
              ) : (
                <ul className="flex flex-col gap-stack-sm">
                  {user.roles.map((r) => (
                    <li
                      key={r.rol_code}
                      className="flex items-center justify-between border border-outline-variant rounded-sm px-4 py-3"
                    >
                      <div className="flex items-center gap-stack-md">
                        <RoleBadge code={r.rol_code} />
                        <div className="flex flex-col">
                          <span className="text-data-mono text-on-surface-variant text-[11px]">
                            Asignado el {formatDate(r.created_at)}
                          </span>
                          {r.expires_at && (
                            <span className="text-data-mono text-warning text-[11px]">
                              Expira el {formatDate(r.expires_at)}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => openConfirmRemove(r.rol_code)}
                        disabled={isQuitando}
                        className="p-1.5 text-on-surface-variant hover:text-danger rounded-sm hover:bg-danger/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label={`Quitar rol ${r.rol_code}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          <UserAddressesSection usuarioId={user.id} />

          <UserOrdersSection usuarioId={user.id} />
        </div>

        {/* ── Columna derecha: control de cuenta ───────────────────────────── */}
        <aside className="flex flex-col gap-stack-lg">
          <section className="bg-surface-container-lowest border border-outline-variant rounded-md overflow-hidden">
            <header className="px-6 py-4 border-b border-outline-variant">
              <h2 className="text-headline-md text-on-surface">Control de cuenta</h2>
            </header>
            <div className="p-6 flex flex-col gap-stack-md">
              <p className="text-body-sm text-on-surface-variant">
                {user.disabled
                  ? 'La cuenta está deshabilitada. El usuario no puede iniciar sesión.'
                  : 'La cuenta está activa. Podés deshabilitarla para bloquear el acceso.'}
              </p>
              <ButtonGeneric
                info={
                  user.disabled ? (
                    <>
                      <Power size={16} aria-hidden="true" />{' '}
                      {isTogglingDisabled ? 'Habilitando...' : 'Habilitar cuenta'}
                    </>
                  ) : (
                    <>
                      <PowerOff size={16} aria-hidden="true" />{' '}
                      {isTogglingDisabled ? 'Deshabilitando...' : 'Deshabilitar cuenta'}
                    </>
                  )
                }
                type={user.disabled ? 'Primary' : 'Secondary'}
                onClick={handleToggleDisabled}
                disabled={isTogglingDisabled}
                extraClass="w-full justify-center"
              />
            </div>
          </section>
        </aside>
      </div>

      {/* Modal — Asignar rol */}
      <Modal dialogRef={assignModalRef} title={`Asignar rol a ${user.username}`}>
        <AssignRoleForm
          existingRoleCodes={user.roles.map((r) => r.rol_code)}
          onSubmit={handleAssign}
          onCancel={() => assignModalRef.current?.close()}
          isPending={isAsignando}
        />
      </Modal>

      {/* Modal — Confirmar quitar rol */}
      <ConfirmModal
        dialogRef={confirmRemoveRef}
        title="Quitar rol"
        message={
          <>
            ¿Quitar el rol <strong className="text-rb-bone">{roleToRemove}</strong> a{' '}
            <strong className="text-rb-bone">{user.username}</strong>?
          </>
        }
        confirmLabel="Quitar"
        onConfirm={handleRemoveRole}
        onCancel={() => confirmRemoveRef.current?.close()}
        isPending={isQuitando}
      />

      {/* Modal — Confirmar deshabilitar */}
      <ConfirmModal
        dialogRef={confirmDisableRef}
        title="Deshabilitar cuenta"
        message={
          <>
            ¿Deshabilitar la cuenta de{' '}
            <strong className="text-rb-bone">{user.username}</strong>? El usuario no
            podrá iniciar sesión hasta que se habilite nuevamente.
          </>
        }
        confirmLabel="Deshabilitar"
        onConfirm={handleConfirmDisable}
        onCancel={() => confirmDisableRef.current?.close()}
        isPending={isDeactivating}
      />
    </div>
  )
}
