import { useEffect, useRef, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useWebSocket } from "@/shared/hooks/useWebSocket";
import type { WsMessage } from "@/shared/hooks/useWebSocket";
import { toast } from "@/shared/lib/toast";

export function useOrderWebSocket(orderIds?: number[]) {
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const subscribedRef = useRef<Set<number>>(new Set());
  const idsRef = useRef<number[]>([]);

  const onMessage = useCallback(
    (msg: WsMessage) => {
      switch (msg.event) {
        case "PEDIDO_ESTADO":
          if (
            msg.data &&
            typeof msg.data === "object" &&
            "id" in (msg.data as Record<string, unknown>)
          ) {
            const orderData = msg.data as { id: number };
            queryClient.setQueryData(["orders", orderData.id], msg.data);
            queryClient.invalidateQueries({
              queryKey: ["orders", orderData.id, "history"],
            });
            queryClient.invalidateQueries({ queryKey: ["orders"] });
          }
          break;

        case "ERROR": {
          const detail =
            msg.data &&
            typeof msg.data === "object" &&
            "detail" in (msg.data as Record<string, unknown>)
              ? (msg.data as { detail: string }).detail
              : "Error desconocido del servidor";
          toast.error(detail);
          break;
        }

        case "WS_CONNECTED":
          idsRef.current.forEach((id) => subRef.current?.(id));
          break;
      }
    },
    [queryClient],
  );

  const { subscribeToOrder, unsubscribeFromOrder } = useWebSocket({
    onMessage,
    enabled: isAuthenticated,
  });

  const subRef = useRef(subscribeToOrder);
  const unsubRef = useRef(unsubscribeFromOrder);

  useEffect(() => {
    subRef.current = subscribeToOrder;
  }, [subscribeToOrder]);

  useEffect(() => {
    unsubRef.current = unsubscribeFromOrder;
  }, [unsubscribeFromOrder]);

  useEffect(() => {
    if (!isAuthenticated) return;
    idsRef.current = orderIds ?? [];

    const ids = new Set(orderIds ?? []);

    subscribedRef.current.forEach((id) => {
      if (!ids.has(id)) {
        subscribedRef.current.delete(id);
        unsubRef.current?.(id);
      }
    });

    ids.forEach((id) => {
      if (!subscribedRef.current.has(id)) {
        subscribedRef.current.add(id);
        subRef.current?.(id);
      }
    });
  }, [orderIds, isAuthenticated]);
}
