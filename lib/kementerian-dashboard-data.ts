export type HealthStatus = 'good' | 'warning' | 'critical'
export type AlertSeverity = 'critical' | 'warning' | 'notice'

export interface ScopeFilters {
  provinceId: string
  regionId: string
  villageId: string
  cooperativeId: string
  commodityId: string
}

export interface OptionItem {
  id: string
  label: string
  provinceId?: string
  regionId?: string
  villageId?: string
}

export interface TrendPoint {
  month: string
  members: number
  avgIncome: number
  npl: number
}

export interface DistributionItem {
  label: string
  value: number
}

export interface RatioScore {
  key: 'liquidity' | 'solvency' | 'profitability'
  label: string
  value: number
  score: number
  status: HealthStatus
}

export interface MemberRecord {
  id: string
  cooperativeId: string
  cooperativeName: string
  province: string
  region: string
  village: string
  name: string
  age: number
  gender: 'Laki-laki' | 'Perempuan'
  occupation: string
  joinedAt: string
  incomeBefore: number
  incomeAfter: number
  incomeChangePct: number
}

export interface FinancialRecord {
  id: string
  cooperativeId: string
  cooperativeName: string
  province: string
  region: string
  village: string
  date: string
  type: string
  report: string
  description: string
  amount: number
  status: 'posted' | 'review' | 'late'
}

export interface EarlyWarningAlert {
  id: string
  severity: AlertSeverity
  scopeType: 'national' | 'region' | 'village' | 'cooperative'
  scopeLabel: string
  cooperativeId?: string
  cooperativeName?: string
  title: string
  message: string
  recommendation: string
  metric: string
  updatedAt: string
}

export interface DashboardAIInsight {
  id: string
  type: 'insight' | 'recommendation' | 'warning' | 'opportunity'
  title: string
  description: string
  confidence: number
  impact: 'high' | 'medium' | 'low'
}

export interface CooperativeAnalytics {
  id: string
  name: string
  provinceId: string
  province: string
  regionId: string
  region: string
  villageId: string
  village: string
  totalMembers: number
  memberGrowthPct: number
  avgIncomeBefore: number
  avgIncomeAfter: number
  incomeImprovementPct: number
  avgMonthlyRevenue: number
  nplRatio: number
  loanOutstanding: number
  totalAssets: number
  totalLiabilities: number
  totalNetIncome: number
  healthScore: number
  healthStatus: HealthStatus
  ageDistribution: DistributionItem[]
  genderDistribution: DistributionItem[]
  occupationDistribution: DistributionItem[]
  ratioScores: RatioScore[]
  trend: TrendPoint[]
  memberRecords: MemberRecord[]
  financialRecords: FinancialRecord[]
  alerts: EarlyWarningAlert[]
}

export interface GroupSummary {
  id: string
  level: 'national' | 'region' | 'village' | 'cooperative'
  label: string
  province: string
  region: string
  village: string
  provinceCount: number
  regionCount: number
  villageCount: number
  cooperatives: number
  totalMembers: number
  memberGrowthPct: number
  avgIncomeBefore: number
  avgIncomeAfter: number
  incomeImprovementPct: number
  avgMonthlyRevenue: number
  avgNpl: number
  avgLiquidityScore: number
  avgSolvencyScore: number
  avgProfitabilityScore: number
  overallScore: number
  overallHealth: HealthStatus
  alertCount: number
  criticalCount: number
}

export interface KementerianDashboardData {
  lastUpdated: string
  provinceOptions: OptionItem[]
  regionOptions: OptionItem[]
  villageOptions: OptionItem[]
  cooperativeOptions: OptionItem[]
  cooperatives: CooperativeAnalytics[]
  nationalSummary: GroupSummary
  nationalTrend: TrendPoint[]
  topAlerts: EarlyWarningAlert[]
  aiInsights: DashboardAIInsight[]
}

export interface KementerianDashboardSnapshot {
  level: 'national' | 'region' | 'village' | 'cooperative'
  scopeLabel: string
  contextLabel: string
  breadcrumb: string[]
  summary: GroupSummary
  trend: TrendPoint[]
  hierarchyTitle: string
  hierarchyRows: GroupSummary[]
  regionComparisons: GroupSummary[]
  villageComparisons: GroupSummary[]
  cooperativeComparisons: GroupSummary[]
  ageDistribution: DistributionItem[]
  genderDistribution: DistributionItem[]
  occupationDistribution: DistributionItem[]
  topAlerts: EarlyWarningAlert[]
  aiSummary: string
  aiInsights: DashboardAIInsight[]
  memberRecords: MemberRecord[]
  financialRecords: FinancialRecord[]
  selectedCooperative: CooperativeAnalytics | null
}

type PerformanceBand = 'strong' | 'watch' | 'critical'

type RegionalBlueprint = {
  provinceId: string
  province: string
  regionId: string
  region: string
  villages: { id: string; label: string }[]
  occupationWeights: Record<string, number>
}

const MONTH_LABELS = ['Nov 2025', 'Des 2025', 'Jan 2026', 'Feb 2026', 'Mar 2026', 'Apr 2026']
const LAST_UPDATED_AT = '2026-04-03T09:18:00+07:00'

const FIRST_NAMES = [
  'Agus',
  'Nur',
  'Dewi',
  'Bambang',
  'Sari',
  'Rizal',
  'Intan',
  'Hendra',
  'Maya',
  'Wawan',
  'Tika',
  'Rahmat',
]

const LAST_NAMES = [
  'Santoso',
  'Lestari',
  'Pratama',
  'Wibowo',
  'Setiawan',
  'Anggraini',
  'Saputra',
  'Hidayat',
  'Mahendra',
  'Kusuma',
  'Yuliani',
  'Fadilah',
]

const AGE_BUCKETS = [
  { label: '18-30', min: 18, max: 30 },
  { label: '31-45', min: 31, max: 45 },
  { label: '46-60', min: 46, max: 60 },
  { label: '60+', min: 61, max: 72 },
]

