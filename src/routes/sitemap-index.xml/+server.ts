/**
 * Sitemap index endpoint
 * 
 * This endpoint generates a sitemap index that references all locale-specific
 * sitemaps, allowing search engines to discover all language versions of the site.
 */
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { SitemapService } from '$lib/services/sitemap.service';

export const GET: RequestHandler = async () => {
  try {
    const sitemapService = new SitemapService();
    const sitemapIndexXml = sitemapService.generateSitemapIndex();

    return new Response(sitemapIndexXml, {
      headers: {
        'Content-Type': 'application/xml',
      }
    });
  } catch (err) {
    console.error('Error generating sitemap index:', err);
    return error(500, 'Internal Server Error');
  }
};