import { neon, type NeonQueryFunction } from '@neondatabase/serverless';
import type { ContactData } from '@/lib/contact';

let client: NeonQueryFunction<false, false> | null = null;

/** True when a Postgres connection string is available. */
export function databaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

function getClient(): NeonQueryFunction<false, false> {
  if (!client) {
    client = neon(process.env.DATABASE_URL as string);
  }
  return client;
}

export type ContactMessageMeta = {
  ip: string;
  userAgent: string;
};

/**
 * Persist a validated contact submission. The schema is created by
 * `npm run db:migrate` (see scripts/migrate.mjs).
 */
export async function saveContactMessage(data: ContactData, meta: ContactMessageMeta): Promise<void> {
  const sql = getClient();

  await sql.query(
    `INSERT INTO contact_messages (name, email, phone, service, message, ip, user_agent)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [data.name, data.email, data.phone, data.service, data.message, meta.ip, meta.userAgent],
  );
}
