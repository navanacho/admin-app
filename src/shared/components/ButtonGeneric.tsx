import { ReactNode } from "react"

export function ButtonGeneric({
  info,
  onClick,
  extraClass,
  type = "Primary",
  submit = false,
  disabled = false,
}: {
  info: ReactNode
  onClick?: () => void
  extraClass?: string
  /** Variante visual */
  type?: "Primary" | "Secondary"
  /** true → el botón actúa como submit del form más cercano */
  submit?: boolean
  disabled?: boolean
}) {
  const baseClass =
    type === "Primary"
      ? "bg-primary text-on-primary shadow-red enabled:hover:bg-rb-red-hover"
      : "bg-surface border border-outline text-on-surface enabled:hover:bg-surface-container"

  return (
    <button
      disabled={disabled}
      type={submit ? "submit" : "button"}
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-3 text-label-caps rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none ${baseClass} ${extraClass ?? ""}`}
    >
      {info}
    </button>
  )
}
