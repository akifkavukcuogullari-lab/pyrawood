import { JsonLd } from './JsonLd';

export function OrganizationJsonLd() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Pyra Wood',
    description:
      'Premium handcrafted wood furniture designed with natural beauty and built to last generations.',
    url: siteUrl,
    logo: `${siteUrl}/images/logo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-555-PYRA-WOOD',
      contactType: 'customer service',
      email: 'hello@pyrawood.com',
      availableLanguage: 'English',
      areaServed: 'US',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: '142 Timber Lane',
      addressLocality: 'Portland',
      addressRegion: 'OR',
      postalCode: '97201',
      addressCountry: 'US',
    },
    sameAs: [
      'https://www.instagram.com/pyrawood',
      'https://www.pinterest.com/pyrawood',
      'https://www.facebook.com/pyrawood',
    ],
  };

  const websiteData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Pyra Wood',
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/products?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <JsonLd data={data} />
      <JsonLd data={websiteData} />
    </>
  );
}
