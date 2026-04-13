'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Eye,
  Filter,
  MapPin,
  MoreHorizontal,
  Pencil,
  Phone,
  Plus,
  Search,
  Trash2,
  TrendingUp,
  Users,
  Activity,
  Download,
  UserPlus,
  ShieldCheck,
} from 'lucide-react'
import { toast } from 'sonner'
import { MemberDetailDialog } from '@/components/dialogs/member-detail-dialog'
import { EditMemberDialog } from '@/components/dialogs/edit-member-dialog'
import { KementerianFilterBar } from '@/components/dashboard/kementerian-filter-bar'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useAuth } from '@/lib/auth/use-auth'
import { members } from '@/lib/mock-data'
import { canAccessRoute } from '@/lib/rbac'
import type { ScopeFilters } from '@/lib/kementerian-dashboard-data'

export default function AnggotaPage() {
  const { user } = useAuth()
  const isKementerian = user?.role === 'kementerian'
  const canOpenOnboarding = user?.role ? canAccessRoute(user.role, '/anggota/onboarding') : false
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
  const [selectedMember, setSelectedMember] = useState<any>(null)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [membersList, setMembersList] = useState(members)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState('10')

  const filteredMembers = useMemo(() => {
    return membersList.filter((member) => {
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
  }, [membersList, search, filterRole, filterStatus, filters, isKementerian])

  const scaleFactor = useMemo(() => {
    if (filters.cooperativeId !== 'all') return 0.05
    if (filters.villageId !== 'all') return 0.1
    if (filters.regionId !== 'all') return 0.25
    if (filters.provinceId !== 'all') return 0.5
    return 1.0
  }, [filters])

  const pageSizeNumber = Number(pageSize)
  const totalPages = Math.max(1, Math.ceil(filteredMembers.length / pageSizeNumber))
  const paginatedMembers = filteredMembers.slice((page - 1) * pageSizeNumber, page * pageSizeNumber)

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(value)

  const handleAction = (action: string) => {
    toast.success(`Aksi ${action} berhasil diproses secara nasional`)
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-none bg-slate-900 flex items-center justify-center shadow-xl">
            <Users className="h-7 w-7 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Pusat Data Anggota</h1>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">
              Monitoring Demografi & Integritas KYC Nasional • {Math.floor(filteredMembers.length * 100 * scaleFactor).toLocaleString()} Entitas Terdata
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {canOpenVerification && (
            <Button 
              variant="outline" 
              size="sm" 
              asChild
              className="h-10 rounded-none text-[10px] font-black uppercase tracking-widest text-slate-600 border-slate-200 shadow-none bg-white hover:bg-slate-50"
            >
              <Link href="/anggota/verifikasi">
                <ShieldCheck className="h-4 w-4 mr-2 text-emerald-600" />
                Audit KYC Nasional
              </Link>
            </Button>
          )}
          <Button 
            size="sm" 
            onClick={() => handleAction('Ekspor')}
            className="h-10 rounded-none bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest px-6 shadow-none"
          >
            <Download className="h-4 w-4 mr-2" />
            Ekspor Laporan PDF
          </Button>
        </div>
      </div>

      <KementerianFilterBar filters={filters} setFilters={setFilters} />

      {/* High-Density KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Anggota', value: Math.floor(filteredMembers.length * 100 * scaleFactor).toLocaleString(), sub: 'JIWA TERDAFTAR', icon: Users, color: 'text-slate-900' },
          { label: 'Produsen Aktif', value: Math.floor(filteredMembers.filter(m => m.role === 'produsen').length * 100 * scaleFactor).toLocaleString(), sub: 'UNIT PRODUKSI', icon: Activity, color: 'text-emerald-600' },
          { label: 'Antrean Audit', value: Math.floor(filteredMembers.filter(m => m.status === 'pending').length * 10 * scaleFactor).toLocaleString(), sub: 'PERLU VERIFIKASI', icon: AlertCircle, color: 'text-rose-600' },
          { label: 'Total Simpanan', value: (filteredMembers.reduce((sum, m) => sum + m.financial.savings, 0) * 100 * scaleFactor / 1000000).toFixed(1), sub: 'JUTA IDR', icon: TrendingUp, color: 'text-blue-600' },
        ].map((s, i) => (
          <Card key={i} className="rounded-none border-none shadow-sm bg-white overflow-hidden">
            <div className={`h-1.5 w-full ${s.color.includes('emerald') ? 'bg-emerald-500' : s.color.includes('rose') ? 'bg-rose-500' : s.color.includes('blue') ? 'bg-blue-500' : 'bg-slate-900'}`} />
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-none bg-slate-50 flex items-center justify-center border border-slate-100">
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{s.label}</p>
                <div className="flex items-baseline gap-1 mt-1.5">
                  <span className={`text-xl font-black ${s.color} leading-none`}>{s.value}</span>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{s.sub}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search & Action Bar */}
      <Card className="rounded-none border-none shadow-sm bg-slate-50/50">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                placeholder="CARI NAMA, NIK, ATAU NOMOR ANGGOTA..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-none pl-9 bg-white border border-slate-200 h-11 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:ring-1 focus:ring-slate-900 placeholder:text-slate-300"
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="w-[180px] rounded-none h-11 bg-white border-slate-200 text-[10px] font-black uppercase tracking-widest shadow-none">
                  <SelectValue placeholder="FILTER PERAN" />
                </SelectTrigger>
                <SelectContent className="rounded-none">
                  <SelectItem value="all" className="text-[10px] font-black uppercase tracking-widest">SEMUA PERAN</SelectItem>
                  <SelectItem value="produsen" className="text-[10px] font-black uppercase tracking-widest">PRODUSEN</SelectItem>
                  <SelectItem value="buyer" className="text-[10px] font-black uppercase tracking-widest">PEMBELI</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px] rounded-none h-11 bg-white border-slate-200 text-[10px] font-black uppercase tracking-widest shadow-none">
                  <SelectValue placeholder="FILTER STATUS" />
                </SelectTrigger>
                <SelectContent className="rounded-none">
                  <SelectItem value="all" className="text-[10px] font-black uppercase tracking-widest">SEMUA STATUS</SelectItem>
                  <SelectItem value="active" className="text-[10px] font-black uppercase tracking-widest">AKTIF</SelectItem>
                  <SelectItem value="pending" className="text-[10px] font-black uppercase tracking-widest">AUDIT</SelectItem>
                </SelectContent>
              </Select>
              {canOpenCreateMember && (
                <Button 
                  asChild
                  className="rounded-none h-11 bg-slate-900 hover:bg-slate-800 text-white font-black text-[10px] uppercase tracking-widest px-6 shadow-none"
                >
                  <Link href="/anggota/tambah">
                    <UserPlus className="h-4 w-4 mr-2" /> Tambah Anggota
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Data Table */}
      <Card className="rounded-none border-none shadow-sm overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-100">
              <TableRow className="border-none bg-slate-100 hover:bg-slate-100">
                <TableHead className="h-12 px-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Identitas Anggota</TableHead>
                <TableHead className="h-12 px-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">ID Anggota</TableHead>
                <TableHead className="h-12 px-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Peran</TableHead>
                <TableHead className="h-12 px-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Wilayah</TableHead>
                <TableHead className="h-12 px-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Komoditas</TableHead>
                <TableHead className="h-12 px-6 text-right text-[10px] font-black text-slate-500 uppercase tracking-widest">Simpanan</TableHead>
                <TableHead className="h-12 px-6 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</TableHead>
                <TableHead className="h-12 px-6 text-right text-[10px] font-black text-slate-500 uppercase tracking-widest">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedMembers.map((member) => (
                <TableRow key={member.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 rounded-none border border-slate-100 shadow-sm">
                        <AvatarFallback className="text-[10px] font-black bg-slate-50 text-slate-400">
                          {member.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-xs font-black text-slate-900 uppercase tracking-tight leading-none">{member.name}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 flex items-center gap-1">
                          <Phone className="h-2.5 w-2.5" /> {member.phone}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 font-mono text-[10px] font-black text-slate-400 uppercase tracking-tighter">{member.memberNumber}</TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge className="rounded-none border-none shadow-none text-[9px] font-black uppercase tracking-widest px-2 h-5 bg-slate-100 text-slate-600">
                      {member.role === 'produsen' ? 'PRODUSEN' : 'PEMBELI'}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-900 uppercase leading-none">{member.village}</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{member.district}, {member.province}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge className="rounded-none border-none shadow-none text-[9px] font-black uppercase tracking-widest px-2 h-5 bg-emerald-50 text-emerald-700">
                      {member.mainCommodity.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    <span className="text-xs font-black text-slate-900">{formatCurrency(member.financial.savings)}</span>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-center">
                    <Badge className={`rounded-none border-none shadow-none text-[9px] font-black uppercase tracking-widest px-2 h-5 ${
                      member.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {member.status === 'active' ? 'AKTIF' : 'AUDIT'}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none text-slate-400 hover:text-slate-900 hover:bg-slate-100">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-none border-slate-200">
                        <DropdownMenuItem className="text-[10px] font-black uppercase tracking-widest py-2">
                          <Eye className="mr-2 h-3.5 w-3.5" /> PROFIL LENGKAP
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-[10px] font-black uppercase tracking-widest py-2">
                          <Pencil className="mr-2 h-3.5 w-3.5" /> EDIT DATA
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-slate-100" />
                        <DropdownMenuItem className="text-[10px] font-black uppercase tracking-widest text-rose-600 py-2">
                          <Trash2 className="mr-2 h-3.5 w-3.5" /> TERMINASI ANGGOTA
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-2">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          MENAMPILKAN {paginatedMembers.length} DARI {filteredMembers.length} ENTITAS • HALAMAN {page} DARI {totalPages}
        </p>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="h-9 rounded-none text-[10px] font-black uppercase tracking-widest border-slate-200 px-4 bg-white shadow-none"
          >
            <ChevronLeft className="h-3.5 w-3.5 mr-1.5" /> Sebelumnya
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
            className="h-9 rounded-none text-[10px] font-black uppercase tracking-widest border-slate-200 px-4 bg-white shadow-none"
          >
            Berikutnya <ChevronRight className="h-3.5 w-3.5 ml-1.5" />
          </Button>
        </div>
      </div>

      <MemberDetailDialog
        member={selectedMember}
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
      />

      <EditMemberDialog
        member={selectedMember}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />
    </div>
  )
}
