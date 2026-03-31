export type DialogOpenProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export type DialogSaveProps<T = unknown> = DialogOpenProps & {
  onSave?: (payload: T) => void
}
