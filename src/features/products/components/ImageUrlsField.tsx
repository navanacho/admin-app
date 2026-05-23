import { ButtonGeneric } from "@/shared/components/ButtonGeneric";
import { InputField } from "@/shared/components/InputField";
import { Plus, X } from "lucide-react";

interface ImageUrlsFieldProps {
  label: string;
  values: string[];
  onChange: (urls: string[]) => void;
}

/**
 * Editor para una lista dinámica de URLs de imágenes.
 * Permite agregar, editar y eliminar URLs individualmente.
 */
export function ImageUrlsField({
  label,
  values,
  onChange,
}: ImageUrlsFieldProps) {
  function updateAt(index: number, url: string) {
    const next = [...values];
    next[index] = url;
    onChange(next);
  }

  function removeAt(index: number) {
    onChange(values.filter((_, i) => i !== index));
  }

  function addEmpty() {
    onChange([...values, ""]);
  }

  const inputClass =
    "flex-1 bg-rb-charcoal border border-white/10 rounded-sm px-3 py-2 text-body-sm text-rb-bone placeholder:text-rb-bone/30 focus:outline-none focus:border-primary transition-colors";

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-label-caps text-rb-bone/60">{label}</label>

      <div className="flex flex-col gap-2">
        {values.length === 0 && (
          <p className="text-data-mono text-rb-bone/40 text-[11px]">
            Sin imágenes — agregá una URL.
          </p>
        )}

        {values.map((url, idx) => (
          <div key={idx} className="flex gap-2">
            <InputField
              placeholder="https://..."
              label=""
              onChange={(e) => updateAt(idx, e)}
              value={url}
            />
            <ButtonGeneric
              type="Secondary"
              info={<X size={15} />}
              onClick={() => removeAt(idx)}
            />
          </div>
        ))}

        <button
          type="button"
          onClick={addEmpty}
          className="self-start flex items-center gap-1.5 text-label-caps text-primary hover:text-rb-red-hover transition-colors mt-1"
        ></button>
        <ButtonGeneric
          type="Primary"
          info={
            <>
              <Plus size={14} />
              Agregar URL
            </>
          }
          onClick={addEmpty}
          extraClass="flex w-fit"
        />
      </div>
    </div>
  );
}
