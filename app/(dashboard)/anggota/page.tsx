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

export default function AnggotaPage() {
  const { user } = useAuth()
  const isKementerian = user?.role === 'kementerian'

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">Manajemen Anggota</h1>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">
            Kelola database anggota produsen dan pembeli Nasional
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {isKementerian && (
            <ExportButton
              title="Data Anggota Koperasi Merah Putih"
              filename="KOPDES_Data_Anggota"
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
          <Button variant="outline" size="sm" className="h-8 text-[10px] font-black uppercase tracking-widest text-slate-600" asChild>
            <Link href="/anggota/onboarding">
              <CreditCard className="mr-2 h-3.5 w-3.5" />
              Onboarding
            </Link>
          </Button>
          <Button variant="outline" size="sm" className="h-8 text-[10px] font-black uppercase tracking-widest text-slate-600" asChild>
            <Link href="/anggota/verifikasi">
              <CheckCircle2 className="mr-2 h-3.5 w-3.5" />
              KYC
            </Link>
          </Button>
          <Button variant="outline" size="sm" className="h-8 text-[10px] font-black uppercase tracking-widest text-slate-600" asChild>
            <Link href="/anggota/profil">
              <Users className="mr-2 h-3.5 w-3.5" />
              Profil
            </Link>
          </Button>
          <Button size="sm" className="h-8 bg-slate-900 text-white hover:bg-slate-800 text-[10px] font-black uppercase tracking-widest" asChild>
            <Link href="/anggota/tambah">
              <Plus className="mr-2 h-3.5 w-3.5" />
              Tambah
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Total Anggota', value: filteredMembers.length.toLocaleString('id-ID'), sub: '+5% vs bln lalu', icon: Users, tone: 'emerald' },
          { label: 'Produsen Aktif', value: filteredMembers.filter(m => m.role === 'produsen' && m.status === 'active').length.toLocaleString('id-ID'), sub: `Tersebar di ${new Set(filteredMembers.map(m => m.village)).size} Desa`, icon: Activity, tone: 'slate' },
          { label: 'Pending KYC', value: filteredMembers.filter(m => m.status === 'pending').length.toLocaleString('id-ID'), sub: 'Perlu verifikasi', icon: AlertCircle, tone: 'rose' },
          { label: 'Total Simpanan', value: formatCurrency(filteredMembers.reduce((sum, m) => sum + m.financial.savings, 0)), sub: 'Akumulasi Dana', icon: TrendingUp, tone: 'emerald' },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-[0_4px_12px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between items-start">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <stat.icon className={`h-4 w-4 ${stat.tone === 'rose' ? 'text-rose-500' : stat.tone === 'emerald' ? 'text-emerald-500' : 'text-slate-400'}`} />
              </div>
              <CardTitle className="text-2xl font-black text-slate-900 tracking-tighter mt-1">{stat.value}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className={`text-[10px] font-bold ${stat.tone === 'rose' ? 'text-rose-600' : stat.tone === 'emerald' ? 'text-emerald-600' : 'text-slate-500'}`}>
                {stat.sub}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Kementerian National Filter Bar (if role permits) */}
      {isKementerian && (
        <div className="mb-4">
          <KementerianFilterBar
            filters={filters}
            setFilters={setFilters}
            search={search}
            setSearch={setSearch}
          />
        </div>
      )}

      {/* Local Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {!isKementerian && (
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Cari nama, No Anggota, atau NIK..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            )}
            <div className="flex gap-2">
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Peran" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Peran</SelectItem>
                  <SelectItem value="produsen">Produsen</SelectItem>
                  <SelectItem value="buyer">Pembeli</SelectItem>
                  <SelectItem value="both">Keduanya</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="inactive">Nonaktif</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-none shadow-[0_4px_12px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
        <CardHeader className="p-4 border-b border-slate-50 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-black text-slate-900 uppercase tracking-tight">Database Anggota</CardTitle>
              <CardDescription className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                Menampilkan {filteredMembers.length} record sesuai filter aktif
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="border-slate-100">
                <TableHead className="text-[10px] font-black text-slate-400 uppercase h-10 px-4">Anggota</TableHead>
                <TableHead className="text-[10px] font-black text-slate-400 uppercase h-10">ID Anggota</TableHead>
                <TableHead className="text-[10px] font-black text-slate-400 uppercase h-10">Peran</TableHead>
                <TableHead className="text-[10px] font-black text-slate-400 uppercase h-10">Lokasi</TableHead>
                <TableHead className="text-[10px] font-black text-slate-400 uppercase h-10">Komoditas</TableHead>
                <TableHead className="text-[10px] font-black text-slate-400 uppercase h-10 text-right">Simpanan</TableHead>
                <TableHead className="text-[10px] font-black text-slate-400 uppercase h-10">Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.map((member) => (
                <TableRow key={member.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors group">
                  <TableCell className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 border-none bg-slate-100">
                        <AvatarFallback className="bg-slate-100 text-slate-600 text-[10px] font-black uppercase">
                          {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-black text-xs text-slate-900 leading-none group-hover:text-emerald-600 transition-colors uppercase">{member.name}</p>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">
                          <Phone className="h-2.5 w-2.5" />
                          {member.phone}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs font-mono font-bold text-slate-500">{member.memberNumber}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize text-[9px] font-black px-1.5 py-0 border-slate-200 text-slate-600 uppercase">
                      {member.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-[10px] font-bold uppercase tracking-tight">
                      <p className="text-slate-900 truncate max-w-[120px]">{member.group}</p>
                      <div className="flex items-center gap-1 text-slate-400 mt-0.5">
                        <MapPin className="h-2.5 w-2.5" />
                        {member.village}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-[9px] font-black uppercase bg-slate-100 text-slate-600 border-none">
                      {member.mainCommodity}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-xs font-black text-slate-900">
                    {formatCurrency(member.financial.savings)}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={`text-[9px] font-black uppercase px-1.5 py-0 border-none ${
                        member.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                        member.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {member.status === 'active' ? 'Aktif' : member.status === 'pending' ? 'KYC' : 'OFF'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100">
                          <MoreHorizontal className="h-4 w-4 text-slate-400" />
                        </Button>
                      </DropdownMenuTrigger>
                       <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={() => handleViewMember(member)} className="cursor-pointer text-[10px] font-black uppercase tracking-widest text-slate-600">
                          <Eye className="mr-2 h-3.5 w-3.5" /> PROFIL
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditMember(member)} className="cursor-pointer text-[10px] font-black uppercase tracking-widest text-slate-600">
                          <Pencil className="mr-2 h-3.5 w-3.5" /> EDIT
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => {
                            if (confirm(`Hapus anggota ${member.name}?`)) {
                              handleDeleteMember(member.id)
                            }
                          }}
                          className="text-rose-600 cursor-pointer text-[10px] font-black uppercase tracking-widest"
                        >
                          <Trash2 className="mr-2 h-3.5 w-3.5" /> HAPUS
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
