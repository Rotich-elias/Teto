import { describe, expect, it } from 'vitest';
import { parseAdvertInput } from '@/lib/adverts';

const IMAGE = 'https://store123.public.blob.vercel-storage.com/images/123-banner.png';

const valid = {
  appSlug: 'deadlines-notes',
  title: 'New planner available',
  body: 'Try the updated study planner.',
};

describe('advert validation', () => {
  it('accepts a minimal advert', () => {
    expect(parseAdvertInput(valid)).toEqual({
      ...valid,
      imageUrl: null,
      ctaLabel: null,
      ctaUrl: null,
      startsAt: null,
      endsAt: null,
      active: true,
    });
  });

  it('accepts an image, call to action and schedule', () => {
    const parsed = parseAdvertInput({
      ...valid,
      imageUrl: IMAGE,
      ctaLabel: 'Read more',
      ctaUrl: 'https://teto.co.ke/products',
      startsAt: '2026-11-24T08:00:00.000Z',
      endsAt: '2026-12-24T08:00:00.000Z',
      active: false,
    });

    expect(parsed.imageUrl).toBe(IMAGE);
    expect(parsed.ctaLabel).toBe('Read more');
    expect(parsed.active).toBe(false);
    expect(parsed.startsAt).toBe('2026-11-24T08:00:00.000Z');
  });

  it('defaults a button label when only a link is provided', () => {
    expect(parseAdvertInput({ ...valid, ctaUrl: 'https://teto.co.ke' }).ctaLabel).toBe('Learn more');
  });

  it('rejects unknown apps and empty content', () => {
    expect(() => parseAdvertInput({ ...valid, appSlug: '../admin' })).toThrow('Unknown app.');
    expect(() => parseAdvertInput({ ...valid, title: '   ' })).toThrow('Title is required.');
    expect(() => parseAdvertInput({ ...valid, body: '' })).toThrow('Message is required.');
  });

  it('only allows images from our own media library', () => {
    expect(() => parseAdvertInput({ ...valid, imageUrl: 'https://example.com/banner.png' })).toThrow(
      'Choose an image uploaded through the media library.',
    );
    expect(parseAdvertInput({ ...valid, imageUrl: IMAGE }).imageUrl).toBe(IMAGE);
  });

  it('only allows https button links', () => {
    expect(() => parseAdvertInput({ ...valid, ctaUrl: 'javascript:alert(1)' })).toThrow();
    expect(() => parseAdvertInput({ ...valid, ctaUrl: 'http://example.com' })).toThrow('https');
    expect(() => parseAdvertInput({ ...valid, ctaLabel: 'Read more' })).toThrow('button link');
  });

  it('rejects invalid or reversed schedules', () => {
    expect(() => parseAdvertInput({ ...valid, startsAt: 'tomorrow' })).toThrow('Start date');
    expect(() =>
      parseAdvertInput({
        ...valid,
        startsAt: '2026-12-25T00:00:00.000Z',
        endsAt: '2026-12-24T00:00:00.000Z',
      }),
    ).toThrow('end date must be after');
  });
});