const REGIONAL_BLUEPRINTS: RegionalBlueprint[] = [
  {
    provinceId: 'ACEH',
    province: 'Aceh',
    regionId: 'ACEH-BESAR',
    region: 'Kab. Aceh Besar',
    villages: [
      { id: 'ACEH-BESAR-LAMPUPOK', label: 'Lampupok' },
      { id: 'ACEH-BESAR-MEUNASAH', label: 'Meunasah Intan' },
    ],
    occupationWeights: { Petani: 0.42, Nelayan: 0.24, UMKM: 0.18, Peternak: 0.08, Pengepul: 0.08 },
  },
  {
    provinceId: 'SUMBAR',
    province: 'Sumatera Barat',
    regionId: 'TANAH-DATAR',
    region: 'Kab. Tanah Datar',
    villages: [
      { id: 'TANAH-DATAR-SUNGAYANG', label: 'Sungayang' },
      { id: 'TANAH-DATAR-TABEK', label: 'Tabek Patah' },
    ],
    occupationWeights: { Petani: 0.5, Nelayan: 0.03, UMKM: 0.23, Peternak: 0.14, Pengepul: 0.1 },
  },
  {
    provinceId: 'JABAR',
    province: 'Jawa Barat',
    regionId: 'GARUT',
    region: 'Kab. Garut',
    villages: [
      { id: 'GARUT-SUKAMAJU', label: 'Sukamaju' },
      { id: 'GARUT-CIKONDANG', label: 'Cikondang' },
    ],
    occupationWeights: { Petani: 0.58, Nelayan: 0.01, UMKM: 0.16, Peternak: 0.14, Pengepul: 0.11 },
  },
  {
    provinceId: 'JATENG',
    province: 'Jawa Tengah',
    regionId: 'KLATEN',
    region: 'Kab. Klaten',
    villages: [
      { id: 'KLATEN-WONOSARI', label: 'Wonosari' },
      { id: 'KLATEN-DELANGGU', label: 'Delanggu' },
    ],
    occupationWeights: { Petani: 0.53, Nelayan: 0.01, UMKM: 0.2, Peternak: 0.15, Pengepul: 0.11 },
  },
  {
    provinceId: 'DIY',
    province: 'DI Yogyakarta',
    regionId: 'KULON-PROGO',
    region: 'Kab. Kulon Progo',
    villages: [
      { id: 'KULON-PROGO-HARGOTIRTO', label: 'Hargotirto' },
      { id: 'KULON-PROGO-BANJAROYO', label: 'Banjaroyo' },
    ],
    occupationWeights: { Petani: 0.45, Nelayan: 0.04, UMKM: 0.27, Peternak: 0.12, Pengepul: 0.12 },
  },
  {
    provinceId: 'KALSEL',
    province: 'Kalimantan Selatan',
    regionId: 'BANJAR',
    region: 'Kab. Banjar',
    villages: [
      { id: 'BANJAR-SUNGAI-TABUK', label: 'Sungai Tabuk' },
      { id: 'BANJAR-GUDANG-HIRANG', label: 'Gudang Hirang' },
    ],
    occupationWeights: { Petani: 0.41, Nelayan: 0.11, UMKM: 0.18, Peternak: 0.18, Pengepul: 0.12 },
  },
  {
    provinceId: 'KALTIM',
    province: 'Kalimantan Timur',
    regionId: 'KUTAI-KARTA',
    region: 'Kab. Kutai Kartanegara',
    villages: [
      { id: 'KUTAI-KARTA-LOA', label: 'Loa Duri Ilir' },
      { id: 'KUTAI-KARTA-MUARA', label: 'Muara Kaman' },
    ],
    occupationWeights: { Petani: 0.39, Nelayan: 0.09, UMKM: 0.2, Peternak: 0.19, Pengepul: 0.13 },
  },
  {
    provinceId: 'SULSEL',
    province: 'Sulawesi Selatan',
    regionId: 'MAROS',
    region: 'Kab. Maros',
    villages: [
      { id: 'MAROS-BONTOA', label: 'Bontoa' },
      { id: 'MAROS-TANRALILI', label: 'Tanralili' },
    ],
    occupationWeights: { Petani: 0.46, Nelayan: 0.13, UMKM: 0.19, Peternak: 0.11, Pengepul: 0.11 },
  },
  {
    provinceId: 'NTT',
    province: 'Nusa Tenggara Timur',
    regionId: 'KUPANG',
    region: 'Kab. Kupang',
    villages: [
      { id: 'KUPANG-NAIBONAT', label: 'Naibonat' },
      { id: 'KUPANG-OESAO', label: 'Oesao' },
    ],
    occupationWeights: { Petani: 0.36, Nelayan: 0.04, UMKM: 0.18, Peternak: 0.29, Pengepul: 0.13 },
  },
  {
    provinceId: 'PABAR',
    province: 'Papua Barat',
    regionId: 'MANOKWARI',
    region: 'Kab. Manokwari',
    villages: [
      { id: 'MANOKWARI-AMBAN', label: 'Amban' },
      { id: 'MANOKWARI-PRAFI', label: 'Prafi Mulya' },
    ],
    occupationWeights: { Petani: 0.33, Nelayan: 0.18, UMKM: 0.2, Peternak: 0.15, Pengepul: 0.14 },
  },
]

const COOPERATIVE_SUFFIXES = [
  { key: 'SEJAHTERA', label: 'Sejahtera Bersama' },
  { key: 'MANDIRI', label: 'Mandiri Nusantara' },
]

function average(values: number[]): number {
  if (values.length === 0) return 0
  return values.reduce((total, value) => total + value, 0) / values.length
}

function roundNumber(value: number, digits = 1): number {
  const factor = 10 ** digits
  return Math.round(value * factor) / factor
}

function roundMoney(value: number): number {
  return Math.round(value / 1000) * 1000
}

function percentChange(initialValue: number, currentValue: number): number {
  if (initialValue === 0) return 0
  return ((currentValue - initialValue) / initialValue) * 100
}

function severityWeight(severity: AlertSeverity): number {
  if (severity === 'critical') return 3
  if (severity === 'warning') return 2
  return 1
}

function scoreToStatus(score: number): HealthStatus {
  if (score >= 80) return 'good'
  if (score >= 65) return 'warning'
  return 'critical'
}

function scoreLiquidity(ratio: number): number {
  if (ratio >= 1.55) return Math.min(98, 88 + (ratio - 1.55) * 10)
  if (ratio >= 1.2) return 72 + (ratio - 1.2) * 35
  if (ratio >= 1) return 58 + (ratio - 1) * 70
  return Math.max(32, 55 - (1 - ratio) * 100)
}

function scoreSolvency(coverage: number): number {
  if (coverage >= 1.9) return Math.min(98, 88 + (coverage - 1.9) * 8)
  if (coverage >= 1.45) return 72 + (coverage - 1.45) * 35
  if (coverage >= 1.2) return 58 + (coverage - 1.2) * 56
  return Math.max(30, 52 - (1.2 - coverage) * 90)
}

function scoreProfitability(margin: number): number {
  if (margin >= 0.13) return Math.min(98, 86 + (margin - 0.13) * 100)
  if (margin >= 0.08) return 70 + (margin - 0.08) * 260
  if (margin >= 0.05) return 54 + (margin - 0.05) * 360
  return Math.max(28, 48 - (0.05 - margin) * 300)
}

function getPerformanceBand(seed: number): PerformanceBand {
  if (seed % 9 === 0 || seed % 13 === 0) return 'critical'
  if (seed % 4 === 0 || seed % 5 === 0) return 'watch'
  return 'strong'
}

function toDistribution(total: number, weights: Record<string, number>): DistributionItem[] {
  const entries = Object.entries(weights)
  let assigned = 0

  return entries.map(([label, weight], index) => {
    const isLast = index === entries.length - 1
    const value = isLast ? total - assigned : Math.round(total * weight)
    assigned += value
    return { label, value }
  })
}

function getNameFromSeed(seed: number): string {
  const firstName = FIRST_NAMES[seed % FIRST_NAMES.length]
  const lastName = LAST_NAMES[(seed * 3) % LAST_NAMES.length]
  return `${firstName} ${lastName}`
}

