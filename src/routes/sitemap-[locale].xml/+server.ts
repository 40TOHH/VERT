/**
 * Sitemap endpoint for specific locales
 *
 * This endpoint generates sitemaps for each supported locale with proper
 * hreflang links to all other language versions of each page.
 */
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { SitemapService } from '$lib/services/sitemap.service';
import { locales } from '$lib/paraglide/runtime';

export const GET: RequestHandler = async ({ params }) => {
  try {
    // Type assertion to satisfy TypeScript
    const requestedLocale = params.locale as typeof locales[number];

    // Validate that the requested locale is supported
    if (!requestedLocale || !locales.includes(requestedLocale)) {
      return error(404, 'Sitemap not found');
    }

    const sitemapService = new SitemapService();
    const sitemapXml = sitemapService.generateSitemapForLocale(requestedLocale);

    return new Response(sitemapXml, {
      headers: {
        'Content-Type': 'application/xml',
      }
    });
  } catch (err) {
    console.error('Error generating locale sitemap:', err);
    return error(500, 'Internal Server Error');
  }
};