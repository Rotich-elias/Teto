import { databaseConfigured, getSql } from '@/lib/db';
import { isImagesBlobUrl, isValidProductSlug } from '@/lib/downloads';

/**
 * Launch popups shown by the Deadlines & Notes app are stored here so an admin
 * can publish, schedule and retract them without shipping a new app release.
 * The app only ever reads the public projection returned by `getActiveAdverts`.
 */

export type Advert = {
  id: number;
  app_slug: string;
  title: string;
  body: string;
  image_url: string | null;
  cta_label: string | null;
  cta_url: string | null;
  starts_at: string | null;
  ends_at: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type AdvertInput = {
  appSlug: string;
  title: string;
  body: string;
  imageUrl: string | null;
  ctaLabel: string | null;
  ctaUrl: string | null;
  startsAt: string | null;
  endsAt: string | null;
  active: boolean;
};

/** The only fields exposed to the mobile app. */
export type PublicAdvert = {
  id: string;
  title: string;
  body: string;
  imageUrl: string | null;
  ctaLabel: string | null;
  ctaUrl: string | null;
};

export function advertsConfigured(): boolean {
  return databaseConfigured();
}

function readText(
  value: unknown,
  label: string,
  maxLength: number,
  required: boolean,
): string | null {
  if (value === undefined || value === null) {
    if (required) throw new Error(`${label} is required.`);
    return null;
  }
  if (typeof value !== 'string') throw new Error(`${label} must be text.`);
  const trimmed = value.trim();
  if (!trimmed) {
    if (required) throw new Error(`${label} is required.`);
    return null;
  }
  if (trimmed.length > maxLength) {
    throw new Error(`${label} must be ${maxLength} characters or fewer.`);
  }
  return trimmed;
}

function readDate(value: unknown, label: string): string | null {
  const raw = readText(value, label, 40, false);
  if (!raw) return null;
  const time = Date.parse(raw);
  if (!Number.isFinite(time)) throw new Error(`${label} is not a valid date.`);
  return new Date(time).toISOString();
}

/** Validate untrusted admin input before it reaches the database. */
export function parseAdvertInput(input: unknown): AdvertInput {
  if (!input || typeof input !== 'object') throw new Error('Invalid request.');
  const raw = input as Record<string, unknown>;

  const appSlug = readText(raw.appSlug, 'App', 60, true)!;
  if (!isValidProductSlug(appSlug)) throw new Error('Unknown app.');

  const title = readText(raw.title, 'Title', 120, true)!;
  const body = readText(raw.body, 'Message', 1000, true)!;

  const imageUrl = readText(raw.imageUrl, 'Image URL', 2000, false);
  if (imageUrl && !isImagesBlobUrl(imageUrl)) {
    throw new Error('Choose an image uploaded through the media library.');
  }

  let ctaLabel = readText(raw.ctaLabel, 'Button label', 40, false);
  const ctaUrl = readText(raw.ctaUrl, 'Button link', 2000, false);
  if (ctaUrl) {
    let parsed: URL;
    try {
      parsed = new URL(ctaUrl);
    } catch {
      throw new Error('Button link must be a valid https URL.');
    }
    if (parsed.protocol !== 'https:') {
      throw new Error('Button link must use https.');
    }
    ctaLabel ??= 'Learn more';
  } else if (ctaLabel) {
    throw new Error('Add a button link when a button label is set.');
  }

  const startsAt = readDate(raw.startsAt, 'Start date');
  const endsAt = readDate(raw.endsAt, 'End date');
  if (startsAt && endsAt && Date.parse(endsAt) < Date.parse(startsAt)) {
    throw new Error('The end date must be after the start date.');
  }

  const active = raw.active === undefined ? true : raw.active;
  if (typeof active !== 'boolean') throw new Error('Invalid active flag.');

  return {
    appSlug,
    title,
    body,
    imageUrl,
    ctaLabel,
    ctaUrl,
    startsAt,
    endsAt,
    active,
  };
}

function toPublic(advert: Advert): PublicAdvert {
  return {
    id: String(advert.id),
    title: advert.title,
    body: advert.body,
    imageUrl: advert.image_url,
    ctaLabel: advert.cta_label,
    ctaUrl: advert.cta_url,
  };
}

/** Active adverts for one app, newest first. Scheduling is enforced in SQL. */
export async function getActiveAdverts(appSlug: string): Promise<PublicAdvert[]> {
  if (!isValidProductSlug(appSlug) || !advertsConfigured()) return [];

  const rows = (await getSql().query(
    `SELECT id, title, body, image_url, cta_label, cta_url
       FROM app_adverts
      WHERE app_slug = $1
        AND active = true
        AND (starts_at IS NULL OR starts_at <= now())
        AND (ends_at IS NULL OR ends_at >= now())
      ORDER BY created_at DESC
      LIMIT 10`,
    [appSlug],
  )) as Advert[];

  return rows.map(toPublic);
}

export async function listAdverts(): Promise<Advert[]> {
  if (!advertsConfigured()) return [];

  return (await getSql().query(
    `SELECT * FROM app_adverts ORDER BY created_at DESC`,
  )) as Advert[];
}

export async function createAdvert(input: AdvertInput): Promise<Advert> {
  const rows = (await getSql().query(
    `INSERT INTO app_adverts
       (app_slug, title, body, image_url, cta_label, cta_url, starts_at, ends_at, active)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [
      input.appSlug,
      input.title,
      input.body,
      input.imageUrl,
      input.ctaLabel,
      input.ctaUrl,
      input.startsAt,
      input.endsAt,
      input.active,
    ],
  )) as Advert[];

  return rows[0]!;
}

export async function updateAdvert(id: number, input: AdvertInput): Promise<Advert | null> {
  const rows = (await getSql().query(
    `UPDATE app_adverts SET
       app_slug = $2,
       title = $3,
       body = $4,
       image_url = $5,
       cta_label = $6,
       cta_url = $7,
       starts_at = $8,
       ends_at = $9,
       active = $10,
       updated_at = now()
     WHERE id = $1
     RETURNING *`,
    [
      id,
      input.appSlug,
      input.title,
      input.body,
      input.imageUrl,
      input.ctaLabel,
      input.ctaUrl,
      input.startsAt,
      input.endsAt,
      input.active,
    ],
  )) as Advert[];

  return rows[0] ?? null;
}

export async function deleteAdvert(id: number): Promise<Advert | null> {
  const rows = (await getSql().query(
    `DELETE FROM app_adverts WHERE id = $1 RETURNING *`,
    [id],
  )) as Advert[];

  return rows[0] ?? null;
}
