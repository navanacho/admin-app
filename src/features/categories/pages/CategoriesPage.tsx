import { useEffect, useMemo, useRef, useState } from 'react'
import { Plus, FolderTree, Search, ChevronsUpDown, ChevronUp, ChevronDown } from 'lucide-react'

import { useCategories } from '../hooks/useCategories'
import { CategoryForm } from '../components/CategoryForm'
import { CategoryTreeNode } from '../components/CategoryTreeNode'

import { PageHeader }    from '@/shared/components/PageHeader'
import { KpiCard }       from '@/shared/components/KpiCard'
import { Modal }         from '@/shared/components/Modal'
import { ConfirmModal }  from '@/shared/components/ConfirmModal'
import { ButtonGeneric } from '@/shared/components/ButtonGeneric'
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue'
import type { SortDirection } from '@/shared/hooks/useSortable'

import type { Category, CategoryNode, CreateCategoryDto } from '../types'

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Construye el árbol recursivo a partir de la lista plana. */
function buildTree(
  categories: Category[],
  nameDirection: SortDirection = null,
): CategoryNode[] {
  const map = new Map<number, CategoryNode>()
  categories.forEach((c) => map.set(c.id, { ...c, children: [] }))

  const roots: CategoryNode[] = []
  categories.forEach((c) => {
    const node = map.get(c.id)!
    if (c.parent_id != null && map.has(c.parent_id)) {
      map.get(c.parent_id)!.children.push(node)
    } else {
      roots.push(node)
    }
  })

  const sortRecursive = (nodes: CategoryNode[]) => {
    if (nameDirection) {
      nodes.sort((a, b) => {
        const cmp = a.name.localeCompare(b.name, 'es', { sensitivity: 'base' })
        return nameDirection === 'asc' ? cmp : -cmp
      })
    } else {
      nodes.sort((a, b) => a.order_display - b.order_display)
    }
    nodes.forEach((n) => sortRecursive(n.children))
  }
  sortRecursive(roots)
  return roots
}

/** Devuelve los IDs del nodo + todos sus descendientes (para evitar ciclos al editar parent). */
function collectDescendants(rootId: number, all: Category[]): Set<number> {
  const result = new Set<number>([rootId])
  const collect = (id: number) => {
    all.filter((c) => c.parent_id === id).forEach((c) => {
      result.add(c.id)
      collect(c.id)
    })
  }
  collect(rootId)
  return result
}

// ── Componente ───────────────────────────────────────────────────────────────

