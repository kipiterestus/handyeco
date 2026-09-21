import { useEffect } from 'react';

/**
 * Custom hook to dynamically manage Title, Meta Description, and Canonical URL
 * for high-performance On-Page SEO on dedicated landing pages.
 */
export function usePageSeo({ title, description, canonical, schema }) {
  useEffect(() => {
    const prevTitle = document.title;
    if (title) {
      document.title = title;
    }

    let metaDesc = document.querySelector('meta[name="description"]');
    const prevDesc = metaDesc ? metaDesc.getAttribute('content') : '';
    if (description) {
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', description);
    }

    let linkCanonical = document.querySelector('link[rel="canonical"]');
    const prevCanonical = linkCanonical ? linkCanonical.getAttribute('href') : '';
    if (canonical) {
      if (!linkCanonical) {
        linkCanonical = document.createElement('link');
        linkCanonical.setAttribute('rel', 'canonical');
        document.head.appendChild(linkCanonical);
      }
      linkCanonical.setAttribute('href', canonical);
    }

    let scriptSchema = null;
    if (schema) {
      scriptSchema = document.createElement('script');
      scriptSchema.type = 'application/ld+json';
      scriptSchema.id = 'page-specific-schema';
      scriptSchema.text = JSON.stringify(schema);
      document.head.appendChild(scriptSchema);
    }

    window.scrollTo(0, 0);

    return () => {
      document.title = prevTitle;
      if (metaDesc && prevDesc) metaDesc.setAttribute('content', prevDesc);
      if (linkCanonical && prevCanonical) linkCanonical.setAttribute('href', prevCanonical);
      if (scriptSchema && scriptSchema.parentNode) {
        scriptSchema.parentNode.removeChild(scriptSchema);
      }
    };
  }, [title, description, canonical, schema]);
}
