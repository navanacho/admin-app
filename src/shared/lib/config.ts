export function getApiBase(): string {
  const raw = import.meta.env.VITE_API_BASE_URL;
  if (!raw || typeof raw !== "string") {
    throw new Error("Falta VITE_API_BASE_URL en .env");
  }
  return raw.replace(/\/$/, "");
}

/**
 * Construye una URL WebSocket reutilizando el host/puerto/prefijo del API REST.
 * Convierte el esquema http(s) → ws(s) y le concatena `path` (ej: "/pedidos/ws").
 */
export function getWsUrl(path: string): string {
  const base = getApiBase().replace(/^http/, "ws");
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${base}${suffix}`;
}
