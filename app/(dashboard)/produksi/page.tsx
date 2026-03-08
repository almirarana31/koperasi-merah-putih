'use client'

import { useState } from 'react'
import {
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Eye,
  CheckCircle,
  Calendar,
  User,
  Package,
} from 'lucide-react'
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { productions, formatDate, getStatusColor } from '@/lib/data'

const gradeColors: Record<string, string> = {
  A: 'bg-emerald-500/10 text-emerald-500',
  B: 'bg-amber-500/10 text-amber-500',
  C: 'bg-red-500/10 text-red-500',
}

export default function ProduksiPage() {
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filteredProductions = productions.filter((prod) => {
    const matchesSearch =
      prod.memberNama.toLowerCase().includes(search.toLowerCase()) ||
      prod.komoditasNama.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = filterStatus === 'all' || prod.status === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Catatan Panen</h1>
          <p className="text-muted-foreground">
            Kelola data produksi dan panen anggota
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Catat Panen
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Catat Panen Baru</DialogTitle>
              <DialogDescription>
                Input data hasil panen dari anggota
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="anggota">Anggota</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih anggota" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M001">Pak Slamet Widodo</SelectItem>
                    <SelectItem value="M002">Bu Sri Wahyuni</SelectItem>
                    <SelectItem value="M003">Pak Ahmad Sudirman</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="komoditas">Komoditas</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih komoditas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="C001">Beras Premium</SelectItem>
                    <SelectItem value="C003">Jagung Pipil</SelectItem>
                    <SelectItem value="C004">Cabai Merah</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="jumlah">Jumlah</Label>
                  <Input id="jumlah" type="number" placeholder="0" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="grade">Grade</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">Grade A</SelectItem>
                      <SelectItem value="B">Grade B</SelectItem>
                      <SelectItem value="C">Grade C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tanggal">Tanggal Panen</Label>
                <Input id="tanggal" type="date" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Batal
              </Button>
              <Button onClick={() => setIsDialogOpen(false)}>Simpan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{productions.length}</p>
                <p className="text-xs text-muted-foreground">Total Catatan</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {productions.filter((p) => p.status === 'disimpan').length}
                </p>
                <p className="text-xs text-muted-foreground">Disimpan</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                <Calendar className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {productions.filter((p) => p.status === 'dicatat').length}
                </p>
                <p className="text-xs text-muted-foreground">Menunggu Verifikasi</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <User className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {new Set(productions.map((p) => p.memberId)).size}
                </p>
                <p className="text-xs text-muted-foreground">Produsen Aktif</p>
              </div>
            </div>
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
                placeholder="Cari anggota atau komoditas..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[160px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="dicatat">Dicatat</SelectItem>
                <SelectItem value="diverifikasi">Diverifikasi</SelectItem>
                <SelectItem value="disimpan">Disimpan</SelectItem>
                <SelectItem value="terjual">Terjual</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Produksi</CardTitle>
          <CardDescription>
            {filteredProductions.length} catatan panen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Anggota</TableHead>
                <TableHead>Komoditas</TableHead>
                <TableHead>Jumlah</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Tanggal Panen</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProductions.map((prod) => (
                <TableRow key={prod.id}>
                  <TableCell className="font-mono text-sm">{prod.id}</TableCell>
                  <TableCell className="font-medium">{prod.memberNama}</TableCell>
                  <TableCell>{prod.komoditasNama}</TableCell>
                  <TableCell>
                    {prod.jumlah} {prod.satuan}
                  </TableCell>
                  <TableCell>
                    <Badge className={gradeColors[prod.grade]}>
                      Grade {prod.grade}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(prod.tanggalPanen)}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(prod.status)}>
                      {prod.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          Lihat Detail
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Verifikasi
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
    </div>
  )
}
