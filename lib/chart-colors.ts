/**
 * Chart Color Configuration
 * 
 * Centralized color palette for all charts and graphs
 * Uses Tailwind CSS color scheme for consistency
 */

export const chartColors = {
  // Primary colors for main data series
  primary: '#10b981',      // emerald-500
  secondary: '#3b82f6',    // blue-500
  tertiary: '#f59e0b',     // amber-500
  quaternary: '#ef4444',   // red-500
  quinary: '#8b5cf6',      // violet-500
  senary: '#ec4899',       // pink-500
  
  // Success/Warning/Error states
  success: '#10b981',      // emerald-500
  warning: '#f59e0b',      // amber-500
  error: '#ef4444',        // red-500
  info: '#3b82f6',         // blue-500
  
  // Gradient colors
  gradients: {
    emerald: ['#10b981', '#059669'],  // emerald-500 to emerald-600
    blue: ['#3b82f6', '#2563eb'],     // blue-500 to blue-600
    amber: ['#f59e0b', '#d97706'],    // amber-500 to amber-600
    red: ['#ef4444', '#dc2626'],      // red-500 to red-600
    violet: ['#8b5cf6', '#7c3aed'],   // violet-500 to violet-600
  },
  
  // Multi-series colors (for charts with multiple data series)
  series: [
    '#10b981', // emerald-500
    '#3b82f6', // blue-500
    '#f59e0b', // amber-500
    '#ef4444', // red-500
    '#8b5cf6', // violet-500
    '#ec4899', // pink-500
    '#06b6d4', // cyan-500
    '#84cc16', // lime-500
    '#f97316', // orange-500
    '#6366f1', // indigo-500
  ],
  
  // Categorical colors (for pie charts, bar charts with categories)
  categorical: {
    agriculture: '#10b981',  // emerald-500
    livestock: '#f59e0b',    // amber-500
    fishery: '#3b82f6',      // blue-500
    forestry: '#84cc16',     // lime-500
    other: '#94a3b8',        // slate-400
  },
  
  // Status colors
  status: {
    active: '#10b981',       // emerald-500
    pending: '#f59e0b',      // amber-500
    inactive: '#94a3b8',     // slate-400
    completed: '#3b82f6',    // blue-500
    cancelled: '#ef4444',    // red-500
  },
  
  // Background colors (for area charts)
  backgrounds: {
    emerald: 'rgba(16, 185, 129, 0.1)',
    blue: 'rgba(59, 130, 246, 0.1)',
    amber: 'rgba(245, 158, 11, 0.1)',
    red: 'rgba(239, 68, 68, 0.1)',
    violet: 'rgba(139, 92, 246, 0.1)',
  },
  
  // Grid and axis colors
  grid: '#e2e8f0',          // slate-200
  gridDark: '#334155',      // slate-700
  axis: '#64748b',          // slate-500
  axisDark: '#94a3b8',      // slate-400
}

/**
 * Get color by index (useful for dynamic charts)
 */
export function getColorByIndex(index: number): string {
  return chartColors.series[index % chartColors.series.length]
}

/**
 * Get gradient colors for area charts
 */
export function getGradient(type: keyof typeof chartColors.gradients): string[] {
  return chartColors.gradients[type]
}

/**
 * Recharts-specific color configuration
 */
export const rechartsConfig = {
  // Default colors for Recharts components
  colors: chartColors.series,
  
  // CartesianGrid configuration
  cartesianGrid: {
    strokeDasharray: '3 3',
    stroke: chartColors.grid,
    strokeOpacity: 0.5,
  },
  
  // XAxis configuration
  xAxis: {
    stroke: chartColors.axis,
    tick: { fill: chartColors.axis, fontSize: 12 },
  },
  
  // YAxis configuration
  yAxis: {
    stroke: chartColors.axis,
    tick: { fill: chartColors.axis, fontSize: 12 },
  },
  
  // Tooltip configuration
  tooltip: {
    contentStyle: {
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    },
    labelStyle: {
      color: '#1e293b',
      fontWeight: 600,
    },
  },
  
  // Legend configuration
  legend: {
    iconType: 'circle' as const,
    wrapperStyle: {
      paddingTop: '20px',
    },
  },
}

/**
 * Dark mode color adjustments
 */
export const chartColorsDark = {
  ...chartColors,
  grid: chartColors.gridDark,
  axis: chartColors.axisDark,
}
