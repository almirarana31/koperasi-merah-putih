import { neon, neonConfig } from '@neondatabase/serverless'

neonConfig.fetchConnectionCache = true

const connectionString = process.env.DATABASE_URL ?? process.env.POSTGRES_URL

if (!connectionString) {
  throw new Error(
    'DATABASE_URL (or POSTGRES_URL) is not set. Run `vercel env pull .env.local` to fetch it from your Vercel project.',
  )
}

export const sql = neon(connectionString)
