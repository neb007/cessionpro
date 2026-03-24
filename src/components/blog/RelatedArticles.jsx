import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import { BLOG_ARTICLES, CLUSTERS } from '@/data/blog/articles';

export default function RelatedArticles({ slugs, label = 'Articles liés' }) {
  const articles = slugs
    .map(slug => BLOG_ARTICLES.find(a => a.slug === slug))
    .filter(Boolean)
    .slice(0, 4);

  if (articles.length === 0) return null;

  return (
    <section className="py-16 px-4 bg-white border-t border-[#F0ECE6]">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-display text-2xl font-bold text-[#3B4759] mb-8">{label}</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {articles.map((article) => {
            const cluster = CLUSTERS[article.cluster];
            return (
              <Link
                key={article.slug}
                to={`/blog/${article.slug}`}
                className="group bg-[#FAF9F7] rounded-xl border border-[#F0ECE6] p-5 hover:border-[#FF6B4A]/30 hover:shadow-md transition-all"
              >
                <span
                  className="inline-block text-xs font-bold uppercase tracking-wider mb-3 px-2 py-0.5 rounded-full"
                  style={{ color: cluster?.color, backgroundColor: `${cluster?.color}15` }}
                >
                  {cluster?.labelFr}
                </span>
                <h3 className="font-display font-semibold text-sm text-[#3B4759] mb-3 group-hover:text-[#FF6B4A] transition-colors line-clamp-3">
                  {article.titleFr}
                </h3>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-xs text-[#9EABC1] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {article.readTime} min
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#FF6B4A] group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
