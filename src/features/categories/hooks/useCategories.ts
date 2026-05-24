import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  activateCategory,
} from "../services/categoryService";
import type { CreateCategoryDto, UpdateCategoryDto } from "../types";
import { extractErrorMessage, toast } from "@/shared/lib/toast";

const QUERY_KEY = "categories";

export function useCategories(offset = 0, limit = 100, name?: string) {
  return useQuery({
    queryKey: [QUERY_KEY, offset, limit, name ?? ""],
    queryFn: () => getCategories(offset, limit, name),
  });
}

export function useCategoryById(id: number) {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => getCategoryById(id),
    enabled: id > 0,
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateCategoryDto) => createCategory(dto),
    onSuccess: (category) => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast.success("Categoria creado", category.name);
    },
    onError: (err) =>
      toast.error("No se pudo crear la categoria", extractErrorMessage(err)),
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateCategoryDto }) =>
      updateCategory(id, dto),
    onSuccess: (category, { id }) => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] });
      qc.invalidateQueries({ queryKey: [QUERY_KEY, id] });
      toast.success("Categoria actualizada", category.name);
    },
    onError: (err) =>
      toast.error(
        "No se pudo actualizar la categoria",
        extractErrorMessage(err),
      ),
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: () => {
          qc.invalidateQueries({ queryKey: [QUERY_KEY] });
          toast.success("Categoria eliminada");
        },
        onError: (err) =>
          toast.error(
            "No se pudo eliminar la categoria",
            extractErrorMessage(err),
          ),
  });
}

export function useActivateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => activateCategory(id),
    onSuccess: () => {
          qc.invalidateQueries({ queryKey: [QUERY_KEY] });
          toast.success("Categoria activada");
        },
        onError: (err) =>
          toast.error(
            "No se pudo activar la categoria",
            extractErrorMessage(err),
          ),
  });
}
