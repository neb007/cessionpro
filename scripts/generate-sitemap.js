/**
 * Sitemap generator
 * Reads blog articles from articles.js and generates a complete sitemap.xml
 * Run: node scripts/generate-sitemap.js
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BASE_URL = 'https://www.riviqo.com';

// Static pages with their priorities and change frequencies
const STATIC_PAGES = [
  { loc: '/', changefreq: 'weekly', priority: '1.0' },
  { loc: '/ceder', changefreq: 'monthly', priority: '0.9' },
  { loc: '/reprendre', changefreq: 'monthly', priority: '0.9' },
  { loc: '/valuations', changefreq: 'monthly', priority: '0.9' },
  { loc: '/blog', changefreq: 'weekly', priority: '0.9' },
  { loc: '/financing', changefreq: 'monthly', priority: '0.8' },
  { loc: '/targeting', changefreq: 'monthly', priority: '0.8' },
  { loc: '/smartmatchingfeatures', changefreq: 'monthly', priority: '0.8' },
  { loc: '/pricing', changefreq: 'monthly', priority: '0.8' },
  { loc: '/outils', changefreq: 'monthly', priority: '0.8' },
  { loc: '/guidecession', changefreq: 'monthly', priority: '0.7' },
  { loc: '/guiderepreneur', changefreq: 'monthly', priority: '0.7' },
  { loc: '/guiderepreneuriat', changefreq: 'monthly', priority: '0.7' },
  { loc: '/expert', changefreq: 'monthly', priority: '0.7' },
  { loc: '/faq', changefreq: 'monthly', priority: '0.7' },
  { loc: '/contact', changefreq: 'monthly', priority: '0.7' },
  { loc: '/dataroom', changefreq: 'monthly', priority: '0.7' },
  { loc: '/partners', changefreq: 'monthly', priority: '0.8' },
  { loc: '/mentionslegales', changefreq: 'yearly', priority: '0.3' },
  { loc: '/cgu', changefreq: 'yearly', priority: '0.3' },
  { loc: '/politiqueconfidentialite', changefreq: 'yearly', priority: '0.3' },
];

// Read blog articles from source
async function getBlogArticles() {
  // Dynamic import of the articles module
  const { BLOG_ARTICLES } = await import(join(__dirname, '..', 'src', 'data', 'blog', 'articles.js'));
  return BLOG_ARTICLES;
}

function generateSitemap(staticPages, blogArticles) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // Static pages
  for (const page of staticPages) {
    xml += '  <url>\n';
    xml += `    <loc>${BASE_URL}${page.loc}</loc>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += '  </url>\n';
  }

  // Blog articles
  for (const article of blogArticles) {
    xml += '  <url>\n';
    xml += `    <loc>${BASE_URL}/blog/${article.slug}</loc>\n`;
    if (article.publishDate) {
      xml += `    <lastmod>${article.publishDate}</lastmod>\n`;
    }
    xml += '    <changefreq>monthly</changefreq>\n';
    xml += '    <priority>0.7</priority>\n';
    xml += '  </url>\n';
  }

  xml += '</urlset>\n';
  return xml;
}

async function main() {
  try {
    const blogArticles = await getBlogArticles();
    const sitemap = generateSitemap(STATIC_PAGES, blogArticles);
    const outputPath = join(__dirname, '..', 'public', 'sitemap.xml');
    writeFileSync(outputPath, sitemap, 'utf-8');
    console.log(`Sitemap generated with ${STATIC_PAGES.length + blogArticles.length} URLs → ${outputPath}`);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    process.exit(1);
  }
}

main();