function generateMemberRecords(
  cooperative: Pick<
    CooperativeAnalytics,
    | 'id'
    | 'name'
    | 'province'
    | 'region'
    | 'village'
    | 'avgIncomeBefore'
    | 'avgIncomeAfter'
    | 'occupationDistribution'
  >,
  performanceBand: PerformanceBand,
  seed: number,
): MemberRecord[] {
  const sortedOccupations = [...cooperative.occupationDistribution].sort((left, right) => right.value - left.value)

  return Array.from({ length: 8 }, (_, index) => {
    const occupation = sortedOccupations[index % sortedOccupations.length]?.label ?? 'Petani'
    const ageBucket = AGE_BUCKETS[index % AGE_BUCKETS.length]
    const age = ageBucket.min + ((seed + index * 7) % (ageBucket.max - ageBucket.min + 1))
    const gender = index % 2 === 0 ? 'Laki-laki' : 'Perempuan'
    const joinedMonth = ((seed + index) % 12) + 1
    const joinedDay = ((seed * 3 + index * 5) % 25) + 1
    const incomeBefore = roundMoney(cooperative.avgIncomeBefore * (0.76 + index * 0.045))
    const upliftFactor =
      performanceBand === 'critical' && index % 3 === 0
        ? 1.03 + index * 0.01
        : performanceBand === 'watch'
          ? 1.09 + index * 0.015
          : 1.16 + index * 0.02
    const incomeAfter = roundMoney(Math.min(cooperative.avgIncomeAfter * 1.12, incomeBefore * upliftFactor))

    return {
      id: `${cooperative.id}-MEM-${String(index + 1).padStart(2, '0')}`,
      cooperativeId: cooperative.id,
      cooperativeName: cooperative.name,
      province: cooperative.province,
      region: cooperative.region,
      village: cooperative.village,
      name: getNameFromSeed(seed + index * 11),
      age,
      gender,
      occupation,
      joinedAt: `2024-${String(joinedMonth).padStart(2, '0')}-${String(joinedDay).padStart(2, '0')}`,
      incomeBefore,
      incomeAfter,
      incomeChangePct: roundNumber(percentChange(incomeBefore, incomeAfter), 1),
    }
  })
}

function generateFinancialRecords(
  cooperative: Pick<
    CooperativeAnalytics,
    | 'id'
    | 'name'
    | 'province'
    | 'region'
    | 'village'
    | 'avgMonthlyRevenue'
    | 'totalNetIncome'
    | 'loanOutstanding'
  >,
  performanceBand: PerformanceBand,
  seed: number,
): FinancialRecord[] {
  const reviewStatus = performanceBand === 'strong' ? 'posted' : 'review'
  const reportStatus = performanceBand === 'critical' ? 'late' : performanceBand === 'watch' ? 'review' : 'posted'

  return [
    {
      id: `${cooperative.id}-FIN-01`,
      cooperativeId: cooperative.id,
      cooperativeName: cooperative.name,
      province: cooperative.province,
      region: cooperative.region,
      village: cooperative.village,
      date: '2026-04-03',
      type: 'Laporan bulanan',
      report: 'Laba Rugi',
      description: `Unggah laporan laba rugi ${cooperative.name} periode Maret 2026`,
      amount: cooperative.totalNetIncome,
      status: reportStatus,
    },
    {
      id: `${cooperative.id}-FIN-02`,
      cooperativeId: cooperative.id,
      cooperativeName: cooperative.name,
      province: cooperative.province,
      region: cooperative.region,
      village: cooperative.village,
      date: '2026-04-02',
      type: 'Pendapatan usaha',
      report: 'Arus Kas',
      description: 'Pendapatan unit usaha koperasi dan margin jasa anggota',
      amount: cooperative.avgMonthlyRevenue,
      status: 'posted',
    },
    {
      id: `${cooperative.id}-FIN-03`,
      cooperativeId: cooperative.id,
      cooperativeName: cooperative.name,
      province: cooperative.province,
      region: cooperative.region,
      village: cooperative.village,
      date: '2026-04-01',
      type: 'Pinjaman beredar',
      report: 'Neraca',
      description: 'Saldo pinjaman produktif anggota aktif',
      amount: cooperative.loanOutstanding,
      status: reviewStatus,
    },
    {
      id: `${cooperative.id}-FIN-04`,
      cooperativeId: cooperative.id,
      cooperativeName: cooperative.name,
      province: cooperative.province,
      region: cooperative.region,
      village: cooperative.village,
      date: '2026-03-30',
      type: 'Simpanan wajib',
      report: 'Arus Kas',
      description: 'Penerimaan simpanan wajib anggota bulan berjalan',
      amount: roundMoney(cooperative.avgMonthlyRevenue * 0.18),
      status: 'posted',
    },
    {
      id: `${cooperative.id}-FIN-05`,
      cooperativeId: cooperative.id,
      cooperativeName: cooperative.name,
      province: cooperative.province,
      region: cooperative.region,
      village: cooperative.village,
      date: '2026-03-28',
      type: 'Biaya operasional',
      report: 'Arus Kas',
      description: 'Biaya operasional, tenaga lapangan, dan pendampingan anggota',
      amount: roundMoney(cooperative.avgMonthlyRevenue * (0.21 + (seed % 4) * 0.01)),
      status: 'posted',
    },
    {
      id: `${cooperative.id}-FIN-06`,
      cooperativeId: cooperative.id,
      cooperativeName: cooperative.name,
      province: cooperative.province,
      region: cooperative.region,
      village: cooperative.village,
      date: '2026-03-26',
      type: 'Angsuran masuk',
      report: 'Arus Kas',
      description: 'Penerimaan angsuran pinjaman produktif anggota',
      amount: roundMoney(cooperative.loanOutstanding * 0.08),
      status: performanceBand === 'critical' ? 'review' : 'posted',
    },
  ]
}

