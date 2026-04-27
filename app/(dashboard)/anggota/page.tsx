'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  AlertCircle,
  Activity,
  Download,
  Eye,
  MoreHorizontal,
  Pencil,
  Phone,
  Search,
  ShieldCheck,
  Trash2,
  TrendingUp,
  UserPlus,
  Users,
} from 'lucide-react'
import { toast } from 'sonner'
import { MemberDetailDialog } from '@/components/dialogs/member-detail-dialog'
import { EditMemberDialog } from '@/components/dialogs/edit-member-dialog'
import { KementerianFilterBar } from '@/components/dashboard/kementerian-filter-bar'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DataTable, type DataTableColumn } from '@/components/ui/data-table'
import { useAuth } from '@/lib/auth/use-auth'
import { members, type Member } from '@/lib/mock-data'
import { canAccessRoute } from '@/lib/rbac'
import type { ScopeFilters } from '@/lib/kementerian-dashboard-data'

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value)

export default function AnggotaPage() {
  const { user } = useAuth()
  const isKementerian = user?.role === 'kementerian'
  const canOpenVerification = user?.role ? canAccessRoute(user.role, '/anggota/verifikasi') : false
  const canOpenCreateMember = user?.role ? canAccessRoute(user.role, '/anggota/tambah') : false

  const [search, setSearch] = useState('')
  const [filterRole, setFilterRole] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filters, setFilters] = useState<ScopeFilters>({
    provinceId: 'all',
    regionId: 'all',
    villageId: 'all',
    cooperativeId: 'all',
    commodityId: 'all',
  })
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const matchesSearch =
        member.name.toLowerCase().includes(search.toLowerCase()) ||
        member.memberNumber.toLowerCase().includes(search.toLowerCase()) ||
        member.ktp.includes(search)
      const matchesRole = filterRole === 'all' || member.role === filterRole
      const matchesStatus = filterStatus === 'all' || member.status === filterStatus

      if (isKementerian) {
        const matchesProvince = filters.provinceId === 'all' || member.province.toUpperCase() === filters.provinceId
        const matchesRegion =
          filters.regionId === 'all' ||
          member.district.toUpperCase().includes(filters.regionId.split('-')[0])
        const matchesVillage =
          filters.villageId === 'all' ||
          member.village.toUpperCase().includes(filters.villageId.split('-').pop() || '')

        return (
          matchesSearch &&
          matchesRole &&
          matchesStatus &&
          matchesProvince &&
          matchesRegion &&
          matchesVillage
        )
      }

      return matchesSearch && matchesRole && matchesStatus
    })
  }, [search, filterRole, filterStatus, filters, isKementerian])

  const scaleFactor = useMemo(() => {
    if (filters.cooperativeId !== 'all') return 0.05
    if (filters.villageId !== 'all') return 0.1
    if (filters.regionId !== 'all') return 0.25
    if (filters.provinceId !== 'all') return 0.5
    return 1.0
  }, [filters])

  const handleViewMember = (member: Member) => {
    setSelectedMember(member)
    setDetailDialogOpen(true)
  }

  const handleEditMember = (member: Member) => {
    setSelectedMember(member)
    setEditDialogOpen(true)
  }

  const handleDeleteMember = (member: Member) => {
    toast.error(`Permintaan terminasi anggota ${member.name} memerlukan persetujuan ketua koperasi.`)
  }

  const kpis = [
    {
      label: 'Total Anggota',
      value: Math.floor(filteredMembers.length * 100 * scaleFactor).toLocaleString('id-ID'),
      sub: 'jiwa terdaftar',
      icon: Users,
      tone: 'secondary' as const,
    },
    {
      label: 'Produsen Aktif',
      value: Math.floor(
        filteredMembers.filter((m) => m.role === 'produsen').length * 100 * scaleFactor,
      ).toLocaleString('id-ID'),
      sub: 'unit produksi',
      icon: Activity,
      tone: 'success' as const,
    },
    {
      label: 'Antrean Audit',
      value: Math.floor(
        filteredMembers.filter((m) => m.status === 'pending').length * 10 * scaleFactor,
      ).toLocaleString('id-ID'),
      sub: 'perlu verifikasi',
      icon: AlertCircle,
      tone: 'primary' as const,
    },
    {
      label: 'Total Simpanan',
      value: `${(
        (filteredMembers.reduce((sum, m) => sum + m.financial.savings, 0) * 100 * scaleFactor) /
        1_000_000
      ).toFixed(1)} Jt`,
      sub: 'IDR terhimpun',
      icon: TrendingUp,
      tone: 'tertiary' as const,
    },
  ]

  const columns: DataTableColumn<Member>[] = [
    {
      key: 'identity',
      header: 'Identitas Anggota',
      cell: (member) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="text-xs font-medium">
              {member.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">{member.name}</p>
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <Phone className="h-3 w-3" /> {member.phone}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'memberNumber',
      header: 'ID Anggota',
      cell: (member) => <span className="font-mono text-xs text-muted-foreground">{member.memberNumber}</span>,
    },
    {
      key: 'role',
      header: 'Peran',
      cell: (member) => (
        <Badge variant="secondary">{member.role === 'produsen' ? 'Produsen' : 'Pembeli'}</Badge>
      ),
    },
    {
      key: 'region',
      header: 'Wilayah',
      cell: (member) => (
        <div className="min-w-0">
          <p className="truncate text-sm text-foreground">{member.village}</p>
          <p className="truncate text-xs text-muted-foreground">
            {member.district}, {member.province}
          </p>
        </div>
      ),
    },
    {
      key: 'commodity',
      header: 'Komoditas',
      cell: (member) => (
        <Badge variant="outline" className="border-success/30 bg-success/10 text-[color:var(--success)]">
          {member.mainCommodity}
        </Badge>
      ),
    },
    {
      key: 'savings',
      header: 'Simpanan',
      align: 'right',
      cell: (member) => <span className="tabular-nums">{formatCurrency(member.financial.savings)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      cell: (member) => (
        <Badge
          variant="outline"
          className={
            member.status === 'active'
              ? 'border-success/30 bg-success/10 text-[color:var(--success)]'
              : 'border-destructive/30 bg-destructive/10 text-destructive'
          }
        >
          {member.status === 'active' ? 'Aktif' : 'Audit'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      cell: (member) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => e.stopPropagation()}
              aria-label={`Aksi untuk ${member.name}`}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
            <DropdownMenuItem onClick={() => handleViewMember(member)}>
              <Eye className="mr-2 h-3.5 w-3.5" /> Profil lengkap
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEditMember(member)}>
              <Pencil className="mr-2 h-3.5 w-3.5" /> Edit data
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleDeleteMember(member)} className="text-destructive">
              <Trash2 className="mr-2 h-3.5 w-3.5" /> Terminasi anggota
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  return (
    <div className="page-shell">
      {/* Header */}
      <div className="page-header surface-card flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <h1 className="page-title">Pusat Data Anggota</h1>
            <p className="page-subtitle">
              Monitoring demografi & integritas KYC nasional ·{' '}
              {Math.floor(filteredMembers.length * 100 * scaleFactor).toLocaleString('id-ID')} entitas terdata
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {canOpenVerification && (
            <Button variant="outline" size="sm" asChild>
              <Link href="/anggota/verifikasi">
                <ShieldCheck className="mr-2 h-4 w-4" /> Audit KYC
              </Link>
            </Button>
          )}
          <Button size="sm" onClick={() => toast.success('Ekspor laporan PDF dimulai.')}>
            <Download className="mr-2 h-4 w-4" /> Ekspor PDF
          </Button>
        </div>
      </div>

      {isKementerian && <KementerianFilterBar filters={filters} setFilters={setFilters} />}

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className={`card-accent card-accent-${kpi.tone}`}>
            <CardContent className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                <kpi.icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <p className="metric-label">{kpi.label}</p>
                <p className="metric-value mt-1 truncate">{kpi.value}</p>
                <p className="text-xs text-muted-foreground">{kpi.sub}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter bar */}
      <Card>
        <CardContent>
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari nama, NIK, atau nomor anggota…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Filter peran" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua peran</SelectItem>
                  <SelectItem value="produsen">Produsen</SelectItem>
                  <SelectItem value="buyer">Pembeli</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua status</SelectItem>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="pending">Audit</SelectItem>
                </SelectContent>
              </Select>
              {canOpenCreateMember && (
                <Button asChild>
                  <Link href="/anggota/tambah">
                    <UserPlus className="mr-2 h-4 w-4" /> Tambah anggota
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="card-accent card-accent-secondary">
        <CardContent>
          <DataTable
            data={filteredMembers}
            columns={columns}
            rowKey={(member) => member.id}
            onRowClick={handleViewMember}
            empty="Tidak ada anggota yang cocok dengan filter."
          />
        </CardContent>
      </Card>

      <MemberDetailDialog member={selectedMember} open={detailDialogOpen} onOpenChange={setDetailDialogOpen} />
      <EditMemberDialog member={selectedMember} open={editDialogOpen} onOpenChange={setEditDialogOpen} />
    </div>
  )
}
