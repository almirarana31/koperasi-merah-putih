import type { LucideIcon } from 'lucide-react'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export type KpiAccent = 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger'

interface KpiCardProps {
  label: string
  value: React.ReactNode
  change?: string
  trend?: 'up' | 'down' | 'neutral'
  icon: LucideIcon
  accent?: KpiAccent
  className?: string
}

const TREND_CLASS: Record<'up' | 'down' | 'neutral', string> = {
  up: 'text-[color:var(--success)]',
  down: 'text-destructive',
  neutral: 'text-muted-foreground',
}

export function KpiCard({
  label,
  value,
  change,
  trend = 'neutral',
  icon: Icon,
  accent = 'secondary',
  className,
}: KpiCardProps) {
  return (
    <Card className={cn(`card-accent card-accent-${accent}`, className)}>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted text-muted-foreground">
            <Icon className="h-5 w-5" />
          </div>
          {change && (
            <div className={cn('flex items-center gap-1 text-xs font-medium', TREND_CLASS[trend])}>
              {trend === 'up' && <ArrowUpRight className="h-3 w-3" />}
              {trend === 'down' && <ArrowDownRight className="h-3 w-3" />}
              {change}
            </div>
          )}
        </div>
        <div className="mt-4">
          <p className="metric-label">{label}</p>
          <p className="metric-value mt-1 truncate">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}