function buildCooperativeAlerts(
  cooperative: Pick<
    CooperativeAnalytics,
    | 'id'
    | 'name'
    | 'nplRatio'
    | 'healthStatus'
    | 'healthScore'
    | 'trend'
    | 'memberGrowthPct'
  >,
): EarlyWarningAlert[] {
  const alerts: EarlyWarningAlert[] = []
  const currentIncome = cooperative.trend[cooperative.trend.length - 1]?.avgIncome ?? 0
  const previousIncome = cooperative.trend[cooperative.trend.length - 2]?.avgIncome ?? currentIncome
  const incomeDropPct = previousIncome === 0 ? 0 : ((currentIncome - previousIncome) / previousIncome) * 100

  if (cooperative.nplRatio >= 8) {
    alerts.push({
      id: `${cooperative.id}-ALERT-NPL`,
      severity: 'critical',
      scopeType: 'cooperative',
      scopeLabel: cooperative.name,
      cooperativeId: cooperative.id,
      cooperativeName: cooperative.name,
      title: 'NPL tinggi',
      message: `${cooperative.name} mencatat NPL ${roundNumber(cooperative.nplRatio)}%, melewati ambang intervensi nasional.`,
      recommendation: 'Lakukan review portofolio pinjaman, penagihan terarah, dan pendampingan manajemen kredit.',
      metric: `${roundNumber(cooperative.nplRatio)}%`,
      updatedAt: LAST_UPDATED_AT,
    })
  } else if (cooperative.nplRatio >= 5.5) {
    alerts.push({
      id: `${cooperative.id}-ALERT-NPL-WARN`,
      severity: 'warning',
      scopeType: 'cooperative',
      scopeLabel: cooperative.name,
      cooperativeId: cooperative.id,
      cooperativeName: cooperative.name,
      title: 'NPL naik',
      message: `${cooperative.name} berada pada NPL ${roundNumber(cooperative.nplRatio)}% dan perlu pemantauan ketat.`,
      recommendation: 'Pantau debitur menunggak dan perketat validasi pinjaman baru.',
      metric: `${roundNumber(cooperative.nplRatio)}%`,
      updatedAt: LAST_UPDATED_AT,
    })
  }

  if (incomeDropPct <= -8) {
    alerts.push({
      id: `${cooperative.id}-ALERT-INCOME`,
      severity: 'critical',
      scopeType: 'cooperative',
      scopeLabel: cooperative.name,
      cooperativeId: cooperative.id,
      cooperativeName: cooperative.name,
      title: 'Pendapatan anggota turun tajam',
      message: `Pendapatan rata-rata anggota di ${cooperative.name} turun ${Math.abs(roundNumber(incomeDropPct))}% dibanding bulan sebelumnya.`,
      recommendation: 'Aktifkan pendampingan usaha, evaluasi pasar, dan verifikasi anggota yang terdampak.',
      metric: `${roundNumber(incomeDropPct)}%`,
      updatedAt: LAST_UPDATED_AT,
    })
  } else if (incomeDropPct <= -4) {
    alerts.push({
      id: `${cooperative.id}-ALERT-INCOME-WARN`,
      severity: 'warning',
      scopeType: 'cooperative',
      scopeLabel: cooperative.name,
      cooperativeId: cooperative.id,
      cooperativeName: cooperative.name,
      title: 'Pendapatan anggota melambat',
      message: `Pendapatan anggota di ${cooperative.name} menurun ${Math.abs(roundNumber(incomeDropPct))}% dalam satu bulan.`,
      recommendation: 'Lihat profil anggota berisiko dan siapkan intervensi usaha jangka pendek.',
      metric: `${roundNumber(incomeDropPct)}%`,
      updatedAt: LAST_UPDATED_AT,
    })
  }

  if (cooperative.healthStatus === 'critical') {
    alerts.push({
      id: `${cooperative.id}-ALERT-RATIO`,
      severity: 'critical',
      scopeType: 'cooperative',
      scopeLabel: cooperative.name,
      cooperativeId: cooperative.id,
      cooperativeName: cooperative.name,
      title: 'Rasio keuangan kritis',
      message: `${cooperative.name} memiliki skor kesehatan ${Math.round(cooperative.healthScore)} dan memerlukan intervensi pengawasan.`,
      recommendation: 'Fokus pada likuiditas, efisiensi biaya, dan penguatan struktur aset.',
      metric: `${Math.round(cooperative.healthScore)}/100`,
      updatedAt: LAST_UPDATED_AT,
    })
  } else if (cooperative.healthStatus === 'warning') {
    alerts.push({
      id: `${cooperative.id}-ALERT-RATIO-WARN`,
      severity: 'warning',
      scopeType: 'cooperative',
      scopeLabel: cooperative.name,
      cooperativeId: cooperative.id,
      cooperativeName: cooperative.name,
      title: 'Rasio keuangan perlu perhatian',
      message: `${cooperative.name} menunjukkan kesehatan keuangan level warning dengan skor ${Math.round(cooperative.healthScore)}.`,
      recommendation: 'Monitor arus kas dan efisiensi operasional sampai indikator kembali hijau.',
      metric: `${Math.round(cooperative.healthScore)}/100`,
      updatedAt: LAST_UPDATED_AT,
    })
  }

  if (cooperative.memberGrowthPct < 0) {
    alerts.push({
      id: `${cooperative.id}-ALERT-MEMBER`,
      severity: 'notice',
      scopeType: 'cooperative',
      scopeLabel: cooperative.name,
      cooperativeId: cooperative.id,
      cooperativeName: cooperative.name,
      title: 'Pertumbuhan anggota negatif',
      message: `${cooperative.name} mencatat kontraksi anggota ${Math.abs(roundNumber(cooperative.memberGrowthPct))}% selama enam bulan.`,
      recommendation: 'Validasi retensi anggota dan percepat program reaktivasi layanan koperasi.',
      metric: `${roundNumber(cooperative.memberGrowthPct)}%`,
      updatedAt: LAST_UPDATED_AT,
    })
  }

  return alerts
}

