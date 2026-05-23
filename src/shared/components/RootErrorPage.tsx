import {
  useRouteError,
  isRouteErrorResponse,
  useNavigate,
} from "react-router-dom";
import { ArrowLeft } from "lucide-react";

/**
 * Error boundary global (root-level).
 * Se muestra sin sidebar para errores que ocurren fuera del DashboardLayout
 * o cuando el layout mismo falla. Usa useRouteError para leer el error del router.
 */
export function RootErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();

  const is404 = isRouteErrorResponse(error) && error.status === 404;
  const code = isRouteErrorResponse(error) ? String(error.status) : "Error";
  const message = is404
    ? "La página que buscás no existe."
    : "Ocurrió un error inesperado en la aplicación.";

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center gap-stack-md text-center px-gutter">
      {/* Brand mínimo */}
      <p className="text-label-caps text-on-surface-variant tracking-widest mb-2">
        ROCK 'N BURGER — ADMIN
      </p>

      {/* Código */}
      <span className="text-display-lg text-primary leading-none">{code}</span>

      {/* Mensaje */}
      <div className="flex flex-col gap-2">
        <h1 className="text-headline-md text-on-surface">
          {is404 ? "Ruta no encontrada" : "Algo salió mal"}
        </h1>
        <p className="text-body-sm text-on-surface-variant max-w-sm">
          {message}
        </p>
      </div>

      {/* CTA */}
      <button
        type="button"
        onClick={() => navigate("/")}
        className="flex items-center gap-2 px-5 py-3 bg-primary text-on-primary text-label-caps rounded-md shadow-red hover:bg-rb-red-hover transition-colors mt-2"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Volver al inicio
      </button>
    </div>
  );
}
