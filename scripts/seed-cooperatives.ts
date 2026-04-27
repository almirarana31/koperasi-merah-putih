import 'dotenv/config'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { sql } from '../lib/db/client'
import { KEMENTERIAN_DASHBOARD_DATA } from '../lib/kementerian-dashboard-data'

async function applySchema() {
  const schemaPath = resolve(process.cwd(), 'db/schema/0001_cooperatives.sql')
  const ddl = await readFile(schemaPath, 'utf8')
  const statements = ddl
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.startsWith('--'))

  for (const statement of statements) {
    await sql.query(statement)
  }
  console.log(`Applied schema: ${statements.length} statements`)
}

async function seed() {
  await applySchema()

  await sql`TRUNCATE TABLE cooperatives`
  console.log('Truncated cooperatives')

  const cooperatives = KEMENTERIAN_DASHBOARD_DATA.cooperatives
  let inserted = 0

  for (const c of cooperatives) {
    await sql`
      INSERT INTO cooperatives (
        id, name, province_id, province, region_id, region, village_id, village,
        total_members, member_growth_pct, avg_income_before, avg_income_after,
        income_improvement_pct, avg_monthly_revenue, npl_ratio, loan_outstanding,
        total_assets, total_liabilities, total_net_income, health_score, health_status,
        age_distribution, gender_distribution, occupation_distribution,
        ratio_scores, trend, member_records, financial_records, alerts
      ) VALUES (
        ${c.id}, ${c.name}, ${c.provinceId}, ${c.province}, ${c.regionId}, ${c.region}, ${c.villageId}, ${c.village},
        ${c.totalMembers}, ${c.memberGrowthPct}, ${c.avgIncomeBefore}, ${c.avgIncomeAfter},
        ${c.incomeImprovementPct}, ${c.avgMonthlyRevenue}, ${c.nplRatio}, ${c.loanOutstanding},
        ${c.totalAssets}, ${c.totalLiabilities}, ${c.totalNetIncome}, ${c.healthScore}, ${c.healthStatus},
        ${JSON.stringify(c.ageDistribution)}::jsonb,
        ${JSON.stringify(c.genderDistribution)}::jsonb,
        ${JSON.stringify(c.occupationDistribution)}::jsonb,
        ${JSON.stringify(c.ratioScores)}::jsonb,
        ${JSON.stringify(c.trend)}::jsonb,
        ${JSON.stringify(c.memberRecords)}::jsonb,
        ${JSON.stringify(c.financialRecords)}::jsonb,
        ${JSON.stringify(c.alerts)}::jsonb
      )
    `
    inserted += 1
  }

  console.log(`Inserted ${inserted} cooperatives`)
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Seed failed:', err)
    process.exit(1)
  })
