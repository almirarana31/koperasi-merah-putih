import { sql } from './client'
import type { CooperativeAnalytics } from '@/lib/kementerian-dashboard-data'

type CooperativeRow = {
  id: string
  name: string
  province_id: string
  province: string
  region_id: string
  region: string
  village_id: string
  village: string
  total_members: number
  member_growth_pct: string
  avg_income_before: string
  avg_income_after: string
  income_improvement_pct: string
  avg_monthly_revenue: string
  npl_ratio: string
  loan_outstanding: string
  total_assets: string
  total_liabilities: string
  total_net_income: string
  health_score: number
  health_status: 'good' | 'warning' | 'critical'
  age_distribution: CooperativeAnalytics['ageDistribution']
  gender_distribution: CooperativeAnalytics['genderDistribution']
  occupation_distribution: CooperativeAnalytics['occupationDistribution']
  ratio_scores: CooperativeAnalytics['ratioScores']
  trend: CooperativeAnalytics['trend']
  member_records: CooperativeAnalytics['memberRecords']
  financial_records: CooperativeAnalytics['financialRecords']
  alerts: CooperativeAnalytics['alerts']
}

function rowToCooperative(row: CooperativeRow): CooperativeAnalytics {
  return {
    id: row.id,
    name: row.name,
    provinceId: row.province_id,
    province: row.province,
    regionId: row.region_id,
    region: row.region,
    villageId: row.village_id,
    village: row.village,
    totalMembers: row.total_members,
    memberGrowthPct: Number(row.member_growth_pct),
    avgIncomeBefore: Number(row.avg_income_before),
    avgIncomeAfter: Number(row.avg_income_after),
    incomeImprovementPct: Number(row.income_improvement_pct),
    avgMonthlyRevenue: Number(row.avg_monthly_revenue),
    nplRatio: Number(row.npl_ratio),
    loanOutstanding: Number(row.loan_outstanding),
    totalAssets: Number(row.total_assets),
    totalLiabilities: Number(row.total_liabilities),
    totalNetIncome: Number(row.total_net_income),
    healthScore: row.health_score,
    healthStatus: row.health_status,
    ageDistribution: row.age_distribution,
    genderDistribution: row.gender_distribution,
    occupationDistribution: row.occupation_distribution,
    ratioScores: row.ratio_scores,
    trend: row.trend,
    memberRecords: row.member_records,
    financialRecords: row.financial_records,
    alerts: row.alerts,
  }
}

export async function getAllCooperatives(): Promise<CooperativeAnalytics[]> {
  const rows = (await sql`SELECT * FROM cooperatives ORDER BY province, region, village, name`) as CooperativeRow[]
  return rows.map(rowToCooperative)
}
