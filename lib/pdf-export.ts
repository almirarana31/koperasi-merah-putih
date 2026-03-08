/**
 * PDF Export Utility
 * 
 * This utility provides functions to export data to PDF format.
 * Uses jsPDF library for PDF generation.
 * 
 * Usage:
 * import { exportToPDF } from '@/lib/pdf-export'
 * exportToPDF({ title: 'Report', data: [...], filename: 'report.pdf' })
 */

export interface PDFExportOptions {
  title: string
  subtitle?: string
  data: any[]
  columns?: string[]
  filename?: string
  orientation?: 'portrait' | 'landscape'
}

export async function exportToPDF(options: PDFExportOptions) {
  const {
    title,
    subtitle,
    data,
    columns,
    filename = 'export.pdf',
    orientation = 'portrait'
  } = options

  try {
    // Dynamically import jsPDF to reduce bundle size
    const { default: jsPDF } = await import('jspdf')
    const { default: autoTable } = await import('jspdf-autotable')

    const doc = new jsPDF({
      orientation,
      unit: 'mm',
      format: 'a4'
    })

    // Add title
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.text(title, 14, 20)

    // Add subtitle if provided
    if (subtitle) {
      doc.setFontSize(12)
      doc.setFont('helvetica', 'normal')
      doc.text(subtitle, 14, 28)
    }

    // Add generation date
    doc.setFontSize(10)
    doc.setTextColor(128, 128, 128)
    const dateStr = new Date().toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    doc.text(`Generated: ${dateStr}`, 14, subtitle ? 35 : 28)

    // Prepare table data
    const tableColumns = columns || (data.length > 0 ? Object.keys(data[0]) : [])
    const tableRows = data.map(item => 
      tableColumns.map(col => item[col] ?? '-')
    )

    // Add table
    autoTable(doc, {
      head: [tableColumns],
      body: tableRows,
      startY: subtitle ? 40 : 33,
      theme: 'grid',
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [16, 185, 129], // Emerald-500
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251], // Gray-50
      },
    })

    // Add footer with page numbers
    const pageCount = doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.setTextColor(128, 128, 128)
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.getWidth() / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      )
    }

    // Save the PDF
    doc.save(filename)

    return { success: true, filename }
  } catch (error) {
    console.error('PDF export error:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Export chart/graph to PDF
 */
export async function exportChartToPDF(options: {
  title: string
  chartElement: HTMLElement
  filename?: string
}) {
  const { title, chartElement, filename = 'chart.pdf' } = options

  try {
    const { default: jsPDF } = await import('jspdf')
    const { default: html2canvas } = await import('html2canvas')

    // Convert chart to canvas
    const canvas = await html2canvas(chartElement, {
      backgroundColor: '#ffffff',
      scale: 2,
    })

    const imgData = canvas.toDataURL('image/png')
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    })

    // Add title
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text(title, 14, 15)

    // Calculate image dimensions to fit page
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const imgWidth = pageWidth - 28 // 14mm margin on each side
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    // Add image
    doc.addImage(imgData, 'PNG', 14, 25, imgWidth, Math.min(imgHeight, pageHeight - 40))

    // Save
    doc.save(filename)

    return { success: true, filename }
  } catch (error) {
    console.error('Chart export error:', error)
    return { success: false, error: error.message }
  }
}
