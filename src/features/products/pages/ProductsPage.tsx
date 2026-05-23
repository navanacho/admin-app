import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Plus, Pencil, PowerOff, Power, Package } from "lucide-react";

import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  useActivateProduct,
} from "../hooks/useProducts";
import { ProductForm } from "../components/ProductForm";
import { LowStockSection } from "../components/LowStockSection";

import { useCategories } from "@/features/categories/hooks/useCategories";
import { useIngredients } from "@/features/ingredients/hooks/useIngredients";

import { PageHeader } from "@/shared/components/PageHeader";
import { KpiCard } from "@/shared/components/KpiCard";
import { EntityTable } from "@/shared/components/EntityTable";
import { Modal } from "@/shared/components/Modal";
import { ConfirmModal } from "@/shared/components/ConfirmModal";
import { ButtonGeneric } from "@/shared/components/ButtonGeneric";

import type { Product, CreateProductDto } from "../types";

const LIMIT = 10;

function formatId(id: number): string {
  return `#PRD-${String(id).padStart(3, "0")}`;
}

function currentPage(offset: number, limit: number): number {
  return Math.floor(offset / limit) + 1;
}

function formatPrice(value: string | number): string {
  const n = typeof value === "string" ? parseFloat(value) : value;
  return `$${n.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function ProductsPage() {
  const [offset, setOffset] = useState(0);

  const { data, isLoading, error } = useProducts(offset, LIMIT);
  const { mutate: createProduct, isPending: isCreating } = useCreateProduct();
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();
  const { mutate: deactivateProduct, isPending: isDeactivating } =
    useDeleteProduct();
  const { mutate: activateProduct, isPending: isActivating } =
    useActivateProduct();

  // Categorías + ingredientes activos para los multi-selects
  const { data: catsData } = useCategories(0, 100);
  const { data: ingsData } = useIngredients(0, 100);
  const availableCategories = (catsData?.data ?? []).filter((c) => c.is_active);
  const availableIngredients = (ingsData?.data ?? []).filter(
    (i) => i.is_active,
  );

  const products = data?.data ?? [];
  const total = data?.total ?? 0;

  const activeCount = products.filter((p) => p.deleted_at == null).length;
  const availableCount = products.filter(
    (p) => p.available && p.deleted_at == null,
  ).length;

  const hasPrev = offset > 0;
  const hasNext = offset + LIMIT < total;

  function goNext() {
    setOffset((o) => o + LIMIT);
  }
  function goPrev() {
    setOffset((o) => Math.max(0, o - LIMIT));
  }

  // ── Modal Crear ───────────────────────────────────────────────────────────
  const createModalRef = useRef<HTMLDialogElement>(null);

  // Si llegamos con ?action=create (típicamente desde el botón del sidebar),
  // abrimos el modal y limpiamos el query param para evitar reabrirlo al refrescar.
  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    if (searchParams.get("action") === "create") {
      createModalRef.current?.showModal();
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  function handleCreate(dto: CreateProductDto) {
    createProduct(dto, {
      onSuccess: () => createModalRef.current?.close(),
    });
  }

  // ── Modal Editar ──────────────────────────────────────────────────────────
  const editModalRef = useRef<HTMLDialogElement>(null);
  const [editing, setEditing] = useState<Product | null>(null);

  function openEdit(product: Product) {
    setEditing(product);
    editModalRef.current?.showModal();
  }

  function handleUpdate(dto: CreateProductDto) {
    if (!editing) return;
    updateProduct(
      { id: editing.id, dto },
      { onSuccess: () => editModalRef.current?.close() },
    );
  }

  // ── Modal Confirmar desactivar ───────────────────────────────────────────
  const confirmModalRef = useRef<HTMLDialogElement>(null);
  const [toDeactivate, setToDeactivate] = useState<Product | null>(null);

  function openConfirmDeactivate(product: Product) {
    setToDeactivate(product);
    confirmModalRef.current?.showModal();
  }
  function handleDeactivate() {
    if (!toDeactivate) return;
    deactivateProduct(toDeactivate.id, {
      onSuccess: () => confirmModalRef.current?.close(),
    });
  }

  return (
    <div className="flex flex-col gap-stack-lg">
      <PageHeader
        title="Productos"
        subtitle="Catálogo del menú: precios, stock y composición."
        action={
          <ButtonGeneric
            info={
              <>
                <Plus size={16} aria-hidden="true" /> Nuevo Producto
              </>
            }
            onClick={() => createModalRef.current?.showModal()}
            disabled={!!error}
          />
        }
      />

      <div className="grid grid-cols-3 gap-stack-md">
        <KpiCard
          icon={<Package size={13} aria-hidden="true" />}
          label="Total Productos"
          value={total}
        />
        <KpiCard label="Activos" value={activeCount} subLabel="No eliminados" />
        <KpiCard
          label="Disponibles"
          value={availableCount}
          subLabel="Para venta"
        />
      </div>

      {/* Alerta de bajo stock — solo si hay alguno */}
      <LowStockSection />

      <EntityTable
        title={`Catálogo — Página ${currentPage(offset, LIMIT)}`}
        isLoading={isLoading}
        isEmpty={products.length === 0}
        entityLabel="productos"
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
            <th className="px-6 py-3 text-left text-label-caps text-on-surface-variant w-28">
              ID
            </th>
            <th className="px-6 py-3 text-left text-label-caps text-on-surface-variant">
              NOMBRE
            </th>
            <th className="px-6 py-3 text-right text-label-caps text-on-surface-variant">
              PRECIO
            </th>
            <th className="px-6 py-3 text-right text-label-caps text-on-surface-variant">
              STOCK
            </th>
            <th className="px-6 py-3 text-left text-label-caps text-on-surface-variant">
              CATEGORÍA
            </th>
            <th className="px-6 py-3 text-left text-label-caps text-on-surface-variant">
              DISPONIBLE
            </th>
            <th className="px-6 py-3 text-left text-label-caps text-on-surface-variant">
              ESTADO
            </th>
            <th className="px-6 py-3 text-right text-label-caps text-on-surface-variant">
              ACCIONES
            </th>
          </tr>
        }
      >
        {products.map((product) => {
          const isActive = product.deleted_at == null;
          const primaryCat = product.categories.find((c) => c.is_primary);
          const isLowStock = product.stock_quantity < 10;

          return (
            <tr
              key={product.id}
              className={`border-b border-outline-variant last:border-0 transition-colors ${
                isActive
                  ? isLowStock
                    ? "bg-surface-dim hover:bg-surface-container-highest"
                    : "hover:bg-surface-container"
                  : "opacity-50 hover:opacity-70"
              }`}
            >
              <td className="px-6 py-4">
                <span className="text-data-mono text-primary">
                  {formatId(product.id)}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="font-sans font-semibold text-body-sm text-on-surface">
                  {product.name}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <span className="text-data-mono text-on-surface">
                  {formatPrice(product.base_price)}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <span
                  className={`text-data-mono ${isLowStock ? "text-warning font-bold" : "text-on-surface"}`}
                >
                  {product.stock_quantity}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="text-body-sm text-on-surface-variant">
                  {primaryCat?.name ?? "—"}
                </span>
              </td>
              <td className="px-6 py-4">
                {product.available ? (
                  <span className="text-label-caps text-success">Sí</span>
                ) : (
                  <span className="text-label-caps text-on-surface-variant">
                    No
                  </span>
                )}
              </td>
              <td className="px-6 py-4">
                {isActive ? (
                  <span className="text-label-caps text-success">Activo</span>
                ) : (
                  <span className="text-label-caps text-danger">Inactivo</span>
                )}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => openEdit(product)}
                    disabled={!isActive}
                    className="p-1.5 text-on-surface-variant hover:text-on-surface rounded-sm hover:bg-surface-container transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label={`Editar ${product.name}`}
                  >
                    <Pencil size={15} />
                  </button>

                  {isActive ? (
                    <button
                      type="button"
                      onClick={() => openConfirmDeactivate(product)}
                      className="p-1.5 text-on-surface-variant hover:text-danger rounded-sm hover:bg-danger/10 transition-colors"
                      aria-label={`Desactivar ${product.name}`}
                    >
                      <PowerOff size={15} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => activateProduct(product.id)}
                      disabled={isActivating}
                      className="p-1.5 text-on-surface-variant hover:text-success rounded-sm hover:bg-success/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      aria-label={`Activar ${product.name}`}
                    >
                      <Power size={15} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          );
        })}
      </EntityTable>

      {/* Modal — Crear */}
      <Modal dialogRef={createModalRef} title="Crear Producto" size="lg">
        <ProductForm
          availableCategories={availableCategories}
          availableIngredients={availableIngredients}
          onSubmit={handleCreate}
          onCancel={() => createModalRef.current?.close()}
          isPending={isCreating}
        />
      </Modal>

      {/* Modal — Editar */}
      <Modal dialogRef={editModalRef} title="Editar Producto" size="lg">
        <ProductForm
          key={editing?.id}
          initialValues={
            editing
              ? {
                  name: editing.name,
                  description: editing.description ?? "",
                  base_price: parseFloat(editing.base_price),
                  stock_quantity: editing.stock_quantity,
                  prep_time_min: editing.prep_time_min,
                  available: editing.available,
                  image_urls: editing.image_urls,
                  categories: editing.categories.map((c) => ({
                    id: c.id,
                    is_primary: c.is_primary,
                  })),
                  ingredients: editing.ingredients.map((i) => ({
                    id: i.id,
                    is_removable: i.is_removable,
                  })),
                }
              : undefined
          }
          availableCategories={availableCategories}
          availableIngredients={availableIngredients}
          onSubmit={handleUpdate}
          onCancel={() => editModalRef.current?.close()}
          isPending={isUpdating}
        />
      </Modal>

      {/* Modal — Confirmar desactivar */}
      <ConfirmModal
        dialogRef={confirmModalRef}
        title="Desactivar Producto"
        message={
          <>
            ¿Desactivar{" "}
            <strong className="text-rb-bone">{toDeactivate?.name}</strong>? El
            producto dejará de estar disponible pero podrá reactivarse.
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