function createCooperativeAnalytics(
  blueprint: RegionalBlueprint,
  regionIndex: number,
  village: RegionalBlueprint['villages'][number],
  villageIndex: number,
  suffix: { key: string; label: string },
  cooperativeIndex: number,
): CooperativeAnalytics {
  const seed = regionIndex * 17 + villageIndex * 5 + cooperativeIndex * 9 + 7
  const performanceBand = getPerformanceBand(seed)
  const startMembers = 175 + regionIndex * 21 + villageIndex * 16 + cooperativeIndex * 24
  const memberGrowthPattern =
    performanceBand === 'strong'
      ? [0, 7, 14, 21, 27, 34]
      : performanceBand === 'watch'
        ? [0, 3, 6, 9, 11, 14]
        : [0, -2, -4, -6, -8, -10]
  const totalMembers = startMembers + memberGrowthPattern[memberGrowthPattern.length - 1]
  const avgIncomeBefore = roundMoney(2200000 + regionIndex * 110000 + villageIndex * 65000 + cooperativeIndex * 85000)
  const incomeImprovementFactor =
    performanceBand === 'strong'
      ? 1.23 + (seed % 5) * 0.015
      : performanceBand === 'watch'
        ? 1.11 + (seed % 4) * 0.012
        : 1.04 + (seed % 3) * 0.012
  const avgIncomeAfter = roundMoney(avgIncomeBefore * incomeImprovementFactor)
  const incomeTrendFactors =
    performanceBand === 'strong'
      ? [0.88, 0.91, 0.94, 0.97, 0.99, 1]
      : performanceBand === 'watch'
        ? [0.93, 0.96, 0.98, 1, 1.01, 1]
        : [1.18, 1.16, 1.14, 1.12, 1.1, 1]
  const nplPattern =
    performanceBand === 'strong'
      ? [3.1, 3.2, 3.4, 3.5, 3.6, 3.5]
      : performanceBand === 'watch'
        ? [4.8, 5.2, 5.6, 5.9, 6.1, 6.3]
        : [6.9, 7.5, 8.1, 8.8, 9.3, 9.7]

  const trend: TrendPoint[] = MONTH_LABELS.map((month, monthIndex) => ({
    month,
    members: startMembers + memberGrowthPattern[monthIndex],
    avgIncome: roundMoney(avgIncomeAfter * incomeTrendFactors[monthIndex]),
    npl: roundNumber(nplPattern[monthIndex], 1),
  }))

  const liquidityRatio =
    performanceBand === 'strong'
      ? 1.55 + (seed % 5) * 0.09
      : performanceBand === 'watch'
        ? 1.16 + (seed % 4) * 0.07
        : 0.88 + (seed % 3) * 0.05
  const solvencyCoverage =
    performanceBand === 'strong'
      ? 1.95 + (seed % 5) * 0.12
      : performanceBand === 'watch'
        ? 1.42 + (seed % 4) * 0.1
        : 1.14 + (seed % 3) * 0.08
  const profitabilityMargin =
    performanceBand === 'strong'
      ? 0.14 + (seed % 4) * 0.012
      : performanceBand === 'watch'
        ? 0.082 + (seed % 3) * 0.01
        : 0.041 + (seed % 3) * 0.008

  const avgMonthlyRevenue = roundMoney(totalMembers * (118000 + regionIndex * 3500 + cooperativeIndex * 4500))
  const totalNetIncome = roundMoney(avgMonthlyRevenue * profitabilityMargin)
  const totalAssets = roundMoney(avgMonthlyRevenue * 8.2 + totalMembers * 460000)
  const totalLiabilities = roundMoney(totalAssets / solvencyCoverage)
  const loanOutstanding = roundMoney(totalMembers * (1450000 + regionIndex * 40000 + cooperativeIndex * 35000))

  const ratioScores: RatioScore[] = [
    {
      key: 'liquidity',
      label: 'Likuiditas',
      value: roundNumber(liquidityRatio, 2),
      score: roundNumber(scoreLiquidity(liquidityRatio), 0),
      status: scoreToStatus(scoreLiquidity(liquidityRatio)),
    },
    {
      key: 'solvency',
      label: 'Solvabilitas',
      value: roundNumber(solvencyCoverage, 2),
      score: roundNumber(scoreSolvency(solvencyCoverage), 0),
      status: scoreToStatus(scoreSolvency(solvencyCoverage)),
    },
    {
      key: 'profitability',
      label: 'Rentabilitas',
      value: roundNumber(profitabilityMargin * 100, 1),
      score: roundNumber(scoreProfitability(profitabilityMargin), 0),
      status: scoreToStatus(scoreProfitability(profitabilityMargin)),
    },
  ]

  const nplPenalty = Math.max(0, nplPattern[nplPattern.length - 1] - 5) * 4
  const healthScore = Math.max(32, average(ratioScores.map((ratio) => ratio.score)) - nplPenalty)
  const healthStatus =
    nplPattern[nplPattern.length - 1] >= 8 || ratioScores.some((ratio) => ratio.score < 60)
      ? 'critical'
      : scoreToStatus(healthScore)

  const ageWeights =
    performanceBand === 'strong'
      ? { '18-30': 0.24, '31-45': 0.39, '46-60': 0.27, '60+': 0.1 }
      : performanceBand === 'watch'
        ? { '18-30': 0.22, '31-45': 0.35, '46-60': 0.3, '60+': 0.13 }
        : { '18-30': 0.18, '31-45': 0.31, '46-60': 0.34, '60+': 0.17 }
  const femaleShare = 0.44 + (seed % 4) * 0.03
  const genderWeights = { 'Laki-laki': 1 - femaleShare, Perempuan: femaleShare }
  const ageDistribution = toDistribution(totalMembers, ageWeights)
  const genderDistribution = toDistribution(totalMembers, genderWeights)
  const occupationDistribution = toDistribution(totalMembers, blueprint.occupationWeights)

  const cooperative: CooperativeAnalytics = {
    id: `${blueprint.regionId}-${village.id}-${suffix.key}`,
    name: `Koperasi ${village.label} ${suffix.label}`,
    provinceId: blueprint.provinceId,
    province: blueprint.province,
    regionId: blueprint.regionId,
    region: blueprint.region,
    villageId: village.id,
    village: village.label,
    totalMembers,
    memberGrowthPct: roundNumber(percentChange(trend[0].members, trend[trend.length - 1].members), 1),
    avgIncomeBefore,
    avgIncomeAfter,
    incomeImprovementPct: roundNumber(percentChange(avgIncomeBefore, avgIncomeAfter), 1),
    avgMonthlyRevenue,
    nplRatio: roundNumber(nplPattern[nplPattern.length - 1], 1),
    loanOutstanding,
    totalAssets,
    totalLiabilities,
    totalNetIncome,
    healthScore: roundNumber(healthScore, 0),
    healthStatus,
    ageDistribution,
    genderDistribution,
    occupationDistribution,
    ratioScores,
    trend,
    memberRecords: [],
    financialRecords: [],
    alerts: [],
  }

  cooperative.memberRecords = generateMemberRecords(cooperative, performanceBand, seed)
  cooperative.financialRecords = generateFinancialRecords(cooperative, performanceBand, seed)
  cooperative.alerts = buildCooperativeAlerts(cooperative)

  return cooperative
}

function buildCooperativeSummaries(cooperatives: CooperativeAnalytics[]): GroupSummary[] {
  return cooperatives.map((cooperative) => ({
    id: cooperative.id,
    level: 'cooperative',
    label: cooperative.name,
    province: cooperative.province,
    region: cooperative.region,
    village: cooperative.village,
    provinceCount: 1,
    regionCount: 1,
    villageCount: 1,
    cooperatives: 1,
    totalMembers: cooperative.totalMembers,
    memberGrowthPct: cooperative.memberGrowthPct,
    avgIncomeBefore: cooperative.avgIncomeBefore,
    avgIncomeAfter: cooperative.avgIncomeAfter,
    incomeImprovementPct: cooperative.incomeImprovementPct,
    avgMonthlyRevenue: cooperative.avgMonthlyRevenue,
    avgNpl: cooperative.nplRatio,
    avgLiquidityScore: cooperative.ratioScores.find((ratio) => ratio.key === 'liquidity')?.score ?? 0,
    avgSolvencyScore: cooperative.ratioScores.find((ratio) => ratio.key === 'solvency')?.score ?? 0,
    avgProfitabilityScore: cooperative.ratioScores.find((ratio) => ratio.key === 'profitability')?.score ?? 0,
    overallScore: cooperative.healthScore,
    overallHealth: cooperative.healthStatus,
    alertCount: cooperative.alerts.length,
    criticalCount: cooperative.alerts.filter((alert) => alert.severity === 'critical').length,
  }))
}

function buildSummaryFromCooperatives(
  cooperatives: CooperativeAnalytics[],
  meta: Pick<GroupSummary, 'id' | 'level' | 'label' | 'province' | 'region' | 'village'>,
): GroupSummary {
  const totalMembers = cooperatives.reduce((total, cooperative) => total + cooperative.totalMembers, 0)
  const baselineMembers = cooperatives.reduce((total, cooperative) => total + cooperative.trend[0].members, 0)
  const alertCount = cooperatives.reduce((total, cooperative) => total + cooperative.alerts.length, 0)
  const criticalCount = cooperatives.reduce(
    (total, cooperative) => total + cooperative.alerts.filter((alert) => alert.severity === 'critical').length,
    0,
  )
  const liquidityScores = cooperatives.map(
    (cooperative) => cooperative.ratioScores.find((ratio) => ratio.key === 'liquidity')?.score ?? 0,
  )
  const solvencyScores = cooperatives.map(
    (cooperative) => cooperative.ratioScores.find((ratio) => ratio.key === 'solvency')?.score ?? 0,
  )
  const profitabilityScores = cooperatives.map(
    (cooperative) => cooperative.ratioScores.find((ratio) => ratio.key === 'profitability')?.score ?? 0,
  )
  const avgNpl = average(cooperatives.map((cooperative) => cooperative.nplRatio))
  const overallScore = Math.max(28, average(cooperatives.map((cooperative) => cooperative.healthScore)) - Math.max(0, avgNpl - 5) * 2.5)
  const overallHealth = criticalCount > 0 || avgNpl >= 8 ? 'critical' : scoreToStatus(overallScore)

  return {
    ...meta,
    provinceCount: new Set(cooperatives.map((cooperative) => cooperative.provinceId)).size,
    regionCount: new Set(cooperatives.map((cooperative) => cooperative.regionId)).size,
    villageCount: new Set(cooperatives.map((cooperative) => cooperative.villageId)).size,
    cooperatives: cooperatives.length,
    totalMembers,
    memberGrowthPct: roundNumber(percentChange(baselineMembers, totalMembers), 1),
    avgIncomeBefore: roundMoney(average(cooperatives.map((cooperative) => cooperative.avgIncomeBefore))),
    avgIncomeAfter: roundMoney(average(cooperatives.map((cooperative) => cooperative.avgIncomeAfter))),
    incomeImprovementPct: roundNumber(average(cooperatives.map((cooperative) => cooperative.incomeImprovementPct)), 1),
    avgMonthlyRevenue: roundMoney(average(cooperatives.map((cooperative) => cooperative.avgMonthlyRevenue))),
    avgNpl: roundNumber(avgNpl, 1),
    avgLiquidityScore: roundNumber(average(liquidityScores), 0),
    avgSolvencyScore: roundNumber(average(solvencyScores), 0),
    avgProfitabilityScore: roundNumber(average(profitabilityScores), 0),
    overallScore: roundNumber(overallScore, 0),
    overallHealth,
    alertCount,
    criticalCount,
  }
}

