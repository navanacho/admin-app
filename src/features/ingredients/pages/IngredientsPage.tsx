import { useEffect, useRef, useState } from "react";
import { Plus, Pencil, PowerOff, Power, AlertTriangle, Search } from "lucide-react";

import { useIngredients } from "../hooks/useIngredients";
import { AllergenBadge } from "../components/AllergenBadge";
import { IngredientForm } from "../components/IngredientForm";
import { IngredientLowStockSection } from "../components/IngredientLowStockSection";

import { PageHeader }    from "@/shared/components/PageHeader";
import { KpiCard }       from "@/shared/components/KpiCard";
import { EntityTable }   from "@/shared/components/EntityTable";
import { Modal }         from "@/shared/components/Modal";
import { ConfirmModal }  from "@/shared/components/ConfirmModal";
import { ButtonGeneric } from "@/shared/components/ButtonGeneric";
import { SortableTh }    from "@/shared/components/SortableTh";
import { useSortable }   from "@/shared/hooks/useSortable";
import { useDebouncedValue } from "@/shared/hooks/useDebouncedValue";
import type { Ingredient, CreateIngredientDto } from "../types";

const LIMIT = 10;

function formatId(id: number): string {
  return `#ING-${String(id).padStart(3, "0")}`;
}

function currentPage(offset: number, limit: number): number {
  return Math.floor(offset / limit) + 1;
}

