import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = async () => {
	const baseUrl = 'https://vert.sh'; // This should be configured based on environment

	// List of all supported locales
	const locales = ['en', 'es', 'fr', 'de', 'it', 'hr', 'tr', 'ja', 'ko', 'el', 'id', 'zh-Hans', 'zh-Hant', 'ru'];

	// Create sitemap entries for each locale
	const sitemapEntries = locales.map(locale => {
		const path = `/sitemap-${locale}.xml`;
		return `<sitemap>
<loc>${baseUrl}${path}</loc>
<lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
</sitemap>`;
	}).join('\n');

	const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</sitemapindex>`;

	return new Response(sitemapIndex, {
		headers: {
			'Content-Type': 'application/xml'
		}
	});
};