import { BUSINESS_INFO } from '../data/businessData';

/**
 * Generates an interconnected Schema.org @graph with:
 * 1. Service / LocalBusiness schema
 * 2. BreadcrumbList schema (for rich Google SERP breadcrumbs)
 * 3. FAQPage schema (for Google accordion rich snippets)
 */
export function buildPageSchema({
  title,
  description,
  canonical,
  serviceName,
  isAreaPage = false,
  areaName,
  areaPostcodes = [],
  breadcrumbs = [],
  faqs = [],
  siteConfig = {},
  price = "65.00"
}) {
  const phone = siteConfig.phone || BUSINESS_INFO.phone;
  const graph = [];

  // 1. Service or LocalBusiness Schema
  if (!isAreaPage && serviceName) {
    graph.push({
      "@type": "Service",
      "@id": `${canonical}#service`,
      "name": serviceName,
      "provider": {
        "@type": ["HandymanService", "LocalBusiness"],
        "name": "Handyeco",
        "telephone": phone,
        "url": "https://handyeco.co.uk/",
        "image": "https://handyeco.co.uk/hero-handyman-edinburgh.jpg",
        "priceRange": "££",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Edinburgh City Centre",
          "addressLocality": "Edinburgh",
          "addressRegion": "City of Edinburgh",
          "postalCode": "EH1",
          "addressCountry": "GB"
        }
      },
      "areaServed": "Edinburgh and Lothians",
      "description": description,
      "offers": {
        "@type": "Offer",
        "priceCurrency": "GBP",
        "price": price,
        "priceValidUntil": "2027-12-31"
      }
    });
  } else if (isAreaPage) {
    graph.push({
      "@type": ["HandymanService", "LocalBusiness"],
      "@id": `${canonical}#localbusiness`,
      "name": `Handyeco - Handyman Services in ${areaName || 'Edinburgh'}`,
      "telephone": phone,
      "url": canonical,
      "image": "https://handyeco.co.uk/hero-handyman-edinburgh.jpg",
      "priceRange": "££",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": `${areaName ? areaName + ', ' : ''}Edinburgh`,
        "addressRegion": "City of Edinburgh",
        "postalCode": areaPostcodes[0] || "EH1",
        "addressCountry": "GB"
      },
      "areaServed": areaPostcodes.length > 0 ? areaPostcodes : [areaName || "Edinburgh"],
      "description": description
    });
  }

  // 2. BreadcrumbList Schema
  if (breadcrumbs && breadcrumbs.length > 0) {
    graph.push({
      "@type": "BreadcrumbList",
      "@id": `${canonical}#breadcrumb`,
      "itemListElement": breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": crumb.name,
        "item": crumb.url
      }))
    });
  }

  // 3. FAQPage Schema
  if (faqs && faqs.length > 0) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${canonical}#faq`,
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.a
        }
      }))
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph
  };
}
