import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getOrdersAdmin,
  getColaPedidos,
  getEstadosPedido,
  getOrderById,
  getOrderHistorial,
  changeOrderState,
} from "../services/orderService";
import type { CambioEstadoDto, EstadoPedidoCodigo, Pedido } from "../types";
import { extractErrorMessage, toast } from "@/shared/lib/toast";
import { useWebSocket } from "@/shared/hooks/useWebSocket";
import { useCallback, useEffect, useReducer, useRef } from "react";

const QUERY_KEY = "orders";
const ESTADOS_KEY = "order-estados";
const HISTORIAL_KEY = "order-historial";

export function useOrders(
  offset: number,
  limit: number,
  estadoId?: number,
  usuarioId?: number,
) {
  return useQuery({
    queryKey: [QUERY_KEY, offset, limit, estadoId ?? null, usuarioId ?? null],
    queryFn: () => getOrdersAdmin(offset, limit, estadoId, usuarioId),
  });
}

export function useEstadosPedido() {
  return useQuery({
    queryKey: [ESTADOS_KEY],
    queryFn: () => getEstadosPedido(),
    staleTime: 5 * 60 * 1000, // los estados casi no cambian
  });
}

// Clave aislada del prefijo QUERY_KEY: así las invalidaciones de
// useChangeOrderState (que sirven a OrdersPage/OrderDetailPage) NO refetchean la
// cola del tablero — el tablero se mantiene solo por WebSocket.
const COLA_KEY = "orders-cola";

type BoardState = Record<number, Pedido>;

type BoardAction =
  | { type: "seed"; pedidos: Pedido[] }
  | { type: "upsert"; pedido: Pedido }
  | { type: "remove"; id: number };

function boardReducer(state: BoardState, action: BoardAction): BoardState {
  switch (action.type) {
    case "seed":
      return Object.fromEntries(action.pedidos.map((p) => [p.id, p]));
    case "upsert":
      return { ...state, [action.pedido.id]: action.pedido };
    case "remove": {
      if (!(action.id in state)) return state;
      const next = { ...state };
      delete next[action.id];
      return next;
    }
    default:
      return state;
  }
}

/**
 * Estado de los tableros (cocina / cajero) en el modelo push del backend:
 * - Una sola carga inicial con GET /pedidos/cola (según la visibilidad del rol).
 * - De ahí en más, SOLO se muta la lista local con los eventos del WebSocket:
 *   UPSERT (agregar/reemplazar por id) y REMOVE (borrar por id). Sin refetch.
 *
 * Devuelve los pedidos agrupados por estado_codigo; cada página ubica cada grupo
 * en su sección (columnas, panel read-only, tabla terminal).
 */
export function useOrdersBoard() {
  const qc = useQueryClient();
  const [state, dispatch] = useReducer(boardReducer, {});

  const { data, isLoading } = useQuery({
    queryKey: [COLA_KEY],
    queryFn: () => getColaPedidos(),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  // Sembrar / re-sembrar el estado local cada vez que llega (o se resincroniza)
  // la cola desde el backend.
  useEffect(() => {
    if (data) dispatch({ type: "seed", pedidos: data.data });
  }, [data]);

  // Ignorar el primer WS_CONNECTED (coincide con la carga inicial) para no
  // disparar un refetch redundante en el montaje.
  const connectedOnce = useRef(false);

  const onMessage = useCallback(
    (msg: { event: string; id?: number; data: unknown }) => {
      switch (msg.event) {
        case "UPSERT":
          dispatch({ type: "upsert", pedido: msg.data as Pedido });
          break;
        case "REMOVE":
          if (msg.id != null) dispatch({ type: "remove", id: msg.id });
          break;
        case "WS_CONNECTED":
          if (connectedOnce.current) {
            // Reconexión: la cola pudo desincronizarse mientras estuvo caído.
            qc.invalidateQueries({ queryKey: [COLA_KEY] });
          }
          connectedOnce.current = true;
          break;
      }
    },
    [qc],
  );

  useWebSocket({ onMessage });

  const byState = {} as Record<EstadoPedidoCodigo, Pedido[]>;
  for (const pedido of Object.values(state)) {
    (byState[pedido.estado_codigo] ??= []).push(pedido);
  }

  return { byState, isLoading };
}

export function useOrderById(id: number | null) {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => getOrderById(id as number),
    enabled: id != null && id > 0,
  });
}

export function useOrderHistorial(id: number | null) {
  return useQuery({
    queryKey: [HISTORIAL_KEY, id],
    queryFn: () => getOrderHistorial(id as number),
    enabled: id != null && id > 0,
  });
}

export function useChangeOrderState() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: CambioEstadoDto }) =>
      changeOrderState(id, dto),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] });
      qc.invalidateQueries({ queryKey: [QUERY_KEY, id] });
      qc.invalidateQueries({ queryKey: [HISTORIAL_KEY, id] });
      toast.success("Estado cambiado");
    },
    onError: (err) =>
      toast.error("No se pudo cambiar el estado", extractErrorMessage(err)),
  });
}
