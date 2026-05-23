import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useCategoryById, useCreateCategory, useUpdateCategory } from '../hooks/useCategories'

export function CategoryFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const numericId = Number(id ?? 0)
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const { data: existing } = useCategoryById(numericId)
  const { mutate: create, isPending: creating } = useCreateCategory()
  const { mutate: update, isPending: updating } = useUpdateCategory()

  useEffect(() => {
    if (existing) {
      setName(existing.name)
      setDescription(existing.description)
    }
  }, [existing])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const dto = { name, description }

    if (isEdit) {
      update({ id: numericId, dto }, { onSuccess: () => navigate('/categories') })
    } else {
      create(dto, { onSuccess: () => navigate('/categories') })
    }
  }

  const isPending = creating || updating

  return (
    <div style={{ maxWidth: 480 }}>
      <h1>{isEdit ? 'Edit Category' : 'New Category'}</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Name</label>
          <br />
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: '100%' }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Description</label>
          <br />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            style={{ width: '100%' }}
          />
        </div>
        <button type="submit" disabled={isPending}>
          {isPending ? 'Saving...' : isEdit ? 'Update' : 'Create'}
        </button>{' '}
        <button type="button" onClick={() => navigate('/categories')}>
          Cancel
        </button>
      </form>
    </div>
  )
}