function groupCooperatives(
  cooperatives: CooperativeAnalytics[],
  level: 'national' | 'region' | 'village',
): GroupSummary[] {
  if (level === 'national') {
    return [
      buildSummaryFromCooperatives(cooperatives, {
        id: 'national',
        level: 'national',
        label: 'Nasional',
        province: 'Nasional',
        region: 'Nasional',
        village: 'Nasional',
      }),
    ]
  }

  const grouped = new Map<string, CooperativeAnalytics[]>()

  for (const cooperative of cooperatives) {
    const key = level === 'region' ? cooperative.regionId : cooperative.villageId
    const existing = grouped.get(key) ?? []
    existing.push(cooperative)
    grouped.set(key, existing)
  }

  return [...grouped.entries()].map(([key, groupedCooperatives]) => {
    const base = groupedCooperatives[0]
    return buildSummaryFromCooperatives(groupedCooperatives, {
      id: key,
      level,
      label: level === 'region' ? base.region : base.village,
      province: base.province,
      region: base.region,
      village: level === 'village' ? base.village : '',
    })
  })
}

function aggregateTrend(cooperatives: CooperativeAnalytics[]): TrendPoint[] {
  return MONTH_LABELS.map((month, monthIndex) => {
    const totalMembers = cooperatives.reduce((total, cooperative) => total + cooperative.trend[monthIndex].members, 0)
    const weightedIncome = cooperatives.reduce(
      (total, cooperative) => total + cooperative.trend[monthIndex].avgIncome * cooperative.trend[monthIndex].members,
      0,
    )
    const weightedNpl = cooperatives.reduce(
      (total, cooperative) => total + cooperative.trend[monthIndex].npl * cooperative.loanOutstanding,
      0,
    )
    const totalLoans = cooperatives.reduce((total, cooperative) => total + cooperative.loanOutstanding, 0)

    return {
      month,
      members: totalMembers,
      avgIncome: totalMembers === 0 ? 0 : roundMoney(weightedIncome / totalMembers),
      npl: totalLoans === 0 ? 0 : roundNumber(weightedNpl / totalLoans, 1),
    }
  })
}

function aggregateDistribution(
  cooperatives: CooperativeAnalytics[],
  key: 'ageDistribution' | 'genderDistribution' | 'occupationDistribution',
): DistributionItem[] {
  const grouped = new Map<string, number>()

  for (const cooperative of cooperatives) {
    for (const item of cooperative[key]) {
      grouped.set(item.label, (grouped.get(item.label) ?? 0) + item.value)
    }
  }

  return [...grouped.entries()].map(([label, value]) => ({ label, value }))
}

function buildRegionalAlerts(regionSummaries: GroupSummary[]): EarlyWarningAlert[] {
  const alerts: EarlyWarningAlert[] = []

  for (const region of regionSummaries) {
    if (region.avgNpl >= 6.5) {
      alerts.push({
        id: `${region.id}-REGION-NPL`,
        severity: region.avgNpl >= 8 ? 'critical' : 'warning',
        scopeType: 'region',
        scopeLabel: region.label,
        title: 'Wilayah dengan tren NPL naik',
        message: `${region.label} berada pada NPL rata-rata ${roundNumber(region.avgNpl)}% dan perlu pengawasan lintas koperasi.`,
        recommendation: 'Koordinasikan pendampingan kredit dan review portofolio di tingkat wilayah.',
        metric: `${roundNumber(region.avgNpl)}%`,
        updatedAt: LAST_UPDATED_AT,
      })
    }

    if (region.overallHealth === 'critical') {
      alerts.push({
        id: `${region.id}-REGION-HEALTH`,
        severity: 'critical',
        scopeType: 'region',
        scopeLabel: region.label,
        title: 'Kesehatan keuangan wilayah kritis',
        message: `${region.label} mencatat skor kesehatan rata-rata ${Math.round(region.overallScore)} dengan ${region.criticalCount} alert kritis.`,
        recommendation: 'Prioritaskan audit laporan dan intervensi koperasi dengan rasio terlemah.',
        metric: `${Math.round(region.overallScore)}/100`,
        updatedAt: LAST_UPDATED_AT,
      })
    }
  }

  return alerts
}

function buildScopeAlerts(summary: GroupSummary, trend: TrendPoint[], scopeLabel: string): EarlyWarningAlert[] {
  const currentIncome = trend[trend.length - 1]?.avgIncome ?? 0
  const previousIncome = trend[trend.length - 2]?.avgIncome ?? currentIncome
  const incomeDropPct = previousIncome === 0 ? 0 : ((currentIncome - previousIncome) / previousIncome) * 100
  const alerts: EarlyWarningAlert[] = []

  if (summary.avgNpl >= 6) {
    alerts.push({
      id: `${summary.id}-SCOPE-NPL`,
      severity: summary.avgNpl >= 8 ? 'critical' : 'warning',
      scopeType: summary.level === 'national' ? 'national' : summary.level,
      scopeLabel,
      title: 'Rata-rata NPL perlu perhatian',
      message: `${scopeLabel} memiliki rata-rata NPL ${roundNumber(summary.avgNpl)}% pada cakupan saat ini.`,
      recommendation: 'Prioritaskan pengawasan koperasi dengan tunggakan tertinggi di cakupan ini.',
      metric: `${roundNumber(summary.avgNpl)}%`,
      updatedAt: LAST_UPDATED_AT,
    })
  }

  if (incomeDropPct <= -5) {
    alerts.push({
      id: `${summary.id}-SCOPE-INCOME`,
      severity: incomeDropPct <= -8 ? 'critical' : 'warning',
      scopeType: summary.level === 'national' ? 'national' : summary.level,
      scopeLabel,
      title: 'Pendapatan anggota melemah',
      message: `Pendapatan rata-rata anggota pada ${scopeLabel} turun ${Math.abs(roundNumber(incomeDropPct))}% dari bulan sebelumnya.`,
      recommendation: 'Lihat koperasi dengan penurunan terdalam dan aktifkan intervensi kesejahteraan.',
      metric: `${roundNumber(incomeDropPct)}%`,
      updatedAt: LAST_UPDATED_AT,
    })
  }

  if (summary.overallHealth !== 'good') {
    alerts.push({
      id: `${summary.id}-SCOPE-HEALTH`,
      severity: summary.overallHealth === 'critical' ? 'critical' : 'warning',
      scopeType: summary.level === 'national' ? 'national' : summary.level,
      scopeLabel,
      title: 'Skor kesehatan di bawah target',
      message: `${scopeLabel} memiliki skor kesehatan rata-rata ${Math.round(summary.overallScore)} dengan ${summary.alertCount} alert aktif.`,
      recommendation: 'Pantau koperasi dengan rasio likuiditas dan rentabilitas terendah.',
      metric: `${Math.round(summary.overallScore)}/100`,
      updatedAt: LAST_UPDATED_AT,
    })
  }

  return alerts
}

