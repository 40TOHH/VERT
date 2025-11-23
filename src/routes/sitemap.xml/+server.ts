/**
 * Sitemap endpoint for the default locale (English)
 *
 * This endpoint generates the main sitemap for the English version of the site.
 * It includes all pages with proper hreflang links to other language versions.
 */
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { SitemapService } from '$lib/services/sitemap.service';

export const GET: RequestHandler = async () => {
  try {
    const sitemapService = new SitemapService();
    const sitemapXml = sitemapService.generateMainSitemap();

    return new Response(sitemapXml, {
      headers: {
        'Content-Type': 'application/xml',
      }
    });
  } catch (err) {
    console.error('Error generating sitemap:', err);
    return error(500, 'Internal Server Error');
  }
};