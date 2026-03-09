import { KopdesLayout } from '@/components/kopdes-layout'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <KopdesLayout>{children}</KopdesLayout>
}
