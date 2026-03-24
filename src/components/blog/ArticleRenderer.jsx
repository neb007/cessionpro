import React from 'react';
import { Link } from 'react-router-dom';
import { BLOG_ARTICLES } from '@/data/blog/articles';

function renderInlineLinks(text) {
  // Convert [[slug]] patterns to internal links
  const parts = text.split(/\[\[([a-z0-9-]+)\]\]/g);
  if (parts.length === 1) return text;

  return parts.map((part, i) => {
    if (i % 2 === 1) {
      const article = BLOG_ARTICLES.find(a => a.slug === part);
      if (article) {
        return (
          <Link key={i} to={`/blog/${part}`} className="text-[#FF6B4A] underline hover:text-[#FF5733]">
            {article.titleFr}
          </Link>
        );
      }
      return part;
    }
    return part;
  });
}

function renderBoldInline(text) {
  // Handle **bold** patterns within a line
  const parts = text.split(/\*\*(.+?)\*\*/g);
  if (parts.length === 1) return renderInlineLinks(text);

  return parts.map((part, i) => {
    if (i % 2 === 1) {
      return <strong key={i} className="text-[#3B4759] font-semibold">{renderInlineLinks(part)}</strong>;
    }
    return renderInlineLinks(part);
  });
}

export default function ArticleRenderer({ content }) {
  return (
    <div className="text-[#6B7A94] leading-relaxed space-y-1">
      {content.split('\n').map((line, li) => {
        if (line.startsWith('### ')) {
          return <h4 key={li} className="font-display font-semibold text-[#3B4759] text-base mt-5 mb-2">{renderBoldInline(line.slice(4))}</h4>;
        }
        if (line.startsWith('**') && line.endsWith('**')) {
          return <h3 key={li} className="font-display font-semibold text-[#3B4759] text-lg mt-6 mb-2">{line.replace(/\*\*/g, '')}</h3>;
        }
        if (line.startsWith('- ')) {
          return <p key={li} className="flex gap-2 text-sm"><span className="text-[#FF6B4A] flex-shrink-0">•</span><span>{renderBoldInline(line.slice(2))}</span></p>;
        }
        if (line === '') return <div key={li} className="h-3" />;
        return <p key={li} className="text-sm">{renderBoldInline(line)}</p>;
      })}
    </div>
  );
}
