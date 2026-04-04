/**
 * Excel Export Utility
 * 
 * Uses 'xlsx' library to generate Excel files.
 */

import { utils, writeFile } from 'xlsx'

export interface ExcelExportOptions {
  title: string
  data: Array<Record<string, unknown>>
  filename?: string
}

export function exportToExcel(options: ExcelExportOptions) {
  const { title, data, filename = 'export.xlsx' } = options

  try {
    // Create worksheet from data
    const worksheet = utils.json_to_sheet(data)
    
    // Create workbook and add the worksheet
    const workbook = utils.book_new()
    utils.book_append_sheet(workbook, worksheet, title.slice(0, 31)) // Sheet name max 31 chars

    // Write file
    writeFile(workbook, filename)

    return { success: true, filename }
  } catch (error) {
    console.error('Excel export error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown export error'
    return { success: false, error: errorMessage }
  }
}