function selectTopAlerts(alerts: EarlyWarningAlert[]): EarlyWarningAlert[] {
  return [...alerts]
    .sort((left, right) => severityWeight(right.severity) - severityWeight(left.severity))
    .slice(0, 6)
}

function buildAiInsights(
  cooperatives: CooperativeAnalytics[],
  regionComparisons: GroupSummary[],
  cooperativeComparisons: GroupSummary[],
  scopeLabel: string,
): DashboardAIInsight[] {
  const highestRiskRegion = [...regionComparisons].sort((left, right) => right.avgNpl - left.avgNpl)[0]
  const bestGrowthRegion = [...regionComparisons].sort((left, right) => right.memberGrowthPct - left.memberGrowthPct)[0]
  const weakestCooperative = [...cooperativeComparisons].sort((left, right) => left.overallScore - right.overallScore)[0]
  const bestIncomeCooperative = [...cooperativeComparisons].sort(
    (left, right) => right.incomeImprovementPct - left.incomeImprovementPct,
  )[0]
  const totalCritical = cooperatives.reduce(
    (total, cooperative) => total + cooperative.alerts.filter((alert) => alert.severity === 'critical').length,
    0,
  )

  return [
    {
      id: `${scopeLabel}-AI-1`,
      type: 'warning',
      title: highestRiskRegion ? `${highestRiskRegion.label} menjadi kantong risiko utama` : 'Tidak ada wilayah risiko tinggi',
      description: highestRiskRegion
        ? `AI mendeteksi kenaikan NPL rata-rata ${roundNumber(highestRiskRegion.avgNpl)}% di ${highestRiskRegion.label}; intervensi kredit dan pendampingan koperasi perlu dipercepat.`
        : 'Semua wilayah berada pada rentang risiko terkendali.',
      confidence: 92,
      impact: totalCritical >= 4 ? 'high' : 'medium',
    },
    {
      id: `${scopeLabel}-AI-2`,
      type: 'insight',
      title: bestGrowthRegion ? `${bestGrowthRegion.label} memimpin pertumbuhan anggota` : 'Pertumbuhan anggota stabil',
      description: bestGrowthRegion
        ? `Wilayah ini mencatat pertumbuhan anggota ${roundNumber(bestGrowthRegion.memberGrowthPct)}% dengan peningkatan kesejahteraan ${roundNumber(bestGrowthRegion.incomeImprovementPct)}%.`
        : 'Tidak ada perbedaan ekstrem pada pertumbuhan anggota.',
      confidence: 88,
      impact: 'medium',
    },
    {
      id: `${scopeLabel}-AI-3`,
      type: 'recommendation',
      title: weakestCooperative ? `${weakestCooperative.label} perlu pendampingan intensif` : 'Tidak ada koperasi yang perlu intervensi khusus',
      description: weakestCooperative
        ? `Skor kesehatan ${Math.round(weakestCooperative.overallScore)} dan NPL ${roundNumber(weakestCooperative.avgNpl)}% menunjukkan perlunya audit rasio serta rencana pemulihan operasional.`
        : 'Seluruh koperasi berada pada skor sehat.',
      confidence: 90,
      impact: 'high',
    },
    {
      id: `${scopeLabel}-AI-4`,
      type: 'opportunity',
      title: bestIncomeCooperative ? `${bestIncomeCooperative.label} layak jadi model replikasi` : 'Belum ada kandidat model replikasi',
      description: bestIncomeCooperative
        ? `Peningkatan pendapatan anggota ${roundNumber(bestIncomeCooperative.incomeImprovementPct)}% menunjukkan pola yang bisa direplikasi ke koperasi dengan performa menengah.`
        : 'Masih perlu penguatan data sebelum menentukan model replikasi.',
      confidence: 84,
      impact: 'medium',
    },
  ]
}

function buildAiSummary(
  summary: GroupSummary,
  regionComparisons: GroupSummary[],
  cooperativeComparisons: GroupSummary[],
  scopeLabel: string,
): string {
  const highestRiskRegion = [...regionComparisons].sort((left, right) => right.avgNpl - left.avgNpl)[0]
  const weakestCooperative = [...cooperativeComparisons].sort((left, right) => left.overallScore - right.overallScore)[0]
  const strongestRegion = [...regionComparisons].sort((left, right) => right.memberGrowthPct - left.memberGrowthPct)[0]

  return `${scopeLabel} saat ini memantau ${summary.cooperatives} koperasi dan ${summary.totalMembers.toLocaleString(
    'id-ID',
  )} anggota. AI menilai kondisi keseluruhan ${
    summary.overallHealth === 'good'
      ? 'masih sehat'
      : summary.overallHealth === 'warning'
        ? 'perlu perhatian'
        : 'butuh intervensi cepat'
  }, dengan fokus risiko utama di ${highestRiskRegion?.label ?? 'wilayah berisiko rendah'} dan koperasi terlemah ${
    weakestCooperative?.label ?? 'belum teridentifikasi'
  }. Peluang penguatan paling menarik terlihat pada ${strongestRegion?.label ?? 'wilayah dengan pertumbuhan stabil'}.`
}

const COOPERATIVES: CooperativeAnalytics[] = REGIONAL_BLUEPRINTS.flatMap((blueprint, regionIndex) =>
  blueprint.villages.flatMap((village, villageIndex) =>
    COOPERATIVE_SUFFIXES.map((suffix, cooperativeIndex) =>
      createCooperativeAnalytics(blueprint, regionIndex, village, villageIndex, suffix, cooperativeIndex),
    ),
  ),
)

const NATIONAL_SUMMARY = groupCooperatives(COOPERATIVES, 'national')[0]
const NATIONAL_TREND = aggregateTrend(COOPERATIVES)
const NATIONAL_REGION_COMPARISONS = groupCooperatives(COOPERATIVES, 'region')
const NATIONAL_COOPERATIVE_COMPARISONS = buildCooperativeSummaries(COOPERATIVES)
const NATIONAL_AI_INSIGHTS = buildAiInsights(COOPERATIVES, NATIONAL_REGION_COMPARISONS, NATIONAL_COOPERATIVE_COMPARISONS, 'Nasional')
const NATIONAL_ALERTS = selectTopAlerts([
  ...buildScopeAlerts(NATIONAL_SUMMARY, NATIONAL_TREND, 'Nasional'),
  ...buildRegionalAlerts(NATIONAL_REGION_COMPARISONS),
  ...COOPERATIVES.flatMap((cooperative) => cooperative.alerts),
])