export function CategoriesPage() {
  const {
    useCategoriesQuery,
    useCreateCategory,
    useUpdateCategory,
    useDeleteCategory,
    useActivateCategory,
  } = useCategories()

  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search, 300)
  const [nameSort, setNameSort] = useState<SortDirection>(null)

  const { data, isLoading, error } = useCategoriesQuery(0, 100, debouncedSearch || undefined)
  const { mutate: createCategory,     isPending: isCreating     } = useCreateCategory()
  const { mutate: updateCategory,     isPending: isUpdating     } = useUpdateCategory()
  const { mutate: deactivateCategory, isPending: isDeactivating } = useDeleteCategory()
  const { mutate: activateCategory,   isPending: isActivating   } = useActivateCategory()

  const categories = data?.data ?? []
  const total      = data?.total ?? 0

  // KPIs
  const activeCount = categories.filter((c) => c.is_active).length
  const rootCount   = categories.filter((c) => c.parent_id == null).length
  const subCount    = total - rootCount

  // Árbol memoizado — recalcula cuando cambia la dirección del sort
  const tree = useMemo(() => buildTree(categories, nameSort), [categories, nameSort])

  function toggleNameSort() {
    setNameSort((d) => (d === null ? 'asc' : d === 'asc' ? 'desc' : null))
  }
  const SortIcon =
    nameSort === 'asc' ? ChevronUp : nameSort === 'desc' ? ChevronDown : ChevronsUpDown

  // ── Estado de expansión ──────────────────────────────────────────────────
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set())
  const [hasInitializedExpansion, setHasInitializedExpansion] = useState(false)

  // Al cargar por primera vez, expandimos solo las raíces
  useEffect(() => {
    if (!hasInitializedExpansion && tree.length > 0) {
      setExpandedIds(new Set(tree.map((n) => n.id)))
      setHasInitializedExpansion(true)
    }
  }, [tree, hasInitializedExpansion])

  function toggleExpanded(id: number) {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else              next.add(id)
      return next
    })
  }

  // ── Modal Crear ───────────────────────────────────────────────────────────
  // Nonce para forzar remount del form en cada apertura → evita state stale.
  const createModalRef = useRef<HTMLDialogElement>(null)
  const [createInitialParentId, setCreateInitialParentId] = useState<number | null>(null)
  const [createNonce, setCreateNonce] = useState(0)

  function openCreateRoot() {
    setCreateInitialParentId(null)
    setCreateNonce((n) => n + 1)
    createModalRef.current?.showModal()
  }
  function openCreateChild(parent: CategoryNode) {
    setCreateInitialParentId(parent.id)
    setCreateNonce((n) => n + 1)
    // Asegurar que el padre esté expandido para que veas el resultado
    setExpandedIds((prev) => new Set(prev).add(parent.id))
    createModalRef.current?.showModal()
  }
  function handleCreate(dto: CreateCategoryDto) {
    createCategory(dto, {
      onSuccess: () => createModalRef.current?.close(),
    })
  }

  // ── Modal Editar ──────────────────────────────────────────────────────────
  const editModalRef = useRef<HTMLDialogElement>(null)
  const [editing, setEditing] = useState<Category | null>(null)
  const [editNonce, setEditNonce] = useState(0)

  function openEdit(node: Category) {
    setEditing(node)
    setEditNonce((n) => n + 1)
    editModalRef.current?.showModal()
  }
  function handleUpdate(dto: CreateCategoryDto) {
    if (!editing) return
    updateCategory(
      { id: editing.id, dto },
      { onSuccess: () => editModalRef.current?.close() },
    )
  }

  // ── Modal Confirmar desactivar ───────────────────────────────────────────
  const confirmModalRef = useRef<HTMLDialogElement>(null)
  const [toDeactivate, setToDeactivate] = useState<Category | null>(null)

  function openConfirmDeactivate(node: Category) {
    setToDeactivate(node)
    confirmModalRef.current?.showModal()
  }
  function handleDeactivate() {
    if (!toDeactivate) return
    deactivateCategory(toDeactivate.id, {
      onSuccess: () => confirmModalRef.current?.close(),
    })
  }

  // ── Parents disponibles para el form ─────────────────────────────────────
  // Al crear: todas las activas
  // Al editar: todas las activas excepto el nodo en edición y sus descendientes
  const availableParentsForCreate = useMemo(
    () => categories.filter((c) => c.is_active),
    [categories],
  )
  const availableParentsForEdit = useMemo(() => {
    if (!editing) return availableParentsForCreate
    const excluded = collectDescendants(editing.id, categories)
    return categories.filter((c) => c.is_active && !excluded.has(c.id))
  }, [editing, categories, availableParentsForCreate])

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-stack-lg">
      <PageHeader
        title="Categorías"
        subtitle="Organización jerárquica del catálogo de productos."
        action={
          <ButtonGeneric
            info={<><Plus size={16} aria-hidden="true" /> Nueva Categoría</>}
            onClick={openCreateRoot}
            disabled={!!error}
          />
        }
      />

      <div className="grid grid-cols-4 gap-stack-md">
        <KpiCard label="Total Categorías" value={total} />
        <KpiCard label="Activas"          value={activeCount} subLabel="En uso" />
        <KpiCard
          icon={<FolderTree size={13} aria-hidden="true" />}
          label="Raíz"
          value={rootCount}
          subLabel="Top-level"
        />
        <KpiCard label="Subcategorías" value={subCount} subLabel="Con padre" />
      </div>

      {/* Contenedor del árbol */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-md overflow-hidden">
        <div className="px-6 py-4 border-b border-outline-variant flex items-center justify-between gap-stack-md flex-wrap">
          <h2 className="text-headline-md text-on-surface">Árbol de Categorías</h2>

          <div className="flex items-center gap-stack-sm">
            <div className="relative">
              <Search
                size={14}
                aria-hidden="true"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar categoría…"
                className="w-64 bg-surface-container-low border border-outline-variant rounded-sm pl-9 pr-3 py-2 text-body-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary"
              />
            </div>
            <button
              type="button"
              onClick={toggleNameSort}
              className={`inline-flex items-center gap-1 text-label-caps px-2 py-2 rounded-sm border border-outline-variant hover:bg-surface-container transition-colors ${
                nameSort ? 'text-primary border-primary' : 'text-on-surface-variant'
              }`}
              aria-label="Ordenar por nombre"
            >
              NOMBRE <SortIcon size={12} aria-hidden="true" />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="px-6 py-12 text-center text-body-sm text-on-surface-variant">
            Cargando...
          </div>
        ) : tree.length === 0 ? (
          <div className="px-6 py-12 text-center text-body-sm text-on-surface-variant">
            No hay categorías. Creá la primera con "Nueva Categoría".
          </div>
        ) : (
          <div>
            {tree.map((node) => (
              <CategoryTreeNode
                key={node.id}
                node={node}
                depth={0}
                expandedIds={expandedIds}
                toggleExpanded={toggleExpanded}
                onAddChild={openCreateChild}
                onEdit={openEdit}
                onDeactivate={openConfirmDeactivate}
                onActivate={(n) => activateCategory(n.id)}
                isActivating={isActivating}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal — Crear */}
      <Modal dialogRef={createModalRef} title="Crear Categoría">
        <CategoryForm
          key={`create-${createInitialParentId ?? 'root'}-${createNonce}`}
          initialValues={{
            parent_id:     createInitialParentId,
            name:          '',
            description:   '',
            order_display: 1,
            image_url:     '',
          }}
          availableParents={availableParentsForCreate}
          onSubmit={handleCreate}
          onCancel={() => createModalRef.current?.close()}
          isPending={isCreating}
        />
      </Modal>

      {/* Modal — Editar */}
      <Modal dialogRef={editModalRef} title="Editar Categoría">
        <CategoryForm
          key={`edit-${editing?.id ?? 'none'}-${editNonce}`}
          initialValues={editing ? {
            parent_id:     editing.parent_id,
            name:          editing.name,
            description:   editing.description ?? '',
            order_display: editing.order_display,
            image_url:     editing.image_url ?? '',
          } : undefined}
          availableParents={availableParentsForEdit}
          onSubmit={handleUpdate}
          onCancel={() => editModalRef.current?.close()}
          isPending={isUpdating}
        />
      </Modal>

      {/* Modal — Confirmar desactivar */}
      <ConfirmModal
        dialogRef={confirmModalRef}
        title="Desactivar Categoría"
        message={
          <>
            ¿Desactivar <strong className="text-rb-bone">{toDeactivate?.name}</strong>?
            La categoría dejará de estar disponible pero podrá reactivarse.
            {toDeactivate && categories.some((c) => c.parent_id === toDeactivate.id && c.is_active) && (
              <span className="block mt-2 text-warning text-data-mono">
                ⚠ Esta categoría tiene subcategorías activas.
              </span>
            )}
          </>
        }
        confirmLabel="Desactivar"
        onConfirm={handleDeactivate}
        onCancel={() => confirmModalRef.current?.close()}
        isPending={isDeactivating}
      />
    </div>
  )
}
