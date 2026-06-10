import { useRef, useState } from 'react'
import { ImageIcon, Loader2, X } from 'lucide-react'
import { ButtonGeneric } from '@/shared/components/ButtonGeneric'
import { useUploadImages } from '@/shared/hooks/useImageUpload'
import { toast } from '@/shared/lib/toast'
import { ALLOWED_IMAGE_TYPES, validateImageFile } from '@/shared/services/imageService'

interface ImagePickerProps {
  label: string
  value: string | null
  onChange: (url: string | null) => void
  disabled?: boolean
}

/**
 * Selector de una imagen: abre el explorador de archivos, sube a Cloudinary
 * vía /images/upload y muestra una preview con el resultado.
 */
export function ImagePicker({ label, value, onChange, disabled = false }: ImagePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const { mutate: upload, isPending } = useUploadImages()

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    const error = validateImageFile(file)
    if (error) {
      toast.error('No se pudo subir la imagen', error)
      return
    }

    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)

    upload([file], {
      onSuccess: ([image]) => onChange(image.url),
      onSettled: () => {
        URL.revokeObjectURL(objectUrl)
        setPreview(null)
      },
    })
  }

  const displayUrl = preview ?? value

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-label-caps text-rb-bone/60">{label}</label>

      <div className="flex items-center gap-3">
        {displayUrl ? (
          <div className="relative w-24 h-24 rounded-sm overflow-hidden border border-white/10 bg-rb-charcoal">
            <img src={displayUrl} alt="" className="w-full h-full object-cover" />
            {isPending && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <Loader2 size={20} className="animate-spin text-rb-bone" />
              </div>
            )}
            {!isPending && value && (
              <button
                type="button"
                onClick={() => onChange(null)}
                className="absolute top-1 right-1 bg-black/60 rounded-full p-0.5 text-rb-bone hover:bg-black/80 transition-colors"
              >
                <X size={12} />
              </button>
            )}
          </div>
        ) : (
          <div className="w-24 h-24 rounded-sm border border-dashed border-white/10 flex items-center justify-center text-rb-bone/30">
            <ImageIcon size={24} />
          </div>
        )}

        <ButtonGeneric
          type="Secondary"
          info={isPending ? 'Subiendo…' : displayUrl ? 'Cambiar imagen' : 'Seleccionar imagen'}
          onClick={() => inputRef.current?.click()}
          disabled={disabled || isPending}
        />

        <input
          ref={inputRef}
          type="file"
          accept={ALLOWED_IMAGE_TYPES.join(',')}
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  )
}
