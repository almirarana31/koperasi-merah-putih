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
import { members } from '@/lib/mock-data'

export default function AnggotaPage() {
  const [search, setSearch] = useState('')
  const [filterRole, setFilterRole] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [selectedMember, setSelectedMember] = useState<any>(null)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [membersList, setMembersList] = useState(members)

  const filteredMembers = membersList.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(search.toLowerCase()) ||
      member.memberNumber.toLowerCase().includes(search.toLowerCase()) ||
      member.ktp.includes(search)
    
    const matchesRole = filterRole === 'all' || member.role === filterRole
    const matchesStatus = filterStatus === 'all' || member.status === filterStatus
    
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
          <h1 className="text-2xl font-bold tracking-tight text-primary">Manajemen Anggota</h1>
          <p className="text-muted-foreground">
            Kelola database anggota produsen dan pembeli Koperasi Merah Putih
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" asChild>
            <Link href="/anggota/onboarding">
              <CreditCard className="mr-2 h-4 w-4" />
              Onboarding KTP
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/anggota/verifikasi">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Verifikasi KYC
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/anggota/profil">
              <Users className="mr-2 h-4 w-4" />
              Profil Member
            </Link>
          </Button>
          <Button className="bg-primary hover:bg-primary/90" asChild>
            <Link href="/anggota/tambah">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Anggota
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Anggota</CardDescription>
            <CardTitle className="text-2xl">{members.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-xs text-emerald-600">
              <TrendingUp className="mr-1 h-3 w-3" />
              +5% dari bulan lalu
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Produsen Aktif</CardDescription>
            <CardTitle className="text-2xl">
              {members.filter(m => m.role === 'produsen' && m.status === 'active').length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-xs text-muted-foreground">
              <Users className="mr-1 h-3 w-3" />
              Tersebar di {new Set(members.map(m => m.village)).size} Desa
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Menunggu Verifikasi</CardDescription>
            <CardTitle className="text-2xl text-amber-600">
              {members.filter(m => m.status === 'pending').length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-xs text-amber-600">
              <AlertCircle className="mr-1 h-3 w-3" />
              Perlu tindakan segera
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Simpanan</CardDescription>
            <CardTitle className="text-2xl">
              {formatCurrency(members.reduce((sum, m) => sum + m.financial.savings, 0))}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">Akumulasi dana anggota</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari nama, No Anggota, atau NIK..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
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
      <Card>
        <CardHeader>
          <CardTitle>Data Anggota</CardTitle>
          <CardDescription>
            Menampilkan {filteredMembers.length} anggota sesuai filter
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Anggota</TableHead>
                <TableHead>No. Anggota</TableHead>
                <TableHead>Peran</TableHead>
                <TableHead>Kelompok / Desa</TableHead>
                <TableHead>Komoditas</TableHead>
                <TableHead className="text-right">Simpanan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border">
                        <AvatarFallback className="bg-primary/5 text-primary text-xs">
                          {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm leading-none mb-1">{member.name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {member.phone}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-mono">{member.memberNumber}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize text-[10px] px-1.5 py-0">
                      {member.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs">
                      <p className="font-medium truncate max-w-[120px]">{member.group}</p>
                      <div className="flex items-center gap-1 text-muted-foreground mt-0.5">
                        <MapPin className="h-3 w-3" />
                        {member.village}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-[10px] font-normal">
                      {member.mainCommodity}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-sm font-medium">
                    {formatCurrency(member.financial.savings)}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={`text-[10px] px-1.5 py-0 ${
                        member.status === 'active' ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10' :
                        member.status === 'pending' ? 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/10' :
                        'bg-slate-100 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {member.status === 'active' ? 'Aktif' : member.status === 'pending' ? 'Verifikasi' : 'Nonaktif'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                       <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewMember(member)} className="cursor-pointer">
                          <Eye className="mr-2 h-4 w-4" /> Lihat Profil
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditMember(member)} className="cursor-pointer">
                          <Pencil className="mr-2 h-4 w-4" /> Edit Data
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => {
                            if (confirm(`Hapus anggota ${member.name}?`)) {
                              handleDeleteMember(member.id)
                            }
                          }}
                          className="text-destructive cursor-pointer"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Hapus
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
