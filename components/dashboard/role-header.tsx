interface RoleHeaderProps {
  title: string
  subtitle: string
  actions?: React.ReactNode
}

export function RoleHeader({ title, subtitle, actions }: RoleHeaderProps) {
  return (
    <div className="page-header">
      <div className="space-y-1">
        <h2 className="page-title">{title}</h2>
        <p className="page-subtitle">{subtitle}</p>
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  )
}
