// This file generates all possible conversion routes for prerendering
import { getAllFormatPairs } from './src/lib/conversion-data';

// Generate all conversion routes for prerendering
export function generateConversionRoutes() {
	const pairs = getAllFormatPairs();
	
	// Include base convert page as well
	const routes = ['/convert', '/en/convert', '/ru/convert', '/es/convert'];
	
	// Generate all possible conversion routes
	for (const { from, to } of pairs) {
		// Add routes for all locales
		routes.push(`/en/convert/${from}/${to}`);
		routes.push(`/ru/convert/${from}/${to}`);
		routes.push(`/es/convert/${from}/${to}`);
		
		// Add additional locale formats if needed
		// These will be prerendered to ensure they work on static hosting
	}
	
	return routes;
}