export function IngredientsPage() {
  const {
    useIngredientsQuery,
    useDeleteIngredient,
    useActivateIngredient,
    useCreateIngredient,
    useUpdateIngredient,
  } = useIngredients();

  const [offset, setOffset] = useState(0);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);

  // Reset paginación cuando cambia el filtro
  useEffect(() => {
    setOffset(0);
  }, [debouncedSearch]);

  const { data, isLoading, error } = useIngredientsQuery(
    offset,
    LIMIT,
    debouncedSearch || undefined,
  );
  const { mutate: deactivateIngredient, isPending: isDeactivating } = useDeleteIngredient();
  const { mutate: activateIngredient,   isPending: isActivating   } = useActivateIngredient();
  const { mutate: createIngredient,     isPending: isCreating     } = useCreateIngredient();
  const { mutate: updateIngredient,     isPending: isUpdating     } = useUpdateIngredient();

  const ingredients = data?.data ?? [];
  const total       = data?.total ?? 0;

  const { sorted: sortedIngredients, sortKey, direction, toggle } = useSortable<Ingredient>(ingredients);

  const allergenCount  = ingredients.filter((i) => i.is_allergen).length;
  const activeCount    = ingredients.filter((i) => i.is_active).length;
  const lowStockCount  = ingredients.filter(
    (i) => i.is_active && i.stock_quantity < 10,
  ).length;

  const hasPrev = offset > 0;
  const hasNext = offset + LIMIT < total;

  function goNext() { setOffset((o) => o + LIMIT); }
  function goPrev() { setOffset((o) => Math.max(0, o - LIMIT)); }

  // ── Modal crear ───────────────────────────────────────────────────────────
  // Nonce para remount del form en cada apertura → evita arrastrar state.
  const createModalRef = useRef<HTMLDialogElement>(null);
  const [createNonce, setCreateNonce] = useState(0);

  function openCreate() {
    setCreateNonce((n) => n + 1);
    createModalRef.current?.showModal();
  }

  function handleCreate(dto: CreateIngredientDto) {
    createIngredient(dto, {
      onSuccess: () => createModalRef.current?.close(),
    });
  }

  // ── Modal editar ──────────────────────────────────────────────────────────
  const editModalRef = useRef<HTMLDialogElement>(null);
  const [editing, setEditing] = useState<Ingredient | null>(null);
  const [editNonce, setEditNonce] = useState(0);

  function openEdit(ingredient: Ingredient) {
    setEditing(ingredient);
    setEditNonce((n) => n + 1);
    editModalRef.current?.showModal();
  }

  function handleUpdate(dto: CreateIngredientDto) {
    if (!editing) return;
    updateIngredient(
      { id: editing.id, dto },
      { onSuccess: () => editModalRef.current?.close() },
    );
  }

  // ── Modal confirmar desactivar ────────────────────────────────────────────
  const confirmModalRef = useRef<HTMLDialogElement>(null);
  const [toDeactivate, setToDeactivate] = useState<Ingredient | null>(null);

  function openConfirmDeactivate(ingredient: Ingredient) {
    setToDeactivate(ingredient);
    confirmModalRef.current?.showModal();
  }

  function handleDeactivate() {
    if (!toDeactivate) return;
    deactivateIngredient(toDeactivate.id, {
      onSuccess: () => confirmModalRef.current?.close(),
    });
  }

  return (
    <div className="flex flex-col gap-stack-lg">
      <PageHeader
        title="Ingredientes"
        subtitle="Gestión de suministros y control de inventario de cocina."
        action={
          <ButtonGeneric
            info={<><Plus size={16} aria-hidden="true" /> Nuevo Ingrediente</>}
            onClick={openCreate}
            disabled={!!error}
          />
        }
      />

      <div className="grid grid-cols-4 gap-stack-md">
        <KpiCard label="Total Ingredientes" value={total} />
        <KpiCard
          variant="warning"
          icon={<AlertTriangle size={13} aria-hidden="true" />}
          label="Con Alérgeno"
          value={allergenCount}
          subLabel="Requieren etiquetado"
        />
        <KpiCard
          label="Activos"
          value={activeCount}
          subLabel="En uso actualmente"
        />
        <KpiCard
          variant="warning"
          icon={<AlertTriangle size={13} aria-hidden="true" />}
          label="Bajo Stock"
          value={lowStockCount}
          subLabel="Stock < 10"
        />
      </div>

      <IngredientLowStockSection onEdit={openEdit} />

      <div className="flex items-center justify-end">
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
            placeholder="Buscar ingrediente…"
            className="w-64 bg-surface-container-low border border-outline-variant rounded-sm pl-9 pr-3 py-2 text-body-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      <EntityTable
        title={`Inventario de Cocina — Página ${currentPage(offset, LIMIT)}`}
        isLoading={isLoading}
        isEmpty={ingredients.length === 0}
        entityLabel="ingredientes"
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
            <SortableTh
              label="NOMBRE"
              active={sortKey === "name"}
              direction={direction}
              onClick={() => toggle("name")}
            />
            <th className="px-6 py-3 text-left text-label-caps text-on-surface-variant">DESCRIPCIÓN</th>
            <th className="px-6 py-3 text-right text-label-caps text-on-surface-variant">STOCK</th>
            <th className="px-6 py-3 text-left text-label-caps text-on-surface-variant">ALÉRGENO</th>
            <th className="px-6 py-3 text-left text-label-caps text-on-surface-variant">ESTADO</th>
            <th className="px-6 py-3 text-right text-label-caps text-on-surface-variant">ACCIONES</th>
          </tr>
        }
      >
        {sortedIngredients.map((ingredient) => (
          <tr
            key={ingredient.id}
            className={`border-b border-outline-variant last:border-0 transition-colors ${
              ingredient.is_active
                ? "hover:bg-surface-container"
                : "opacity-50 hover:opacity-70"
            }`}
          >
            <td className="px-6 py-4">
              <span className="text-data-mono text-primary">{formatId(ingredient.id)}</span>
            </td>
            <td className="px-6 py-4">
              <span className="font-sans font-semibold text-body-sm text-on-surface">
                {ingredient.name}
              </span>
            </td>
            <td className="px-6 py-4">
              <span className="text-body-sm text-on-surface-variant line-clamp-1 max-w-xs">
                {ingredient.description ?? "—"}
              </span>
            </td>
            <td className="px-6 py-4 text-right">
              <span
                className={`text-data-mono ${
                  ingredient.stock_quantity < 10
                    ? "text-warning font-bold"
                    : "text-on-surface"
                }`}
              >
                {ingredient.stock_quantity}
              </span>
            </td>
            <td className="px-6 py-4">
              <AllergenBadge isAllergen={ingredient.is_allergen} />
            </td>
            <td className="px-6 py-4">
              {ingredient.is_active ? (
                <span className="text-label-caps text-success">Activo</span>
              ) : (
                <span className="text-label-caps text-danger">Inactivo</span>
              )}
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center justify-end gap-1">
                {/* Editar — solo si está activo */}
                <button
                  type="button"
                  onClick={() => openEdit(ingredient)}
                  disabled={!ingredient.is_active}
                  className="p-1.5 text-on-surface-variant hover:text-on-surface rounded-sm hover:bg-surface-container transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label={`Editar ${ingredient.name}`}
                >
                  <Pencil size={15} />
                </button>

                {/* Desactivar / Activar */}
                {ingredient.is_active ? (
                  <button
                    type="button"
                    onClick={() => openConfirmDeactivate(ingredient)}
                    className="p-1.5 text-on-surface-variant hover:text-danger rounded-sm hover:bg-danger/10 transition-colors"
                    aria-label={`Desactivar ${ingredient.name}`}
                  >
                    <PowerOff size={15} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => activateIngredient(ingredient.id)}
                    disabled={isActivating}
                    className="p-1.5 text-on-surface-variant hover:text-success rounded-sm hover:bg-success/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label={`Activar ${ingredient.name}`}
                  >
                    <Power size={15} />
                  </button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </EntityTable>

      {/* Modal — Crear */}
      <Modal dialogRef={createModalRef} title="Crear Ingrediente">
        <IngredientForm
          key={`create-${createNonce}`}
          onSubmit={handleCreate}
          onCancel={() => createModalRef.current?.close()}
          isPending={isCreating}
        />
      </Modal>

      {/* Modal — Editar */}
      <Modal dialogRef={editModalRef} title="Editar Ingrediente">
        <IngredientForm
          key={`edit-${editing?.id ?? 'none'}-${editNonce}`}
          initialValues={editing ? {
            name:           editing.name,
            description:    editing.description ?? '',
            stock_quantity: editing.stock_quantity,
            is_allergen:    editing.is_allergen,
          } : undefined}
          onSubmit={handleUpdate}
          onCancel={() => editModalRef.current?.close()}
          isPending={isUpdating}
        />
      </Modal>

      {/* Modal — Confirmar desactivar */}
      <ConfirmModal
        dialogRef={confirmModalRef}
        title="Desactivar Ingrediente"
        message={
          <>
            ¿Desactivar <strong className="text-rb-bone">{toDeactivate?.name}</strong>?
            El ingrediente dejará de estar disponible pero podrá reactivarse.
          </>
        }
        confirmLabel="Desactivar"
        onConfirm={handleDeactivate}
        onCancel={() => confirmModalRef.current?.close()}
        isPending={isDeactivating}
      />
    </div>
  );
}
