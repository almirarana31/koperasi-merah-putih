'use client'

import { useState } from 'react'
import { Download, FileText, FileSpreadsheet, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { exportToPDF } from '@/lib/pdf-export'
import { exportToExcel } from '@/lib/excel-export'
import { toast } from 'sonner'

interface ExportButtonProps {
  title: string
  filename: string
  data: Array<Record<string, any>>
  columns?: string[]
}

export function ExportButton({ title, filename, data, columns }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handlePDF = async () => {
    if (data.length === 0) {
      toast.error('Tidak ada data untuk diexport')
      return
    }
    
    setIsExporting(true)
    toast.info(`Sedang menyiapkan PDF...`)
    
    try {
      const result = await exportToPDF({
        title,
        data,
        columns,
        filename: `${filename}_${new Date().getTime()}.pdf`,
        orientation: 'landscape'
      })
      
      if (result.success) {
        toast.success('PDF berhasil diunduh')
      } else {
        toast.error(`Gagal export PDF: ${result.error}`)
      }
    } catch (err) {
      toast.error('Terjadi kesalahan saat export PDF')
    } finally {
      setIsExporting(false)
    }
  }

  const handleExcel = () => {
    if (data.length === 0) {
      toast.error('Tidak ada data untuk diexport')
      return
    }

    setIsExporting(true)
    toast.info(`Sedang menyiapkan Excel...`)
    
    try {
      const result = exportToExcel({
        title,
        data,
        filename: `${filename}_${new Date().getTime()}.xlsx`
      })
      
      if (result.success) {
        toast.success('Excel berhasil diunduh')
      } else {
        toast.error(`Gagal export Excel: ${result.error}`)
      }
    } catch (err) {
      toast.error('Terjadi kesalahan saat export Excel')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-slate-900" disabled={isExporting}>
          <Download className="h-3.5 w-3.5 mr-2" />
          Export
          <ChevronDown className="h-3 w-3 ml-2 text-slate-400" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onClick={handlePDF} className="cursor-pointer text-[10px] font-black uppercase tracking-widest text-slate-600">
          <FileText className="h-4 w-4 mr-2 text-rose-600" />
          Format PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExcel} className="cursor-pointer text-[10px] font-black uppercase tracking-widest text-slate-600">
          <FileSpreadsheet className="h-4 w-4 mr-2 text-emerald-600" />
          Format Excel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
