import { getCompany, getSeo, getSocial } from '@/lib/content';
import { siteUrl } from '@/lib/site';

function compact(input: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(input).filter(([, value]) => value !== null && value !== undefined && !(Array.isArray(value) && value.length === 0)),
  );
}

/** JSON-LD for the organisation, plus LocalBusiness on pages that want it. */
export async function Schema({ localBusiness = false }: { localBusiness?: boolean }) {
  const [company, seo, social] = await Promise.all([getCompany(), getSeo(), getSocial()]);
  const base = siteUrl();
  const sameAs = social.map((item) => item.url).filter(Boolean);
  const address = company.address ? { '@type': 'PostalAddress', streetAddress: company.address, addressCountry: 'KE' } : null;

  const schemas = [
    compact({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': `${base}/#organization`,
      name: company.name,
      url: `${base}/`,
      description: company.description,
      logo: `${base}/images/teto-logo.png`,
      image: `${base}${seo.shareImage}`,
      email: company.email,
      telephone: company.phone,
      foundingDate: company.founded,
      address,
      sameAs,
    }),
  ];

  if (localBusiness) {
    schemas.push(
      compact({
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        '@id': `${base}/#localbusiness`,
        name: company.name,
        url: `${base}/`,
        description: company.description,
        image: `${base}${seo.shareImage}`,
        email: company.email,
        telephone: company.phone,
        address,
        areaServed: { '@type': 'Country', name: 'Kenya' },
        sameAs,
      }),
    );
  }

  return schemas.map((schema) => (
    <script
      key={String(schema['@type'])}
      type="application/ld+json"
      // Escape "<" so the JSON can never close the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
    />
  ));
}
