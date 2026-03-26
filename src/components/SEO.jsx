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
  getJsonLdFAQ,
} from '@/config/seo.config';

export default function SEO({ pageName, slug, ogImage, faqItems }) {
  const { language } = useLanguage();
  const lang = language === 'fr' ? 'fr' : 'en';

  const pageConfig = SEO_PAGES[pageName];
  const isNoIndex = NOINDEX_PAGES.includes(pageName);

  // Fallback title/description
  const title = pageConfig?.[lang]?.title || `${pageName} | Riviqo`;
  const description = pageConfig?.[lang]?.description || '';
  const lowerPageName = pageName.toLowerCase();
  const canonicalUrl = slug
    ? `${SEO_DEFAULTS.baseUrl}/${lowerPageName}/${slug}`
    : `${SEO_DEFAULTS.baseUrl}/${lowerPageName}`;
  const locale = SEO_DEFAULTS.locale[lang];
  const image = ogImage || SEO_DEFAULTS.ogImage;

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
      } else if (type === 'FAQPage' && faqItems?.length) {
        jsonLdScripts.push(getJsonLdFAQ(faqItems));
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
        <>
          <link rel="canonical" href={canonicalUrl} />
          <link rel="alternate" hrefLang="fr" href={canonicalUrl} />
          <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />
        </>
      )}

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SEO_DEFAULTS.siteName} />
      <meta property="og:locale" content={locale} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={SEO_DEFAULTS.twitterHandle} />
      <meta name="twitter:creator" content={SEO_DEFAULTS.twitterHandle} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* JSON-LD */}
      {jsonLdScripts.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
