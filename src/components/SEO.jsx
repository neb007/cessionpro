import { Helmet } from 'react-helmet-async';
import { useLanguage } from '@/components/i18n/LanguageContext';
import {
  SEO_DEFAULTS,
  SEO_PAGES,
  NOINDEX_PAGES,
  getJsonLdOrganization,
  getJsonLdWebSite,
  getJsonLdSoftwareApp,
  getJsonLdArticle,
  getJsonLdBlog,
} from '@/config/seo.config';

export default function SEO({ pageName }) {
  const { language } = useLanguage();
  const lang = language === 'fr' ? 'fr' : 'en';

  const pageConfig = SEO_PAGES[pageName];
  const isNoIndex = NOINDEX_PAGES.includes(pageName);

  // Fallback title/description
  const title = pageConfig?.[lang]?.title || `${pageName} | Riviqo`;
  const description = pageConfig?.[lang]?.description || '';
  const canonicalUrl = `${SEO_DEFAULTS.baseUrl}/${pageName}`;
  const locale = SEO_DEFAULTS.locale[lang];

  // Build JSON-LD scripts
  const jsonLdScripts = [];

  // Organization on all indexed pages
  if (!isNoIndex) {
    jsonLdScripts.push(getJsonLdOrganization());
  }

  // Page-specific JSON-LD
  if (pageConfig?.jsonLd) {
    for (const type of pageConfig.jsonLd) {
      if (type === 'WebSite') {
        jsonLdScripts.push(getJsonLdWebSite());
      } else if (type === 'SoftwareApplication') {
        jsonLdScripts.push(getJsonLdSoftwareApp(title, description));
      } else if (type === 'Article') {
        jsonLdScripts.push(getJsonLdArticle(title, description, canonicalUrl));
      } else if (type === 'Blog') {
        jsonLdScripts.push(getJsonLdBlog());
      }
    }
  }

  return (
    <Helmet>
      <html lang={lang} />
      <title>{title}</title>
      <meta name="description" content={description} />
      {isNoIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <link rel="canonical" href={canonicalUrl} />
      )}

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SEO_DEFAULTS.siteName} />
      <meta property="og:locale" content={locale} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={SEO_DEFAULTS.ogImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={SEO_DEFAULTS.ogImage} />

      {/* JSON-LD */}
      {jsonLdScripts.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
