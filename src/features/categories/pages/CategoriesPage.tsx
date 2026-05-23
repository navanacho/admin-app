import { Link, useNavigate } from 'react-router-dom'
import { useCategories, useDeleteCategory } from '../hooks/useCategories'

export function CategoriesPage() {
  const { data: categories, isLoading, error } = useCategories()
  const { mutate: deleteCategory } = useDeleteCategory()
  const navigate = useNavigate()

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error loading categories.</p>

  function handleDelete(id: number) {
    if (confirm('Delete this category?')) deleteCategory(id)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h1>Categories</h1>
        <Link to="/categories/new">
          <button>+ New Category</button>
        </Link>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={th}>ID</th>
            <th style={th}>Name</th>
            <th style={th}>Description</th>
            <th style={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories?.map((cat) => (
            <tr key={cat.id}>
              <td style={td}>{cat.id}</td>
              <td style={td}>{cat.name}</td>
              <td style={td}>{cat.description}</td>
              <td style={td}>
                <button onClick={() => navigate(`/categories/${cat.id}/edit`)}>Edit</button>{' '}
                <button onClick={() => handleDelete(cat.id)}>Delete</button>
              </td>
            </tr>
          ))}
          {categories?.length === 0 && (
            <tr>
              <td colSpan={4} style={td}>No categories found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

const th: React.CSSProperties = { borderBottom: '1px solid #ccc', padding: '8px', textAlign: 'left' }
const td: React.CSSProperties = { padding: '8px', borderBottom: '1px solid #eee' }
