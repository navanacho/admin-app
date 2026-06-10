import { apiClient } from '@/shared/lib/axios'

export interface UploadedImage {
  id:         number
  public_id:  string
  url:        string
  filename:   string
  format:     string | null
  width:      number | null
  height:     number | null
  bytes:      number | null
  created_at: string
}

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg']
export const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024 

/** Valida un archivo de imagen antes de subirlo. Devuelve un mensaje de error o `null` si es válido. */
export function validateImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return 'Formato no soportado (usá JPG, PNG, GIF o WEBP)'
  if (file.size > MAX_IMAGE_SIZE_BYTES) return 'El archivo supera los 10 MB'
  return null
}

export async function uploadImages(files: File[]): Promise<UploadedImage[]> {
  const formData = new FormData()
  files.forEach((file) => formData.append('files', file))

  const { data } = await apiClient.post<UploadedImage[]>('/images/upload', formData, {
    timeout: 30_000,
  })
  return data
}