export const KEMENTERIAN_DASHBOARD_DATA: KementerianDashboardData = {
  lastUpdated: LAST_UPDATED_AT,
  provinceOptions: REGIONAL_BLUEPRINTS.map((blueprint) => ({
    id: blueprint.provinceId,
    label: blueprint.province,
  })),
  regionOptions: REGIONAL_BLUEPRINTS.map((blueprint) => ({
    id: blueprint.regionId,
    label: blueprint.region,
    provinceId: blueprint.provinceId,
  })),
  villageOptions: REGIONAL_BLUEPRINTS.flatMap((blueprint) =>
    blueprint.villages.map((village) => ({
      id: village.id,
      label: village.label,
      provinceId: blueprint.provinceId,
      regionId: blueprint.regionId,
    })),
  ),
  cooperativeOptions: COOPERATIVES.map((cooperative) => ({
    id: cooperative.id,
    label: cooperative.name,
    provinceId: cooperative.provinceId,
    regionId: cooperative.regionId,
    villageId: cooperative.villageId,
  })),
  cooperatives: COOPERATIVES,
  nationalSummary: NATIONAL_SUMMARY,
  nationalTrend: NATIONAL_TREND,
  topAlerts: NATIONAL_ALERTS,
  aiInsights: NATIONAL_AI_INSIGHTS,
}

function filterCooperatives(filters: ScopeFilters): CooperativeAnalytics[] {
  return KEMENTERIAN_DASHBOARD_DATA.cooperatives.filter((cooperative) => {
    const matchesProvince = filters.provinceId === 'all' || cooperative.provinceId === filters.provinceId
    const matchesRegion = filters.regionId === 'all' || cooperative.regionId === filters.regionId
    const matchesVillage = filters.villageId === 'all' || cooperative.villageId === filters.villageId
    const matchesCooperative = filters.cooperativeId === 'all' || cooperative.id === filters.cooperativeId
    return matchesProvince && matchesRegion && matchesVillage && matchesCooperative
  })
}

function getScopeLabel(filters: ScopeFilters, selectedCooperative: CooperativeAnalytics | null): string {
  if (selectedCooperative) return selectedCooperative.name
  if (filters.villageId !== 'all') {
    return KEMENTERIAN_DASHBOARD_DATA.villageOptions.find((option) => option.id === filters.villageId)?.label ?? 'Desa'
  }
  if (filters.regionId !== 'all') {
    return KEMENTERIAN_DASHBOARD_DATA.regionOptions.find((option) => option.id === filters.regionId)?.label ?? 'Regional'
  }
  if (filters.provinceId !== 'all') {
    const province = KEMENTERIAN_DASHBOARD_DATA.provinceOptions.find((option) => option.id === filters.provinceId)?.label
    return province ? `Provinsi ${province}` : 'Nasional'
  }
  return 'Nasional'
}

function getContextLabel(filters: ScopeFilters): string {
  if (filters.provinceId === 'all') return 'Seluruh Indonesia'
  const province = KEMENTERIAN_DASHBOARD_DATA.provinceOptions.find((option) => option.id === filters.provinceId)?.label
  return province ? `Filter provinsi: ${province}` : 'Seluruh Indonesia'
}

export function getKementerianDashboardSnapshot(filters: ScopeFilters): KementerianDashboardSnapshot {
  const cooperatives = filterCooperatives(filters)
  const selectedCooperative =
    filters.cooperativeId === 'all'
      ? null
      : cooperatives.find((cooperative) => cooperative.id === filters.cooperativeId) ?? null
  const summary = buildSummaryFromCooperatives(cooperatives, {
    id: selectedCooperative?.id ?? (filters.villageId !== 'all' ? filters.villageId : filters.regionId !== 'all' ? filters.regionId : filters.provinceId !== 'all' ? filters.provinceId : 'national'),
    level: selectedCooperative ? 'cooperative' : filters.villageId !== 'all' ? 'village' : filters.regionId !== 'all' ? 'region' : 'national',
    label: getScopeLabel(filters, selectedCooperative),
    province: selectedCooperative?.province ?? '',
    region: selectedCooperative?.region ?? '',
    village: selectedCooperative?.village ?? '',
  })
  const trend = aggregateTrend(cooperatives)
  const breadcrumb = ['Nasional']
  const regionLabel = KEMENTERIAN_DASHBOARD_DATA.regionOptions.find((option) => option.id === filters.regionId)?.label
  const villageLabel = KEMENTERIAN_DASHBOARD_DATA.villageOptions.find((option) => option.id === filters.villageId)?.label

  if (regionLabel) breadcrumb.push(regionLabel)
  if (villageLabel) breadcrumb.push(villageLabel)
  if (selectedCooperative) breadcrumb.push(selectedCooperative.name)

  const regionComparisons = groupCooperatives(cooperatives, 'region')
  const villageComparisons = groupCooperatives(cooperatives, 'village')
  const cooperativeComparisons = buildCooperativeSummaries(cooperatives)
  const hierarchyRows = selectedCooperative
    ? buildCooperativeSummaries(
        KEMENTERIAN_DASHBOARD_DATA.cooperatives.filter(
          (cooperative) => cooperative.villageId === selectedCooperative.villageId && cooperative.id !== selectedCooperative.id,
        ),
      )
    : filters.villageId !== 'all'
      ? buildCooperativeSummaries(cooperatives)
      : filters.regionId !== 'all'
        ? groupCooperatives(cooperatives, 'village')
        : groupCooperatives(cooperatives, 'region')
  const hierarchyTitle = selectedCooperative
    ? 'Koperasi pembanding dalam desa yang sama'
    : filters.villageId !== 'all'
      ? 'Drill-down koperasi'
      : filters.regionId !== 'all'
        ? 'Drill-down desa'
        : 'Drill-down regional'
  const topAlerts = selectTopAlerts([
    ...buildScopeAlerts(summary, trend, getScopeLabel(filters, selectedCooperative)),
    ...buildRegionalAlerts(regionComparisons),
    ...cooperatives.flatMap((cooperative) => cooperative.alerts),
  ])
  const ageDistribution = aggregateDistribution(cooperatives, 'ageDistribution')
  const genderDistribution = aggregateDistribution(cooperatives, 'genderDistribution')
  const occupationDistribution = aggregateDistribution(cooperatives, 'occupationDistribution')
  const aiInsights = buildAiInsights(cooperatives, regionComparisons, cooperativeComparisons, getScopeLabel(filters, selectedCooperative))
  const aiSummary = buildAiSummary(summary, regionComparisons, cooperativeComparisons, getScopeLabel(filters, selectedCooperative))
  const memberRecords = [...cooperatives.flatMap((cooperative) => cooperative.memberRecords)]
    .sort((left, right) => left.incomeChangePct - right.incomeChangePct)
    .slice(0, 12)
  const financialRecords = [...cooperatives.flatMap((cooperative) => cooperative.financialRecords)]
    .sort((left, right) => right.date.localeCompare(left.date))
    .slice(0, 12)

  return {
    level: summary.level,
    scopeLabel: getScopeLabel(filters, selectedCooperative),
    contextLabel: getContextLabel(filters),
    breadcrumb,
    summary,
    trend,
    hierarchyTitle,
    hierarchyRows,
    regionComparisons,
    villageComparisons,
    cooperativeComparisons,
    ageDistribution,
    genderDistribution,
    occupationDistribution,
    topAlerts,
    aiSummary,
    aiInsights,
    memberRecords,
    financialRecords,
    selectedCooperative,
  }
}
