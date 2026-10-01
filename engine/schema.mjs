/* engine/schema.mjs — JSON-LD builders.
   Allowed types only: Organization, WebSite, BreadcrumbList, FAQPage, Article.
   Never InsuranceAgency, Offer, price, Review or AggregateRating. */

export function organizationId(config) { return `${config.origin}/#organizacion`; }
export function websiteId(config) { return `${config.origin}/#website`; }

export function organizationNode(config) {
  /* Name and url only. No e-mail, phone, tax id or address is ever published. */
  const node = {
    '@type': 'Organization',
    '@id': organizationId(config),
    name: config.brand.name,
    url: `${config.origin}/`
  };
  const legal = config.operator?.legalName;
  if (typeof legal === 'string' && legal.trim() !== '') node.legalName = legal.trim();
  return node;
}

export function webSiteNode(config) {
  return {
    '@type': 'WebSite',
    '@id': websiteId(config),
    url: `${config.origin}/`,
    name: config.brand.name,
    inLanguage: config.locale,
    publisher: { '@id': organizationId(config) }
  };
}

export function breadcrumbNode(config, trail) {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${config.origin}${trail[trail.length - 1].path}#breadcrumb`,
    itemListElement: trail.map((entry, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: entry.label,
      item: `${config.origin}${entry.path}`
    }))
  };
}

export function faqPageNode(url, items) {
  return {
    '@type': 'FAQPage',
    '@id': `${url}#faq`,
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a }
    }))
  };
}

export function articleNode(config, post, url) {
  const node = {
    '@type': 'Article',
    '@id': `${url}#article`,
    headline: post.title,
    description: post.description,
    url,
    inLanguage: config.locale,
    datePublished: post.date,
    mainEntityOfPage: url,
    publisher: { '@id': organizationId(config) },
    isPartOf: { '@id': websiteId(config) }
  };
  if (post.updated) node.dateModified = post.updated;
  node.author = post.authorRecord
    ? { '@type': post.authorRecord.type === 'Person' ? 'Person' : 'Organization', name: post.authorRecord.name }
    : { '@id': organizationId(config) };
  return node;
}

export function graph(nodes) {
  return { '@context': 'https://schema.org', '@graph': nodes.filter(Boolean) };
}
