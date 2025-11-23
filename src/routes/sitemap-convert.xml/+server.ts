import type { RequestHandler } from './$types';
import { getAllFormatPairs } from '$lib/conversion-data';
import { VERT_NAME } from '$lib/consts';

// Generate sitemap for all conversion pages
export const prerender = true;

export const GET: RequestHandler = async () => {
	const baseUrl = 'https://vert.sh'; // This should be configured based on environment
	const formatPairs = getAllFormatPairs();
	
	// Create XML sitemap
	let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
		
		<!-- Generated sitemap for conversion pages -->
		<url>
			<loc>${baseUrl}/</loc>
			<priority>1.00</priority>
			<changefreq>daily</changefreq>
		</url>
		
		<url>
			<loc>${baseUrl}/convert</loc>
			<priority>0.90</priority>
			<changefreq>daily</changefreq>
		</url>
		
		<url>
			<loc>${baseUrl}/formats</loc>
			<priority>0.80</priority>
			<changefreq>weekly</changefreq>
		</url>
	`;
	
	// Add all conversion pages with dynamic priority based on format popularity
	for (const pair of formatPairs) {
		const priority = getPriorityForConversion(pair.from, pair.to);
		const changeFreq = getChangeFrequency(pair.from, pair.to);
		
		sitemap += `
		<url>
			<loc>${baseUrl}/convert/${pair.from}/${pair.to}</loc>
			<priority>${priority.toFixed(2)}</priority>
			<changefreq>${changeFreq}</changefreq>
		</url>`;
	}
	
	sitemap += '\n</urlset>';
	
	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml'
		}
	});
};

/**
 * Determine priority for a specific conversion based on format popularity
 */
function getPriorityForConversion(from: string, to: string): number {
	// Common formats get higher priority
	const commonFormats = [
		'jpg', 'png', 'gif', // Common image formats
		'mp3', 'wav',       // Common audio formats
		'mp4', 'avi',       // Common video formats
		'pdf', 'doc', 'docx' // Common document formats
	];
	
	// If both formats are common, assign higher priority
	if (commonFormats.includes(from) && commonFormats.includes(to)) {
		return 0.80;
	}
	
	// If at least one format is common, assign medium-high priority
	if (commonFormats.includes(from) || commonFormats.includes(to)) {
		return 0.60;
	}
	
	// For other conversions, assign medium priority
	return 0.40;
}

/**
 * Determine change frequency based on format type
 */
function getChangeFrequency(from: string, to: string): string {
	// For now, all conversion pages have weekly change frequency since content is static
	// but the priority can change based on usage analytics
	return 'weekly';
}