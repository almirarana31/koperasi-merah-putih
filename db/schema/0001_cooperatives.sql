-- Cooperatives analytics table for the Kementerian dashboard.
-- Distributions and trend are stored as JSONB for now; normalize once query
-- patterns settle.

CREATE TABLE IF NOT EXISTS cooperatives (
  id                    TEXT PRIMARY KEY,
  name                  TEXT NOT NULL,
  province_id           TEXT NOT NULL,
  province              TEXT NOT NULL,
  region_id             TEXT NOT NULL,
  region                TEXT NOT NULL,
  village_id            TEXT NOT NULL,
  village               TEXT NOT NULL,
  total_members         INTEGER NOT NULL,
  member_growth_pct     NUMERIC(6, 2) NOT NULL,
  avg_income_before     BIGINT NOT NULL,
  avg_income_after      BIGINT NOT NULL,
  income_improvement_pct NUMERIC(6, 2) NOT NULL,
  avg_monthly_revenue   BIGINT NOT NULL,
  npl_ratio             NUMERIC(5, 2) NOT NULL,
  loan_outstanding      BIGINT NOT NULL,
  total_assets          BIGINT NOT NULL,
  total_liabilities     BIGINT NOT NULL,
  total_net_income      BIGINT NOT NULL,
  health_score          INTEGER NOT NULL,
  health_status         TEXT NOT NULL CHECK (health_status IN ('good', 'warning', 'critical')),
  age_distribution      JSONB NOT NULL,
  gender_distribution   JSONB NOT NULL,
  occupation_distribution JSONB NOT NULL,
  ratio_scores          JSONB NOT NULL,
  trend                 JSONB NOT NULL,
  member_records        JSONB NOT NULL,
  financial_records     JSONB NOT NULL,
  alerts                JSONB NOT NULL,
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS cooperatives_province_idx ON cooperatives (province_id);
CREATE INDEX IF NOT EXISTS cooperatives_region_idx   ON cooperatives (region_id);
CREATE INDEX IF NOT EXISTS cooperatives_village_idx  ON cooperatives (village_id);
CREATE INDEX IF NOT EXISTS cooperatives_health_idx   ON cooperatives (health_status);
