// @ts-nocheck
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useLanguage } from '@/components/i18n/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, FileText, Landmark, Rocket, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import SEO from '@/components/SEO';
import { BLOG_ARTICLES, CLUSTERS } from '@/data/blog/articles';

// Legacy featured articles (existing guides/tools)
const FEATURED_ARTICLES = [
  {
    slug: 'GuideCession',
    icon: FileText,
    titleFr: 'Guide complet de la cession d\'entreprise',
    titleEn: 'Complete guide to selling a business',
    descFr: 'Tout savoir pour vendre votre entreprise : préparation, valorisation, timing, négociation et fiscalité.',
    descEn: 'Everything you need to know to sell your business: preparation, valuation, timing, negotiation and taxation.',
    categoryFr: 'Guide',
    categoryEn: 'Guide',
    readTimeFr: '25 min de lecture',
    readTimeEn: '25 min read',
    isLegacy: true,
  },
  {
    slug: 'GuideRepreneur',
    icon: Landmark,
    titleFr: 'Guide complet de la reprise d\'entreprise',
    titleEn: 'Complete guide to buying a business',
    descFr: 'Du projet au closing : sourcing, due diligence, financement et négociation.',
    descEn: 'From project to closing: sourcing, due diligence, financing and negotiation.',
    categoryFr: 'Guide',
    categoryEn: 'Guide',
    readTimeFr: '30 min de lecture',
    readTimeEn: '30 min read',
    isLegacy: true,
  },
  {
    slug: 'GuideRepreneuriat',
    icon: Rocket,
    titleFr: 'Le repreneuriat : devenir entrepreneur par la reprise',
    titleEn: 'Entrepreneurship through acquisition',
    descFr: 'Avantages vs création, profil du repreneur, étapes clés, financement et erreurs à éviter.',
    descEn: 'Advantages vs startup, buyer profile, key steps, financing and mistakes to avoid.',
    categoryFr: 'Guide',
    categoryEn: 'Guide',
    readTimeFr: '20 min de lecture',
    readTimeEn: '20 min read',
    isLegacy: true,
  },
];

const ARTICLES_PER_PAGE = 12;

export default function Blog() {
  const { language } = useLanguage();
  const isFr = language === 'fr';
  const [activeCluster, setActiveCluster] = useState('all');
  const [page, setPage] = useState(1);

  const filteredArticles = useMemo(() => {
    if (activeCluster === 'all') return BLOG_ARTICLES;
    return BLOG_ARTICLES.filter(a => a.cluster === activeCluster);
  }, [activeCluster]);

  const totalPages = Math.ceil(filteredArticles.length / ARTICLES_PER_PAGE);
  const paginatedArticles = filteredArticles.slice((page - 1) * ARTICLES_PER_PAGE, page * ARTICLES_PER_PAGE);

  const handleClusterChange = (cluster) => {
    setActiveCluster(cluster);
    setPage(1);
  };

  return (
    <div className="bg-[#FAF9F7]">
      <SEO pageName="Blog" />

      {/* Hero */}
      <section className="bg-[#FAF9F7] pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#FFD8CC] bg-[#FFF4F1] px-4 py-1.5 text-[#FF6B4A] text-sm font-medium mb-6">
            <BookOpen className="w-3.5 h-3.5" />
            {isFr ? 'Ressources & Guides' : 'Resources & Guides'}
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#3B4759] leading-tight mb-6">
            {isFr ? 'Blog Riviqo' : 'Riviqo Blog'}
          </h1>
          <p className="text-lg text-[#6B7A94] max-w-2xl mx-auto leading-relaxed">
            {isFr
              ? "Guides, analyses et conseils d'experts pour réussir votre cession ou reprise d'entreprise. Contenus gratuits rédigés par des professionnels M&A."
              : "Guides, analysis and expert advice to succeed in your business sale or acquisition. Free content written by M&A professionals."}
          </p>
        </div>
      </section>

      {/* Featured Guides */}
      <section className="pb-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-xl font-bold text-[#3B4759] mb-5">
            {isFr ? 'Guides essentiels' : 'Essential guides'}
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            {FEATURED_ARTICLES.map((article) => (
              <Link
                key={article.slug}
                to={createPageUrl(article.slug)}
                className="group bg-white rounded-2xl border border-[#F0ECE6] p-6 hover:border-[#FF6B4A]/30 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-[#FFF0ED] flex items-center justify-center">
                    <article.icon className="w-4 h-4 text-[#FF6B4A]" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B4A]">
                    {isFr ? article.categoryFr : article.categoryEn}
                  </span>
                </div>
                <h3 className="font-display font-semibold text-base text-[#3B4759] mb-2 group-hover:text-[#FF6B4A] transition-colors">
                  {isFr ? article.titleFr : article.titleEn}
                </h3>
                <p className="text-sm text-[#6B7A94] leading-relaxed mb-3 line-clamp-2">
                  {isFr ? article.descFr : article.descEn}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#9EABC1]">{isFr ? article.readTimeFr : article.readTimeEn}</span>
                  <span className="text-sm font-medium text-[#FF6B4A] flex items-center gap-1 group-hover:gap-2 transition-all">
                    {isFr ? 'Lire' : 'Read'} <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Cluster filter tabs */}
      <section className="px-4 pb-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleClusterChange('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCluster === 'all'
                  ? 'bg-[#3B4759] text-white'
                  : 'bg-white text-[#6B7A94] border border-[#F0ECE6] hover:border-[#3B4759]'
              }`}
            >
              {isFr ? 'Tous les articles' : 'All articles'} ({BLOG_ARTICLES.length})
            </button>
            {Object.entries(CLUSTERS).map(([key, cluster]) => {
              const count = BLOG_ARTICLES.filter(a => a.cluster === key).length;
              return (
                <button
                  key={key}
                  onClick={() => handleClusterChange(key)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCluster === key
                      ? 'text-white'
                      : 'bg-white text-[#6B7A94] border border-[#F0ECE6] hover:border-[#3B4759]'
                  }`}
                  style={activeCluster === key ? { backgroundColor: cluster.color } : {}}
                >
                  {isFr ? cluster.labelFr : cluster.labelEn} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="pb-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginatedArticles.map((article) => {
              const cluster = CLUSTERS[article.cluster];
              return (
                <Link
                  key={article.slug}
                  to={`/blog/${article.slug}`}
                  className="group bg-white rounded-2xl border border-[#F0ECE6] p-6 hover:border-[#FF6B4A]/30 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={{ color: cluster?.color, backgroundColor: `${cluster?.color}15` }}
                    >
                      {isFr ? cluster?.labelFr : cluster?.labelEn}
                    </span>
                  </div>
                  <h3 className="font-display font-semibold text-base text-[#3B4759] mb-2 group-hover:text-[#FF6B4A] transition-colors line-clamp-2">
                    {isFr ? article.titleFr : article.titleEn}
                  </h3>
                  <p className="text-sm text-[#6B7A94] leading-relaxed mb-4 line-clamp-3">
                    {isFr ? article.descFr : article.descEn}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#9EABC1] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.readTime} min
                    </span>
                    <span className="text-sm font-medium text-[#FF6B4A] flex items-center gap-1 group-hover:gap-2 transition-all">
                      {isFr ? 'Lire' : 'Read'} <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-[#F0ECE6] disabled:opacity-30 hover:bg-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-[#3B4759]" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                    page === p
                      ? 'bg-[#FF6B4A] text-white'
                      : 'border border-[#F0ECE6] text-[#6B7A94] hover:bg-white'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg border border-[#F0ECE6] disabled:opacity-30 hover:bg-white transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-[#3B4759]" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
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
