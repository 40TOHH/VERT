import type { ConversionInfo } from '$lib/conversion-data';

/**
 * SEO validation utility for conversion pages
 */

export type SEOValidationResult = {
  page: string;
  errors: string[];
  warnings: string[];
  passed: boolean;
};

/**
 * Validates SEO elements for a conversion page
 */
export function validateConversionPageSEO(conversionInfo: ConversionInfo, pageContent: string): SEOValidationResult {
  const { from, to } = conversionInfo;
  const page = `${from.substring(1).toUpperCase()} to ${to.substring(1).toUpperCase()} Converter`;
  const result: SEOValidationResult = {
    page,
    errors: [],
    warnings: [],
    passed: true
  };
  
  // Check for required meta tags
  if (!pageContent.includes('<title>')) {
    result.errors.push('Missing title tag');
  }
  
  if (!pageContent.includes('name="description"')) {
    result.errors.push('Missing meta description');
  }
  
  if (!pageContent.includes('rel="canonical"')) {
    result.errors.push('Missing canonical URL');
  }
  
  // Check for structured data
  if (!pageContent.includes('application/ld+json')) {
    result.errors.push('Missing structured data (JSON-LD)');
  }
  
  // Check for proper heading structure
  const h1Count = (pageContent.match(/<h1/g) || []).length;
  if (h1Count === 0) {
    result.errors.push('Missing H1 heading');
  } else if (h1Count > 1) {
    result.warnings.push('Multiple H1 headings found');
  }
  
  // Check for content length (basic check for thin content)
  const textContent = pageContent.replace(/<[^>]*>/g, '').trim();
  if (textContent.length < 300) {
    result.warnings.push('Page content may be too short (less than 300 characters)');
  }
  
  // Check for internal links (basic check)
  const linkCount = (pageContent.match(/href="\/convert\//g) || []).length;
  if (linkCount < 3) {
    result.warnings.push('Low internal linking (less than 3 conversion links)');
  }
  
  // Check for keyword usage in title
  const titleMatch = pageContent.match(/<title>(.*?)<\/title>/);
  if (titleMatch && titleMatch[1]) {
    const title = titleMatch[1].toLowerCase();
    if (!title.includes(from.substring(1).toLowerCase()) || !title.includes(to.substring(1).toLowerCase()))) {
      result.warnings.push('Title may not contain target keywords');
    }
  }
  
  result.passed = result.errors.length === 0;
  
  return result;
}

/**
 * Validates SEO elements for the sitemap
 */
export function validateSitemapSEO(sitemapContent: string): SEOValidationResult {
  const result: SEOValidationResult = {
    page: 'Sitemap',
    errors: [],
    warnings: [],
    passed: true
  };
  
  // Check for sitemap structure
  if (!sitemapContent.includes('<urlset')) {
    result.errors.push('Invalid sitemap structure - missing urlset tag');
  }
  
  if (!sitemapContent.includes('www.sitemaps.org')) {
    result.errors.push('Missing sitemap schema declaration');
  }
  
  // Count URLs in sitemap
  const urlCount = (sitemapContent.match(/<url>/g) || []).length;
  if (urlCount === 0) {
    result.errors.push('No URLs found in sitemap');
  } else if (urlCount > 50000) {
    result.errors.push('Sitemap exceeds 50,000 URLs limit');
  }
  
  result.passed = result.errors.length === 0;
  
  return result;
}