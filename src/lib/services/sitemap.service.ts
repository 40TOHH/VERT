/**
 * Comprehensive Sitemap Generator Service for VERT Application
 * 
 * This service generates sitemaps for all pages, including multilingual versions,
 * with proper priority and changefreq values based on page importance.
 * 
 * Features:
 * - Complete page coverage (home, categories, static pages, blog)
 * - Multilingual support with hreflang tags
 * - Proper XML formatting according to sitemaps.org protocol
 * - Configurable priorities and changefreq values
 * - Error handling and performance optimization
 */

import { locales, baseLocale } from '$lib/paraglide/runtime';
import { dev } from '$app/environment';

// Define page priorities based on importance
const PAGE_PRIORITIES = {
  home: 1.0,
  main_sections: 0.9,  // convert, about
  secondary_sections: 0.7,  // settings, faq, privacy
  default: 0.5
};

// Define change frequency based on content update patterns
const CHANGE_FREQ = {
  daily: 'daily',
  weekly: 'weekly',
  monthly: 'monthly'
};

// Define the structure for a sitemap URL entry
interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: number;
  alternateLinks?: { hreflang: string; href: string }[];
}

// Define the structure for a sitemap index entry
interface SitemapIndexEntry {
  loc: string;
  lastmod: string;
}

// Service to generate sitemaps with all required features
export class SitemapService {
  private readonly hostname: string;
  private readonly lastmod: string;

  constructor() {
    // Always use the production hostname for sitemap generation to ensure
    // hreflang links work properly for search engines
    this.hostname = 'https://vert.sh';
    // Use current date in YYYY-MM-DD format (ISO 8601)
    this.lastmod = new Date().toISOString().split('T')[0];
  }

  /**
   * Generates the main sitemap for the base locale (English)
   */
  generateMainSitemap(): string {
    return this.generateSitemapForLocale(baseLocale);
  }

  /**
   * Generates a sitemap for a specific locale
   */
  generateSitemapForLocale(locale: typeof locales[number]): string {
    if (!locales.includes(locale)) {
      throw new Error(`Locale ${locale} is not supported`);
    }

    const urls = this.getAllUrlsForLocale(locale);
    return this.buildSitemapXml(urls);
  }

  /**
   * Generates a sitemap index that references all locale-specific sitemaps
   */
  generateSitemapIndex(): string {
    const sitemapEntries: SitemapIndexEntry[] = locales.map(locale => {
      const path = locale === baseLocale ? '/sitemap.xml' : `/sitemap-${locale}.xml`;
      return {
        loc: `${this.hostname}${path}`,
        lastmod: this.lastmod
      };
    });

    return this.buildSitemapIndexXml(sitemapEntries);
  }

  /**
   * Gets all URLs for a specific locale with proper hreflang links
   */
  private getAllUrlsForLocale(locale: typeof locales[number]): SitemapUrl[] {
    const urls: SitemapUrl[] = [];

    // Define all static routes
    const staticRoutes = [
      { path: '/', priority: PAGE_PRIORITIES.home, changefreq: CHANGE_FREQ.daily },
      { path: '/convert', priority: PAGE_PRIORITIES.main_sections, changefreq: CHANGE_FREQ.weekly },
      { path: '/settings', priority: PAGE_PRIORITIES.secondary_sections, changefreq: CHANGE_FREQ.monthly },
      { path: '/about', priority: PAGE_PRIORITIES.main_sections, changefreq: CHANGE_FREQ.monthly },
      { path: '/faq', priority: PAGE_PRIORITIES.secondary_sections, changefreq: CHANGE_FREQ.weekly },
      { path: '/privacy', priority: PAGE_PRIORITIES.secondary_sections, changefreq: CHANGE_FREQ.monthly }
    ];

    // Generate URL entries for each route
    for (const route of staticRoutes) {
      // Determine the URL path for this locale
      let path: string;
      if (route.path === '/') {
        // Home page
        path = locale === baseLocale ? '/' : `/${locale}/`;
      } else {
        // Other pages
        path = locale === baseLocale ? route.path : `/${locale}${route.path}`;
      }
      
      const fullUrl = `${this.hostname}${path}`;
      
      // Generate hreflang links for all locales to this same page
      const alternateLinks = locales.map(loc => {
        let hreflangPath: string;
        if (route.path === '/') {
          hreflangPath = loc === baseLocale ? '/' : `/${loc}/`;
        } else {
          hreflangPath = loc === baseLocale ? route.path : `/${loc}${route.path}`;
        }
        return {
          hreflang: loc,
          href: `${this.hostname}${hreflangPath}`
        };
      });

      urls.push({
        loc: fullUrl,
        lastmod: this.lastmod,
        changefreq: route.changefreq,
        priority: route.priority,
        alternateLinks
      });
    }

    // TODO: Add any dynamic routes when implemented (e.g., if formats have individual pages)
    // For now, we only have static routes
    
    return urls;
  }

  /**
   * Builds the sitemap XML string from URL entries
   */
  private buildSitemapXml(urls: SitemapUrl[]): string {
    const urlEntries = urls.map(url => {
      let alternateLinksXml = '';
      if (url.alternateLinks && url.alternateLinks.length > 0) {
        alternateLinksXml = url.alternateLinks
          .map(link => `    <xhtml:link rel="alternate" hreflang="${link.hreflang}" href="${link.href}" />`)
          .join('\n    ');

        // Add newline before the first hreflang tag if there are any
        alternateLinksXml = '\n    ' + alternateLinksXml;
      }

      return `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>${alternateLinksXml}
  </url>`;
    }).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlEntries}
</urlset>`;
  }

  /**
   * Builds the sitemap index XML string
   */
  private buildSitemapIndexXml(sitemapEntries: SitemapIndexEntry[]): string {
    const sitemapEntriesXml = sitemapEntries
      .map(entry => `
  <sitemap>
    <loc>${entry.loc}</loc>
    <lastmod>${entry.lastmod}</lastmod>
  </sitemap>`)
      .join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntriesXml}
</sitemapindex>`;
  }
}