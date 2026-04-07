'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Phone,
  MapPin,
  Users,
  Activity,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  CreditCard,
} from 'lucide-react'
import { MemberDetailDialog } from '@/components/dialogs/member-detail-dialog'
import { EditMemberDialog } from '@/components/dialogs/edit-member-dialog'
import { toast } from 'sonner'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useAuth } from '@/lib/auth/use-auth'
import {
  KEMENTERIAN_DASHBOARD_DATA,
  type ScopeFilters,
} from '@/lib/kementerian-dashboard-data'
import { KementerianFilterBar } from '@/components/dashboard/kementerian-filter-bar'
import { ExportButton } from '@/components/dashboard/export-button'
import { members } from '@/lib/mock-data'
import { canAccessRoute } from '@/lib/rbac'

export default function AnggotaPage() {
  const { user } = useAuth()
  const isKementerian = user?.role === 'kementerian'
  const canOpenOnboarding = user?.role ? canAccessRoute(user.role, '/anggota/onboarding') : false
  const canOpenVerification = user?.role ? canAccessRoute(user.role, '/anggota/verifikasi') : false
  const canOpenProfile = user?.role ? canAccessRoute(user.role, '/anggota/profil') : false
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

  const filteredMembers = membersList.filter((member) => {
    // Basic search
    const matchesSearch =
      member.name.toLowerCase().includes(search.toLowerCase()) ||
      member.memberNumber.toLowerCase().includes(search.toLowerCase()) ||
      member.ktp.includes(search)
    
    // Existing list filters
    const matchesRole = filterRole === 'all' || member.role === filterRole
    const matchesStatus = filterStatus === 'all' || member.status === filterStatus

    // National monitoring filters (Kementerian only)
    if (isKementerian) {
      const matchesProvince = filters.provinceId === 'all' || member.province.toUpperCase() === filters.provinceId
      // Note: In mock-data.ts, member has 'district', but in filters it's 'regionId'
      // We need to map these correctly. For now, let's assume 'district' in mock-data corresponds to 'region'
      const matchesRegion = filters.regionId === 'all' || member.district.toUpperCase().includes(filters.regionId.split('-')[0])
      const matchesVillage = filters.villageId === 'all' || member.village.toUpperCase().includes(filters.villageId.split('-').pop() || '')
      
      // Cooperative mapping might be tricky since mock members don't have cooperativeId
      // But they have 'group'. In a real app, they would have cooperativeId.
      
      return matchesSearch && matchesRole && matchesStatus && matchesProvince && matchesRegion && matchesVillage
    }
    
    return matchesSearch && matchesRole && matchesStatus
  })

  const handleViewMember = (member: any) => {
    setSelectedMember(member)
    setDetailDialogOpen(true)
  }

  const handleEditMember = (member: any) => {
    setSelectedMember(member)
    setEditDialogOpen(true)
  }

  const handleSaveMember = (updatedMember: any) => {
    setMembersList(membersList.map(m => m.id === updatedMember.id ? updatedMember : m))
    toast.success('Data anggota berhasil diperbarui')
  }

  const handleDeleteMember = (memberId: string) => {
    setMembersList(membersList.filter(m => m.id !== memberId))
    toast.success('Anggota berhasil dihapus')
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(val)
  }

  const toTitleCaseLabel = (value: string) =>
    value
      .replace(/[_-]+/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase())

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">PUSAT DATA ANGGOTA NASIONAL</h1>
          <p className="text-[10px] font-black text-slate-500 mt-1 uppercase tracking-widest leading-relaxed">
            PEMANTAUAN DEMOGRAFI & INTEGRITAS KYC ANGGOTA NASIONAL • {filteredMembers.length} ENTITAS TERDAFTAR
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {isKementerian && (
            <ExportButton
              title="MANIFEST_DATA_ANGGOTA_NASIONAL"
              filename="KOPDES_ANGGOTA_AUDIT"
              data={filteredMembers.map(m => ({
                'No. Anggota': m.memberNumber,
                'Nama': m.name,
                'NIK': m.ktp,
                'Telepon': m.phone,
                'Desa': m.village,
                'Peran': m.role,
                'Simpanan': m.financial.savings,
                'Status': m.status
              }))}
            />
          )}
          {canOpenOnboarding && (
            <Button variant="outline" size="sm" className="h-9 text-[10px] font-black uppercase tracking-widest border-slate-200 text-slate-600 rounded-none shadow-sm" asChild>
              <Link href="/anggota/onboarding">
                <CreditCard className="mr-2 h-3.5 w-3.5 text-blue-600" />
                ONBOARDING
              </Link>
            </Button>
          )}
          {canOpenVerification && (
            <Button variant="outline" size="sm" className="h-9 text-[10px] font-black uppercase tracking-widest border-slate-200 text-slate-600 rounded-none shadow-sm" asChild>
              <Link href="/anggota/verifikasi">
                <CheckCircle2 className="mr-2 h-3.5 w-3.5 text-emerald-600" />
                AUDIT KYC
              </Link>
            </Button>
          )}
          {canOpenCreateMember && (
            <Button size="sm" className="h-9 bg-slate-900 text-white hover:bg-slate-800 text-[10px] font-black uppercase tracking-widest px-6 rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] transition-all" asChild>
              <Link href="/anggota/tambah">
                <Plus className="mr-2 h-3.5 w-3.5" />
                REGISTRASI BARU
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'TOTAL ANGGOTA NASIONAL', value: Math.floor(filteredMembers.length * 100).toLocaleString('id-ID'), sub: '+5.2% VS BULAN LALU', icon: Users, tone: 'emerald' },
          { label: 'PRODUSEN AKTIF', value: Math.floor(filteredMembers.filter(m => m.role === 'produsen' && m.status === 'active').length * 100).toLocaleString('id-ID'), sub: `DISTRIBUSI DI ${new Set(filteredMembers.map(m => m.village)).size} NODES`, icon: Activity, tone: 'slate' },
          { label: 'PENDING KYC / AUDIT', value: (filteredMembers.filter(m => m.status === 'pending').length * 10).toLocaleString('id-ID'), sub: 'MEMERLUKAN INTERVENSI', icon: AlertCircle, tone: 'rose' },
          { label: 'AKUMULASI SIMPANAN', value: formatCurrency(filteredMembers.reduce((sum, m) => sum + m.financial.savings, 0) * 100), sub: 'TOTAL DANA TERKONSOLIDASI', icon: TrendingUp, tone: 'emerald' },
        ].map((stat, i) => (
          <Card key={i} className="border-none bg-white shadow-sm overflow-hidden rounded-none">
            <div className={`h-1 w-full border-t-4 ${stat.tone === 'rose' ? 'border-rose-500' : stat.tone === 'emerald' ? 'border-emerald-500' : 'border-slate-900'}`} />
            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between items-start">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                <stat.icon className={`h-4 w-4 ${stat.tone === 'rose' ? 'text-rose-500' : stat.tone === 'emerald' ? 'text-emerald-500' : 'text-slate-900'}`} />
              </div>
              <CardTitle className="text-xl font-black text-slate-900 mt-1">{stat.value}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className={`text-[10px] font-black uppercase tracking-tighter ${stat.tone === 'rose' ? 'text-rose-600' : stat.tone === 'emerald' ? 'text-emerald-600' : 'text-slate-500'}`}>
                {stat.sub}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Kementerian National Filter Bar (if role permits) */}
      {isKementerian && (
        <div className="mb-0">
          <KementerianFilterBar
            filters={filters}
            setFilters={setFilters}
            search={search}
            setSearch={setSearch}
          />
        </div>
      )}

      {/* Local Filters */}
      {!isKementerian && (
        <Card className="border-none bg-white shadow-sm overflow-hidden rounded-none">
          <div className="h-1 w-full bg-slate-900" />
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="CARI NAMA, NOMOR ANGGOTA, ATAU NIK..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-11 text-[10px] font-black uppercase tracking-widest bg-slate-50 border-slate-100 rounded-none focus-visible:ring-slate-900"
                />
              </div>
              <div className="flex gap-2">
                <Select value={filterRole} onValueChange={setFilterRole}>
                  <SelectTrigger className="h-11 w-[150px] text-[10px] font-black uppercase tracking-widest bg-slate-50 border-slate-100 rounded-none">
                    <Filter className="mr-2 h-3.5 w-3.5" />
                    <SelectValue placeholder="PERAN" />
                  </SelectTrigger>
                  <SelectContent className="rounded-none">
                    <SelectItem value="all" className="text-[10px] font-black uppercase">SEMUA PERAN</SelectItem>
                    <SelectItem value="produsen" className="text-[10px] font-black uppercase">PRODUSEN</SelectItem>
                    <SelectItem value="buyer" className="text-[10px] font-black uppercase">PEMBELI</SelectItem>
                    <SelectItem value="both" className="text-[10px] font-black uppercase">KEDUANYA</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="h-11 w-[150px] text-[10px] font-black uppercase tracking-widest bg-slate-50 border-slate-100 rounded-none">
                    <SelectValue placeholder="STATUS" />
                  </SelectTrigger>
                  <SelectContent className="rounded-none">
                    <SelectItem value="all" className="text-[10px] font-black uppercase">SEMUA STATUS</SelectItem>
                    <SelectItem value="active" className="text-[10px] font-black uppercase">AKTIF</SelectItem>
                    <SelectItem value="pending" className="text-[10px] font-black uppercase">PENDING</SelectItem>
                    <SelectItem value="inactive" className="text-[10px] font-black uppercase">NONAKTIF</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      <Card className="border-none bg-white shadow-sm overflow-hidden rounded-none">
        <div className="h-1 w-full bg-slate-900" />
        <CardHeader className="p-6 border-b border-slate-50">
          <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">MANIFEST DATABASE ANGGOTA</CardTitle>
          <CardDescription className="text-[10px] font-bold text-slate-500 uppercase mt-1">LOG AUDIT IDENTITAS & STATUS KEPATUHAN</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-900">
              <TableRow className="hover:bg-slate-900 border-none">
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 h-10 px-6">IDENTITAS ANGGOTA</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 h-10 px-6">ID ANGGOTA</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 h-10 px-6">PERAN</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 h-10 px-6">NODES / WILAYAH</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 h-10 px-6">KOMODITAS</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 h-10 px-6 text-right">SIMPANAN</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 h-10 px-6 text-center">STATUS</TableHead>
                <TableHead className="w-[50px] px-6"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.map((member) => (
                <TableRow key={member.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border-none bg-slate-100 rounded-none shadow-inner">
                        <AvatarFallback className="bg-slate-100 text-slate-600 text-[10px] font-black ">
                          {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-black text-xs text-slate-900 uppercase tracking-tight group-hover:text-emerald-600 transition-colors ">{member.name}</p>
                        <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 mt-0.5 uppercase tracking-widest">
                          <Phone className="h-2.5 w-2.5" />
                          {member.phone}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-[10px] font-mono font-black text-slate-500 uppercase">{member.memberNumber}</TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge className="text-[9px] font-black border-none px-1.5 h-4 uppercase rounded-none tracking-tighter bg-slate-100 text-slate-600">
                      {toTitleCaseLabel(member.role).toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="text-[9px] font-black uppercase tracking-widest">
                      <p className="text-slate-900 truncate max-w-[120px]">{member.group}</p>
                      <div className="flex items-center gap-1 text-slate-400 mt-0.5">
                        <MapPin className="h-2.5 w-2.5" />
                        {member.village}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge className="text-[9px] font-black border-none px-1.5 h-4 uppercase rounded-none tracking-tighter bg-emerald-50 text-emerald-700">
                      {member.mainCommodity.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right text-[10px] font-black text-slate-900">
                    {formatCurrency(member.financial.savings)}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-center">
                    <Badge 
                      className={`text-[9px] font-black px-1.5 h-4 border-none rounded-none tracking-widest ${
                        member.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                        member.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {member.status === 'active' ? 'AKTIF' : member.status === 'pending' ? 'AUDIT KYC' : 'OFF'}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100 rounded-none group-hover:bg-white group-hover:shadow-sm">
                          <MoreHorizontal className="h-4 w-4 text-slate-400" />
                        </Button>
                      </DropdownMenuTrigger>
                       <DropdownMenuContent align="end" className="w-44 rounded-none border-slate-200">
                        <DropdownMenuItem onClick={() => handleViewMember(member)} className="cursor-pointer text-[10px] font-black uppercase tracking-widest text-slate-600 focus:bg-slate-50">
                          <Eye className="mr-2 h-3.5 w-3.5" /> PROFIL LENGKAP
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditMember(member)} className="cursor-pointer text-[10px] font-black uppercase tracking-widest text-slate-600 focus:bg-slate-50">
                          <Pencil className="mr-2 h-3.5 w-3.5" /> MODIFIKASI DATA
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-slate-100" />
                        <DropdownMenuItem 
                          onClick={() => {
                            if (confirm(`Hapus anggota ${member.name}?`)) {
                              handleDeleteMember(member.id)
                            }
                          }}
                          className="text-rose-600 cursor-pointer text-[10px] font-black uppercase tracking-widest focus:bg-rose-50"
                        >
                          <Trash2 className="mr-2 h-3.5 w-3.5" /> TERMINASI ENTITAS
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <MemberDetailDialog
        member={selectedMember}
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        onEdit={(member) => {
          setDetailDialogOpen(false)
          handleEditMember(member)
        }}
        onDelete={handleDeleteMember}
      />

      <EditMemberDialog
        member={selectedMember}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleSaveMember}
      />
    </div>
  )
}
