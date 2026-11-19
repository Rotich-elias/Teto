import { databaseConfigured, getSql } from '@/lib/db';

/** Helpers for the admin media library and contact-message inbox. */

export type MediaAsset = {
  id: number;
  pathname: string;
  url: string;
  file_name: string;
  content_type: string;
  size_bytes: number;
  uploaded_at: string;
};

export type AdminMessage = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  service: string;
  message: string;
  ip: string | null;
  read: boolean;
  created_at: string;
};

export async function listMedia(): Promise<MediaAsset[]> {
  if (!databaseConfigured()) return [];
  try {
    return (await getSql().query(
      `SELECT * FROM media_assets ORDER BY uploaded_at DESC, id DESC LIMIT 200`,
    )) as MediaAsset[];
  } catch (error) {
    console.error('Could not list media assets.', error);
    return [];
  }
}

export async function addMedia(input: Omit<MediaAsset, 'id' | 'uploaded_at'>): Promise<void> {
  if (!databaseConfigured()) return;
  await getSql().query(
    `INSERT INTO media_assets (pathname, url, file_name, content_type, size_bytes)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (pathname) DO UPDATE SET url = EXCLUDED.url, file_name = EXCLUDED.file_name`,
    [input.pathname, input.url, input.file_name, input.content_type, input.size_bytes],
  );
}

export async function removeMedia(pathname: string): Promise<MediaAsset | null> {
  if (!databaseConfigured()) return null;
  const rows = (await getSql().query(
    `DELETE FROM media_assets WHERE pathname = $1 RETURNING *`,
    [pathname],
  )) as MediaAsset[];
  return rows[0] ?? null;
}

export async function listMessages(options: { unreadOnly?: boolean; limit?: number } = {}): Promise<AdminMessage[]> {
  if (!databaseConfigured()) return [];
  const limit = Math.min(Math.max(options.limit ?? 100, 1), 200);
  try {
    return (await getSql().query(
      `SELECT id, name, email, phone, service, message, ip, read, created_at
         FROM contact_messages
        WHERE ($1::boolean = false OR read = false)
        ORDER BY created_at DESC, id DESC
        LIMIT $2`,
      [options.unreadOnly === true, limit],
    )) as AdminMessage[];
  } catch (error) {
    console.error('Could not list contact messages.', error);
    return [];
  }
}

export async function setMessageRead(id: number, read: boolean): Promise<boolean> {
  if (!databaseConfigured()) return false;
  const rows = (await getSql().query(
    `UPDATE contact_messages SET read = $2 WHERE id = $1 RETURNING id`,
    [id, read],
  )) as Array<{ id: number }>;
  return rows.length > 0;
}

export async function deleteMessage(id: number): Promise<boolean> {
  if (!databaseConfigured()) return false;
  const rows = (await getSql().query(
    `DELETE FROM contact_messages WHERE id = $1 RETURNING id`,
    [id],
  )) as Array<{ id: number }>;
  return rows.length > 0;
}

export async function unreadMessageCount(): Promise<number> {
  if (!databaseConfigured()) return 0;
  try {
    const rows = (await getSql().query(
      `SELECT count(*)::int AS count FROM contact_messages WHERE read = false`,
    )) as Array<{ count: number }>;
    return Number(rows[0]?.count ?? 0);
  } catch {
    return 0;
  }
}
