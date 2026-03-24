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

const BASE_URL = 'https://riviqo.com';

// Static pages with their priorities and change frequencies
const STATIC_PAGES = [
  { loc: '/', changefreq: 'weekly', priority: '1.0' },
  { loc: '/Ceder', changefreq: 'monthly', priority: '0.9' },
  { loc: '/Reprendre', changefreq: 'monthly', priority: '0.9' },
  { loc: '/Valuations', changefreq: 'monthly', priority: '0.9' },
  { loc: '/Blog', changefreq: 'weekly', priority: '0.9' },
  { loc: '/Financing', changefreq: 'monthly', priority: '0.8' },
  { loc: '/Targeting', changefreq: 'monthly', priority: '0.8' },
  { loc: '/SmartMatchingFeatures', changefreq: 'monthly', priority: '0.8' },
  { loc: '/Pricing', changefreq: 'monthly', priority: '0.8' },
  { loc: '/Outils', changefreq: 'monthly', priority: '0.8' },
  { loc: '/GuideCession', changefreq: 'monthly', priority: '0.7' },
  { loc: '/GuideRepreneur', changefreq: 'monthly', priority: '0.7' },
  { loc: '/GuideRepreneuriat', changefreq: 'monthly', priority: '0.7' },
  { loc: '/Expert', changefreq: 'monthly', priority: '0.7' },
  { loc: '/FAQ', changefreq: 'monthly', priority: '0.7' },
  { loc: '/Contact', changefreq: 'monthly', priority: '0.7' },
  { loc: '/Dataroom', changefreq: 'monthly', priority: '0.7' },
  { loc: '/Partners', changefreq: 'monthly', priority: '0.8' },
  { loc: '/MentionsLegales', changefreq: 'yearly', priority: '0.3' },
  { loc: '/CGU', changefreq: 'yearly', priority: '0.3' },
  { loc: '/PolitiqueConfidentialite', changefreq: 'yearly', priority: '0.3' },
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
