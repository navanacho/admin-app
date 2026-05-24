import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUsers,
  deactivateUser,
  activateUser,
  getUserRoles,
  asignarRol,
  quitarRol,
} from "../services/userService";
import type { AsignarRolDto, User } from "../types";
import { extractErrorMessage, toast } from "@/shared/lib/toast";

const QUERY_KEY = "users";
const ROLES_KEY = "user-roles";

export function useUsers() {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: () => getUsers(),
  });
}

/**
 * Como el backend no expone GET /users/{id}, derivamos el detalle del listado
 * cacheado para evitar un endpoint extra. Si se necesita refrescar, invalidar
 * la query principal.
 */
export function useUserById(id: number | null) {
  return useQuery({
    queryKey: [QUERY_KEY, "detail", id],
    queryFn: async (): Promise<User | null> => {
      if (id == null) return null;
      const users = await getUsers();
      return users.find((u) => u.id === id) ?? null;
    },
    enabled: id != null && id > 0,
  });
}

export function useUserRoles(id: number | null) {
  return useQuery({
    queryKey: [ROLES_KEY, id],
    queryFn: () => getUserRoles(id as number),
    enabled: id != null && id > 0,
  });
}

export function useDeactivateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deactivateUser(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast.success("Usuario desactivado");
    },
    onError: (err) =>
      toast.error("No se pudo desactivar el usuario", extractErrorMessage(err)),
  });
}

export function useActivateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => activateUser(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast.success("Usuario activado");
    },
    onError: (err) =>
      toast.error("No se pudo activar el usuario", extractErrorMessage(err)),
  });
}

export function useAsignarRol() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: AsignarRolDto }) =>
      asignarRol(id, dto),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] });
      qc.invalidateQueries({ queryKey: [ROLES_KEY, id] });
      toast.success("Rol Asignado");
    },
    onError: (err) =>
      toast.error("No se pudo asignar el rol", extractErrorMessage(err)),
  });
}

export function useQuitarRol() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, rolCode }: { id: number; rolCode: string }) =>
      quitarRol(id, rolCode),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] });
      qc.invalidateQueries({ queryKey: [ROLES_KEY, id] });
      toast.success("Rol desaignado");
    },
    onError: (err) =>
      toast.error("No se pudo desasignar el rol", extractErrorMessage(err)),
  });
}
