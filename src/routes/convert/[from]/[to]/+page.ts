import type { PageLoad } from './$types';
import { getConversionInfo } from '$lib/conversion-data';

// Отключаем prerender для динамических страниц, так как они будут обработаны через SSR
export const prerender = false;

export const load: PageLoad = async ({ params }) => {
	const { from, to } = params;

	const conversionInfo = getConversionInfo('.' + from, '.' + to);

	return {
		conversionInfo
	};
};