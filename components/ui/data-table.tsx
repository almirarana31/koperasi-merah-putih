'use client'

import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
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

export type DataTableAlign = 'left' | 'center' | 'right'

export type DataTableColumn<T> = {
  key: string
  header: ReactNode
  cell: (row: T, rowNumber: number) => ReactNode
  align?: DataTableAlign
  headerClassName?: string
  cellClassName?: string
  width?: string
}

interface DataTableProps<T> {
  data: T[]
  columns: DataTableColumn<T>[]
  rowKey: (row: T, index: number) => string
  pageSize?: number
  pageSizeOptions?: number[]
  showRowNumbers?: boolean
  rowNumberHeader?: ReactNode
  onRowClick?: (row: T) => void
  rowClassName?: (row: T) => string | undefined
  empty?: ReactNode
  className?: string
  /** Render the footer pagination — defaults to true. Hide for very small fixed lists. */
  pagination?: boolean
}

const ALIGN_CLASS: Record<DataTableAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
}

export function DataTable<T>({
  data,
  columns,
  rowKey,
  pageSize: initialPageSize = 10,
  pageSizeOptions = [10, 25, 50, 100],
  showRowNumbers = true,
  rowNumberHeader = '#',
  onRowClick,
  rowClassName,
  empty,
  className,
  pagination = true,
}: DataTableProps<T>) {
  const [pageSize, setPageSize] = useState(initialPageSize)
  const [page, setPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(data.length / pageSize))

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  useEffect(() => {
    setPage(1)
  }, [data.length, pageSize])

  const pagedData = useMemo(() => {
    if (!pagination) return data
    const start = (page - 1) * pageSize
    return data.slice(start, start + pageSize)
  }, [data, page, pageSize, pagination])

  const startIndex = pagination ? (page - 1) * pageSize : 0
  const showingFrom = data.length === 0 ? 0 : startIndex + 1
  const showingTo = startIndex + pagedData.length

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <Table>
        <TableHeader>
          <TableRow>
            {showRowNumbers && (
              <TableHead className="w-12 text-center text-muted-foreground">
                {rowNumberHeader}
              </TableHead>
            )}
            {columns.map((col) => (
              <TableHead
                key={col.key}
                style={col.width ? { width: col.width } : undefined}
                className={cn(ALIGN_CLASS[col.align ?? 'left'], col.headerClassName)}
              >
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {pagedData.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length + (showRowNumbers ? 1 : 0)}
                className="h-32 text-center text-sm text-muted-foreground"
              >
                {empty ?? 'Tidak ada data untuk ditampilkan.'}
              </TableCell>
            </TableRow>
          ) : (
            pagedData.map((row, idx) => {
              const rowNumber = startIndex + idx + 1
              return (
                <TableRow
                  key={rowKey(row, startIndex + idx)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn(onRowClick && 'cursor-pointer', rowClassName?.(row))}
                >
                  {showRowNumbers && (
                    <TableCell className="text-center font-medium text-muted-foreground tabular-nums">
                      {rowNumber}
                    </TableCell>
                  )}
                  {columns.map((col) => (
                    <TableCell
                      key={col.key}
                      className={cn(ALIGN_CLASS[col.align ?? 'left'], col.cellClassName)}
                    >
                      {col.cell(row, rowNumber)}
                    </TableCell>
                  ))}
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>

      {pagination && data.length > 0 && (
        <div className="flex flex-col gap-3 px-1 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            Menampilkan {showingFrom}–{showingTo} dari {data.length} entri
          </p>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Baris per halaman</span>
              <Select value={String(pageSize)} onValueChange={(v) => setPageSize(Number(v))}>
                <SelectTrigger className="h-8 w-[72px] text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {pageSizeOptions.map((size) => (
                    <SelectItem key={size} value={String(size)} className="text-xs">
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-1">
              <Button
                size="icon"
                variant="outline"
                className="h-8 w-8"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                aria-label="Halaman sebelumnya"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="px-2 text-xs text-muted-foreground tabular-nums">
                {page} / {totalPages}
              </span>
              <Button
                size="icon"
                variant="outline"
                className="h-8 w-8"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                aria-label="Halaman berikutnya"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
