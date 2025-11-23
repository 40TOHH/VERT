import type { PageLoad } from './$types';
import { getConversionInfo } from '$lib/conversion-data';

export const prerender = false; // Отключаем prerender для динамических страниц

export const load: PageLoad = async ({ params }) => {
	const { from, to } = params;

	const conversionInfo = getConversionInfo('.' + from, '.' + to);

	return {
		conversionInfo
	};
};