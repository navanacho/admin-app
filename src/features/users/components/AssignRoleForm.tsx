import { useMemo, useState } from 'react'
import { ButtonGeneric } from '@/shared/components/ButtonGeneric'
import { SelectField } from '@/shared/components/SelectField'
import { ALL_ROLE_CODES, type AsignarRolDto } from '../types'

interface AssignRoleFormProps {
  /** Códigos de rol que el usuario YA tiene — para excluirlos de las opciones. */
  existingRoleCodes: string[]
  onSubmit: (dto: AsignarRolDto) => void
  onCancel: () => void
  isPending?: boolean
}

export function AssignRoleForm({
  existingRoleCodes,
  onSubmit,
  onCancel,
  isPending = false,
}: AssignRoleFormProps) {
  const availableRoles = useMemo(
    () => ALL_ROLE_CODES.filter((r) => !existingRoleCodes.includes(r)),
    [existingRoleCodes],
  )

  const [rolCode, setRolCode] = useState<string>(availableRoles[0] ?? '')

  if (availableRoles.length === 0) {
    return (
      <div className="flex flex-col gap-stack-md">
        <p className="text-body-sm text-on-surface-variant">
          El usuario ya tiene todos los roles conocidos asignados.
        </p>
        <div className="flex justify-end">
          <ButtonGeneric info="Cerrar" type="Secondary" onClick={onCancel} />
        </div>
      </div>
    )
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (rolCode === '') return
    onSubmit({ rol_code: rolCode })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-stack-md">
      <SelectField
        label="Rol a asignar"
        value={rolCode}
        onChange={setRolCode}
        options={availableRoles.map((r) => ({ value: r, label: r }))}
        required
      />

      <p className="text-data-mono text-on-surface-variant text-[11px]">
        El rol se asigna sin fecha de expiración. Para vencimientos, usar la API
        directamente.
      </p>

      <div className="flex justify-end gap-2 pt-2">
        <ButtonGeneric
          info="Cancelar"
          type="Secondary"
          onClick={onCancel}
          disabled={isPending}
        />
        <ButtonGeneric
          info={isPending ? 'Asignando...' : 'Asignar rol'}
          submit
          disabled={isPending || rolCode === ''}
        />
      </div>
    </form>
  )
}
