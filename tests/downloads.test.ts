import { describe, expect, it } from 'vitest';
import {
  APK_MIME_TYPE,
  MAX_APK_BYTES,
  isDownloadsBlobUrl,
  isImagesBlobUrl,
  isValidApkFileName,
  isValidApkSize,
  isValidProductSlug,
  normalizeVersion,
  withDownloadParam,
} from '@/lib/downloads';

const BLOB_URL =
  'https://store123.public.blob.vercel-storage.com/downloads/deadlines-notes/deadline-1.0.24-AbCdEf.apk';

describe('download validation', () => {
  it('accepts only safe product slugs', () => {
    expect(isValidProductSlug('deadlines-notes')).toBe(true);
    expect(isValidProductSlug('tso2')).toBe(true);
    expect(isValidProductSlug('Deadlines Notes')).toBe(false);
    expect(isValidProductSlug('../admin')).toBe(false);
    expect(isValidProductSlug('')).toBe(false);
  });

  it('accepts only simple APK file names', () => {
    expect(isValidApkFileName('deadline-1.0.24.apk')).toBe(true);
    expect(isValidApkFileName('My.App-v2.APK')).toBe(true);
    expect(isValidApkFileName('notes.exe')).toBe(false);
    expect(isValidApkFileName('../evil.apk')).toBe(false);
    expect(isValidApkFileName('folder/evil.apk')).toBe(false);
  });

  it('accepts only supported file sizes', () => {
    expect(isValidApkSize(1)).toBe(true);
    expect(isValidApkSize(MAX_APK_BYTES)).toBe(true);
    expect(isValidApkSize(0)).toBe(false);
    expect(isValidApkSize(MAX_APK_BYTES + 1)).toBe(false);
    expect(isValidApkSize(Number.NaN)).toBe(false);
  });

  it('recognises public Blob URLs in the downloads folder', () => {
    expect(isDownloadsBlobUrl(BLOB_URL)).toBe(true);
    expect(isDownloadsBlobUrl(BLOB_URL, 'deadlines-notes')).toBe(true);
    expect(isDownloadsBlobUrl(BLOB_URL, 'other-app')).toBe(false);
    expect(isDownloadsBlobUrl(BLOB_URL.replace('.apk', '.exe'))).toBe(false);
    expect(isDownloadsBlobUrl('https://example.com/downloads/app.apk')).toBe(false);
    expect(isDownloadsBlobUrl('not a url')).toBe(false);
  });

  it('recognises public Blob URLs for uploaded images', () => {
    const image = 'https://store123.public.blob.vercel-storage.com/images/123-logo.png';
    expect(isImagesBlobUrl(image)).toBe(true);
    expect(isImagesBlobUrl(image.replace('.png', '.apk'))).toBe(false);
    expect(isImagesBlobUrl(image.replace('/images/', '/downloads/'))).toBe(false);
    expect(isImagesBlobUrl('https://example.com/images/logo.png')).toBe(false);
  });

  it('adds the download parameter without losing other parameters', () => {
    expect(withDownloadParam(BLOB_URL)).toBe(`${BLOB_URL}?download=1`);
    expect(withDownloadParam(`${BLOB_URL}?x=1`)).toContain('download=1');
  });

  it('normalises optional version labels', () => {
    expect(normalizeVersion(' 1.0.24 ')).toBe('1.0.24');
    expect(normalizeVersion('   ')).toBeNull();
    expect(normalizeVersion(null)).toBeNull();
  });

  it('uses the Android package MIME type', () => {
    expect(APK_MIME_TYPE).toBe('application/vnd.android.package-archive');
  });
});
