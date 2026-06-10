import { useMutation } from '@tanstack/react-query'
import { uploadImages } from '@/shared/services/imageService'
import { toast, extractErrorMessage } from '@/shared/lib/toast'

export function useUploadImages() {
  return useMutation({
    mutationFn: uploadImages,
    onError: (err) => toast.error('No se pudo subir la imagen', extractErrorMessage(err)),
  })
}
