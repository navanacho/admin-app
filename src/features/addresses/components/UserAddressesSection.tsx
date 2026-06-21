import { useState } from 'react'
import { MapPin, Star } from 'lucide-react'
import { useAddresses } from '../hooks/useAddresses'
import type { Direccion } from '../types'

const LIMIT = 5

interface UserAddressesSectionProps {
  usuarioId: number
}

function fullAddressLine(d: Direccion): string {
  const piso = d.piso_dpto ? `, ${d.piso_dpto}` : ''
  const cp = d.codigo_postal ? ` (CP ${d.codigo_postal})` : ''
  return `${d.calle} ${d.numero}${piso} — ${d.ciudad}, ${d.provincia}${cp}`
}

export function UserAddressesSection({ usuarioId }: UserAddressesSectionProps) {
  const { useAddressesByUsuario } = useAddresses()
  const [offset, setOffset] = useState(0)
  const { data, isLoading } = useAddressesByUsuario(usuarioId, offset, LIMIT)

  const direcciones = data?.data ?? []
  const total = data?.total ?? 0

  const hasPrev = offset > 0
  const hasNext = offset + LIMIT < total

  return (
    <section className="bg-surface-container-lowest border border-outline-variant rounded-md overflow-hidden">
      <header className="flex items-center justify-between px-6 py-4 border-b border-outline-variant">
        <h2 className="text-headline-md text-on-surface">
          Direcciones de entrega
          {total > 0 && (
            <span className="ml-2 text-label-caps text-on-surface-variant">
              ({total})
            </span>
          )}
        </h2>
      </header>

      <div className="p-6">
        {isLoading ? (
          <p className="text-body-sm text-on-surface-variant">Cargando...</p>
        ) : direcciones.length === 0 ? (
          <p className="text-body-sm text-on-surface-variant">
            El cliente no tiene direcciones cargadas.
          </p>
        ) : (
          <ul className="flex flex-col gap-stack-sm">
            {direcciones.map((d) => (
              <li
                key={d.id}
                className="border border-outline-variant rounded-sm px-4 py-3 flex items-start gap-3"
              >
                <MapPin
                  size={16}
                  className={`mt-0.5 shrink-0 ${
                    d.es_principal ? 'text-primary' : 'text-on-surface-variant'
                  }`}
                  aria-hidden="true"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-label-caps text-rb-bone">{d.alias}</span>
                    {d.es_principal && (
                      <span className="text-label-caps text-primary inline-flex items-center gap-1">
                        <Star size={11} aria-hidden="true" /> Principal
                      </span>
                    )}
                  </div>
                  <p className="text-body-sm text-on-surface mt-1">
                    {fullAddressLine(d)}
                  </p>
                  {d.referencias && (
                    <p className="text-body-sm text-on-surface-variant mt-1 italic">
                      "{d.referencias}"
                    </p>
                  )}
                  {(d.latitud != null || d.longitud != null) && (
                    <p className="text-data-mono text-on-surface-variant text-[11px] mt-1">
                      {d.latitud ?? '—'}, {d.longitud ?? '—'}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {total > LIMIT && (
        <div className="flex items-center justify-between px-6 py-3 border-t border-outline-variant">
          <span className="text-body-sm text-on-surface-variant">
            Mostrando {offset + 1}–{Math.min(offset + LIMIT, total)} de {total}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setOffset((o) => Math.max(0, o - LIMIT))}
              disabled={!hasPrev}
              className="px-3 py-1.5 text-body-sm text-on-surface border border-outline-variant rounded-sm hover:bg-surface-container disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Anterior
            </button>
            <button
              type="button"
              onClick={() => setOffset((o) => o + LIMIT)}
              disabled={!hasNext}
              className="px-3 py-1.5 text-body-sm bg-rb-ink text-rb-bone rounded-sm hover:bg-rb-charcoal disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
