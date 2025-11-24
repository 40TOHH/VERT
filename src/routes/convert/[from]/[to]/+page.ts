import type { PageLoad } from './$types';
import { getConversionInfo } from '$lib/conversion-data';

// Включаем prerender для этих страниц, так как они будут сгенерированы статически
export const prerender = true;

export const load: PageLoad = async ({ params }) => {
	const { from, to } = params;

	const conversionInfo = getConversionInfo('.' + from, '.' + to);

	return {
		conversionInfo
	};
};