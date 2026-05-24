import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getIngredients,
  getIngredientById,
  createIngredient,
  updateIngredient,
  deleteIngredient,
  activateIngredient,
} from "../services/ingredientService";
import type { CreateIngredientDto, UpdateIngredientDto } from "../types";
import { extractErrorMessage, toast } from "@/shared/lib/toast";

const QUERY_KEY = "ingredients";

export function useIngredients(offset: number, limit: number, name?: string) {
  return useQuery({
    queryKey: [QUERY_KEY, offset, limit, name ?? ""],
    queryFn: () => getIngredients(offset, limit, name),
  });
}

export function useIngredientById(id: number) {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => getIngredientById(id),
    enabled: id > 0,
  });
}

export function useCreateIngredient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateIngredientDto) => createIngredient(dto),
    onSuccess: (ingredient) => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast.success("Ingrediente creado", ingredient.name);
    },
    onError: (err) =>
      toast.error("No se pudo crear el ingrediente", extractErrorMessage(err)),
  });
}

export function useUpdateIngredient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateIngredientDto }) =>
      updateIngredient(id, dto),
    onSuccess: (ingredient, { id }) => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] });
      qc.invalidateQueries({ queryKey: [QUERY_KEY, id] });
      toast.success("Ingrediente actualizado", ingredient.name);
    },
    onError: (err) =>
      toast.error(
        "No se pudo actualizar el ingrediente",
        extractErrorMessage(err),
      ),
  });
}

export function useDeleteIngredient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteIngredient(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast.success("Ingrediente eliminado");
    },
    onError: (err) =>
      toast.error(
        "No se pudo eliminar el ingrediente",
        extractErrorMessage(err),
      ),
  });
}

export function useActivateIngredient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => activateIngredient(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast.success("Ingrediente activado");
    },
    onError: (err) =>
      toast.error(
        "No se pudo activar el ingrediente",
        extractErrorMessage(err),
      ),
  });
}
