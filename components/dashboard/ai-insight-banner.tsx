import { Zap } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface AiInsightBannerProps {
  title: string
  description: string
  action?: React.ReactNode
}

export function AiInsightBanner({ title, description, action }: AiInsightBannerProps) {
  return (
    <Card className="card-accent card-accent-tertiary">
      <CardContent className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-[color:var(--dashboard-tertiary-soft)] text-[color:var(--dashboard-tertiary)]">
            <Zap className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{title}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
          </div>
        </div>
        {action && <div className="w-full sm:w-auto">{action}</div>}
      </CardContent>
    </Card>
  )
}
