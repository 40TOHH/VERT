import { writeFileSync } from 'fs';
import { join } from 'path';

// Define all the routes for the site
const routes = [
  '/',
  '/convert',
  '/settings',
  '/about',
  '/faq',
  '/privacy'
];

// Define all supported locales
const locales = [
  'en', 'es', 'fr', 'de', 'it', 'hr', 'tr', 'ja', 'ko', 'el', 'id', 
  'zh-Hans', 'zh-Hant', 'ru'
];

// Generate sitemap for each locale
const generateSitemap = (locale) => {
  const urls = [];
  
  routes.forEach(route => {
    const normalizedRoute = route === '/' ? '' : route.replace(/^\/|\/$/g, '');
    const url = `https://vert.sh/${locale === 'en' ? normalizedRoute : locale + (normalizedRoute ? '/' + normalizedRoute : '')}`;
    urls.push(`
    <url>
      <loc>${url}</loc>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>`);
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://vert.sh/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    ${locales.map(loc => 
      `<xhtml:link rel="alternate" hreflang="${loc}" href="https://vert.sh/${loc === 'en' ? '' : loc + '/'}" />`
    ).join('\n    ')}
  </url>
  ${urls.join('\n  ')}
</urlset>`;
};

// Generate a main sitemap index file
const generateSitemapIndex = () => {
  const sitemaps = locales.map(locale => {
    const path = locale === 'en' ? '/sitemap.xml' : `/sitemap-${locale}.xml`;
    return `
  <sitemap>
    <loc>https://vert.sh${path}</loc>
  </sitemap>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${sitemaps.join('\n')}  
</sitemapindex>`;
};

// Generate individual sitemaps for each locale
locales.forEach(locale => {
  const sitemap = generateSitemap(locale);
  const fileName = locale === 'en' ? 'sitemap.xml' : `sitemap-${locale}.xml`;
  const filePath = join(process.cwd(), 'static', fileName);
  writeFileSync(filePath, sitemap);
  console.log(`Generated ${fileName}`);
});

// Generate sitemap index file
const sitemapIndex = generateSitemapIndex();
const indexPath = join(process.cwd(), 'static', 'sitemap-index.xml');
writeFileSync(indexPath, sitemapIndex);
console.log('Generated sitemap-index.xml');

// Also generate a robots.txt file
const robotsTxt = `User-agent: *
Allow: /

Sitemap: https://vert.sh/sitemap-index.xml`;

const robotsPath = join(process.cwd(), 'static', 'robots.txt');
writeFileSync(robotsPath, robotsTxt);
console.log('Generated robots.txt');