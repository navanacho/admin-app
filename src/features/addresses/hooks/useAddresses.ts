import { useQuery } from '@tanstack/react-query'
import { getDireccionesByUsuario } from '../services/addressService'

const QUERY_KEY = 'user-addresses'

export const useAddresses = () => {
  function useAddressesByUsuario(
    usuarioId: number | null,
    offset = 0,
    limit = 20,
  ) {
    return useQuery({
      queryKey: [QUERY_KEY, usuarioId, offset, limit],
      queryFn:  () => getDireccionesByUsuario(usuarioId as number, offset, limit),
      enabled:  usuarioId != null && usuarioId > 0,
    })
  }

  return { useAddressesByUsuario }
}
