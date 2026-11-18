#!/usr/bin/env node
/**
 * Creates the contact_messages and app_downloads tables. Safe to run repeatedly.
 *
 *   npm run db:migrate
 *
 * Reads DATABASE_URL from .env.local (then .env). Use a Neon Postgres
 * connection string, or any Postgres URL that supports the Neon HTTP driver.
 */
import { neon } from '@neondatabase/serverless';

for (const file of ['.env.local', '.env']) {
  try {
    process.loadEnvFile(file);
  } catch {
    // Missing file is fine; the other one may exist.
  }
}

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('✗ DATABASE_URL is not set.');
  console.error('  Add it to .env.local (or .env), then run `npm run db:migrate` again.');
  process.exit(1);
}

const sql = neon(url);

const statements = [
  {
    name: 'create contact_messages table',
    query: `CREATE TABLE IF NOT EXISTS contact_messages (
      id BIGSERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      service TEXT NOT NULL,
      message TEXT NOT NULL,
      ip TEXT,
      user_agent TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )`,
  },
  {
    name: 'index contact_messages by created_at',
    query: `CREATE INDEX IF NOT EXISTS contact_messages_created_at_idx
      ON contact_messages (created_at DESC)`,
  },
  {
    name: 'create app_downloads table',
    query: `CREATE TABLE IF NOT EXISTS app_downloads (
      id BIGSERIAL PRIMARY KEY,
      product_slug TEXT NOT NULL UNIQUE,
      file_name TEXT NOT NULL,
      version TEXT,
      size_bytes BIGINT NOT NULL,
      content_type TEXT NOT NULL,
      blob_url TEXT NOT NULL,
      download_url TEXT NOT NULL,
      blob_pathname TEXT NOT NULL,
      uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )`,
  },
];

let failed = false;

for (const statement of statements) {
  try {
    await sql.query(statement.query);
    console.log(`✓ ${statement.name}`);
  } catch (error) {
    failed = true;
    console.error(`✗ ${statement.name}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

if (failed) process.exit(1);

console.log('Migration complete.');
