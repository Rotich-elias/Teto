#!/usr/bin/env node
/**
 * Creates all tables used by the contact form, downloads and admin CMS.
 * Safe to run repeatedly.
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
  {
    name: 'add read flag to contact_messages',
    query: `ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS read BOOLEAN NOT NULL DEFAULT false`,
  },
  {
    name: 'index unread contact_messages',
    query: `CREATE INDEX IF NOT EXISTS contact_messages_read_idx
      ON contact_messages (read, created_at DESC)`,
  },
  {
    name: 'create site_content table',
    query: `CREATE TABLE IF NOT EXISTS site_content (
      key TEXT PRIMARY KEY,
      data JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )`,
  },
  {
    name: 'create content_changes table',
    query: `CREATE TABLE IF NOT EXISTS content_changes (
      id BIGSERIAL PRIMARY KEY,
      section TEXT NOT NULL,
      action TEXT NOT NULL,
      snapshot JSONB,
      changed_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )`,
  },
  {
    name: 'index content_changes by date',
    query: `CREATE INDEX IF NOT EXISTS content_changes_changed_at_idx
      ON content_changes (changed_at DESC)`,
  },
  {
    name: 'create media_assets table',
    query: `CREATE TABLE IF NOT EXISTS media_assets (
      id BIGSERIAL PRIMARY KEY,
      pathname TEXT NOT NULL UNIQUE,
      url TEXT NOT NULL,
      file_name TEXT NOT NULL,
      content_type TEXT NOT NULL,
      size_bytes BIGINT NOT NULL,
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
