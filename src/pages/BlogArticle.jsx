import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useLanguage } from '@/components/i18n/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowRight, Clock, Calendar, ArrowLeft } from 'lucide-react';
import BreadcrumbNav from '@/components/blog/BreadcrumbNav';
import TableOfContents from '@/components/blog/TableOfContents';
import ArticleRenderer from '@/components/blog/ArticleRenderer';
import RelatedArticles from '@/components/blog/RelatedArticles';
import { BLOG_ARTICLES, CLUSTERS } from '@/data/blog/articles';
import { Helmet } from 'react-helmet-async';
import {
  SEO_DEFAULTS,
  getJsonLdOrganization,
  getJsonLdBreadcrumb,
  getJsonLdFAQ,
} from '@/config/seo.config';

export default function BlogArticle() {
  const { slug } = useParams();
  const { language } = useLanguage();
  const isFr = language === 'fr';
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  const article = BLOG_ARTICLES.find(a => a.slug === slug);
  const cluster = article ? CLUSTERS[article.cluster] : null;

  useEffect(() => {
    setLoading(true);
    setContent(null);
    if (!article) {
      setLoading(false);
      return;
    }
    import(`@/data/blog/content/${slug}.js`)
      .then(mod => {
        setContent(mod.default);
        setLoading(false);
      })
      .catch(() => {
        setContent(null);
        setLoading(false);
      });
  }, [slug, article]);

  if (!article) {
    return (
      <div className="bg-[#FAF9F7] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-[#3B4759] mb-4">Article introuvable</h1>
          <Link to="/Blog">
            <Button className="bg-[#FF6B4A] hover:bg-[#FF5733] text-white rounded-full px-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour au blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const title = isFr ? article.titleFr : article.titleEn;
  const description = isFr ? article.descFr : article.descEn;
  const canonicalUrl = `${SEO_DEFAULTS.baseUrl}/blog/${slug}`;

  // JSON-LD
  const jsonLdArticle = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url: canonicalUrl,
    datePublished: article.publishDate,
    dateModified: article.publishDate,
    author: { '@type': 'Organization', name: 'Riviqo' },
    publisher: {
      '@type': 'Organization',
      name: 'Riviqo',
      logo: { '@type': 'ImageObject', url: `${SEO_DEFAULTS.baseUrl}/riviqo-logo.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
  };

  const breadcrumbJsonLd = getJsonLdBreadcrumb(title, canonicalUrl);

  return (
    <div className="bg-[#FAF9F7]">
      <Helmet>
        <html lang={isFr ? 'fr' : 'en'} />
        <title>{`${title} | Riviqo`}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="alternate" hrefLang="fr" href={canonicalUrl} />
        <link rel="alternate" hrefLang="en" href={canonicalUrl} />
        <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Riviqo" />
        <meta property="og:locale" content={isFr ? 'fr_FR' : 'en_US'} />
        <meta property="og:title" content={`${title} | Riviqo`} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={`${SEO_DEFAULTS.baseUrl}/riviqo-logo.png`} />
        <meta property="article:published_time" content={article.publishDate} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content={SEO_DEFAULTS.twitterHandle} />
        <meta name="twitter:title" content={`${title} | Riviqo`} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={`${SEO_DEFAULTS.baseUrl}/riviqo-logo.png`} />
        <script type="application/ld+json">{JSON.stringify(getJsonLdOrganization())}</script>
        <script type="application/ld+json">{JSON.stringify(jsonLdArticle)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
        {content?.faq?.length > 0 && (
          <script type="application/ld+json">{JSON.stringify(getJsonLdFAQ(content.faq))}</script>
        )}
      </Helmet>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-[#F0ECE6]">
        <BreadcrumbNav articleTitle={title} />
      </div>

      {/* Hero */}
      <section className="bg-[#FAF9F7] pt-12 pb-10 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-5">
            {cluster && (
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider"
                style={{ color: cluster.color, backgroundColor: `${cluster.color}15` }}
              >
                {isFr ? cluster.labelFr : cluster.labelEn}
              </span>
            )}
            <span className="text-xs text-[#9EABC1] flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {article.readTime} min {isFr ? 'de lecture' : 'read'}
            </span>
            <span className="text-xs text-[#9EABC1] flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(article.publishDate).toLocaleDateString(isFr ? 'fr-FR' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#3B4759] leading-tight mb-4">
            {title}
          </h1>
          <p className="text-lg text-[#6B7A94] leading-relaxed max-w-3xl">
            {description}
          </p>
        </div>
      </section>

      {loading && (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-[#FF6B4A] rounded-full animate-spin" />
        </div>
      )}

      {!loading && content && (
        <>
          {/* Table des matières */}
          {content.chapters?.length > 1 && (
            <TableOfContents
              chapters={content.chapters}
              label={isFr ? 'Table des matières' : 'Table of contents'}
            />
          )}

          {/* Chapitres */}
          <section className="py-16 px-4 bg-[#FAF9F7]">
            <div className="max-w-4xl mx-auto space-y-16">
              {content.chapters?.map((ch, idx) => (
                <article key={ch.id} id={ch.id} className="scroll-mt-24">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="font-mono text-sm font-bold text-[#FF6B4A] flex-shrink-0">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#3B4759]">{ch.title}</h2>
                  </div>
                  <div className="w-12 h-0.5 bg-[#FF6B4A] mb-6" />
                  <ArticleRenderer content={ch.content} />
                </article>
              ))}
            </div>
          </section>

          {/* FAQ */}
          {content.faq?.length > 0 && (
            <section className="py-16 px-4 bg-white border-t border-[#F0ECE6]">
              <div className="max-w-4xl mx-auto">
                <h2 className="font-display text-2xl font-bold text-[#3B4759] mb-8">
                  {isFr ? 'Questions fréquentes' : 'Frequently asked questions'}
                </h2>
                <div className="space-y-4">
                  {content.faq.map((item, i) => (
                    <details key={i} className="group bg-[#FAF9F7] rounded-xl border border-[#F0ECE6] overflow-hidden">
                      <summary className="px-6 py-4 cursor-pointer font-display font-semibold text-[#3B4759] hover:text-[#FF6B4A] transition-colors list-none flex items-center justify-between">
                        {item.question}
                        <ChevronIcon />
                      </summary>
                      <div className="px-6 pb-4 text-sm text-[#6B7A94] leading-relaxed">
                        {item.answer}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* CTA */}
          {content.cta && (
            <section className="py-12 px-4 bg-[#FAF9F7]">
              <div className="max-w-4xl mx-auto">
                <div className="p-6 bg-[#FFF4F1] rounded-xl border border-[#FFD8CC] text-center">
                  <p className="text-sm font-medium text-[#FF6B4A] mb-2">
                    {isFr ? 'Outil gratuit' : 'Free tool'}
                  </p>
                  <p className="text-[#3B4759] font-display font-semibold mb-4">{content.cta.text}</p>
                  <Link to={createPageUrl(content.cta.tool)}>
                    <Button className="bg-[#FF6B4A] hover:bg-[#FF5733] text-white rounded-full px-8 py-5 font-display font-semibold">
                      {isFr ? 'Essayer gratuitement' : 'Try for free'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </section>
          )}
        </>
      )}

      {!loading && !content && (
        <div className="py-20 text-center">
          <p className="text-[#6B7A94]">{isFr ? 'Contenu en cours de rédaction...' : 'Content coming soon...'}</p>
        </div>
      )}

      {/* Related articles */}
      {article.relatedSlugs?.length > 0 && (
        <RelatedArticles
          slugs={article.relatedSlugs}
          label={isFr ? 'Articles liés' : 'Related articles'}
        />
      )}

      {/* Bottom CTA */}
      <section className="py-16 px-4 bg-[#3B4759]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-4">
            {isFr ? 'Prêt à passer à l\'action ?' : 'Ready to take action?'}
          </h2>
          <p className="text-[#B7C2D4] mb-8 max-w-xl mx-auto">
            {isFr
              ? "Utilisez nos outils gratuits pour concrétiser votre projet de cession ou de reprise d'entreprise."
              : "Use our free tools to bring your business sale or acquisition project to life."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl('Outils')}>
              <Button className="bg-[#FF6B4A] hover:bg-[#FF5733] text-white rounded-full px-8 py-6 text-base font-display font-semibold">
                {isFr ? 'Découvrir les outils' : 'Discover tools'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to={createPageUrl('Contact')}>
              <Button variant="outline" className="bg-transparent rounded-full px-8 py-6 text-base font-display font-semibold border-white/30 text-white hover:bg-white/10">
                {isFr ? 'Parler à un expert' : 'Talk to an expert'}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function ChevronIcon() {
  return (
    <svg className="w-4 h-4 transition-transform group-open:rotate-180 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}
