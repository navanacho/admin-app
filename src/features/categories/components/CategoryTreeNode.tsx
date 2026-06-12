import { ChevronRight, ChevronDown, Pencil, PowerOff, Power, Plus } from 'lucide-react'
import type { CategoryNode } from '../types'

interface CategoryTreeNodeProps {
  node: CategoryNode
  depth: number
  expandedIds: Set<number>
  toggleExpanded: (id: number) => void
  onAddChild: (parent: CategoryNode) => void
  onEdit: (node: CategoryNode) => void
  onDeactivate: (node: CategoryNode) => void
  onActivate: (node: CategoryNode) => void
  isActivating: boolean
}

function formatId(id: number): string {
  return `#CAT-${String(id).padStart(3, '0')}`
}

/**
 * Nodo recursivo del árbol de categorías.
 * Renderiza la fila del nodo y, si está expandido, sus hijos indentados.
 */
export function CategoryTreeNode({
  node,
  depth,
  expandedIds,
  toggleExpanded,
  onAddChild,
  onEdit,
  onDeactivate,
  onActivate,
  isActivating,
}: CategoryTreeNodeProps) {
  const hasChildren = node.children.length > 0
  const isExpanded  = expandedIds.has(node.id)

  return (
    <>
      <div
        className={`flex items-center gap-stack-md px-6 py-3 border-b border-outline-variant transition-colors ${
          node.is_active
            ? 'hover:bg-surface-container'
            : 'opacity-50 hover:opacity-70'
        }`}
        style={{ paddingLeft: `${24 + depth * 28}px` }}
      >
        {/* Chevron — espacio reservado aunque no tenga hijos para alinear */}
        <button
          type="button"
          onClick={() => hasChildren && toggleExpanded(node.id)}
          disabled={!hasChildren}
          className="w-5 h-5 flex items-center justify-center text-on-surface-variant hover:text-on-surface disabled:opacity-0 disabled:cursor-default"
          aria-label={isExpanded ? 'Colapsar' : 'Expandir'}
        >
          {isExpanded
            ? <ChevronDown size={16} />
            : <ChevronRight size={16} />}
        </button>

        {/* ID */}
        <span className="text-data-mono text-primary w-20 shrink-0">
          {formatId(node.id)}
        </span>

        {/* Imagen thumbnail */}
        {node.image_url ? (
          <div className="w-10 h-10 rounded-sm overflow-hidden shrink-0 bg-surface-container-high">
            <img
              src={node.image_url}
              alt={node.name}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-sm shrink-0 bg-surface-container-high flex items-center justify-center">
            <span className="text-xs font-display text-on-surface-variant/20">
              {node.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        {/* Nombre + descripción */}
        <div className="flex-1 min-w-0">
          <div className="font-sans font-semibold text-body-sm text-on-surface">
            {node.name}
          </div>
          {node.description && (
            <div className="text-body-sm text-on-surface-variant line-clamp-1">
              {node.description}
            </div>
          )}
        </div>

        {/* Estado */}
        <span className={`text-label-caps shrink-0 ${
          node.is_active ? 'text-success' : 'text-danger'
        }`}>
          {node.is_active ? 'Activo' : 'Inactivo'}
        </span>

        {/* Acciones */}
        <div className="flex items-center gap-1 shrink-0">
          {/* + Subcategoría — solo si está activa */}
          <button
            type="button"
            onClick={() => onAddChild(node)}
            disabled={!node.is_active}
            className="p-1.5 text-on-surface-variant hover:text-primary rounded-sm hover:bg-primary/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label={`Agregar subcategoría de ${node.name}`}
            title="Agregar subcategoría"
          >
            <Plus size={15} />
          </button>

          {/* Editar — solo si está activa */}
          <button
            type="button"
            onClick={() => onEdit(node)}
            disabled={!node.is_active}
            className="p-1.5 text-on-surface-variant hover:text-on-surface rounded-sm hover:bg-surface-container transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label={`Editar ${node.name}`}
          >
            <Pencil size={15} />
          </button>

          {/* Desactivar / Activar */}
          {node.is_active ? (
            <button
              type="button"
              onClick={() => onDeactivate(node)}
              className="p-1.5 text-on-surface-variant hover:text-danger rounded-sm hover:bg-danger/10 transition-colors"
              aria-label={`Desactivar ${node.name}`}
            >
              <PowerOff size={15} />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onActivate(node)}
              disabled={isActivating}
              className="p-1.5 text-on-surface-variant hover:text-success rounded-sm hover:bg-success/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label={`Activar ${node.name}`}
            >
              <Power size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Hijos recursivos */}
      {isExpanded && node.children.map((child) => (
        <CategoryTreeNode
          key={child.id}
          node={child}
          depth={depth + 1}
          expandedIds={expandedIds}
          toggleExpanded={toggleExpanded}
          onAddChild={onAddChild}
          onEdit={onEdit}
          onDeactivate={onDeactivate}
          onActivate={onActivate}
          isActivating={isActivating}
        />
      ))}
    </>
  )
}
