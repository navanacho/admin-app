import { useRef, useState } from "react";
import { Loader2, Plus, X } from "lucide-react";
import { useUploadImages } from "@/shared/hooks/useImageUpload";
import { toast } from "@/shared/lib/toast";
import { ALLOWED_IMAGE_TYPES, validateImageFile } from "@/shared/services/imageService";

interface ImageUrlsFieldProps {
  label: string;
  values: string[];
  onChange: (urls: string[]) => void;
}

/**
 * Selector de imágenes del producto: permite elegir uno o más archivos del
 * dispositivo, los sube a Cloudinary vía /images/upload y agrega las URLs
 * resultantes a la lista. Cada imagen se puede quitar individualmente.
 */
export function ImageUrlsField({
  label,
  values,
  onChange,
}: ImageUrlsFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pendingPreviews, setPendingPreviews] = useState<string[]>([]);
  const { mutate: upload, isPending } = useUploadImages();

  function removeAt(index: number) {
    onChange(values.filter((_, i) => i !== index));
  }

  function handleFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;

    const validFiles: File[] = [];
    for (const file of files) {
      const error = validateImageFile(file);
      if (error) {
        toast.error("No se pudo subir la imagen", `${file.name}: ${error}`);
        continue;
      }
      validFiles.push(file);
    }
    if (validFiles.length === 0) return;

    const previews = validFiles.map((file) => URL.createObjectURL(file));
    setPendingPreviews((prev) => [...prev, ...previews]);

    upload(validFiles, {
      onSuccess: (images) => onChange([...values, ...images.map((img) => img.url)]),
      onSettled: () => {
        previews.forEach((p) => URL.revokeObjectURL(p));
        setPendingPreviews((prev) => prev.filter((p) => !previews.includes(p)));
      },
    });
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-label-caps text-rb-bone/60">{label}</label>

      <div className="flex flex-wrap gap-2">
        {values.map((url, idx) => (
          <div
            key={url + idx}
            className="relative w-24 h-24 rounded-sm overflow-hidden border border-white/10 bg-rb-charcoal"
          >
            <img src={url} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removeAt(idx)}
              className="absolute top-1 right-1 bg-black/60 rounded-full p-0.5 text-rb-bone hover:bg-black/80 transition-colors"
            >
              <X size={12} />
            </button>
          </div>
        ))}

        {pendingPreviews.map((src) => (
          <div
            key={src}
            className="relative w-24 h-24 rounded-sm overflow-hidden border border-white/10 bg-rb-charcoal"
          >
            <img src={src} alt="" className="w-full h-full object-cover opacity-50" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <Loader2 size={20} className="animate-spin text-rb-bone" />
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isPending}
          className="w-24 h-24 rounded-sm border border-dashed border-white/10 flex flex-col items-center justify-center gap-1 text-rb-bone/40 hover:text-primary hover:border-primary transition-colors disabled:opacity-40"
        >
          <Plus size={20} />
          <span className="text-[10px]">Agregar</span>
        </button>

        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ALLOWED_IMAGE_TYPES.join(",")}
          className="hidden"
          onChange={handleFilesChange}
        />
      </div>

      {values.length === 0 && pendingPreviews.length === 0 && (
        <p className="text-data-mono text-rb-bone/40 text-[11px]">
          Sin imágenes — agregá una desde tu dispositivo.
        </p>
      )}
    </div>
  );
}
